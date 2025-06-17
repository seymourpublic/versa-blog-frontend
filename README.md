# VersaBlog Frontend

A modern, responsive blog application built with Next.js, featuring category-based content organization, GraphQL integration, and accessibility-first design.

## Tech Stack

- **Framework**: Next.js 15.3.0 (Pages Router)
- **Language**: JavaScript (React 19)
- **Styling**: CSS Modules + Tailwind CSS 4.1.4
- **State Management**: Apollo Client 3.13.6 with GraphQL
- **Animations**: Framer Motion 12.10.2
- **Icons**: Lucide React 0.508.0 + React Icons 5.5.0
- **Development**: ESLint 9

## Project Structure

```
versa-blog-frontend/
├── components/           # Reusable UI components
│   ├── Layout.js        # Main layout with header/footer
│   ├── CategoryPageTemplate.js  # Template for category pages
│   ├── PostCard.js      # Individual post card component
│   ├── HeroSection.js   # Hero banner component
│   ├── ErrorBoundary.js # Error handling component
│   ├── LoadingComponents.js  # Loading states & skeletons
│   └── OptimizedImage.js     # Image optimization component
├── pages/               # Next.js pages (file-based routing)
│   ├── _app.js         # App wrapper with providers
│   ├── index.js        # Homepage
│   ├── men.js          # Men's category page
│   ├── youth.js        # Youth category page
│   └── posts/
│       └── [id].js     # Dynamic post pages
├── styles/             # CSS modules and global styles
│   ├── globals.css     # Global styles with CSS variables
│   ├── CategoryPage.module.css
│   ├── PostCard.module.css
│   └── Home.module.css
├── lib/                # Utility libraries
│   └── apollo-client.js  # GraphQL client configuration
├── graphql/            # GraphQL queries and mutations
│   └── queries.js      # All GraphQL queries
└── public/             # Static assets
```

## Design System

The project uses a comprehensive CSS variables-based design system defined in `globals.css`:

