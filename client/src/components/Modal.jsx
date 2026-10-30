import { useEffect } from 'react';
import { HiOutlineX, HiOutlineCamera, HiOutlineEye, HiOutlineCalendar, HiOutlineTag } from 'react-icons/hi';
import FavoriteButton from './FavoriteButton';
import { usePhotos } from '../hooks/usePhotos';
import styles from '../styles/Modal.module.css';

/**
 * Modal — Lightbox overlay for full-size image viewing
 * Demonstrates: useEffect for keyboard events, portal-like pattern,
 * conditional rendering, event propagation, CSS animation
 */
export default function Modal({ photo, isOpen, onClose }) {
  const { toggleFavorite } = usePhotos();

  // useEffect for keyboard event listener (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    // Cleanup function — important React pattern
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Conditional rendering: don't render if not open or no photo
  if (!isOpen || !photo) return null;

  const { _id, title, description, imageUrl, category, photographer, tags, views, createdAt } = photo;

  // Format date using JavaScript Date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Backdrop — click to close */}
      <div className={styles.backdrop} onClick={onClose} />

      {/* Close button */}
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal" id="modal-close">
        <HiOutlineX />
      </button>

      {/* Modal content */}
      <div className={styles.modal} role="dialog" aria-labelledby="modal-title" id="photo-modal">
        <img
          className={styles.modalImage}
          src={imageUrl}
          alt={title}
        />

        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle} id="modal-title">{title}</h2>

          {description && (
            <p className={styles.modalDescription}>{description}</p>
          )}

          {/* Metadata row */}
          <div className={styles.modalMeta}>
            <span className={styles.metaItem}>
              <HiOutlineCamera />
              {photographer}
            </span>
            <span className={styles.metaItem}>
              <HiOutlineEye />
              {views} views
            </span>
            <span className={styles.metaItem}>
              <HiOutlineCalendar />
              {formattedDate}
            </span>
            <span className={`badge badge-accent`}>
              {category}
            </span>
          </div>

          {/* Tags — .map() to render tag chips */}
          {tags && tags.length > 0 && (
            <div className={styles.modalTags}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  <HiOutlineTag size={12} style={{ marginRight: '4px' }} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className={styles.modalActions}>
            <FavoriteButton
              isFavorite={photo.isFavorite}
              onToggle={() => toggleFavorite(_id)}
              size="lg"
            />
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
              {photo.isFavorite ? 'In your favorites' : 'Add to favorites'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
