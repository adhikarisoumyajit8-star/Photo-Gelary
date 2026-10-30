import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HiOutlinePhotograph, HiOutlineHeart, HiOutlineUpload, HiOutlineInformationCircle, HiOutlineMenuAlt3, HiOutlineX, HiOutlineHome, HiOutlineUserCircle, HiOutlineLogout, HiOutlineShieldCheck } from 'react-icons/hi';
import { usePhotos } from '../hooks/usePhotos';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Navbar.module.css';

/**
 * Navbar — Responsive navigation bar
 * Demonstrates: useState for mobile menu, NavLink active state,
 * conditional rendering, props from context
 */
export default function Navbar() {
  // useState for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { favoriteCount } = usePhotos();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Navigation items array — rendered with .map()
  const navItems = [
    { to: '/', label: 'Gallery', icon: <HiOutlineHome /> },
    { to: '/favorites', label: 'Favorites', icon: <HiOutlineHeart />, badge: favoriteCount },
    ...(user?.role === 'admin' ? [
      { to: '/admin', label: 'Admin', icon: <HiOutlineShieldCheck /> },
      { to: '/upload', label: 'Upload', icon: <HiOutlineUpload /> },
    ] : []),
    { to: '/about', label: 'About', icon: <HiOutlineInformationCircle /> },
  ];

  const handleSignOut = () => {
    signOut();
    closeMobileMenu();
    navigate('/');
  };

  return (
    <nav className={styles.navbar} id="main-navbar">
      <div className={styles.navContainer}>
        {/* Logo — Link component from react-router-dom */}
        <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
          <span className={styles.logoIcon}>
            <HiOutlinePhotograph />
          </span>
          <span>PixelVault</span>
        </Link>

        {/* Desktop Navigation — uses .map() to render nav items */}
        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
              {/* Conditional rendering: show badge only when count > 0 */}
              {item.badge > 0 && (
                <span className={styles.favBadge}>{item.badge}</span>
              )}
            </NavLink>
          ))}
          {user ? (
            <button className={styles.navLink} onClick={handleSignOut} title={`Sign out ${user.name}`}><HiOutlineLogout /><span>Sign out</span></button>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}><HiOutlineUserCircle /><span>Sign in</span></NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          id="mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Navigation — conditional rendering */}
      {isMobileMenuOpen && (
        <div className={styles.mobileNav} id="mobile-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
              onClick={closeMobileMenu}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className={styles.favBadge}>{item.badge}</span>
              )}
            </NavLink>
          ))}
          {user ? (
            <button className={styles.navLink} onClick={handleSignOut}><HiOutlineLogout /><span>Sign out</span></button>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} onClick={closeMobileMenu}><HiOutlineUserCircle /><span>Sign in</span></NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
