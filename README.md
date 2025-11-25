# Tiger Sight – AI Agent Stack

A stunning, enterprise-grade single-page web application for demoing and orchestrating logistics AI agents. Built with Freight Tiger's signature orange and navy blue branding.

![Tiger Sight Demo](https://img.shields.io/badge/Status-Live-green) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Freight Tiger](https://img.shields.io/badge/Freight-Tiger-orange)

## 🚀 Features

### Core Functionality
- **Agent Showcase Grid**: Beautiful card-based layout displaying 9 logistics AI agents
- **Advanced Filtering**: Search by name, description, tags + filter by category and status
- **Agent Modals**: Full-screen iframe-based modal to demo agents without leaving the page
- **Dark Mode**: Seamless light/dark theme toggle with system preference support
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

### Agent Cards
Each agent card features:
- **Image Banner**: Eye-catching gradient SVG images (h-32 on desktop, h-24 on mobile)
- **Agent Information**: Name, description, category, status badges
- **Smart Tags**: First 3 tags visible with "+N more" indicator
- **Footer Actions**: Last updated timestamp + "Open Agent" button
- **Hover Animations**: Card scale & image zoom effects using Framer Motion

### Agent Modal
- **Iframe Integration**: Loads Vercel-deployed agent without redirect
- **Loading States**: Skeleton loader while agent loads
- **Error Handling**: Graceful fallback with retry option
- **Rich Header**: Agent name, badges, and description
- **Keyboard Support**: ESC key to close
- **External Link**: Option to open agent in new tab

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **Theme**: next-themes (dark mode)
- **Icons**: Lucide React

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎨 Project Structure

```
TigerSight/
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider
│   ├── page.tsx             # Main page with agent grid
│   └── globals.css          # Global styles & CSS variables
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── agent-card.tsx       # Agent card component
│   ├── agent-modal.tsx      # Agent modal with iframe
│   ├── header.tsx           # Header with dark mode toggle
│   ├── search-filters.tsx   # Search & filter UI
│   └── theme-provider.tsx   # Theme context provider
├── lib/
│   ├── types.ts             # TypeScript interfaces
│   ├── data.ts              # Agent data & constants
│   └── utils.ts             # Utility functions (cn)
└── public/
    └── agents/              # Agent banner images (SVG)
        ├── rate-intelligence.png
        ├── fleetedge.png
        ├── exception-sentinel.png
        ├── route-oracle.png
        ├── cargovision.png
        ├── invoiceiq.png
        ├── command-center.png
        ├── capacity-predictor.png
        └── customs-copilot.png
```

## 🎯 Agent Data Model

```typescript
interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: "Planning" | "Tracking" | "Intelligence" | "Finance" | "Control Tower" | "Other";
  tags: string[];
  status: "Live" | "Beta" | "Experimental";
  vercelUrl: string;
  imageUrl: string;
  lastUpdated: string;
  primaryActionLabel?: string;
}
```

## 🎨 Freight Tiger Branding

The entire app uses Freight Tiger's signature color scheme:

### Color Usage
- **Headers & Titles**: Orange gradient text
- **Buttons**: Orange primary color
- **Agent Cards**: Orange tags and accents
- **Hover States**: Orange glow effects
- **Modal Headers/Footers**: Orange gradient backgrounds
- **Status Badges**: Orange for Beta, Emerald for Live, Cyan for Experimental

### Image Banners
All agent banner images use combinations of:
- Tiger Orange (`#FF6B35`, `#F26419`)
- Deep Navy Blue (`#2B4162`, `#1A2332`)
- White overlays for contrast

## 🔧 Customization

### Adding New Agents

Edit `lib/data.ts` and add a new agent object:

```typescript
{
  id: "10",
  name: "Your Agent Name",
  slug: "your-agent-slug",
  description: "Your agent description...",
  category: "Intelligence",
  tags: ["Tag1", "Tag2", "Tag3"],
  status: "Beta",
  vercelUrl: "https://your-agent.vercel.app",
  imageUrl: "/agents/your-agent.png",
  lastUpdated: "Nov 2025",
}
```

### Replacing Placeholder Images

1. Create/obtain your agent banner images (recommended: 800x400px)
2. Save them to `public/agents/`
3. Update the `imageUrl` in your agent data

### Customizing Colors & Styles

- **Theme Colors**: Edit CSS variables in `app/globals.css`
- **Component Styles**: Modify Tailwind classes in component files
- **Status Badge Colors**: Update `statusColors` in `agent-card.tsx` and `agent-modal.tsx`

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

```bash
# Build production bundle
npm run build

# Serve static files from .next/
```

## 🎨 Design System

### Freight Tiger Color Palette
- **Primary**: Tiger Orange `#FF6B35` - Brand color, CTAs, highlights
- **Secondary**: Deep Navy Blue `#2B4162` - Trust, reliability, backgrounds
- **Accent**: Teal `#19A7CE` - Interactive elements, links
- **Dark Theme**: Navy Dark `#0d1829` / `#1a2332` - Professional dark backgrounds

### Status Colors
- **Live**: Emerald Green (Stable, production-ready)
- **Beta**: Orange (Testing phase, on-brand)
- **Experimental**: Cyan (Early stage, innovative)

### Categories
- Planning
- Tracking
- Intelligence
- Finance
- Control Tower
- Other

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚦 Demo Agents Included

1. **Rate Intelligence Hub** - Freight rate prediction & market analysis
2. **FleetEdge Optimizer** - Real-time fleet optimization & route planning
3. **Exception Sentinel** - Proactive shipment exception detection
4. **Route Oracle** - Intelligent multi-modal route suggestions
5. **CargoVision Pro** - Advanced cargo visibility & tracking
6. **InvoiceIQ** - Automated invoice processing & audit
7. **Command Center 360** - Unified control tower dashboard
8. **Capacity Predictor** - AI-driven capacity forecasting
9. **Customs Copilot** - Customs documentation & compliance

## 📝 Notes

- All agent images are SVG placeholders—replace with your actual assets
- Vercel URLs in the data are examples—update with your deployed agent URLs
- The iframe sandbox allows scripts, forms, and popups for agent functionality
- Dark mode is enabled by default

## 🐛 Troubleshooting

**Issue**: Images not loading
- Ensure images are in `public/agents/` directory
- Check that `imageUrl` matches the filename
- SVG files should have `.png` extension (they work with Next.js Image)

**Issue**: Iframe not loading
- Check that `vercelUrl` is correct and publicly accessible
- Verify the agent app allows iframe embedding (no X-Frame-Options: DENY)

**Issue**: Dark mode not working
- Clear browser cache and reload
- Check that `ThemeProvider` is wrapping the app in `layout.tsx`

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)

---

Built with ❤️ for Tiger Sight logistics AI demos
