import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../lib/api';

// ──────────────────────────────────────────────
// PhotoContext — Global state for the entire app
// Demonstrates: createContext, useState, useEffect,
//   useCallback, useMemo, Context Provider pattern
// ──────────────────────────────────────────────
export const PhotoContext = createContext(null);

export function PhotoProvider({ children }) {
  // ─── State Management with useState ───
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Fetch all photos — useEffect for side effects ───
  const fetchPhotos = useCallback(async (category = 'All', search = '') => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (category && category !== 'All') params.category = category;
      if (search && search.trim()) params.search = search.trim();

      const response = await api.get('/photos', { params });
      setPhotos(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch photos');
      console.error('Fetch photos error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch categories ───
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/photos/categories/list');
      setCategories(['All', ...response.data]);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  }, []);

  // ─── Toggle favorite — PATCH API call ───
  const toggleFavorite = useCallback(async (photoId) => {
    try {
      const response = await api.patch(`/photos/${photoId}/favorite`);
      const updatedPhoto = response.data;

      // Update local state optimistically (using .map to create new array)
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo._id === photoId ? { ...photo, isFavorite: updatedPhoto.isFavorite } : photo
        )
      );

      return updatedPhoto;
    } catch (err) {
      console.error('Toggle favorite error:', err);
      throw err;
    }
  }, []);

  // ─── Add new photo — POST API call ───
  const addPhoto = useCallback(async (photoData) => {
    try {
      const response = await api.post('/photos', photoData);
      setPhotos((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  }, []);

  // ─── Delete photo — DELETE API call ───
  const deletePhoto = useCallback(async (photoId) => {
    try {
      await api.delete(`/photos/${photoId}`);
      // Remove from local state using .filter()
      setPhotos((prev) => prev.filter((photo) => photo._id !== photoId));
    } catch (err) {
      console.error('Delete photo error:', err);
      throw err;
    }
  }, []);

  // ─── Fetch single photo ───
  const fetchPhotoById = useCallback(async (photoId) => {
    try {
      const response = await api.get(`/photos/${photoId}`);
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  }, []);

  // ─── Derived state using useMemo ───
  const favoritePhotos = useMemo(
    () => photos.filter((photo) => photo.isFavorite),
    [photos]
  );

  const favoriteCount = useMemo(() => favoritePhotos.length, [favoritePhotos]);

  const photosByCategory = useMemo(() => {
    if (activeCategory === 'All') return photos;
    return photos.filter((photo) => photo.category === activeCategory);
  }, [photos, activeCategory]);

  // ─── Initial data fetch ───
  useEffect(() => {
    fetchPhotos();
    fetchCategories();
  }, [fetchPhotos, fetchCategories]);

  // ─── Refetch when filters change ───
  useEffect(() => {
    fetchPhotos(activeCategory, searchQuery);
  }, [activeCategory, searchQuery, fetchPhotos]);

  // ─── Context value (memoized to prevent unnecessary re-renders) ───
  const contextValue = useMemo(
    () => ({
      // State
      photos,
      categories,
      activeCategory,
      searchQuery,
      loading,
      error,
      favoritePhotos,
      favoriteCount,
      photosByCategory,

      // Actions
      setActiveCategory,
      setSearchQuery,
      toggleFavorite,
      addPhoto,
      deletePhoto,
      fetchPhotos,
      fetchPhotoById,
    }),
    [
      photos, categories, activeCategory, searchQuery, loading, error,
      favoritePhotos, favoriteCount, photosByCategory,
      toggleFavorite, addPhoto, deletePhoto, fetchPhotos, fetchPhotoById,
    ]
  );

  return (
    <PhotoContext.Provider value={contextValue}>
      {children}
    </PhotoContext.Provider>
  );
}
