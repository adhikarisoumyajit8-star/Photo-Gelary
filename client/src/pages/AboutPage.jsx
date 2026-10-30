import { Link } from 'react-router-dom';
import { HiOutlineCode, HiOutlineDatabase, HiOutlineColorSwatch, HiOutlineLightningBolt, HiOutlineArrowRight } from 'react-icons/hi';

/**
 * AboutPage — Static page with project info
 * Demonstrates: JSX, static content rendering, .map() for lists,
 * CSS-in-JS inline styles, HTML-to-JSX conversions (className, etc.)
 */
export default function AboutPage() {
  // JavaScript array variable — rendered with .map()
  const techStack = [
    {
      icon: <HiOutlineCode size={28} />,
      title: 'React + Vite',
      description: 'Modern React with functional components, hooks (useState, useEffect, useContext, useCallback), React Router for navigation, and Context API for state management.',
      color: '#61dafb',
    },
    {
      icon: <HiOutlineLightningBolt size={28} />,
      title: 'Node.js + Express',
      description: 'RESTful API server with Express.js, CORS middleware, and comprehensive route handling for CRUD operations, favorites, and filtering.',
      color: '#68a063',
    },
    {
      icon: <HiOutlineDatabase size={28} />,
      title: 'MongoDB + Mongoose',
      description: 'NoSQL database for flexible photo storage with Mongoose ODM for schema validation, indexing, and efficient querying.',
      color: '#47a248',
    },
    {
      icon: <HiOutlineColorSwatch size={28} />,
      title: 'CSS Modules + Custom Properties',
      description: 'Multiple styling techniques: CSS Custom Properties for design tokens, CSS Modules for scoped styles, inline styles for dynamic values, and media queries for responsive design.',
      color: '#7c3aed',
    },
  ];

  // React concepts demonstrated
  const concepts = [
    { name: 'JSX & HTML-to-JSX', desc: 'className, htmlFor, self-closing tags, expression interpolation' },
    { name: 'Functional Components', desc: 'All components are pure functions with props' },
    { name: 'useState Hook', desc: 'Local state for forms, modals, search, favorites' },
    { name: 'useEffect Hook', desc: 'Side effects for data fetching, keyboard events' },
    { name: 'useContext Hook', desc: 'Global state sharing via PhotoContext provider' },
    { name: 'useCallback Hook', desc: 'Memoized event handlers and API functions' },
    { name: 'useMemo Hook', desc: 'Derived state computation for favorites and filtering' },
    { name: 'Custom Hooks', desc: 'usePhotos, useSearch, useModal — reusable logic' },
    { name: '.map() Operation', desc: 'Dynamic rendering of photo grids, tags, nav items' },
    { name: '.filter() Operation', desc: 'Filtering by category, favorites, and search' },
    { name: 'React Router', desc: 'BrowserRouter, Routes, useParams, useNavigate, NavLink' },
    { name: 'Controlled Components', desc: 'Form inputs bound to state with onChange handlers' },
    { name: 'Conditional Rendering', desc: 'Loading states, error states, empty states, modals' },
    { name: 'Component Composition', desc: 'PhotoCard inside PhotoGrid, FavoriteButton in Card' },
    { name: 'Props & Data Flow', desc: 'Parent-to-child data passing and callback functions' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-12)' }}>
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: 'var(--space-16)' }}>
          <h2>About PixelVault</h2>
          <p>
            A full-stack Photo Gallery application demonstrating React fundamentals,
            Express.js API development, and MongoDB integration.
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-16)',
        }}>
          {/* .map() to render tech stack cards */}
          {techStack.map((tech) => (
            <div
              key={tech.title}
              className="glass-card"
              style={{ padding: 'var(--space-8)', animation: 'fadeInUp 0.5s ease-out' }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-xl)',
                background: `${tech.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: tech.color,
                marginBottom: 'var(--space-5)',
              }}>
                {tech.icon}
              </div>
              <h3 style={{
                fontSize: 'var(--fs-xl)',
                fontWeight: 'var(--fw-bold)',
                marginBottom: 'var(--space-3)',
              }}>
                {tech.title}
              </h3>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--fs-sm)',
                lineHeight: 1.7,
              }}>
                {tech.description}
              </p>
            </div>
          ))}
        </div>

        {/* React Concepts Table */}
        <div className="glass-card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-16)' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-2xl)',
            fontWeight: 'var(--fw-bold)',
            marginBottom: 'var(--space-6)',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            React Concepts Demonstrated
          </h3>

          <div style={{
            display: 'grid',
            gap: 'var(--space-1)',
          }}>
            {/* .map() to render concept rows */}
            {concepts.map((concept, index) => (
              <div
                key={concept.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  alignItems: 'center',
                }}
              >
                <span style={{
                  fontSize: 'var(--fs-sm)',
                  fontWeight: 'var(--fw-semibold)',
                  color: 'var(--color-accent-light)',
                }}>
                  {concept.name}
                </span>
                <span style={{
                  fontSize: 'var(--fs-sm)',
                  color: 'var(--color-text-secondary)',
                }}>
                  {concept.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-12)',
          background: 'var(--gradient-hero)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--color-border)',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-3xl)',
            fontWeight: 'var(--fw-bold)',
            marginBottom: 'var(--space-4)',
          }}>
            Ready to Explore?
          </h3>
          <p style={{
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-6)',
          }}>
            Browse the gallery, save your favorites, and upload your own photos.
          </p>
          <Link to="/" className="btn btn-primary" style={{ fontSize: 'var(--fs-base)', padding: 'var(--space-4) var(--space-8)' }}>
            Go to Gallery <HiOutlineArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
