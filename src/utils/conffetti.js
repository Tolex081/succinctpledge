// Confetti animation utility for celebration effects
export const createConfetti = () => {
  const colors = ['#8B45FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FCEA2B'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    
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
    
    confetti.style.animation = `fall-${i} ${confetti.style.animationDuration} linear ${confetti.style.animationDelay} forwards`;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
      style.remove();
    }, 5000);
  }
};

// Alternative confetti burst from a specific position
export const createConfettiBurst = (x, y, particleCount = 30) => {
  const colors = ['#8B45FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FCEA2B'];
  
  for (let i = 0; i < particleCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '8px';
    confetti.style.height = '8px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = x + 'px';
    confetti.style.top = y + 'px';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = Math.random() * 100 + 50;
    const life = Math.random() * 1000 + 1000;
    
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    let currentX = x;
    let currentY = y;
    let opacity = 1;
    
    const animate = () => {
      currentX += vx * 0.01;
      currentY += vy * 0.01 + 2; // Add gravity
      opacity -= 0.02;
      
      confetti.style.left = currentX + 'px';
      confetti.style.top = currentY + 'px';
      confetti.style.opacity = opacity;
      confetti.style.transform = `rotate(${currentX * 2}deg)`;
      
      if (opacity > 0 && currentY < window.innerHeight) {
        requestAnimationFrame(animate);
      } else {
        confetti.remove();
      }
    };
    
    document.body.appendChild(confetti);
    requestAnimationFrame(animate);
  }
};

// Sparkle effect for special moments
export const createSparkles = (element, duration = 2000) => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 15; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.width = '4px';
    sparkle.style.height = '4px';
    sparkle.style.backgroundColor = '#FFD700';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    
    const angle = (Math.PI * 2 * i) / 15;
    const distance = Math.random() * 50 + 20;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    sparkle.style.left = centerX + 'px';
    sparkle.style.top = centerY + 'px';
    
    sparkle.animate([
      { 
        transform: 'translate(0, 0) scale(0)',
        opacity: 0
      },
      { 
        transform: `translate(${x - centerX}px, ${y - centerY}px) scale(1)`,
        opacity: 1,
        offset: 0.5
      },
      { 
        transform: `translate(${x - centerX}px, ${y - centerY}px) scale(0)`,
        opacity: 0
      }
    ], {
      duration: duration,
      easing: 'ease-out'
    }).onfinish = () => sparkle.remove();
    
    document.body.appendChild(sparkle);
  }
};