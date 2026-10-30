import { Link } from 'react-router-dom';
import { HiOutlinePhotograph, HiOutlineHeart, HiOutlineMail } from 'react-icons/hi';

/**
 * Footer — Site footer
 * Demonstrates: inline CSS styles, Link component,
 * JSX with multiple HTML-to-JSX conversions (className, htmlFor)
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerStyle = {
    background: 'var(--color-bg-secondary)',
    borderTop: '1px solid var(--color-border)',
    padding: 'var(--space-12) var(--space-6)',
    marginTop: 'auto',
  };

  const containerStyle = {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--space-10)',
  };

  const brandStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--fs-xl)',
    fontWeight: 'var(--fw-bold)',
    color: 'var(--color-text-primary)',
  };

  const linkGroupTitleStyle = {
    fontSize: 'var(--fs-sm)',
    fontWeight: 'var(--fw-semibold)',
    color: 'var(--color-text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 'var(--space-4)',
  };

  const linkStyle = {
    display: 'block',
    color: 'var(--color-text-muted)',
    fontSize: 'var(--fs-sm)',
    padding: 'var(--space-1) 0',
    transition: 'color 250ms ease',
    textDecoration: 'none',
  };

  const bottomStyle = {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    paddingTop: 'var(--space-8)',
    marginTop: 'var(--space-8)',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'var(--space-4)',
    fontSize: 'var(--fs-xs)',
    color: 'var(--color-text-muted)',
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        {/* Brand Column */}
        <div style={brandStyle}>
          <div style={logoStyle}>
            <HiOutlinePhotograph style={{ color: 'var(--color-accent-light)' }} />
            PixelVault
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', lineHeight: '1.7' }}>
            A premium photo gallery showcasing stunning photography from around the world.
            Built with React, Express, and MongoDB.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={linkGroupTitleStyle}>Quick Links</h4>
          <Link to="/" style={linkStyle}>Gallery</Link>
          <Link to="/favorites" style={linkStyle}>Favorites</Link>
          <Link to="/upload" style={linkStyle}>Upload Photo</Link>
          <Link to="/about" style={linkStyle}>About</Link>
        </div>

        {/* Categories */}
        <div>
          <h4 style={linkGroupTitleStyle}>Categories</h4>
          {['Nature', 'Architecture', 'People', 'Animals', 'Travel', 'Food'].map((cat) => (
            <Link key={cat} to={`/category/${cat}`} style={linkStyle}>
              {cat}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={linkGroupTitleStyle}>Built With</h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', lineHeight: '1.8' }}>
            ⚛️ React + Vite<br />
            🟢 Node.js + Express<br />
            🍃 MongoDB + Mongoose<br />
            🎨 CSS Modules + Custom Properties
          </p>
        </div>
      </div>

      <div style={bottomStyle}>
        <p>© {currentYear} PixelVault. All rights reserved.</p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Made with <HiOutlineHeart style={{ color: 'var(--color-pink)' }} /> using React
        </p>
      </div>
    </footer>
  );
}
