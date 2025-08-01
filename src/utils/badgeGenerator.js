// Complete badge generation utility with Base64 image support and proper error handling
export const downloadBadge = async (pledgeData) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set high resolution for crisp image (300 DPI equivalent)
      const scale = 3;
      const width = 480;
      const height = 720;
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // Create gradient background matching preview
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add main border
      ctx.strokeStyle = '#8B45FF';
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, width - 6, height - 6);

      // Add inner glow effect
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // State tracking
      let logoLoaded = false;
      let profileLoaded = false;

      const checkAndFinish = () => {
        if (logoLoaded && profileLoaded) {
          finishBadge();
        }
      };

      const drawHeader = (hasLogo = false, logoImg = null) => {
        if (hasLogo && logoImg && isImageValid(logoImg)) {
          try {
            const targetHeight = 32;
            const maxWidth = 240;
            const aspectRatio = logoImg.naturalWidth / logoImg.naturalHeight;
            
            let logoHeight = targetHeight;
            let logoWidth = targetHeight * aspectRatio;
            
            if (logoWidth > maxWidth) {
              logoWidth = maxWidth;
              logoHeight = maxWidth / aspectRatio;
            }
            
            const logoX = (width - logoWidth) / 2;
            const logoY = 50;
            
            ctx.globalAlpha = 0.9;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
            ctx.globalAlpha = 1.0;
            
            ctx.font = 'bold 18px Arial, sans-serif';
            ctx.fillStyle = '#E5E7EB';
            ctx.textAlign = 'center';
            ctx.fillText('ALLEGIANCE PLEDGE', width/2, logoY + logoHeight + 30);
          } catch (e) {
            console.warn('Failed to draw logo, using text fallback');
            ctx.globalAlpha = 1.0;
            drawTextHeader();
          }
        } else {
          drawTextHeader();
        }
      };

      const drawTextHeader = () => {
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = 'bold 28px Arial, sans-serif';
        ctx.fillText('SUCCINCT', width/2, 80);
        
        ctx.font = 'bold 18px Arial, sans-serif';
        ctx.fillStyle = '#E5E7EB';
        ctx.fillText('ALLEGIANCE PLEDGE', width/2, 110);
      };

      const drawProfile = (hasProfile = false, profileImg = null) => {
        const profileX = width/2;
        const profileY = 260;
        const profileRadius = 70;
        
        if (hasProfile && profileImg) {
          try {
            ctx.save();
            ctx.beginPath();
            ctx.arc(profileX, profileY, profileRadius, 0, 2 * Math.PI);
            ctx.clip();
            
            if (profileImg instanceof HTMLCanvasElement) {
              ctx.drawImage(profileImg, profileX - profileRadius, profileY - profileRadius, profileRadius * 2, profileRadius * 2);
            } else if (isImageValid(profileImg)) {
              ctx.drawImage(profileImg, profileX - profileRadius, profileY - profileRadius, profileRadius * 2, profileRadius * 2);
            } else {
              throw new Error('Invalid image');
            }
            
            ctx.restore();
          } catch (e) {
            console.warn('Failed to draw profile image, using text fallback');
            drawProfileFallback(profileX, profileY);
          }
        } else {
          drawProfileFallback(profileX, profileY);
        }
        
        // Profile border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(profileX, profileY, profileRadius, 0, 2 * Math.PI);
        ctx.stroke();
      };

      const drawProfileFallback = (x, y) => {
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('PFP', x, y + 8);
      };

      const isImageValid = (img) => {
        return img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
      };

      // Check if profile URL is a Base64 image
      const isBase64Image = (url) => {
        return url && url.startsWith('data:image/');
      };

      const finishBadge = () => {
        // Username
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(pledgeData.username, width/2, 380);

        // Pledge message box
        const boxX = 40;
        const boxY = 420;
        const boxWidth = width - 80;
        const boxHeight = 140;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Pledge text with word wrapping
        ctx.fillStyle = '#E5E7EB';
        ctx.font = '16px Arial, sans-serif';
        ctx.textAlign = 'left';
        
        const words = pledgeData.message.split(' ');
        let line = '';
        let y = 450;
        const maxWidth = boxWidth - 50;
        const lineHeight = 22;
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, 65, y);
            line = words[i] + ' ';
            y += lineHeight;
            
            if (y > boxY + boxHeight - 25) break;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 65, y);

        // Timestamp
        ctx.font = '14px Arial, sans-serif';
        ctx.fillStyle = '#C084FC';
        ctx.textAlign = 'center';
        const timestamp = pledgeData.timestamp.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        ctx.fillText(timestamp, width/2, 600);

        // Footer badges
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.fillStyle = '#C084FC';
        ctx.fillText('DIAMOND HANDS', width/2, 630);

        // Certified stamp
        ctx.save();
        ctx.translate(400, 70);
        ctx.rotate(0.3);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
        ctx.fillRect(-35, -12, 70, 24);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('✓ CERTIFIED', 0, 5);
        ctx.restore();

        // Username watermark
        ctx.save();
        ctx.font = '12px Arial, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'right';
        ctx.fillText(`@${pledgeData.username}`, width - 25, height - 25);
        ctx.restore();

        // Download the image
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement('a');
            link.download = `succinct-pledge-${pledgeData.username}.png`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            resolve();
          } else {
            reject(new Error('Failed to create image blob'));
          }
        }, 'image/png', 1.0);
      };

      // Load logo
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      
      logoImg.onload = () => {
        console.log('Logo loaded successfully');
        drawHeader(true, logoImg);
        logoLoaded = true;
        checkAndFinish();
      };
      
      logoImg.onerror = () => {
        console.warn('Logo failed to load, using text fallback');
        drawHeader(false);
        logoLoaded = true;
        checkAndFinish();
      };

      // **NEW: Enhanced profile loading with Base64 support**
      const tryLoadProfile = async () => {
        const cleanUsername = pledgeData.username.replace(/^@+/, '');
        
        // **Check if we have a Base64 uploaded image first**
        if (isBase64Image(pledgeData.profileUrl)) {
          console.log('Loading Base64 uploaded image...');
          try {
            const profileImg = new Image();
            
            const loadPromise = new Promise((resolve, reject) => {
              profileImg.onload = () => {
                console.log('✅ Base64 image loaded successfully');
                resolve(profileImg);
              };
              profileImg.onerror = () => reject('Failed to load Base64 image');
              setTimeout(() => reject('Base64 image timeout'), 5000);
            });
            
            // Base64 images don't need crossOrigin and won't cause CORS issues
            profileImg.src = pledgeData.profileUrl;
            const validImg = await loadPromise;
            
            drawProfile(true, validImg);
            profileLoaded = true;
            checkAndFinish();
            return; // Success with uploaded image
            
          } catch (error) {
            console.warn('Failed to load Base64 image:', error);
            // Fall through to external sources
          }
        }
        
        // **Fallback to external avatar sources if no upload or upload failed**
        console.log('Loading external avatar sources...');
        const sources = [
          pledgeData.profileUrl, // Original URL (if not Base64)
          `https://unavatar.io/x/${cleanUsername}`,
          `https://unavatar.io/github/${cleanUsername}`,
          `https://github.com/${cleanUsername}.png`
        ].filter(src => !isBase64Image(src)); // Filter out Base64 URLs from external attempts
        
        // Try external sources with CORS
        for (const src of sources) {
          try {
            const profileImg = new Image();
            profileImg.crossOrigin = 'anonymous';
            
            const loadPromise = new Promise((resolve, reject) => {
              profileImg.onload = () => {
                if (profileImg.naturalWidth > 10 && profileImg.naturalHeight > 10) {
                  console.log(`✅ Profile loaded from: ${src}`);
                  resolve(profileImg);
                } else {
                  reject('Image too small or placeholder');
                }
              };
              profileImg.onerror = () => reject('Failed to load');
              setTimeout(() => reject('Timeout'), 3000);
            });
            
            profileImg.src = src;
            const validImg = await loadPromise;
            
            drawProfile(true, validImg);
            profileLoaded = true;
            checkAndFinish();
            return; // Success
            
          } catch (error) {
            console.log(`❌ Failed to load profile from ${src}:`, error);
            continue;
          }
        }
        
        // **If everything fails, create canvas fallback**
        console.warn('⚠️ All profile sources failed, creating canvas fallback');
        const fallbackCanvas = createProfileFallback(cleanUsername);
        drawProfile(true, fallbackCanvas);
        profileLoaded = true;
        checkAndFinish();
      };

      // Create a canvas-based profile fallback
      const createProfileFallback = (username) => {
        const fallbackCanvas = document.createElement('canvas');
        const fallbackCtx = fallbackCanvas.getContext('2d');
        fallbackCanvas.width = 140;
        fallbackCanvas.height = 140;
        
        // Create a gradient background
        const gradient = fallbackCtx.createRadialGradient(70, 70, 0, 70, 70, 70);
        gradient.addColorStop(0, '#8B45FF');
        gradient.addColorStop(1, '#6366F1');
        fallbackCtx.fillStyle = gradient;
        fallbackCtx.fillRect(0, 0, 140, 140);
        
        // Add initials
        const initials = username.slice(0, 2).toUpperCase();
        fallbackCtx.fillStyle = 'white';
        fallbackCtx.font = 'bold 48px Arial, sans-serif';
        fallbackCtx.textAlign = 'center';
        fallbackCtx.textBaseline = 'middle';
        fallbackCtx.fillText(initials, 70, 70);
        
        return fallbackCanvas;
      };

      // Set timeouts to prevent hanging
      setTimeout(() => {
        if (!logoLoaded) {
          console.warn('Logo loading timeout, using fallback');
          logoImg.onerror();
        }
      }, 10000);

      // Start loading images
      console.log(`Loading logo from: /succinct-logo.png`);
      console.log(`Loading profile from: ${pledgeData.profileUrl}`);
      console.log(`Profile is Base64: ${isBase64Image(pledgeData.profileUrl)}`);
      
      logoImg.src = '/succinct-logo.png';
      tryLoadProfile();
      
    } catch (error) {
      console.error('Badge generation error:', error);
      reject(error);
    }
  });
};

// Helper function to create canvas with high DPI
export const createHighDPICanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  
  ctx.scale(devicePixelRatio, devicePixelRatio);
  
  return { canvas, ctx };
};

// Helper function to wrap text
export const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  
  return currentY;
};