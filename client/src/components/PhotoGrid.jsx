import PhotoCard from './PhotoCard';
import styles from '../styles/PhotoGrid.module.css';

/**
 * PhotoGrid — Renders a responsive grid of PhotoCards
 * Demonstrates: .map() array operation to render dynamic content,
 * props drilling, conditional rendering for empty state, CSS Grid
 */
export default function PhotoGrid({ photos, title, onOpenModal, showCount = true }) {
  // Early return for empty state — conditional rendering
  if (!photos || photos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📸</div>
        <h3>No Photos Found</h3>
        <p>Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <section className={styles.gridSection}>
      {/* Grid header with title and count */}
      {(title || showCount) && (
        <div className={styles.gridHeader}>
          {title && <h2 className={styles.gridTitle}>{title}</h2>}
          {showCount && (
            <span className={styles.resultCount}>
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </span>
          )}
        </div>
      )}

      {/* 
        CSS Grid container — uses .map() to render each photo
        Each PhotoCard receives photo data as props
      */}
      <div className={styles.grid}>
        {photos.map((photo) => (
          <PhotoCard
            key={photo._id}
            photo={photo}
            onOpenModal={onOpenModal}
          />
        ))}
      </div>
    </section>
  );
}
