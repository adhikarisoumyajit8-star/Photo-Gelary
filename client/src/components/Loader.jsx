/**
 * Loader — Loading skeleton/spinner
 * Demonstrates: CSS-in-JS inline styles, reusable component with props
 */
export default function Loader({ text = 'Loading photos...' }) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    gap: '1.5rem',
  };

  const spinnerStyle = {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(124, 58, 237, 0.1)',
    borderTopColor: '#7c3aed',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  };

  const textStyle = {
    fontSize: 'var(--fs-sm)',
    color: 'var(--color-text-muted)',
    fontWeight: 'var(--fw-medium)',
  };

  return (
    <div style={containerStyle}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={spinnerStyle} />
      <p style={textStyle}>{text}</p>
    </div>
  );
}
