# 🎨 Collaborative Whiteboard

A real-time collaborative whiteboard application built with Next.js, perfect for teams to draw and share ideas together!

## ✨ Features

- **Real-time Collaboration**: Multiple users can draw simultaneously and see each other's work
- **Drawing Tools**: 
  - Pen with multiple colors and custom color picker
  - Eraser tool
  - Adjustable line thickness (Thin, Medium, Thick, Very Thick)
  - 10 preset colors + custom color picker
- **Clear Canvas**: Clear the entire whiteboard with one click
- **Touch Support**: Works on tablets and touch devices
- **Auto-sync**: Automatically syncs drawings every second
- **Responsive Design**: Beautiful UI that works on all screen sizes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Test collaboration:**
   - Open the app in multiple browser windows/tabs
   - Draw in one window and watch it appear in others!

## 📦 Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to your Vercel account
   - Choose project settings
   - Deploy!

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Share the URL:**
   - Once deployed, Vercel will give you a URL
   - Share this URL with your groupmates!
   - Everyone can draw together in real-time

## 🎯 How to Use

1. **Drawing Mode**: Click the "Draw" button and select your color and size
2. **Eraser Mode**: Click the "Eraser" button to erase parts of your drawing
3. **Change Colors**: Click any color circle or use the color picker for custom colors
4. **Adjust Size**: Select Thin, Medium, Thick, or Very Thick
5. **Clear Canvas**: Click "Clear All" to start fresh (affects all users)
6. **Collaborate**: Share your URL with friends - they'll see your drawings in real-time!

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Canvas**: HTML5 Canvas API
- **Deployment**: Vercel
- **Real-time Sync**: Polling-based sync (1 second intervals)

## 📝 Notes

- **In-Memory Storage**: The current implementation stores drawing data in memory on the server. This means:
  - Drawings will be lost when the server restarts
  - Not suitable for very long drawing sessions with many strokes
  
- **For Production**: Consider upgrading to a persistent database like:
  - **Redis** for fast real-time data
  - **MongoDB** for document storage
  - **PostgreSQL** for relational data
  - **Liveblocks** or **Pusher** for professional real-time features

## 🔧 Customization

### Change Sync Interval
Edit `components/Whiteboard.tsx`, line 50:
```typescript
}, 1000) // Change from 1000ms (1 second) to your preferred interval
```

### Add More Colors
Edit `components/Toolbar.tsx`, add colors to the `colors` array:
```typescript
const colors = [
  '#000000',
  '#FF0000',
  // Add more hex colors here
]
```

### Adjust Maximum Strokes
Edit `app/api/canvas/route.ts`, change `MAX_STROKES`:
```typescript
const MAX_STROKES = 10000 // Increase or decrease as needed
```

## 🐛 Troubleshooting

- **Drawings not syncing?** Check your internet connection and make sure the API route is working
- **Canvas not showing?** Try refreshing the page
- **Build errors?** Make sure you're using Node.js 18 or higher

## 📄 License

MIT License - feel free to use this project for anything!

## 🤝 Contributing

Pull requests are welcome! Feel free to improve the app and share your changes.

## 💡 Future Enhancements

- [ ] User cursors showing who's drawing where
- [ ] Different drawing tools (shapes, text, etc.)
- [ ] Undo/Redo functionality
- [ ] Save/Export canvas as image
- [ ] Multiple pages/boards
- [ ] User authentication
- [ ] Persistent database storage
- [ ] WebSocket for instant sync

---

Made with ❤️ for collaborative drawing!

