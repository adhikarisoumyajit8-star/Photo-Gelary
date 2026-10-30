import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUpload, HiOutlineCheck, HiOutlineExclamation, HiOutlineX } from 'react-icons/hi';
import { usePhotos } from '../hooks/usePhotos';
import styles from '../styles/Upload.module.css';

/**
 * UploadPage — Form to add new photo
 * Demonstrates: controlled components (every input bound to state),
 * form validation, useState for form state, event handling,
 * image URL preview, tag management with array operations
 */
export default function UploadPage() {
  const navigate = useNavigate();
  const { addPhoto } = usePhotos();

  // ─── Form state — each field controlled with useState ───
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    photographer: '',
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Available categories — JavaScript array variable
  const categories = ['Nature', 'Architecture', 'People', 'Animals', 'Travel', 'Food'];

  // ─── Controlled input handler ───
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ─── Tag management — array operations ───
  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      // .filter() to check for duplicates, then spread to add
      if (!tags.includes(newTag)) {
        setTags((prev) => [...prev, newTag]);
      }
      setTagInput('');
    }
  };

  // .filter() to remove a tag
  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // ─── Form submission ───
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission — important JSX/HTML pattern
    setError('');
    setSuccess(false);

    // Basic validation
    if (!formData.title || !formData.imageUrl || !formData.category) {
      setError('Please fill in all required fields (Title, Image URL, and Category)');
      return;
    }

    setSubmitting(true);

    try {
      await addPhoto({
        ...formData,
        tags,
      });

      setSuccess(true);

      // Reset form
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        category: '',
        photographer: '',
      });
      setTags([]);

      // Navigate to gallery after delay
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message || err.errors?.join(', ') || 'Failed to upload photo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className={`container ${styles.uploadPage}`}>
        {/* Page Header */}
        <div className="section-header">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'rgba(124, 58, 237, 0.1)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-4)',
          }}>
            <HiOutlineUpload size={32} style={{ color: 'var(--color-accent-light)' }} />
          </div>
          <h2>Upload a Photo</h2>
          <p>Share your photography with the PixelVault community</p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className={styles.formCard} id="upload-form">
          {/* Success message — conditional rendering */}
          {success && (
            <div className={styles.successMessage}>
              <HiOutlineCheck size={20} />
              Photo uploaded successfully! Redirecting to gallery...
            </div>
          )}

          {/* Error message — conditional rendering */}
          {error && (
            <div className={styles.errorMessage}>
              <HiOutlineExclamation size={20} />
              {error}
            </div>
          )}

          {/* Title + Photographer Row */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              {/* htmlFor — JSX conversion from HTML "for" attribute */}
              <label className={styles.label} htmlFor="title">
                Title <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={styles.input}
                placeholder="Enter photo title"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="photographer">
                Photographer
              </label>
              <input
                type="text"
                id="photographer"
                name="photographer"
                className={styles.input}
                placeholder="Photographer name"
                value={formData.photographer}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Image URL */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="imageUrl">
              Image URL <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              className={styles.input}
              placeholder="https://example.com/photo.jpg"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            {/* Image preview — conditional rendering */}
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className={styles.imagePreview}
                onError={(e) => { e.target.style.display = 'none'; }}
                onLoad={(e) => { e.target.style.display = 'block'; }}
              />
            )}
            <p className={styles.helperText}>
              Paste a direct link to your image (e.g., from Unsplash)
            </p>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              placeholder="Describe your photo..."
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
            />
          </div>

          {/* Category */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="category">
              Category <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            {/* select element — controlled component */}
            <select
              id="category"
              name="category"
              className={styles.select}
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {/* .map() to render options from array */}
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="tags">
              Tags
            </label>
            <div className={styles.tagsInput}>
              {/* .map() to render tag chips dynamically */}
              {tags.map((tag) => (
                <span key={tag} className={styles.tagChip}>
                  {tag}
                  <span
                    className={styles.tagRemove}
                    onClick={() => removeTag(tag)}
                    role="button"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <HiOutlineX size={14} />
                  </span>
                </span>
              ))}
              <input
                type="text"
                id="tags"
                className={styles.input}
                placeholder="Type a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                style={{ flex: 1, minWidth: '150px' }}
              />
            </div>
            <p className={styles.helperText}>Press Enter or comma to add a tag</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
            id="submit-upload"
          >
            {submitting ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      </div>
    </div>
  );
}
