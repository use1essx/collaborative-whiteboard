import { NextRequest, NextResponse } from 'next/server'
import { addStrokes } from '../storage'

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const strokes: DrawData[] = body.strokes || []
    
    if (!Array.isArray(strokes) || strokes.length === 0) {
      return NextResponse.json({ error: 'Invalid strokes data' }, { status: 400 })
    }
    
    // Add timestamps if not present
    strokes.forEach(stroke => {
      if (!stroke.timestamp) {
        stroke.timestamp = Date.now()
      }
    })
    
    const totalStrokes = addStrokes(strokes)
    
    return NextResponse.json({ 
      success: true, 
      received: strokes.length,
      totalStrokes 
    })
  } catch (error) {
    console.error('Error saving strokes:', error)
    return NextResponse.json({ error: 'Failed to save strokes' }, { status: 500 })
  }
}

