import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import PhotoGrid from '../components/PhotoGrid';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { usePhotos, useModal } from '../hooks/usePhotos';

/**
 * HomePage — Landing page with hero section + full gallery
 * Demonstrates: component composition, custom hooks, conditional rendering,
 * inline styles + CSS classes, dynamic content from state
 */
export default function HomePage() {
  const { photos, loading, error } = usePhotos();
  const { isOpen, modalData, openModal, closeModal } = useModal();

  // Hero section styles — inline style technique
  const heroStyle = {
    position: 'relative',
    padding: 'var(--space-24) var(--space-6) var(--space-16)',
    textAlign: 'center',
    overflow: 'hidden',
  };

  const heroBgStyle = {
    position: 'absolute',
    inset: 0,
    background: 'var(--gradient-hero)',
    zIndex: -1,
  };

  const heroTitleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--fs-6xl)',
    fontWeight: 'var(--fw-extrabold)',
    lineHeight: 1.1,
    marginBottom: 'var(--space-6)',
    animation: 'fadeInUp 0.6s ease-out',
  };

  const gradientTextStyle = {
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <div className="page-wrapper">
      {/* ─── Hero Section ─── */}
      <section style={heroStyle} id="hero-section">
        <div style={heroBgStyle} />
        <div className="container">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-4)',
            background: 'rgba(124, 58, 237, 0.1)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--fs-sm)',
            color: 'var(--color-accent-light)',
            marginBottom: 'var(--space-6)',
            animation: 'fadeInDown 0.5s ease-out',
          }}>
            <HiOutlineSparkles />
            <span>Discover Amazing Photography</span>
          </div>

          <h1 style={heroTitleStyle}>
            Your Personal<br />
            <span style={gradientTextStyle}>Photo Gallery</span>
          </h1>

          <p style={{
            fontSize: 'var(--fs-lg)',
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto var(--space-8)',
            lineHeight: 1.7,
            animation: 'fadeInUp 0.7s ease-out',
          }}>
            Explore, curate, and organize stunning photography from around the world.
            Filter by category, save your favorites, and build your collection.
          </p>

          <div style={{
            display: 'flex',
            gap: 'var(--space-4)',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fadeInUp 0.8s ease-out',
          }}>
            <a href="#gallery" className="btn btn-primary" style={{ fontSize: 'var(--fs-base)', padding: 'var(--space-4) var(--space-8)' }}>
              Explore Gallery <HiOutlineArrowRight />
            </a>
            <Link to="/upload" className="btn btn-secondary" style={{ fontSize: 'var(--fs-base)', padding: 'var(--space-4) var(--space-8)' }}>
              Upload Photo
            </Link>
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-10)',
            marginTop: 'var(--space-12)',
            animation: 'fadeInUp 0.9s ease-out',
          }}>
            {[
              { value: photos.length, label: 'Photos' },
              { value: '6', label: 'Categories' },
              { value: '20+', label: 'Photographers' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--fs-3xl)',
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--color-text-primary)',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: 'var(--fs-sm)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Gallery Section ─── */}
      <section className="container" id="gallery">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <FilterBar />
          <SearchBar />
        </div>

        {/* Conditional rendering based on loading/error state */}
        {loading ? (
          <Loader text="Loading your gallery..." />
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        ) : (
          <PhotoGrid
            photos={photos}
            onOpenModal={openModal}
          />
        )}
      </section>

      {/* ─── Lightbox Modal ─── */}
      <Modal photo={modalData} isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
