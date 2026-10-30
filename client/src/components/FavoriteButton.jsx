import { useState } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';

/**
 * FavoriteButton — Animated heart toggle
 * Demonstrates: useState, inline styles, conditional rendering,
 * event handling, CSS animation trigger
 */
export default function FavoriteButton({ isFavorite, onToggle, size = 'md' }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async (e) => {
    // Stop event propagation so card click doesn't fire
    e.stopPropagation();

    setIsAnimating(true);
    try {
      await onToggle();
    } catch (err) {
      console.error('Failed to toggle favorite');
    }

    // Reset animation after it completes
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Inline styles — demonstrates dynamic styling technique
  const sizeMap = { sm: 18, md: 22, lg: 28 };
  const iconSize = sizeMap[size] || sizeMap.md;

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: iconSize + 16,
    height: iconSize + 16,
    borderRadius: '50%',
    background: isFavorite
      ? 'rgba(236, 72, 153, 0.15)'
      : 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${isFavorite ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255,255,255,0.1)'}`,
    cursor: 'pointer',
    transition: 'all 250ms ease',
    animation: isAnimating ? 'heartBeat 0.6s ease-in-out' : 'none',
    transform: isAnimating ? 'scale(1)' : 'scale(1)',
  };

  const iconStyle = {
    color: isFavorite ? '#ec4899' : 'rgba(255, 255, 255, 0.7)',
    filter: isFavorite ? 'drop-shadow(0 0 6px rgba(236, 72, 153, 0.5))' : 'none',
    transition: 'all 250ms ease',
  };

  return (
    <button
      onClick={handleClick}
      style={buttonStyle}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {/* Conditional rendering: filled vs outline heart */}
      {isFavorite ? (
        <HiHeart size={iconSize} style={iconStyle} />
      ) : (
        <HiOutlineHeart size={iconSize} style={iconStyle} />
      )}
    </button>
  );
}
