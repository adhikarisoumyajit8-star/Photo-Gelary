import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineCamera, HiOutlineEye, HiOutlineCalendar, HiOutlineTag, HiOutlineTrash } from 'react-icons/hi';
import FavoriteButton from '../components/FavoriteButton';
import Loader from '../components/Loader';
import { usePhotos } from '../hooks/usePhotos';
import { useAuth } from '../context/AuthContext';

/**
 * PhotoDetailPage — Single photo full view with metadata
 * Demonstrates: useParams, useEffect with cleanup, useNavigate,
 * useState for local state, error handling, JSX rendering
 */
export default function PhotoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPhotoById, toggleFavorite, deletePhoto } = usePhotos();
  const { user } = useAuth();

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // useEffect to fetch photo data when ID changes
  useEffect(() => {
    let isMounted = true; // cleanup flag to prevent state update on unmounted component

    const loadPhoto = async () => {
      try {
        setLoading(true);
        const data = await fetchPhotoById(id);
        if (isMounted) {
          setPhoto(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Photo not found');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPhoto();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [id, fetchPhotoById]);

  const handleToggleFavorite = async () => {
    const updated = await toggleFavorite(photo._id);
    setPhoto((prev) => ({ ...prev, isFavorite: updated.isFavorite }));
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    setDeleting(true);
    try {
      await deletePhoto(photo._id);
      navigate('/');
    } catch (err) {
      setDeleting(false);
      alert('Failed to delete photo');
    }
  };

  if (loading) return <div className="page-wrapper"><Loader text="Loading photo..." /></div>;

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: 'var(--space-12)' }}>
          <div className="empty-state">
            <div className="empty-state-icon">😔</div>
            <h3>Photo Not Found</h3>
            <p>{error}</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--space-6)', display: 'inline-flex' }}>
              <HiOutlineArrowLeft /> Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(photo.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
        {/* Back navigation */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--fs-sm)',
            marginBottom: 'var(--space-6)',
            transition: 'color 250ms ease',
          }}
        >
          <HiOutlineArrowLeft /> Back to Gallery
        </Link>

        {/* Photo Detail Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-8)',
          animation: 'fadeInUp 0.5s ease-out',
        }}>
          {/* Main Image */}
          <div style={{
            borderRadius: 'var(--radius-2xl)',
            overflow: 'hidden',
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}>
            <img
              src={photo.imageUrl}
              alt={photo.title}
              style={{
                width: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

          {/* Photo Info */}
          <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-6)',
              flexWrap: 'wrap',
            }}>
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-4xl)',
                  fontWeight: 'var(--fw-bold)',
                  marginBottom: 'var(--space-2)',
                }}>
                  {photo.title}
                </h1>
                <span className="badge badge-accent">{photo.category}</span>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <FavoriteButton
                  isFavorite={photo.isFavorite}
                  onToggle={handleToggleFavorite}
                  size="lg"
                />
                {user?.role === 'admin' && <button
                  className="btn btn-ghost"
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{ color: 'var(--color-danger)' }}
                  title="Delete photo"
                >
                  <HiOutlineTrash size={20} />
                </button>}
              </div>
            </div>

            {photo.description && (
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--fs-lg)',
                lineHeight: 1.8,
                marginBottom: 'var(--space-6)',
              }}>
                {photo.description}
              </p>
            )}

            {/* Metadata Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 'var(--space-4)',
              padding: 'var(--space-6)',
              background: 'var(--color-bg-glass)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              marginBottom: 'var(--space-6)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <HiOutlineCamera size={20} style={{ color: 'var(--color-accent-light)' }} />
                <div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Photographer</div>
                  <div style={{ fontWeight: 'var(--fw-semibold)' }}>{photo.photographer}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <HiOutlineEye size={20} style={{ color: 'var(--color-accent-light)' }} />
                <div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Views</div>
                  <div style={{ fontWeight: 'var(--fw-semibold)' }}>{photo.views}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <HiOutlineCalendar size={20} style={{ color: 'var(--color-accent-light)' }} />
                <div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Added</div>
                  <div style={{ fontWeight: 'var(--fw-semibold)' }}>{formattedDate}</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {photo.tags && photo.tags.length > 0 && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--fs-sm)',
                  fontWeight: 'var(--fw-semibold)',
                  textTransform: 'uppercase',
                }}>
                  <HiOutlineTag /> Tags
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {/* .map() to render tags array */}
                  {photo.tags.map((tag) => (
                    <span key={tag} className="badge badge-accent">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
