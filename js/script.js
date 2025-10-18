// Theme Toggle Functionality
// Selects the theme toggle button and icons for dark/light mode switching
const themeToggle = document.getElementById('themeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const body = document.body;

// Retrieves the saved theme from localStorage or defaults to 'dark'
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
        e.preventDefault(); // Prevents default jump behavior
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80; // Offset to account for sticky header height
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth' // Enables smooth scrolling
            });
        }
    });
});

// Active nav link highlighting on scroll
// Selects all sections with IDs and navigation links
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

// Listens for scroll events to highlight the current section in the nav
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 150) { // Threshold for considering a section active
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active'); // Removes active class from all links
        link.classList.remove('text-blue-400');

        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active'); // Adds active class to the matching link
            link.classList.add('text-blue-400');
        }
    });
});

// Fade-in animation on scroll
// Configuration for IntersectionObserver to detect when elements enter viewport
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1'; // Fades in the element
            entry.target.style.transform = 'translateY(0)'; // Moves it into position
            observer.unobserve(entry.target); // Stops observing once animated
        }
    });
}, observerOptions);

// Applies fade-in effect to cards and section titles
document.querySelectorAll('.card, .section-title').forEach(el => {
    el.style.opacity = '0'; // Initial hidden state
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el); // Starts observing the element
});

// Typing effect for hero subtitle
// Selects the subtitle in the hero section
const subtitle = document.querySelector('#hero h2');
if (subtitle) {
    const text = subtitle.textContent; // Stores the original text
    subtitle.textContent = ''; // Clears the text for typing effect
    subtitle.style.opacity = '1'; // Makes subtitle visible
    
    let i = 0;
    const typingSpeed = 40; // Speed of typing in milliseconds
    
    setTimeout(() => {
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.innerHTML += text.charAt(i); // Adds one character at a time
                i++;
                setTimeout(typeWriter, typingSpeed); // Recursively calls itself
            }
        };
        typeWriter();
    }, 800); // Delay before starting the typing effect
}

// Skill percentage animations (Staggered Fade-in)
// Selects list items in the skills section
const skillItems = document.querySelectorAll('#skills .card ul li');
let skillsAnimated = false; // Flag to prevent multiple animations

// Observer for skills section to trigger staggered fade-in
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            skillsAnimated = true;
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1'; // Fades in the item
                    item.style.transform = 'translateX(0)'; // Slides it into position
                }, index * 80); // Staggers the animation for each item
            });
            skillsObserver.unobserve(entry.target); // Stops observing after animation
        }
    });
}, { threshold: 0.3 });

// Initializes skill items to hidden state
skillItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.5s ease-out';
});

// Observes the skills section
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Particle background effect for hero section
// Selects the hero section
const hero = document.querySelector('#hero');
if (hero) {
    const canvas = document.createElement('canvas'); // Creates a canvas for particles
    hero.insertBefore(canvas, hero.firstChild); // Inserts canvas at the beginning of hero

    const ctx = canvas.getContext('2d'); // Gets 2D drawing context
    canvas.width = hero.offsetWidth; // Sets canvas size to match hero
    canvas.height = hero.offsetHeight;

    const particles = []; // Array to hold particle objects
    const particleCount = 50; // Number of particles

    // Particle class definition
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width; // Random initial x position
            this.y = Math.random() * canvas.height; // Random initial y position
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
            ctx.fillStyle = 'rgba(59, 130, 246, 0.5)'; // Blue semi-transparent fill
            ctx.fill();
        }
    }

    // Creates the particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop function
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas
        particles.forEach(particle => {
            particle.update(); // Updates each particle
            particle.draw(); // Draws each particle
        });
        requestAnimationFrame(animate); // Requests next frame
    }

    animate(); // Starts the animation

    // Resizes canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    });
}