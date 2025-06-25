
# Frontend Environment Setup Guide

## Requirements

Before you start, make sure you have:

- Node.js 18.0.0 or higher installed
    - Download from: https://nodejs.org/
    - Verify with: `node --version`
- npm (comes with Node.js)
    - Verify with: `npm --version`

## Quick Start

1. **Clone the project**
   ```bash
   git clone https://github.com/Weilei424/leafwheels.git
   ```

2. **Go to frontend folder**
   ```bash
   cd leafwheels/frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
    - Go to: http://localhost:5173
    - The page will automatically reload when you make changes

## Common Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code style

## Troubleshooting

### If npm install fails:
1. Delete these folders/files:
   ```bash
   rm -rf node_modules package-lock.json
   ```
2. Try installing again:
   ```bash
   npm install
   ```

### If the app won't start:
1. Make sure nothing else is using port 5173
2. Check if all dependencies are installed
3. Try stopping and restarting the dev server

### If you see errors about missing modules: