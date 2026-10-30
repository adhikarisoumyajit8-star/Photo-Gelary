import { useContext, useState, useCallback, useMemo } from 'react';
import { PhotoContext } from '../context/PhotoContext';

// ──────────────────────────────────────────────
// Custom Hook: usePhotos
// Demonstrates: useContext, useState, useCallback, useMemo
// Provides a clean API for components to interact with photo state
// ──────────────────────────────────────────────
export function usePhotos() {
  const context = useContext(PhotoContext);

  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }

  return context;
}

// ──────────────────────────────────────────────
// Custom Hook: useSearch
// Debounced search input handler
// ──────────────────────────────────────────────
export function useSearch(delay = 300) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [timerId, setTimerId] = useState(null);

  const handleSearch = useCallback(
    (value) => {
      setInputValue(value);

      // Clear previous timer
      if (timerId) clearTimeout(timerId);

      // Set new debounced update
      const newTimerId = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      setTimerId(newTimerId);
    },
    [delay, timerId]
  );

  const clearSearch = useCallback(() => {
    setInputValue('');
    setDebouncedValue('');
    if (timerId) clearTimeout(timerId);
  }, [timerId]);

  return { inputValue, debouncedValue, handleSearch, clearSearch };
}

// ──────────────────────────────────────────────
// Custom Hook: useModal
// Generic modal open/close state
// ──────────────────────────────────────────────
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
    document.body.style.overflow = '';
  }, []);

  return { isOpen, modalData, openModal, closeModal };
}
