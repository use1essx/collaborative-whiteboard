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
export let canvasStrokes: DrawData[] = []
export const MAX_STROKES = 10000 // Limit to prevent memory issues

export function addStrokes(strokes: DrawData[]) {
  canvasStrokes.push(...strokes)
  
  // Keep only the most recent strokes to prevent memory issues
  if (canvasStrokes.length > MAX_STROKES) {
    canvasStrokes = canvasStrokes.slice(-MAX_STROKES)
  }
  
  return canvasStrokes.length
}

export function getStrokes() {
  return canvasStrokes
}

export function clearStrokes() {
  canvasStrokes = []
}

