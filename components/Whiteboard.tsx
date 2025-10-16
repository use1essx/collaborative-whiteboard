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

  // Sync with other users
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/canvas')
        const data = await response.json()
        
        if (data.strokes && data.strokes.length > 0) {
          // Draw new strokes from other users
          const lastSyncTime = parseInt(localStorage.getItem('lastSyncTime') || '0')
          const newStrokes = data.strokes.filter((stroke: DrawData) => stroke.timestamp > lastSyncTime)
          
          newStrokes.forEach((stroke: DrawData) => {
            drawLine(stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.color, stroke.lineWidth, stroke.isEraser)
          })
          
          if (newStrokes.length > 0) {
            localStorage.setItem('lastSyncTime', Date.now().toString())
          }
        }
      } catch (error) {
        console.error('Sync error:', error)
      }
    }, 1000) // Sync every second

    return () => clearInterval(syncInterval)
  }, [context])

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

  const sendDrawData = async (x0: number, y0: number, x1: number, y1: number) => {
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

    try {
      await fetch('/api/canvas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drawData),
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
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas || !context) return

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    // Clear server data
    fetch('/api/canvas', {
      method: 'DELETE',
    })
    
    localStorage.setItem('lastSyncTime', Date.now().toString())
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

