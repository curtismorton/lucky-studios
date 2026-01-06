# Lucky Studios

A premium podcast network website built with Next.js 14, featuring a playful and cultural brand identity.

## Tech Stack

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS v3** with custom configuration
- **Framer Motion** for animations
- **Lucide React** for icons

## Design System

- **Theme**: Dark (#0a0a0a background)
- **Accent Colors**: 
  - Orange: #FF6B35 (primary)
  - Purple: #8B5CF6
  - Cyan: #06B6D4
  - Green: #10B981
- **Fonts**: 
  - Syne (headings)
  - Space Grotesk (body)

## Getting Started

### Initial Setup (if starting fresh)
```bash
# Clone and setup (if using template)
npx create-next-app@latest lucky-studios --typescript --tailwind --app

# Navigate and install dependencies
cd lucky-studios
npm install framer-motion lucide-react react-hook-form

# Start development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Current Project Setup
This project is already configured with all dependencies. To get started:

```bash
# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build & Deploy
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
├── app/
│   ├── globals.css       # Global styles with CSS variables
│   ├── layout.tsx        # Root layout with fonts
│   └── page.tsx          # Home page
├── tailwind.config.ts    # Tailwind configuration with custom theme
└── package.json
```

## Brand Identity

Lucky Studios embodies a **playful and cultural** aesthetic - modern, bold, but approachable. The design emphasizes premium quality while maintaining an inviting, non-corporate feel.

# lucky-studios
