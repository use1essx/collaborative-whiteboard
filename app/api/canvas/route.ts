import { NextRequest, NextResponse } from 'next/server'
import { getStrokes, addStrokes, clearStrokes } from './storage'

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

export async function GET() {
  return NextResponse.json({ strokes: getStrokes() })
}

export async function POST(request: NextRequest) {
  try {
    const drawData: DrawData = await request.json()
    
    // Add timestamp if not present
    if (!drawData.timestamp) {
      drawData.timestamp = Date.now()
    }
    
    const totalStrokes = addStrokes([drawData])
    
    return NextResponse.json({ success: true, totalStrokes })
  } catch (error) {
    console.error('Error saving stroke:', error)
    return NextResponse.json({ error: 'Failed to save stroke' }, { status: 500 })
  }
}

export async function DELETE() {
  clearStrokes()
  return NextResponse.json({ success: true, message: 'Canvas cleared' })
}

