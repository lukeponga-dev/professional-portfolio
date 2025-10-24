// --- Theme Toggle Functionality ---

const themeToggle = document.getElementById('themeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const body = document.body;

// 1. Initial Theme Setup: Check localStorage for user preference
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.add('light-mode');
    // Ensure correct icon is shown on load
    if (moonIcon) moonIcon.classList.add('hidden'); 
    if (sunIcon) sunIcon.classList.remove('hidden'); 
}

// 2. Theme Toggle Listener
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
        // Save the new state and toggle icons
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            if (moonIcon) moonIcon.classList.add('hidden');
            if (sunIcon) sunIcon.classList.remove('hidden');
        } else {
            localStorage.setItem('theme', 'dark');
            if (moonIcon) moonIcon.classList.remove('hidden');
            if (sunIcon) sunIcon.classList.add('hidden');
        }
    });
}

// --- Smooth Scrolling & Mobile Menu Management ---

// Smooth scroll with offset for sticky header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Compensate for the sticky navigation bar height
            const headerOffset = 80; 
            const elementPosition = targetElement.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
        
        // Close mobile menu if it's open
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });
});

// Mobile Menu Toggle Functionality
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// --- Canvas Particle Animation for Hero Section ---

const canvas = document.getElementById('hero-canvas');
// Check if canvas element exists before getting context
if (canvas) {
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 75;
    const connectDistance = 120; // Max distance for drawing lines

    // Function to ensure canvas size matches its container (responsive)
    function resizeCanvas() {
        // Use offsetWidth/Height to get the actual rendered size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    // Set initial size and listen for window resize events
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);


    // Particle class definition
    class Particle {
        constructor() {
            // Random initial position within canvas bounds
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // Small random velocity for subtle movement
            this.vx = (Math.random() - 0.5) * 0.5; 
            this.vy = (Math.random() - 0.5) * 0.5; 
            this.radius = Math.random() * 2; 
        }

        update() {
            this.x += this.vx; 
            this.y += this.vy;

            // Boundary collision detection: Reverse velocity if hitting an edge
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1; 
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1; 
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
            // Read particle color dynamically from CSS
            const particleColor = getComputedStyle(body).getPropertyValue('--particle-color').trim();
            ctx.fillStyle = particleColor || 'rgba(59, 130, 246, 0.5)';
            ctx.fill();
        }
    }

    // Function to connect particles with lines
    function connectParticles() {
        const particleColor = getComputedStyle(body).getPropertyValue('--particle-color').trim();

        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const p1 = particles[i];
                const p2 = particles[j];

                // Calculate distance using Pythagorean theorem (faster than Math.sqrt for comparison)
                const distanceSq = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;

                if (distanceSq < connectDistance ** 2) {
                    const opacity = 1 - (distanceSq / (connectDistance ** 2));
                    
                    ctx.beginPath();
                    // Set line color dynamically, fading out based on distance
                    ctx.strokeStyle = particleColor.replace(/,\s*([\d.]+)\)/, `, ${opacity * 0.4})`);
                    ctx.lineWidth = 0.5; // Subtle line thickness
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Initialize all particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Main animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Always clear the canvas first

        // Only draw particles/lines when in dark mode (where the effect is intended)
        if (!body.classList.contains('light-mode')) {
            connectParticles();
            particles.forEach(particle => {
                particle.update(); 
                particle.draw(); 
            });
        }
        
        requestAnimationFrame(animate); // Requests the next frame for continuous animation
    }

    // Start the animation loop after the DOM is fully loaded and canvas is ready
    window.onload = function () {
        animate();
    }
}