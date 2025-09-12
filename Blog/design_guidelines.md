# Blog Platform Design Guidelines

## Design Approach
**Selected Approach**: Reference-Based Design inspired by modern publishing platforms like Medium and Notion, prioritizing readability, clean typography, and content-first design.

**Key Design Principles**:
- Content-first approach with exceptional typography
- Clean, minimal interface that doesn't compete with written content
- Professional publishing aesthetic with subtle brand touches
- Accessibility-focused with excellent contrast and spacing

## Core Design Elements

### A. Color Palette
**Light Mode**:
- Primary: 15 15% 15% (deep charcoal for text)
- Background: 0 0% 100% (pure white)
- Secondary: 220 13% 91% (light gray for borders/dividers)
- Accent: 212 100% 47% (medium blue for links/CTAs)

**Dark Mode**:
- Primary: 0 0% 95% (near white for text)
- Background: 222 84% 5% (dark slate)
- Secondary: 215 28% 17% (dark gray for borders)
- Accent: 212 100% 60% (brighter blue for contrast)

### B. Typography
**Font Stack**: Inter (primary), system fonts fallback
- **Headings**: 700 weight, tight letter spacing
- **Body**: 400 weight, 1.6 line height for optimal reading
- **Metadata**: 500 weight, smaller sizes for author/date info
- **Scale**: 14px, 16px, 18px, 24px, 32px, 48px

### C. Layout System
**Spacing Units**: Tailwind 2, 4, 6, 8, 12, 16 units
- Consistent 8px grid system
- Generous whitespace around content blocks
- Maximum content width: 680px for optimal reading line length
- Sidebar content: 280px width

### D. Component Library

**Navigation**:
- Clean header with logo, search, and user avatar
- Minimal hamburger menu for mobile
- Sticky navigation with subtle shadow on scroll

**Content Cards**:
- Clean blog post previews with cover image, title, excerpt
- Author attribution with small avatar and byline
- Minimal borders with hover elevation

**Forms**:
- Clean input fields with subtle borders
- Focus states with accent color
- Inline validation with helpful messaging

**Buttons**:
- Primary: filled with accent color
- Secondary: outline style with accent border
- Ghost: text-only with accent color
- All with subtle hover/focus states

**Rich Text Editor**:
- Minimal toolbar with essential formatting options
- Clean, distraction-free writing interface
- Live preview capabilities

### E. Animations
**Minimal Motion**:
- Subtle hover elevations (2-4px)
- Smooth transitions (200-300ms ease-out)
- Page load fade-ins for content
- No distracting or unnecessary animations

## Content Strategy

**Post Layout**:
- Hero area with cover image and title overlay
- Clean article typography with optimal line spacing
- Author bio card at article end
- Related posts suggestions

**Profile Pages**:
- Simple header with avatar, name, bio
- Grid layout for authored posts
- Clean, scannable post listings

**Search & Discovery**:
- Prominent search bar in header
- Tag-based filtering with clean pill design
- Paginated results with infinite scroll option

## Images
- **Hero Images**: Large cover images for blog posts (16:9 aspect ratio)
- **Profile Avatars**: Circular, consistent sizing (40px, 64px, 96px variants)
- **Post Thumbnails**: Consistent aspect ratios in feed views
- **Placeholder Images**: Subtle gray backgrounds with centered icons for missing images

This design prioritizes readability and content discovery while maintaining a professional, modern publishing aesthetic that scales across devices.