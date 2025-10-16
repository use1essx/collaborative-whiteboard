'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Toolbar from './Toolbar'

interface DrawData {
  x0: number
  y0: number
  x1: number
  y1: number
  color: string
  lineWidth: number
  isEraser: boolean
  timestamp: number
}

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(2)
  const [isEraser, setIsEraser] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)
  const strokeBufferRef = useRef<DrawData[]>([])
  const sendTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Define drawLine function first so it can be used in useEffects
  const drawLine = useCallback((x0: number, y0: number, x1: number, y1: number, strokeColor: string, strokeWidth: number, eraser: boolean) => {
    if (!context) return

    context.beginPath()
    context.moveTo(x0, y0)
    context.lineTo(x1, y1)
    
    if (eraser) {
      context.globalCompositeOperation = 'destination-out'
      context.strokeStyle = 'rgba(0,0,0,1)'
      context.lineWidth = strokeWidth * 2
    } else {
      context.globalCompositeOperation = 'source-over'
      context.strokeStyle = strokeColor
      context.lineWidth = strokeWidth
    }
    
    context.lineCap = 'round'
    context.stroke()
    context.closePath()
  }, [context])

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight - 80 // Account for toolbar
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    setContext(ctx)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Load saved canvas from localStorage on mount
  useEffect(() => {
    if (!context) return
    
    const savedStrokes = localStorage.getItem('canvasStrokes')
    if (savedStrokes) {
      try {
        const strokes: DrawData[] = JSON.parse(savedStrokes)
        strokes.forEach((stroke: DrawData) => {
          drawLine(stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.color, stroke.lineWidth, stroke.isEraser)
        })
      } catch (error) {
        console.error('Error loading saved canvas:', error)
      }
    }
  }, [context, drawLine])

  // Sync with other users - simple approach: check if server has more strokes
  useEffect(() => {
    if (!context) return
    
    const syncInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/canvas')
        const data = await response.json()
        
        if (data.strokes && data.strokes.length > 0) {
          // Get our local stroke count
          const savedStrokes = localStorage.getItem('canvasStrokes')
          const localStrokes: DrawData[] = savedStrokes ? JSON.parse(savedStrokes) : []
          const localCount = localStrokes.length
          const serverCount = data.strokes.length
          
          // If server has MORE strokes than us, draw the missing ones
          if (serverCount > localCount) {
            const missingStrokes = data.strokes.slice(localCount)
            console.log(`Server has ${serverCount - localCount} new strokes! Drawing them...`)
            
            missingStrokes.forEach((stroke: DrawData) => {
              drawLine(stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.color, stroke.lineWidth, stroke.isEraser)
            })
            
            // Update localStorage with all strokes from server
            localStorage.setItem('canvasStrokes', JSON.stringify(data.strokes))
          }
        }
      } catch (error) {
        console.error('Sync error:', error)
      }
    }, 2000) // Sync every 2 seconds

    return () => clearInterval(syncInterval)
  }, [context, drawLine])

  const sendDrawData = (x0: number, y0: number, x1: number, y1: number) => {
    const drawData: DrawData = {
      x0,
      y0,
      x1,
      y1,
      color,
      lineWidth,
      isEraser,
      timestamp: Date.now()
    }

    // Save to localStorage immediately for persistence
    try {
      const savedStrokes = localStorage.getItem('canvasStrokes')
      const allStrokes = savedStrokes ? JSON.parse(savedStrokes) : []
      allStrokes.push(drawData)
      localStorage.setItem('canvasStrokes', JSON.stringify(allStrokes))
    } catch (error) {
      console.error('LocalStorage error:', error)
    }

    // Add to buffer
    strokeBufferRef.current.push(drawData)

    // Clear existing timer
    if (sendTimerRef.current) {
      clearTimeout(sendTimerRef.current)
    }

    // Send batched strokes after 50ms of inactivity (or immediately if buffer is large)
    if (strokeBufferRef.current.length >= 10) {
      flushStrokeBuffer()
    } else {
      sendTimerRef.current = setTimeout(() => {
        flushStrokeBuffer()
      }, 50)
    }
  }

  const flushStrokeBuffer = async () => {
    if (strokeBufferRef.current.length === 0) return

    const strokesToSend = [...strokeBufferRef.current]
    strokeBufferRef.current = []

    try {
      await fetch('/api/canvas/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ strokes: strokesToSend }),
      })
    } catch (error) {
      console.error('Send error:', error)
    }
  }

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      }
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(true)
    const coords = getCoordinates(e)
    lastPosRef.current = coords
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing || !lastPosRef.current) return

    const coords = getCoordinates(e)
    
    drawLine(
      lastPosRef.current.x,
      lastPosRef.current.y,
      coords.x,
      coords.y,
      color,
      lineWidth,
      isEraser
    )

    sendDrawData(
      lastPosRef.current.x,
      lastPosRef.current.y,
      coords.x,
      coords.y
    )

    lastPosRef.current = coords
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
    lastPosRef.current = null
    // Flush any remaining strokes when user stops drawing
    flushStrokeBuffer()
  }

  const syncNow = async () => {
    try {
      const response = await fetch('/api/canvas')
      const data = await response.json()
      
      if (data.strokes && data.strokes.length > 0) {
        // Get our local stroke count
        const savedStrokes = localStorage.getItem('canvasStrokes')
        const localStrokes: DrawData[] = savedStrokes ? JSON.parse(savedStrokes) : []
        const localCount = localStrokes.length
        const serverCount = data.strokes.length
        
        // If server has MORE strokes than us, draw the missing ones
        if (serverCount > localCount) {
          const missingStrokes = data.strokes.slice(localCount)
          console.log(`Manual sync: Found ${serverCount - localCount} new strokes!`)
          
          missingStrokes.forEach((stroke: DrawData) => {
            drawLine(stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.color, stroke.lineWidth, stroke.isEraser)
          })
          
          // Update localStorage with all strokes from server
          localStorage.setItem('canvasStrokes', JSON.stringify(data.strokes))
          alert(`Synced ${serverCount - localCount} new strokes!`)
        } else {
          console.log('Already up to date!')
          alert('Already up to date! ✓')
        }
      } else {
        alert('Canvas is empty on server')
      }
    } catch (error) {
      console.error('Manual sync error:', error)
      alert('Sync failed! Check console.')
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas || !context) return

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    // Clear localStorage completely
    localStorage.removeItem('canvasStrokes')
    
    // Clear server data for other users
    fetch('/api/canvas', {
      method: 'DELETE',
    }).catch(error => console.error('Clear error:', error))
    
    console.log('Canvas cleared!')
  }

  return (
    <div className="flex flex-col h-full">
      <Toolbar
        color={color}
        setColor={setColor}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
        isEraser={isEraser}
        setIsEraser={setIsEraser}
        clearCanvas={clearCanvas}
        syncNow={syncNow}
      />
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className="cursor-crosshair touch-none"
        style={{ display: 'block' }}
      />
    </div>
  )
}

