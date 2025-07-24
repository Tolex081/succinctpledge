import React, { useEffect } from 'react';
import { downloadBadge } from '../utils/badgeGenerator';

const PledgeModal = ({ pledge, onClose, onDownload }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!pledge) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownloadBadge = async () => {
    try {
      await downloadBadge(pledge);
      onDownload('🏆 Badge downloaded successfully!');
    } catch (error) {
      console.error('Badge download failed:', error);
      onDownload('❌ Error downloading badge');
    }
  };

  // Check if profile URL is a Base64 uploaded image
  const isBase64Image = (url) => {
    return url && url.startsWith('data:image/');
  };

  // Get profile image source with proper fallback
  const getProfileImageSrc = () => {
    if (pledge.profileUrl) {
      return pledge.profileUrl; // Works for both Base64 and external URLs
    }
    return `https://unavatar.io/twitter/${pledge.username}`;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 modal flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-purple-800 to-indigo-800 rounded-2xl p-6 max-w-md w-full glow">
        <div className="text-center">
          {/* Profile Section */}
          <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
            <img 
              src={getProfileImageSrc()} 
              alt={pledge.username}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                console.log('Modal image failed to load:', pledge.profileUrl);
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-3xl text-white">👤</span>';
              }}
            />
          </div>

          {/* Image type indicator (for debugging - can be removed later) */}
          {isBase64Image(pledge.profileUrl) && (
            <div className="mb-2">
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                📤 Custom Upload
              </span>
            </div>
          )}

          {/* Username */}
          <h3 className="text-2xl font-bold mb-2">{pledge.username}</h3>

          {/* Timestamp */}
          <p className="text-purple-200 text-sm mb-4">
            {pledge.timestamp.toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>

          {/* Pledge Message */}
          <div className="bg-black/30 rounded-lg p-4 mb-6">
            <p className="text-white leading-relaxed">{pledge.message}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={handleDownloadBadge}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              📥 Download Badge
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PledgeModal;