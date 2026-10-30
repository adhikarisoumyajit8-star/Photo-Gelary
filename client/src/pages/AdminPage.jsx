import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePhotograph, HiOutlinePlus, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import { usePhotos } from '../hooks/usePhotos';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Admin.module.css';

export default function AdminPage() {
  const { photos, fetchPhotos, deletePhoto } = usePhotos();
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPhotos('All', '');
  }, [fetchPhotos]);

  const handleDelete = async (photo) => {
    if (!window.confirm(`Delete “${photo.title}” from the gallery?`)) return;
    setError('');
    setDeletingId(photo._id);
    try {
      await deletePhoto(photo._id);
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Could not delete this photo.');
    } finally {
      setDeletingId(null);
    }
  };

  const photoCount = photos.length;
  const totalViews = photos.reduce((total, photo) => total + (photo.views || 0), 0);
  const categoryCount = new Set(photos.map((photo) => photo.category)).size;

  return (
    <main className={`page-wrapper ${styles.adminPage}`}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PixelVault / Control room</p>
          <h1>Gallery overview</h1>
          <p className={styles.welcome}>Signed in as {user.name}</p>
        </div>
        <Link to="/upload" className={styles.addButton}><HiOutlinePlus /> Add a photo</Link>
      </div>

      <section className={styles.metrics} aria-label="Gallery statistics">
        <div className={styles.metric}><span>Photos</span><strong>{photoCount}</strong><small>in the collection</small></div>
        <div className={styles.metric}><span>Categories</span><strong>{categoryCount}</strong><small>represented</small></div>
        <div className={styles.metric}><span>Photo views</span><strong>{totalViews.toLocaleString()}</strong><small>all time</small></div>
      </section>

      <section className={styles.inventory}>
        <div className={styles.inventoryHeader}>
          <div><p className={styles.eyebrow}>Collection</p><h2>Manage photographs</h2></div>
          <span>{photoCount} total</span>
        </div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>Photograph</th><th>Category</th><th>Photographer</th><th>Views</th><th><span className={styles.srOnly}>Actions</span></th></tr></thead>
            <tbody>
              {photos.map((photo) => (
                <tr key={photo._id}>
                  <td><div className={styles.photoCell}><img src={photo.imageUrl} alt="" /><div><strong>{photo.title}</strong><small>{new Date(photo.createdAt).toLocaleDateString()}</small></div></div></td>
                  <td><span className={styles.category}>{photo.category}</span></td>
                  <td>{photo.photographer || 'Unknown'}</td>
                  <td><span className={styles.views}><HiOutlineEye /> {photo.views || 0}</span></td>
                  <td><button className={styles.deleteButton} type="button" aria-label={`Delete ${photo.title}`} title="Delete photo" disabled={deletingId === photo._id} onClick={() => handleDelete(photo)}><HiOutlineTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {photoCount === 0 && <div className={styles.empty}><HiOutlinePhotograph /><p>No photographs yet.</p><Link to="/upload">Add the first photo</Link></div>}
        </div>
      </section>
    </main>
  );
}