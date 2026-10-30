import { useNavigate } from 'react-router-dom';
import { HiOutlineCamera, HiOutlineEye } from 'react-icons/hi';
import FavoriteButton from './FavoriteButton';
import { usePhotos } from '../hooks/usePhotos';
import styles from '../styles/PhotoCard.module.css';

/**
 * PhotoCard — Individual photo card
 * Demonstrates: props, event handlers, conditional rendering,
 * CSS Modules, component composition (FavoriteButton),
 * useNavigate for programmatic navigation
 */
export default function PhotoCard({ photo, onOpenModal }) {
  const { toggleFavorite } = usePhotos();
  const navigate = useNavigate();

  // Destructuring JavaScript variables from props
  const { _id, title, imageUrl, category, photographer, isFavorite, views } = photo;

  const handleCardClick = () => {
    if (onOpenModal) {
      onOpenModal(photo);
    } else {
      navigate(`/photo/${_id}`);
    }
  };

  const handleViewDetail = (e) => {
    e.stopPropagation();
    navigate(`/photo/${_id}`);
  };

  return (
    <article className={styles.card} onClick={handleCardClick} id={`photo-card-${_id}`}>
      {/* Favorite button — component composition */}
      <div className={styles.favoriteBtn}>
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={() => toggleFavorite(_id)}
        />
      </div>

      {/* Image with hover zoom effect */}
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={imageUrl}
          alt={title}
          loading="lazy"
        />
        <div className={styles.imageOverlay} />
        <button className={styles.viewBtn} onClick={handleViewDetail}>
          <HiOutlineEye style={{ marginRight: '4px' }} /> View Details
        </button>
      </div>

      {/* Card body with metadata */}
      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.cardMeta}>
          <span className={styles.category}>{category}</span>
          <span className={styles.photographer}>
            <HiOutlineCamera size={14} />
            {photographer}
          </span>
        </div>
      </div>
    </article>
  );
}
