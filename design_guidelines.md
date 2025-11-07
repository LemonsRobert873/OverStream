# Design Guidelines for Overtime Streaming Platform

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern streaming platforms (Netflix, Twitch) and sports apps (ESPN, DAZN, FanCode) with emphasis on immersive dark interfaces and live content prominence.

## Core Design Principles
1. **Immediacy**: Live content takes visual priority with prominent badges and spotlight positioning
2. **Clarity**: Dark backgrounds ensure content (matches, video) remains the focus
3. **Fluidity**: Smooth loading states and transitions maintain engagement during data fetches

---

## Typography
**Font Family**: Inter (via Google Fonts CDN)
- **Headline (H1)**: 40-48px, weight 900, tracking tight (-0.025em)
- **Section Headers**: 24-32px, weight 700
- **Match Titles**: 18-20px, weight 700
- **Metadata (tournament, language)**: 12-14px, weight 600
- **Body/Buttons**: 14-16px, weight 500-600

---

## Layout System
**Spacing Units**: Use Tailwind spacing scale focusing on: 2, 4, 6, 8, 12, 16, 20, 24, 32
- **Page padding**: px-4 (mobile), max-w-7xl mx-auto (desktop container)
- **Section spacing**: mt-16 between major sections, mt-8 for subsections
- **Card padding**: p-5 to p-8
- **Grid gaps**: gap-6 standard

**Grid Structure**:
- Match grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Spotlight: `grid-cols-1 lg:grid-cols-2` (image left, content right on desktop)

---

## Component Library

### Header (index.html)
- Centered layout with gradient text treatment
- Main title: Gradient from sky-400 to amber-400
- Subtitle: Slate-400, max-width prose
- Vertical padding: py-12

### Spotlight Card
- **Layout**: Two-column on desktop (image + content), stacked on mobile
- **Background**: Glassmorphic with `backdrop-filter: blur(20px)`, dark translucent background
- **Border**: 1px border with low-opacity white
- **LIVE Badge**: Red gradient (red-600 to red-500) with animated pulse, positioned top-left on image
- **Image**: Aspect-ratio 16:9, object-cover with dark gradient overlay from bottom
- **Content**: Tournament name (amber-400), large match title, language info, stream buttons row

### Match Cards
- **Structure**: Vertical card with image top, content below
- **Image Height**: h-48 fixed
- **Card Background**: Dark translucent (slate-800/50) with glassmorphic blur
- **Border**: 1px subtle border, enhanced on hover with sky-400 glow
- **LIVE Badge**: Small red badge (bg-red-600) top-left with rounded-full
- **Content Padding**: p-5
- **Hover Effect**: Subtle lift with enhanced shadow and border glow (no rotation/tilt)

### Stream Buttons
- **Style**: Sky-400 background with rounded corners
- **Sizing**: px-3 to px-5, py-2 to py-2.5
- **Text**: Uppercase or title case, bold weight
- **Layout**: Flex wrap with gap-2 to gap-3
- **Hover**: Scale 1.05 with enhanced shadow/glow

### Loading State
- **Placeholder Cards**: Matching grid layout with pulsing slate-800/50 backgrounds
- **Animation**: Tailwind `animate-pulse`
- **Count**: Show 3 placeholders (1 mobile, 2 tablet, 3 desktop)

### Player Page (player.html)

**Header**:
- Dark background (slate-900), border-bottom
- Match title centered, truncate if long
- Share button: Gradient amber-400 to yellow-400 with glow effect
- Padding: p-4

**Video Container**:
- **Layout**: Flex-grow to fill available vertical space
- **Background**: Pure black (#000)
- **Player**: Plyr.js with custom sky-400 accent color
- **Aspect**: Responsive, maintaining video ratio

**Footer**:
- Dark background matching header
- Telegram/social CTA button: Sky-400 background with icon
- Full-width or max-w-sm centered
- Padding: p-4

**Error State**:
- Centered flexbox layout
- Large red-500 heading
- Descriptive text in slate-400
- Prominent "Go Back" button (sky-600)

---

## Color Palette
**Background**: #02040a (near-black with blue tint)
**Surface**: rgba(15, 23, 42, 0.5) - Slate-900 with transparency
**Primary Accent**: #0ea5e9 (Sky-400) - For CTAs, links, player controls
**Secondary Accent**: #f59e0b (Amber-400) - For highlights, gradients
**Live Indicator**: #dc2626 to #ef4444 (Red-600 to Red-500 gradient)
**Text Primary**: Slate-100
**Text Secondary**: Slate-400
**Borders**: rgba(255, 255, 255, 0.1)

---

## Visual Effects

**Glassmorphism**:
- `backdrop-filter: blur(12px)` on cards
- Subtle dark backgrounds with transparency
- Thin light borders for definition

**Gradients**:
- Header title: Linear gradient sky-400 → amber-400
- Background: Radial gradients with sky/amber at 10-15% opacity for depth
- Buttons: Use solid colors primarily, gradients sparingly for special CTAs

**Animations**:
- **LIVE Badge Pulse**: Scale 1 to 1.05 with shadow expansion, 2s infinite
- **Card Entrance**: Fade-in with translateY(30px) to 0, stagger by 100ms
- **Hover States**: Scale 1.03-1.05, enhance shadows/glows, 300ms ease transitions
- **Loading**: Tailwind pulse animation

---

## Responsive Behavior
- **Mobile (<768px)**: Single column, full-width cards, stacked spotlight
- **Tablet (768-1024px)**: 2-column match grid, 2-column spotlight
- **Desktop (>1024px)**: 3-column match grid, maintain max-w-7xl container

---

## Images
**Match Thumbnails**: 
- Aspect 16:9 or 4:3 depending on source
- Object-fit: cover, object-position: top
- Fallback: Use generic sports/cricket image if none provided

**Spotlight Image**:
- Large, prominent (50% of spotlight card on desktop)
- Dark gradient overlay from bottom for text contrast
- High visual impact - primary engagement driver

**Player Page**:
- No hero image, focus entirely on video player occupying maximum viewport