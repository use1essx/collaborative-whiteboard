'use client'

interface ToolbarProps {
  color: string
  setColor: (color: string) => void
  lineWidth: number
  setLineWidth: (width: number) => void
  isEraser: boolean
  setIsEraser: (isEraser: boolean) => void
  clearCanvas: () => void
}

export default function Toolbar({
  color,
  setColor,
  lineWidth,
  setLineWidth,
  isEraser,
  setIsEraser,
  clearCanvas,
}: ToolbarProps) {
  const colors = [
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#FFC0CB', // Pink
  ]

  const sizes = [
    { label: 'Thin', value: 2 },
    { label: 'Medium', value: 5 },
    { label: 'Thick', value: 10 },
    { label: 'Very Thick', value: 15 },
  ]

  return (
    <div className="bg-white border-b-2 border-gray-300 p-4 shadow-md">
      <div className="flex flex-wrap items-center gap-4">
        {/* Drawing Mode */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsEraser(false)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              !isEraser
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ✏️ Draw
          </button>
          <button
            onClick={() => setIsEraser(true)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              isEraser
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🧹 Eraser
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300"></div>

        {/* Colors */}
        {!isEraser && (
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700 self-center mr-2">
              Color:
            </span>
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  color === c ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-300"
              title="Custom color"
            />
          </div>
        )}

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300"></div>

        {/* Line Width */}
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium text-gray-700">Size:</span>
          {sizes.map((size) => (
            <button
              key={size.value}
              onClick={() => setLineWidth(size.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                lineWidth === size.value
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300"></div>

        {/* Clear Button */}
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all shadow-md"
        >
          🗑️ Clear All
        </button>

        {/* Status Indicator */}
        <div className="ml-auto flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 font-medium">Live Sync</span>
        </div>
      </div>
    </div>
  )
}

