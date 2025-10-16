import { NextRequest, NextResponse } from 'next/server'

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

// In-memory storage for drawing data
// In production, you'd use a database like Redis, MongoDB, or PostgreSQL
let canvasStrokes: DrawData[] = []
const MAX_STROKES = 10000 // Limit to prevent memory issues

export async function GET() {
  return NextResponse.json({ strokes: canvasStrokes })
}

export async function POST(request: NextRequest) {
  try {
    const drawData: DrawData = await request.json()
    
    // Add timestamp if not present
    if (!drawData.timestamp) {
      drawData.timestamp = Date.now()
    }
    
    canvasStrokes.push(drawData)
    
    // Keep only the most recent strokes to prevent memory issues
    if (canvasStrokes.length > MAX_STROKES) {
      canvasStrokes = canvasStrokes.slice(-MAX_STROKES)
    }
    
    return NextResponse.json({ success: true, totalStrokes: canvasStrokes.length })
  } catch (error) {
    console.error('Error saving stroke:', error)
    return NextResponse.json({ error: 'Failed to save stroke' }, { status: 500 })
  }
}

export async function DELETE() {
  canvasStrokes = []
  return NextResponse.json({ success: true, message: 'Canvas cleared' })
}

