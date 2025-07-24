import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import PledgeForm from './components/PledgeForm';
import CommunityPledges from './components/CommunityPledges';
import PledgeModal from './components/PledgeModal';
import BadgePreview from './components/BadgePreview';
import SuccessToast from './components/SuccessToast';
// Import Firebase functions
import { savePledge, subscribeToPledges } from './firebase/services';

function App() {
  const [pledges, setPledges] = useState([]);
  const [selectedPledge, setSelectedPledge] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPreview, setCurrentPreview] = useState({
    username: '',
    message: '',
    timestamp: new Date()
  });

  // Set up real-time Firebase listener
  useEffect(() => {
    console.log('Setting up Firebase listener...');
    
    const unsubscribe = subscribeToPledges((newPledges) => {
      console.log('Received pledges from Firebase:', newPledges.length);
      setPledges(newPledges);
      setLoading(false);
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up Firebase listener');
      unsubscribe();
    };
  }, []);

  // Handle pledge submission with Firebase
  const handlePledgeSubmit = async (pledgeData) => {
    try {
      console.log('Submitting pledge to Firebase:', pledgeData);
      setLoading(true);
      
      // Save to Firebase (includes duplicate check)
      const savedPledge = await savePledge(pledgeData);
      console.log('Pledge saved successfully:', savedPledge);
      
      // Clear preview
      setCurrentPreview({ username: '', message: '', timestamp: new Date() });
      
      // Show success message
      showSuccessToast('✅ Pledge submitted successfully!');
      
      // Create confetti effect
      createConfettiEffect();
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to save pledge:', error);
      setLoading(false);
      
      // Check if it's a duplicate user error
      if (error.message && error.message.includes('has already made a pledge')) {
        showSuccessToast('⚠️ You have already made a pledge! Only one pledge per user is allowed.');
      } else {
        showSuccessToast('❌ Failed to submit pledge. Please try again.');
      }
    }
  };

  const handlePledgeClick = (pledge) => {
    console.log('Opening pledge modal for:', pledge);
    setSelectedPledge(pledge);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPledge(null);
  };

  const showSuccessToast = useCallback((message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  const updatePreview = useCallback((username, message) => {
    setCurrentPreview({
      username,
      message,
      timestamp: new Date()
    });
  }, []);

  // Inline confetti function
  const createConfettiEffect = () => {
    const colors = ['#8B45FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FCEA2B'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '9999';
      
      const fallAnimation = `
        @keyframes fall-${i} {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `;
      
      const style = document.createElement('style');
      style.textContent = fallAnimation;
      document.head.appendChild(style);
      
      confetti.style.animation = `fall-${i} ${Math.random() * 3 + 2}s linear ${Math.random() * 2}s forwards`;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
        style.remove();
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 floating"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-500 rounded-full opacity-20 floating" style={{animationDelay: '-2s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-blue-500 rounded-full opacity-20 floating" style={{animationDelay: '-4s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-teal-500 rounded-full opacity-20 floating" style={{animationDelay: '-1s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="text-center py-8">
          <h1 className="text-6xl font-black gradient-text mb-4">Succinct Allegiance</h1>
          <p className="text-2xl font-semibold text-purple-200">Pledge Your Eternal Loyalty to the Succinct Kingdom!</p>
          <div className="flex justify-center mt-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 rounded-full text-lg font-bold">
              Mainnet Approaching • Show Your True Colors!
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Pledge Form Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 glow">
            <h2 className="text-4xl font-black text-center mb-6 gradient-text">Take The Pledge</h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <PledgeForm 
                  onSubmit={handlePledgeSubmit}
                  onPreviewUpdate={updatePreview}
                  onToastShow={showSuccessToast}
                  currentPreview={currentPreview}
                  loading={loading}
                />
              </div>
              
              {/* Badge Preview */}
              <div className="flex flex-col items-center justify-center">
                <BadgePreview 
                  preview={currentPreview}
                  onDownload={showSuccessToast}
                />
              </div>
            </div>
          </div>

          {/* Community Pledges */}
          <CommunityPledges 
            pledges={pledges}
            onPledgeClick={handlePledgeClick}
            loading={loading}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <PledgeModal 
          pledge={selectedPledge}
          onClose={handleCloseModal}
          onDownload={showSuccessToast}
        />
      )}

      {/* Toast */}
      <SuccessToast 
        message={toastMessage}
        show={showToast}
      />
    </div>
  );
}

export default App;