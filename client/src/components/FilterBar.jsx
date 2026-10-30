import { usePhotos } from '../hooks/usePhotos';
import styles from '../styles/FilterBar.module.css';

/**
 * FilterBar — Category filter pills
 * Demonstrates: .map() to render category pills, .filter() conceptually
 * (filters are applied via context), useState via context,
 * dynamic className binding, event handling
 */
export default function FilterBar() {
  const { categories, activeCategory, setActiveCategory } = usePhotos();

  // Category icons mapping — JavaScript object/variable usage
  const categoryIcons = {
    All: '🌐',
    Nature: '🌿',
    Architecture: '🏛️',
    People: '👥',
    Animals: '🐾',
    Travel: '✈️',
    Food: '🍽️',
  };

  return (
    <div className={styles.filterBar} id="filter-bar">
      <span className={styles.filterLabel}>Filter by</span>
      <div className={styles.filterPills}>
        {/* .map() to render category filter pills dynamically */}
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.pill} ${activeCategory === category ? styles.active : ''}`}
            onClick={() => setActiveCategory(category)}
            id={`filter-${category.toLowerCase()}`}
          >
            <span>{categoryIcons[category] || '📁'}</span>
            <span>{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
