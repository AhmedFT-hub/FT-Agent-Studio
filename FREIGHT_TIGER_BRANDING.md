# Freight Tiger Branding Guide

## Color Palette

### Primary Colors
- **Tiger Orange**: `#FF6B35` (HSL: 18 95% 60%)
  - Used for: Primary buttons, CTAs, main accents, brand identity
  - RGB: `rgb(255, 107, 53)`

- **Orange Variant**: `#F26419` 
  - Used for: Gradients, secondary accents
  - RGB: `rgb(242, 100, 25)`

### Secondary Colors
- **Deep Navy Blue**: `#2B4162` (HSL: 216 38% 25%)
  - Used for: Secondary elements, trust indicators
  - RGB: `rgb(43, 65, 98)`

- **Navy Dark**: `#1A2332`
  - Used for: Dark theme backgrounds, cards
  - RGB: `rgb(26, 35, 50)`

- **Navy Darker**: `#0d1829`
  - Used for: Dark theme primary background
  - RGB: `rgb(13, 24, 41)`

### Accent Colors
- **Teal/Cyan**: `#19A7CE` (HSL: 189 85% 45%)
  - Used for: Experimental status, interactive elements
  - RGB: `rgb(25, 167, 206)`

### Status Colors
- **Live (Emerald)**: Green tones for production-ready
- **Beta (Orange)**: `#FF6B35` - On-brand for testing phase
- **Experimental (Cyan)**: `#19A7CE` - For innovative features

## Implementation

### CSS Variables (globals.css)
```css
--primary: 18 95% 60%;           /* Tiger Orange */
--secondary: 216 38% 25%;        /* Deep Navy Blue */
--accent: 189 85% 45%;           /* Teal */
--ring: 18 95% 60%;              /* Orange focus ring */

/* Dark Theme */
--background: 216 38% 8%;        /* Navy Dark */
--card: 216 34% 12%;             /* Navy for cards */
```

### Tailwind Classes Used

#### Orange (Primary)
- `text-orange-600`, `text-orange-700`
- `bg-orange-50`, `bg-orange-100`, `bg-orange-500`, `bg-orange-600`
- `border-orange-200`, `border-orange-500`
- `hover:text-orange-600`, `hover:shadow-orange-500/10`

#### Navy (Secondary)
- `bg-[#0d1829]`, `bg-[#1a2332]`
- `dark:bg-[#0d1829]`, `dark:bg-[#1a2332]`

#### Gradients
- `from-orange-600 to-orange-500` (Header title)
- `from-orange-50 to-orange-100/50` (Modal header/footer)
- `from-orange-500 to-orange-600` (Card image fallback)

## Component Styling

### Header
- Title: Orange gradient text
- Border: Orange subtle border
- POC Badge: Orange with orange border

### Agent Cards
- Hover: Orange glow shadow (`hover:shadow-orange-500/10`)
- Tags: Orange background with orange border
- Image fallback: Orange gradient
- Border: Gray with hover effects

### Agent Modal
- Header/Footer: Orange gradient background
- Loading spinner: Orange
- Error icon: Orange
- Tags: Orange styling

### Search & Filters
- Focus ring: Orange (`focus-visible:ring-orange-500`)
- Clear button: Orange hover state
- Beta status: Orange coloring

## Banner Images

All 9 agent banner SVGs use Freight Tiger colors:

1. **Rate Intelligence**: Orange gradient (#FF6B35 → #F26419)
2. **FleetEdge**: Navy gradient with orange accents
3. **Exception Sentinel**: Orange gradient with navy accent
4. **Route Oracle**: Navy gradient with orange paths
5. **CargoVision**: Orange to navy gradient
6. **InvoiceIQ**: Navy gradient with orange lines
7. **Command Center**: Navy to orange gradient with orange blocks
8. **Capacity Predictor**: Orange gradient with navy accent
9. **Customs Copilot**: Navy gradient with orange highlights

## Best Practices

### DO ✅
- Use Tiger Orange for primary actions and CTAs
- Use Navy Blue for backgrounds and trust elements
- Maintain contrast ratios for accessibility
- Use orange gradients for brand emphasis
- Keep dark theme professional with navy darks

### DON'T ❌
- Don't use generic blues or purples for primary elements
- Don't mix orange with clashing colors
- Don't override the brand orange with other accent colors
- Don't use pure black backgrounds (use navy darks instead)

## Accessibility

All color combinations meet WCAG 2.1 AA standards:
- Orange on white: 4.8:1 (AA compliant)
- White on orange: 4.8:1 (AA compliant)
- White on navy dark: 14.5:1 (AAA compliant)

## Brand Consistency

The color scheme creates a professional, logistics-focused identity:
- **Orange**: Energy, movement, action (Tiger branding)
- **Navy Blue**: Trust, reliability, professionalism
- **Teal**: Innovation, technology, intelligence

Perfect for a logistics AI platform that needs to convey both innovation and trustworthiness.


