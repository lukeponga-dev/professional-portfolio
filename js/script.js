// Theme Toggle Functionality
// Selects the theme toggle button and icons for dark/light mode switching
const themeToggle = document.getElementById('themeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const body = document.body;

// Retrieves the saved theme from localStorage or defaults to 'dark'
// NOTE: localStorage is used for persistent UI state only.
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.add('light-mode');
    if (moonIcon) moonIcon.classList.add('hidden'); // Hides moon icon in light mode
    if (sunIcon) sunIcon.classList.remove('hidden'); // Shows sun icon in light mode
}

// Adds click event listener to toggle between light and dark modes
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light'); // Saves light mode preference
            if (moonIcon) moonIcon.classList.add('hidden');
            if (sunIcon) sunIcon.classList.remove('hidden');
        } else {
            localStorage.setItem('theme', 'dark'); // Saves dark mode preference
            if (moonIcon) moonIcon.classList.remove('hidden');
            if (sunIcon) sunIcon.classList.add('hidden');
        }
    });
}

// Smooth scroll with offset for sticky header
// Adds smooth scrolling behavior to all anchor links starting with '#'
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        const headerOffset = 80; // Approximate height of the sticky header
        const elementPosition = targetElement.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
        
        // Close mobile menu after clicking a link
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
const ctx = canvas.getContext('2d');
const particles = [];
const particleCount = 75;

// Function to resize canvas on window resize
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// Initial resize and listener
resizeCanvas();
window.addEventListener('resize', resizeCanvas);


// Particle class definition
class Particle {
    constructor() {
        // Initialize particle position randomly within the canvas bounds
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5; // Random x velocity
        this.vy = (Math.random() - 0.5) * 0.5; // Random y velocity
        this.radius = Math.random() * 2; // Random radius
    }

    update() {
        this.x += this.vx; // Updates position based on velocity
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1; // Bounces off horizontal edges
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1; // Bounces off vertical edges
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Draws a circle
        // Use a semi-transparent blue that matches the primary color
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)'; 
        ctx.fill();
    }
}

// Creates the particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Animation loop function
function animate() {
    // Only draw/animate if the current body is in dark mode (optional aesthetic choice)
    if (!body.classList.contains('light-mode')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas
        particles.forEach(particle => {
            particle.update(); // Updates each particle
            particle.draw(); // Draws each particle
        });
    } else {
         ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear if in light mode
    }
    requestAnimationFrame(animate); // Requests next frame
}

// Start the animation loop when the window is loaded
window.onload = function () {
    animate();
}
