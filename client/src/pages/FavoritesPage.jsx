import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiOutlineArrowRight } from 'react-icons/hi';
import PhotoGrid from '../components/PhotoGrid';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { usePhotos, useModal } from '../hooks/usePhotos';

/**
 * FavoritesPage — Shows only favorited photos
 * Demonstrates: .filter() array operation (via context),
 * conditional rendering for empty state, component reuse
 */
export default function FavoritesPage() {
  const { favoritePhotos, loading } = usePhotos();
  const { isOpen, modalData, openModal, closeModal } = useModal();

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-12)' }}>
        {/* Page Header */}
        <div className="section-header">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'rgba(236, 72, 153, 0.1)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-4)',
          }}>
            <HiOutlineHeart size={32} style={{ color: 'var(--color-pink)' }} />
          </div>
          <h2>Your Favorites</h2>
          <p>
            {favoritePhotos.length > 0
              ? `You have ${favoritePhotos.length} favorite ${favoritePhotos.length === 1 ? 'photo' : 'photos'}`
              : 'Start adding photos to your favorites collection'}
          </p>
        </div>

        {loading ? (
          <Loader text="Loading favorites..." />
        ) : favoritePhotos.length === 0 ? (
          /* Empty state — conditional rendering */
          <div className="empty-state">
            <div className="empty-state-icon">💜</div>
            <h3>No Favorites Yet</h3>
            <p>Click the heart icon on any photo to add it to your favorites</p>
            <Link
              to="/"
              className="btn btn-primary"
              style={{ marginTop: 'var(--space-6)', display: 'inline-flex' }}
            >
              Browse Gallery <HiOutlineArrowRight />
            </Link>
          </div>
        ) : (
          /* PhotoGrid reuse — same component, different data (filtered) */
          <PhotoGrid
            photos={favoritePhotos}
            title="Favorites Collection"
            onOpenModal={openModal}
          />
        )}
      </div>

      <Modal photo={modalData} isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
