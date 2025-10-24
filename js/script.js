// Theme Toggle Functionality

// Selects the theme toggle button and icons for dark/light mode switching
const themeToggle = document.getElementById('themeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const body = document.body;

// 1. Initialize Theme from localStorage
// Retrieves the saved theme from localStorage or defaults to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.add('light-mode');
    if (moonIcon) moonIcon.classList.add('hidden'); // Hides moon icon in light mode
    if (sunIcon) sunIcon.classList.remove('hidden'); // Shows sun icon in light mode
}

// 2. Add click listener to toggle theme
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
        // Force particle redraw on theme change for color update
        // The animation loop handles this, but forcing a resize can ensure immediate refresh if needed
        const canvas = document.getElementById('heroCanvas');
        if (canvas) setCanvasSize(); 
    });
}


// --- Mobile Menu Toggle Functionality ---
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');
const closeIcon = document.getElementById('closeIcon');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
    const isExpanded = mobileMenu.classList.contains('hidden') ? 'false' : 'true';
    mobileMenuButton.setAttribute('aria-expanded', isExpanded);

    // Toggle icons
    if (menuIcon && closeIcon) {
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    }
}

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
}

// Close menu when a link is clicked (good mobile UX)
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Only close if it's currently open
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    });
});


// --- Header Scroll Effect ---
const header = document.querySelector('header');
const scrollThreshold = 50; // Distance in pixels before the header changes

/**
 * Toggles header background based on scroll position.
 * Makes it fully opaque and adds a heavier shadow when scrolled.
 */
function handleScroll() {
    if (!header) return; // Exit if header is not found

    if (window.scrollY > scrollThreshold) {
        // Classes for the 'scrolled' state: fully opaque background and a stronger shadow
        header.classList.add('bg-slate-900', 'shadow-xl', 'light-mode:bg-white', 'scrolled');
        header.classList.remove('bg-slate-900/90', 'light-mode:bg-white/90'); // Remove semi-transparent classes
    } else {
        // Classes for the 'at top' state: semi-transparent/blurred background
        header.classList.remove('bg-slate-900', 'shadow-xl', 'light-mode:bg-white', 'scrolled');
        header.classList.add('bg-slate-900/90', 'light-mode:bg-white/90'); // Restore semi-transparent classes
    }
}

// Attach the listener and run once on load to handle refresh state
document.addEventListener('scroll', handleScroll);
handleScroll();


// --- Hero Canvas Particle Animation ---
let canvas, ctx, particles, particleCount;

// Function to set canvas dimensions based on its parent container
function setCanvasSize() {
    if (!canvas) return;
    
    // Get the actual width and height of the canvas element from the layout
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Reinitialize particles only on first load
    if (particles.length === 0) {
         for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
}

// Particle class definition
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width; // Random x position within canvas bounds
        this.y = Math.random() * canvas.height; // Random y position within canvas bounds
        this.vx = (Math.random() - 0.5) * 0.5; // Random x velocity (slow movement)
        this.vy = (Math.random() - 0.5) * 0.5; // Random y velocity (slow movement)
        this.radius = Math.random() * 2 + 0.5; // Random radius between 0.5 and 2.5
    }

    update() {
        this.x += this.vx; // Updates position based on velocity
        this.y += this.vy;

        // Bounce off edges (Reverse velocity on boundary hit)
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Draws a circle

        // Use a color that adapts slightly to the theme but remains subtle
        // Blue for dark mode, lighter blue for light mode
        const color = body.classList.contains('light-mode') ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.5)';
        ctx.fillStyle = color;
        ctx.fill();
    }
}

// Animation loop function
function animate() {
    // Clear the canvas with a slight transparency to create a subtle trail effect
    // The background color matches the body background in both modes
    const clearColor = body.classList.contains('light-mode') ? 'rgba(248, 250, 252, 0.3)' : 'rgba(12, 18, 30, 0.3)';
    ctx.fillStyle = clearColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update(); // Updates each particle
        particle.draw(); // Draws each particle
    });
    requestAnimationFrame(animate); // Requests next frame
}

window.onload = function () {
    canvas = document.getElementById('heroCanvas');
    if (!canvas) return; // Exit if canvas element doesn't exist

    ctx = canvas.getContext('2d');
    particleCount = 50;
    particles = [];
    
    // Initial setup and event listeners
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Start the animation loop
    animate();
};