### Color Palette
- **Primary**: Orange (#ff5400) for CTAs and highlights
- **Secondary**: Teal (#0A615F) for accents
- **Background**: Dark theme with white cards
- **Text**: Hierarchical grayscale system

### Typography
- **Font Family**: Arial/Helvetica system fonts
- **Scale**: xs (12px) to 5xl (48px)
- **Weights**: Normal (400) to Bold (700)

### Spacing & Layout
- **Spacing Scale**: 4px to 64px using CSS custom properties
- **Container**: Max-width 1200px with responsive padding
- **Border Radius**: 4px to 16px scale
- **Shadows**: Subtle depth with multiple shadow levels

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd versa-blog-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_GRAPHQL_URL=https://versablog-backend.onrender.com/graphql/v1
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Architecture

### Pages & Routing
- **Homepage** (`/`): Featured posts and latest content
- **Category Pages**: 
  - `/men` - Men's issues and content
  - `/youth` - Youth-focused content
- **Post Pages** (`/posts/[id]`): Individual post view with SSG

### Components Architecture

#### Layout System
- **Layout.js**: Main wrapper with navigation and footer
- **HeroSection.js**: Reusable hero banner component
- **CategoryPageTemplate.js**: Template for consistent category pages

#### Content Components
- **PostCard.js**: Displays post preview with image, title, excerpt, date
- **OptimizedImage.js**: Image optimization with lazy loading
- **LoadingComponents.js**: Skeleton loaders and loading states

#### Error Handling
- **ErrorBoundary.js**: Catches and displays errors gracefully
- Global error handlers in `_app.js` for unhandled promises

### State Management
- **Apollo Client**: GraphQL state management and caching
- **React Hooks**: Local component state (useState, useEffect)
- **Error Recovery**: Retry mechanisms and fallback states

## GraphQL Integration

### Queries
Located in `graphql/queries.js`:

- **GET_POSTS**: Fetch filtered posts with category support
- **GET_CATEGORIES**: Retrieve all categories and subcategories
- **GET_HOMEPAGE_POSTS**: Homepage-specific post data
- **GET_POST_BY_ID**: Individual post details

### Apollo Client Configuration
- **Cache**: In-memory caching for performance
- **Error Policy**: Graceful error handling with partial data
- **Network**: Configurable GraphQL endpoint

## Features

### Core Functionality
-  **Category-based Content**: Organized by Men, Youth, etc.
-  **Featured Posts**: Hero section highlighting top content
-  **Search & Filter**: Real-time content filtering
-  **Pagination**: Efficient content browsing
-  **Responsive Design**: Mobile-first responsive layout

### Performance & UX
-  **Static Generation**: SSG for post pages
-  **Image Optimization**: Lazy loading and optimization
-  **Loading States**: Skeleton loaders for better UX
-  **Error Boundaries**: Graceful error handling
-  **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

### Content Features
-  **Rich Content**: Full post content with formatting
-  **Date Display**: Publication and update dates
-  **Category Labels**: Clear content categorization
-  **Excerpt Generation**: Automatic content summaries

## Error Handling

### Error Boundary Strategy
- **Application Level**: Catches all unhandled errors
- **Page Level**: Isolates page-specific errors
- **Component Level**: Granular error recovery

### GraphQL Error Handling
- **Network Errors**: Retry mechanisms with exponential backoff
- **Partial Data**: Display available content while retrying failed parts
- **User Feedback**: Clear error messages with retry options

##  Styling Approach

### CSS Modules
- **Scoped Styles**: Component-specific styling
- **Performance**: Only load required CSS
- **Maintainability**: Clear style organization

### Design Tokens
- **CSS Custom Properties**: Consistent design system
- **Dark Mode**: Automatic dark mode support
- **Responsive**: Mobile-first responsive design

##  Deployment

### Build Process
```bash
npm run build  # Creates optimized production build
npm run start  # Serves production build
```

### Static Generation
- Post pages use `getStaticPaths` and `getStaticProps`
- Automatic regeneration with `revalidate: 10`
- Fallback pages for new content

### Environment Variables
- `NEXT_PUBLIC_GRAPHQL_URL`: GraphQL API endpoint
- All public variables must have `NEXT_PUBLIC_` prefix

##  Development Guidelines

### Code Organization
- **Components**: Reusable UI components with single responsibility
- **Pages**: Minimal logic, delegate to components
- **Styles**: CSS Modules with consistent naming
- **Utils**: Pure functions in lib/ directory

### Performance Best Practices
- **Image Optimization**: Use OptimizedImage component
- **Code Splitting**: Automatic with Next.js
- **Bundle Analysis**: Monitor build output
- **Caching**: Leverage Apollo Client caching

### Accessibility
- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Descriptive labels for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Compatible with assistive technology

##  Future Enhancements

### Planned Features
- [ ] **Comment System**: User engagement features
- [ ] **Social Sharing**: Share posts on social platforms
- [ ] **Newsletter**: Email subscription functionality
- [ ] **Related Posts**: Content recommendation system
- [ ] **Full-text Search**: Enhanced search capabilities

### Technical Improvements
- [ ] **TypeScript**: Type safety and better DX
- [ ] **Testing**: Unit and integration tests
- [ ] **PWA**: Progressive Web App features
- [ ] **Analytics**: User behavior tracking
- [ ] **SEO**: Enhanced meta tags and structured data

##  Performance Metrics

### Core Web Vitals Targets
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Optimization Strategies
- **Image Optimization**: WebP format with fallbacks
- **Code Splitting**: Route-based splitting
- **Lazy Loading**: Content below the fold
- **Caching**: Apollo Client + browser caching

##  Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Follow existing code patterns and conventions
4. Test thoroughly across devices and browsers
5. Submit pull request with clear description

### Code Standards
- **ESLint**: Follow configured linting rules
- **Naming**: Use descriptive, consistent naming
- **Comments**: Document complex logic and decisions
- **Git**: Use conventional commit messages

---

##  Support

For issues and questions:
- Create GitHub issues for bugs and feature requests
- Follow existing issue templates
- Provide reproduction steps for bugs
- Include environment details (OS, browser, Node.js version)

---

