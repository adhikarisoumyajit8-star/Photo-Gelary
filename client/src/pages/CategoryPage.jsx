import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import api from '../lib/api';
import PhotoGrid from '../components/PhotoGrid';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { useModal } from '../hooks/usePhotos';

/**
 * CategoryPage — Photos filtered by category from URL params
 * Demonstrates: useParams (dynamic route params), useState,
 * useEffect for data fetching on param change, .filter()
 */
export default function CategoryPage() {
  // useParams — extract dynamic route parameter
  const { name } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, modalData, openModal, closeModal } = useModal();

  // Category emoji mapping
  const categoryEmojis = {
    Nature: '🌿',
    Architecture: '🏛️',
    People: '👥',
    Animals: '🐾',
    Travel: '✈️',
    Food: '🍽️',
  };

  // useEffect with dependency on URL param — refetch when category changes
  useEffect(() => {
    const fetchCategoryPhotos = async () => {
      setLoading(true);
      try {
        const response = await api.get('/photos', {
          params: { category: name },
        });
        setPhotos(response.data);
      } catch (err) {
        console.error('Error fetching category photos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPhotos();
  }, [name]); // Re-run when category name changes

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-12)' }}>
        {/* Breadcrumb nav */}
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

        {/* Page Header */}
        <div className="section-header">
          <div style={{
            fontSize: '3rem',
            marginBottom: 'var(--space-4)',
          }}>
            {categoryEmojis[name] || '📁'}
          </div>
          <h2>{name} Photography</h2>
          <p>Explore our curated collection of {name?.toLowerCase()} photographs</p>
        </div>

        {loading ? (
          <Loader text={`Loading ${name} photos...`} />
        ) : (
          <PhotoGrid
            photos={photos}
            onOpenModal={openModal}
          />
        )}
      </div>

      <Modal photo={modalData} isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
