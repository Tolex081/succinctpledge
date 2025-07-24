import React, { useState, useEffect } from 'react';
import { aiPledges } from '../utils/pledgeGenerator';

const PledgeForm = ({ onSubmit, onPreviewUpdate, onToastShow }) => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [currentPledgeIndex, setCurrentPledgeIndex] = useState(0);
  const [profileImage, setProfileImage] = useState(null); // New state for uploaded image
  const [profileImagePreview, setProfileImagePreview] = useState(null); // New state for image preview

  useEffect(() => {
    const cleanUsername = username.trim().replace(/^@+/, '');
    const fullMessage = message
      ? `I, ${cleanUsername}, ${message}`
      : cleanUsername
      ? `I, ${cleanUsername}, pledge my allegiance to Succinct!`
      : '';
    
    // Pass image data to preview as well
    onPreviewUpdate(cleanUsername, fullMessage, profileImage);
  }, [username, message, profileImage, onPreviewUpdate]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // New function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file (JPG, PNG, GIF, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        setProfileImage(base64Image);
        setProfileImagePreview(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  // New function to remove uploaded image
  const removeUploadedImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    // Clear the file input
    const fileInput = document.getElementById('profile-image-input');
    if (fileInput) fileInput.value = '';
  };

  const generateAIPledge = () => {
    const randomPledge = aiPledges[Math.floor(Math.random() * aiPledges.length)];
    setMessage(randomPledge);
  };

  const getRandomPledge = () => {
    setMessage(aiPledges[currentPledgeIndex]);
    setCurrentPledgeIndex((currentPledgeIndex + 1) % aiPledges.length);
  };

  const handleSubmit = () => {
    const cleanUsername = username.trim().replace(/^@+/, '');

    if (!cleanUsername) {
      alert('Please enter your username!');
      return;
    }

    if (!message.trim()) {
      alert('Please enter a pledge message or generate one!');
      return;
    }

    // Use uploaded image or fallback to unavatar
    const profileUrl = profileImage || `https://unavatar.io/twitter/${cleanUsername}`;

    const pledgeData = {
      username: cleanUsername,
      message: `I, ${cleanUsername}, ${message.trim()}`,
      timestamp: new Date(),
      profileUrl: profileUrl,
      hasCustomImage: !!profileImage, // Flag to indicate custom uploaded image
    };

    onSubmit(pledgeData);
    setUsername('');
    setMessage('');
    removeUploadedImage(); // Clear uploaded image after submit
  };

  const handleDownloadBadge = () => {
    const cleanUsername = username.trim().replace(/^@+/, '');

    if (!cleanUsername) {
      alert('Please enter your username first!');
      return;
    }

    // Use uploaded image or fallback to unavatar
    const profileUrl = profileImage || `https://unavatar.io/twitter/${cleanUsername}`;

    const pledgeData = {
      username: cleanUsername,
      message: message.trim()
        ? `I, ${cleanUsername}, ${message.trim()}`
        : `I, ${cleanUsername}, pledge my allegiance to Succinct!`,
      timestamp: new Date(),
      profileUrl: profileUrl,
      hasCustomImage: !!profileImage, // Flag for badge generator
    };

    import('../utils/badgeGenerator').then(({ downloadBadge }) => {
      downloadBadge(pledgeData)
        .then(() => {
          onToastShow('✅ Badge downloaded successfully!');
        })
        .catch((error) => {
          console.error('Badge download error:', error);
          onToastShow('❌ Error downloading badge');
        });
    });
  };

  // Get the profile image source for display
  const getProfileImageSrc = () => {
    if (profileImagePreview) return profileImagePreview;
    if (username.trim()) {
      return `https://unavatar.io/twitter/${username.trim().replace(/^@+/, '')}`;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold mb-2 text-purple-200">
             Enter Your X Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Your epic username..."
            className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-purple-300/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          />
        </div>

        <div className="flex flex-col justify-end">
          <div className="text-center">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 mb-2 mx-auto group">
              {getProfileImageSrc() ? (
                <img
                  src={getProfileImageSrc()}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (!profileImagePreview) {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        username || 'User'
                      )}&background=8B5CF6&color=fff`;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl text-white">
                  👤
                </div>
              )}
              
              {/* Upload overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label htmlFor="profile-image-input" className="cursor-pointer text-white text-xs font-bold">
                   UPLOAD
                </label>
              </div>
            </div>
            
            {/* Image upload controls */}
            <div className="space-y-2">
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <div className="flex gap-2 justify-center">
                <label
                  htmlFor="profile-image-input"
                  className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  📤 Upload PFP
                </label>
                
                {profileImagePreview && (
                  <button
                    onClick={removeUploadedImage}
                    className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-lg text-xs font-bold transition-all"
                  >
                     Remove
                  </button>
                )}
              </div>
              
              <p className="text-purple-200 text-xs">
                {profileImagePreview ? '✅ Custom Image' : 'Profile Preview'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-lg font-semibold mb-2 text-purple-200">Your Pledge:</label>
        <textarea
          rows="4"
          value={message}
          onChange={handleMessageChange}
          placeholder="Type your pledge or use AI to generate one..."
          className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-purple-300/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={generateAIPledge}
          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95"
        >
           Generate AI Pledge
        </button>
        <button
          onClick={getRandomPledge}
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95"
        >
           NEXT
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 active:scale-95 glow"
        >
         SUBMIT PLEDGE 
        </button>
        <button
          onClick={handleDownloadBadge}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-8 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 active:scale-95 glow"
        >
          DOWNLOAD BADGE 
        </button>
      </div>
    </div>
  );
};

export default PledgeForm;