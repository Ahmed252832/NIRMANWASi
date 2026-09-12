---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished code that avoids generic AI aesthetics.
version: 1.0.0
source: claude-official
original_plugin: frontend-design
category: frontend
triggers:
  - create a dashboard
  - build a landing page
  - design a page
  - frontend design
  - UI design
  - UX design
  - web design
  - create component
  - build interface
  - design interface
  - create UI
  - build UI
  - design system
  - dark mode
  - light mode
  - animation
  - responsive design
requires: []
max_context_tokens: 1800
---

# Frontend Design

Create distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

## Overview

This skill guides creation of distinctive, production-grade frontend interfaces. When you provide frontend requirements - a component, page, application, or interface to build - this skill helps implement creative, polished code with meticulous attention to detail.

## Design Thinking

Before coding, understand the context and commit to a **BOLD** aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

## Implementation Standards

Implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

### Typography
Choose fonts that are beautiful, unique, and interesting:
- **Avoid**: Generic fonts like Arial, Inter, Roboto, system fonts
- **Choose**: Distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices
- **Pair**: A distinctive display font with a refined body font

### Color & Theme
- Commit to a cohesive aesthetic
- Use CSS variables for consistency
- Dominant colors with sharp accents outperform timid, evenly-distributed palettes

### Motion
- Use animations for effects and micro-interactions
- Prioritize CSS-only solutions for HTML
- Use Motion library for React when available
- Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions
- Use scroll-triggering and hover states that surprise

### Spatial Composition
- Unexpected layouts
- Asymmetry
- Overlap
- Diagonal flow
- Grid-breaking elements
- Generous negative space OR controlled density

### Backgrounds & Visual Details
Create atmosphere and depth rather than defaulting to solid colors:
- Gradient meshes
- Noise textures
- Geometric patterns
- Layered transparencies
- Dramatic shadows
- Decorative borders
- Custom cursors
- Grain overlays

## Anti-Patterns to Avoid

**NEVER use generic AI-generated aesthetics:**
- Overused font families (Inter, Roboto, Arial, system fonts)
- Cliched color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character
- Converging on common choices (Space Grotesk, for example) across generations

## Design Philosophy

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between:
- Light and dark themes
- Different fonts
- Different aesthetics

**IMPORTANT**: Match implementation complexity to the aesthetic vision:
- **Maximalist designs**: Need elaborate code with extensive animations and effects
- **Minimalist/refined designs**: Need restraint, precision, and careful attention to spacing, typography, and subtle details

Elegance comes from executing the vision well.

## Usage Examples

### Creating a Dashboard
```
"Create a dashboard for a music streaming app"
"Build an analytics dashboard with dark mode"
```

### Building Landing Pages
```
"Build a landing page for an AI security startup"
"Design a landing page for a creative agency"
```

### Designing Components
```
"Design a settings panel with dark mode toggle"
"Create a pricing card component"
"Build a navigation bar with animations"
```

### Complex Interfaces
```
"Build a kanban board interface"
"Create an e-commerce product page"
"Design a chat interface"
```

## Framework Support

This skill works with any frontend framework:
- **React**: Component-based with hooks, styled-components, or CSS modules
- **Vue**: Single File Components with scoped styles
- **HTML/CSS/JS**: Vanilla implementation with modern CSS
- **Next.js**: Server components and client components
- **Svelte**: Reactive components with scoped styles
- **Angular**: Component architecture with TypeScript

## Technical Considerations

### Accessibility
- Ensure keyboard navigation works
- Maintain sufficient color contrast ratios
- Include appropriate ARIA labels
- Test with screen readers

### Performance
- Optimize images and assets
- Use CSS transforms for animations (GPU-accelerated)
- Lazy load non-critical content
- Minimize JavaScript bundle size

### Responsiveness
- Design mobile-first
- Test across different screen sizes
- Ensure touch targets are appropriately sized
- Consider landscape and portrait orientations

## Usage in OpenCode

This skill activates automatically when you mention frontend design work. You can also call it manually:

```
skill(name="frontend-design", user_message="Create a landing page for a SaaS product")
```

Or simply mention:
- "Create a dashboard"
- "Build a landing page"
- "Design a component"
- "Create a UI"

## Best Practices

1. **Start with purpose**: Understand what problem the interface solves
2. **Commit to a direction**: Don't waver between aesthetic choices
3. **Details matter**: Every pixel, animation, and interaction should be intentional
4. **Be bold**: Safe choices lead to forgettable designs
5. **Test on real devices**: What looks good in design tools may not translate perfectly
6. **Iterate**: First draft rarely captures the full vision

## Learning Resources

See the [Frontend Aesthetics Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb) for detailed guidance on prompting for high-quality frontend design.

## Original Source

Converted from: https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design
Authors: 
- Prithvi Rajasekaran (prithvi@anthropic.com)
- Alexander Bricken (alexander@anthropic.com)
License: See LICENSE file in original repository
