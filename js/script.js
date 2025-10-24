// --- Theme Toggle Functionality ---

const themeToggle = document.getElementById('themeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const body = document.body;

/**
 * Gets the current value of a CSS variable from the body element.
 * @param {string} variableName - The name of the CSS variable (e.g., '--particle-color').
 * @returns {string} The computed value of the variable.
 */
function getCssVariable(variableName) {
    return getComputedStyle(body).getPropertyValue(variableName).trim();
}

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
            // Compensate for the sticky navigation bar height (80px is a good estimate)
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
            const particleColor = getCssVariable('--particle-color');
            ctx.fillStyle = particleColor || 'rgba(59, 130, 246, 0.5)';
            ctx.fill();
        }
    }

    // Function to connect particles with lines (the "network" effect)
    function connectParticles() {
        // Get the color dynamically to ensure theme change is reflected
        const particleColor = getCssVariable('--particle-color');

        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const p1 = particles[i];
                const p2 = particles[j];

                // Calculate distance squared (faster than Math.sqrt for comparison)
                const distanceSq = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;

                if (distanceSq < connectDistance ** 2) {
                    // Calculate opacity based on distance: closer = more opaque
                    const opacity = 1 - (distanceSq / (connectDistance ** 2));
                    
                    ctx.beginPath();
                    // Set line color dynamically, fading out based on distance
                    // We reduce the maximum opacity of the line slightly (e.g., * 0.4) 
                    // to keep the lines subtle and the points the focus.
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

        // Only draw particles/lines when in dark mode (where the effect is intended for contrast)
        // Note: The particle color variable is set to a low opacity in light mode, so this check 
        // prevents drawing a near-invisible effect and saves CPU cycles.
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

