import React, { useState, useEffect } from 'react';

const BadgePreview = ({ preview, onDownload }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const cleanUsername = preview.username?.replace(/^@+/, '');
    if (cleanUsername && cleanUsername.length > 1) {
      setProfileImage(null); // Reset while loading
      setProfileLoading(true); // Show loading state
      
      const loadProfileImage = async () => {
        const sources = [
          `https://unavatar.io/x/${cleanUsername}`,
          `https://unavatar.io/github/${cleanUsername}`,
          `https://github.com/${cleanUsername}.png`
        ];
        
        for (const src of sources) {
          try {
            // Create a test image to check if it loads
            const testImg = new Image();
            
            const imageLoaded = await new Promise((resolve, reject) => {
              testImg.onload = () => {
                // Check if image is actually loaded (not a placeholder)
                if (testImg.naturalWidth > 10 && testImg.naturalHeight > 10) {
                  console.log(`Badge preview: Profile loaded from ${src}`);
                  resolve(src);
                } else {
                  reject('Image too small or placeholder');
                }
              };
              
              testImg.onerror = () => reject('Failed to load');
              
              // Add timeout
              setTimeout(() => reject('Timeout'), 2000);
              
              // Don't set crossOrigin to avoid CORS issues in preview
              testImg.src = src;
            });
            
            // If we get here, the image loaded successfully
            setProfileImage(imageLoaded);
            setProfileLoading(false);
            return; // Success, exit loop
            
          } catch (error) {
            console.log(`Badge preview: Failed to load from ${src}:`, error);
            continue; // Try next source
          }
        }
        
        // If all sources fail, keep null (shows initials fallback)
        console.log('Badge preview: All sources failed, using initials fallback');
        setProfileLoading(false);
      };
      
      // Debounce the loading to avoid too many requests
      const timeoutId = setTimeout(() => {
        loadProfileImage();
      }, 300); // Shorter delay for better UX
      
      return () => {
        clearTimeout(timeoutId);
        setProfileLoading(false);
      };
    } else {
      setProfileImage(null);
      setProfileLoading(false);
    }
  }, [preview.username]);

  const handleDownload = async () => {
    const cleanUsername = preview.username?.replace(/^@+/, '');
    
    if (!cleanUsername) {
      alert('Please enter your username first!');
      return;
    }
    
    const pledgeData = {
      username: cleanUsername,
      message: preview.message || `I, ${cleanUsername}, pledge my allegiance to Succinct!`,
      timestamp: preview.timestamp,
      profileUrl: profileImage || `https://unavatar.io/x/${cleanUsername}`
    };
    
    try {
      // Import badgeGenerator dynamically
      const { downloadBadge } = await import('../utils/badgeGenerator');
      await downloadBadge(pledgeData);
      onDownload('Badge downloaded successfully!');
    } catch (error) {
      onDownload('Error downloading badge');
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
    const cleanUsername = preview.username?.replace(/^@+/, '');
    if (!cleanUsername) return 'Enter your pledge to see preview...';
    return preview.message || `I, ${cleanUsername}, pledge my allegiance to Succinct!`;
  };

  const getDisplayUsername = () => {
    const cleanUsername = preview.username?.replace(/^@+/, '');
    return cleanUsername || 'Enter Username';
  };

  return (
    <div className="w-full max-w-lg">
      <h3 className="text-2xl font-black mb-4 text-purple-200 text-center">Badge Preview</h3>
      
      {/* Badge Container */}
      <div className="badge-preview badge-glow rounded-2xl p-8 w-80 h-[480px] flex flex-col items-center justify-between stamp-effect mx-auto">
        {/* Badge Header - Logo Only */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4 min-h-[32px]">
            <img 
              id="badge-logo"
              src="/succinct-logo.png" 
              alt="Succinct Logo" 
              className="opacity-90"
              style={{
                height: '32px',
                width: 'auto',
                maxWidth: '240px',
                objectFit: 'contain',
                display: 'block'
              }}
              onLoad={(e) => {
                // Apply exact canvas calculations
                const img = e.target;
                const targetHeight = 32;
                const maxWidth = 240;
                
                if (img.naturalWidth && img.naturalHeight) {
                  const aspectRatio = img.naturalWidth / img.naturalHeight;
                  
                  let logoHeight = targetHeight;
                  let logoWidth = targetHeight * aspectRatio;
                  
                  if (logoWidth > maxWidth) {
                    logoWidth = maxWidth;
                    logoHeight = maxWidth / aspectRatio;
                  }
                  
                  img.style.width = logoWidth + 'px';
                  img.style.height = logoHeight + 'px';
                }
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <div className="hidden text-center">
              <h3 className="text-xl font-bold text-white">SUCCINCT</h3>
            </div>
          </div>
          <p className="text-lg font-bold text-purple-200">ALLEGIANCE PLEDGE</p>
        </div>
        
        {/* Profile Section */}
        <div className="text-center flex-1 flex flex-col justify-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-4xl mb-4 mx-auto border-4 border-white/50 relative overflow-hidden">
            {profileLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
            ) : profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full absolute inset-0"
                onError={(e) => {
                  console.log('Badge preview image failed to display, falling back');
                  setProfileImage(null);
                }}
                onLoad={() => {
                  console.log('Badge preview image displayed successfully');
                }}
              />
            ) : (
              <span className="text-white font-bold text-lg relative z-10">
                {getDisplayUsername() !== 'Enter Username' ? 
                  getDisplayUsername().slice(0, 2).toUpperCase() : 'PFP'}
              </span>
            )}
          </div>
          <h4 className="text-2xl font-black text-white mb-3">
            {getDisplayUsername()}
          </h4>
        </div>
        
        {/* Pledge Text */}
        <div className="bg-black/30 rounded-lg p-4 mb-6 w-full">
          <p className="text-sm font-semibold text-purple-100 text-center leading-relaxed">
            {getDisplayMessage()}
          </p>
        </div>
        
        {/* Footer */}
        <div className="text-center">
          {getDisplayUsername() !== 'Enter Username' && (
            <p className="text-sm font-bold text-purple-300 mb-2">
              {formatTimestamp()}
            </p>
          )}
          <div className="flex items-center justify-center space-x-2 text-sm font-bold text-purple-300 mb-2">
            <span>DIAMOND HANDS</span>
          </div>
          {getDisplayUsername() !== 'Enter Username' && (
            <p className="text-sm text-purple-400 opacity-60 font-semibold">
              @{getDisplayUsername()}
            </p>
          )}
        </div>
      </div>
      
      {/* Download Info */}
      <div className="text-center mt-4">
        
        {getDisplayUsername() !== 'Enter Username' && (
          <button
            onClick={handleDownload}
            className="mt-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-4 py-2 rounded-lg text-sm font-black transition-all transform hover:scale-105"
          >
            Download This Badge
          </button>
        )}
      </div>
    </div>
  );
};

export default BadgePreview;