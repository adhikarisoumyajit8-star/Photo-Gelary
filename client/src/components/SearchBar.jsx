import { useEffect } from 'react';
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import { useSearch } from '../hooks/usePhotos';
import { usePhotos } from '../hooks/usePhotos';
import styles from '../styles/FilterBar.module.css';

/**
 * SearchBar — Controlled input with debounced search
 * Demonstrates: controlled components (value + onChange),
 * custom hook usage (useSearch), useEffect for syncing
 * debounced value to context
 */
export default function SearchBar() {
  const { setSearchQuery } = usePhotos();
  const { inputValue, debouncedValue, handleSearch, clearSearch } = useSearch(400);

  // useEffect to sync debounced search to context
  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  const handleClear = () => {
    clearSearch();
    setSearchQuery('');
  };

  return (
    <div className={styles.searchWrapper} id="search-bar">
      <HiOutlineSearch className={styles.searchIcon} />
      {/* Controlled input — value bound to state */}
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search photos by title, tag, or photographer..."
        value={inputValue}
        onChange={(e) => handleSearch(e.target.value)}
        aria-label="Search photos"
        id="search-input"
      />
      {/* Conditional rendering: show clear button only when input has value */}
      {inputValue && (
        <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
          <HiOutlineX size={16} />
        </button>
      )}
    </div>
  );
}
