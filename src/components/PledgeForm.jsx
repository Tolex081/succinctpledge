import React, { useState, useEffect } from 'react';
import { aiPledges } from '../utils/pledgeGenerator';

const PledgeForm = ({ onSubmit, onPreviewUpdate, onToastShow }) => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [currentPledgeIndex, setCurrentPledgeIndex] = useState(0);

  useEffect(() => {
    const cleanUsername = username.trim().replace(/^@+/, '');
    const fullMessage = message
      ? `I, ${cleanUsername}, ${message}`
      : cleanUsername
      ? `I, ${cleanUsername}, pledge my allegiance to Succinct!`
      : '';
    onPreviewUpdate(cleanUsername, fullMessage);
  }, [username, message, onPreviewUpdate]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
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

    const profileUrl = `https://unavatar.io/twitter/${cleanUsername}`;

    const pledgeData = {
      username: cleanUsername,
      message: `I, ${cleanUsername}, ${message.trim()}`,
      timestamp: new Date(),
      profileUrl: profileUrl,
    };

    onSubmit(pledgeData);
    setUsername('');
    setMessage('');
  };

  const handleDownloadBadge = () => {
    const cleanUsername = username.trim().replace(/^@+/, '');

    if (!cleanUsername) {
      alert('Please enter your username first!');
      return;
    }

    const profileUrl = `https://unavatar.io/twitter/${cleanUsername}`;

    const pledgeData = {
      username: cleanUsername,
      message: message.trim()
        ? `I, ${cleanUsername}, ${message.trim()}`
        : `I, ${cleanUsername}, pledge my allegiance to Succinct!`,
      timestamp: new Date(),
      profileUrl: profileUrl,
    };

    import('../utils/badgeGenerator').then(({ downloadBadge }) => {
      downloadBadge(pledgeData)
        .then(() => {
          onToastShow('Badge downloaded successfully!');
        })
        .catch(() => {
          onToastShow('Error downloading badge');
        });
    });
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
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 mb-2 mx-auto">
              {username.trim() ? (
                <img
                  src={`https://unavatar.io/twitter/${username.trim().replace(/^@+/, '')}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      username
                    )}&background=8B5CF6&color=fff`;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl text-white">
                  👤
                </div>
              )}
            </div>
            <p className="text-purple-200 text-sm">Profile Preview</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-lg font-semibold mb-2 text-purple-200"> Your Pledge:</label>
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
