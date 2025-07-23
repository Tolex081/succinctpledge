import React, { useState, useEffect } from 'react';

const BadgePreview = ({ preview, onDownload }) => {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const cleanUsername = preview.username?.replace('@', '');
    if (cleanUsername) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setProfileImage(img.src);
        
        // Calculate logo dimensions exactly like canvas does
        const logoImg = document.querySelector('#badge-logo');
        if (logoImg && img.naturalWidth && img.naturalHeight) {
          const targetHeight = 32;
          const maxWidth = 240;
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          
          let logoHeight = targetHeight;
          let logoWidth = targetHeight * aspectRatio;
          
          if (logoWidth > maxWidth) {
            logoWidth = maxWidth;
            logoHeight = maxWidth / aspectRatio;
          }
          
          // Apply calculated dimensions
          logoImg.style.width = logoWidth + 'px';
          logoImg.style.height = logoHeight + 'px';
          logoImg.style.maxWidth = 'none';
        }
      };
      img.onerror = () => setProfileImage(null);
      // Use X provider specifically for unavatar.io
      img.src = `https://unavatar.io/x/${cleanUsername}`;
    } else {
      setProfileImage(null);
    }
  }, [preview.username]);

  const handleDownload = async () => {
    const cleanUsername = preview.username?.replace('@', '');
    
    if (!cleanUsername) {
      alert('Please enter your username first!');
      return;
    }
    
    const pledgeData = {
      username: cleanUsername,
      message: preview.message || `I, ${cleanUsername}, pledge my allegiance to Succinct!`,
      timestamp: preview.timestamp,
      profileUrl: `https://unavatar.io/x/${cleanUsername}`
    };
    
    try {
      // Import badgeGenerator dynamically
      const { downloadBadge } = await import('../utils/badgeGenerator');
      await downloadBadge(pledgeData);
      onDownload('🏆 Badge downloaded successfully!');
    } catch (error) {
      onDownload('❌ Error downloading badge');
    }
  };

  const formatTimestamp = () => {
    if (!preview.timestamp) return '';
    return preview.timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDisplayMessage = () => {
    const cleanUsername = preview.username?.replace('@', '');
    if (!cleanUsername) return 'Enter your pledge to see preview...';
    return preview.message || `I, ${cleanUsername}, pledge my allegiance to Succinct!`;
  };

  const getDisplayUsername = () => {
    const cleanUsername = preview.username?.replace('@', '');
    return cleanUsername || 'Enter Username';
  };

  return (
    <div className="w-full max-w-sm">
      <h3 className="text-xl font-bold mb-4 text-purple-200 text-center">Badge Preview</h3>
      
      {/* Badge Container */}
      <div className="badge-preview badge-glow rounded-2xl p-6 w-72 h-96 flex flex-col items-center justify-between stamp-effect mx-auto">
        {/* Badge Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-3">
            <img 
              src="/succinct-logo.png" 
              alt="Succinct Logo" 
              className="w-12 h-12"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <div className="hidden">
              <h3 className="text-2xl font-bold text-white">SUCCINCT</h3>
            </div>
          </div>
          <p className="text-sm text-purple-200">ALLEGIANCE PLEDGE</p>
        </div>
        
        {/* Profile Section */}
        <div className="text-center flex-1 flex flex-col justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-4xl mb-3 mx-auto border-4 border-white/50">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
                onError={() => setProfileImage(null)}
              />
            ) : (
              '👤'
            )}
          </div>
          <h4 className="text-xl font-bold text-white mb-2">
            {getDisplayUsername()}
          </h4>
        </div>
        
        {/* Pledge Text */}
        <div className="bg-black/30 rounded-lg p-3 mb-4 w-full">
          <p className="text-xs text-purple-100 text-center leading-relaxed">
            {getDisplayMessage()}
          </p>
        </div>
        
        {/* Footer */}
        <div className="text-center">
          {preview.username && (
            <p className="text-xs text-purple-300 mb-1">
              {formatTimestamp()}
            </p>
          )}
          <div className="flex items-center justify-center space-x-2 text-xs text-purple-300">
            <span>🔥</span>
            <span>DIAMOND HANDS</span>
            <span>🔥</span>
          </div>
        </div>
      </div>
      
      {/* Download Info */}
      <div className="text-center mt-4">
        <p className="text-xs text-purple-400">Badge will be generated at 300 DPI</p>
        <p className="text-xs text-purple-400">Perfect for social media!</p>
        
        {preview.username && (
          <button
            onClick={handleDownload}
            className="mt-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105"
          >
             Download This Badge
          </button>
        )}
      </div>
    </div>
  );
};

export default BadgePreview;