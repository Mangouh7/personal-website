// ==================== //
// Theme Toggle          //
// ==================== //
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add a fun animation
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
});

// ==================== //
// Smooth Scrolling      //
// ==================== //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== //
// Navbar Scroll Effect  //
// ==================== //
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-md)';
    }
    
    lastScroll = currentScroll;
});

// ==================== //
// Active Nav Link       //
// ==================== //
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = 'var(--text-secondary)';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--text-primary)';
        }
    });
});

// ==================== //
// Intersection Observer //
// ==================== //
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for fade-in animation
const cards = document.querySelectorAll('.about-card, .interest-card, .project-card');
cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ==================== //
// Form Submission       //
// ==================== //
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Create a fun success message
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<span>Sending...</span> <span class="btn-icon">🚀</span>';
    submitButton.style.pointerEvents = 'none';
    
    // Simulate sending (in a real app, you'd send this to a server)
    setTimeout(() => {
        submitButton.innerHTML = '<span>Message Sent!</span> <span class="btn-icon">✅</span>';
        
        // Show alert with fun message
        alert(`Thanks ${name}! 🎉 I got your message and I'll get back to you super soon! 💌`);
        
        // Reset form
        contactForm.reset();
        
        // Reset button
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.style.pointerEvents = 'auto';
        }, 2000);
    }, 1500);
});

// ==================== //
// Cursor Trail Effect   //
// ==================== //
const createSparkle = (x, y) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 8px;
        height: 8px;
        background: var(--gradient-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: sparkleAnimation 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 600);
};

// Add sparkle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleAnimation {
        0% {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
        100% {
            transform: scale(0) translateY(-30px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add sparkles on click
let sparkleEnabled = true;
document.addEventListener('click', (e) => {
    if (sparkleEnabled && !e.target.closest('button, a, input, textarea')) {
        createSparkle(e.clientX, e.clientY);
        
        // Create additional sparkles around the clicked point
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const offsetX = (Math.random() - 0.5) * 30;
                const offsetY = (Math.random() - 0.5) * 30;
                createSparkle(e.clientX + offsetX, e.clientY + offsetY);
            }, i * 50);
        }
    }
});

// ==================== //
// Easter Egg: Konami Code //
// ==================== //
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
            activatePartyMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activatePartyMode() {
    // Party mode activated!
    const originalBg = document.body.style.background;
    let colorIndex = 0;
    const colors = [
        'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(45deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(45deg, #30cfd0 0%, #330867 100%)'
    ];
    
    alert('🎉 PARTY MODE ACTIVATED! 🎊');
    
    const partyInterval = setInterval(() => {
        document.body.style.background = colors[colorIndex % colors.length];
        colorIndex++;
    }, 200);
    
    setTimeout(() => {
        clearInterval(partyInterval);
        document.body.style.background = originalBg;
        alert('Party mode deactivated! That was fun! 😄');
    }, 5000);
}

// ==================== //
// Dynamic Year in Footer //
// ==================== //
const updateYear = () => {
    const yearElements = document.querySelectorAll('.footer p');
    yearElements.forEach(el => {
        if (el.textContent.includes('©')) {
            el.textContent = el.textContent.replace(/© \d{4}/, `© ${new Date().getFullYear()}`);
        }
    });
};
updateYear();

// ==================== //
// Console Easter Egg    //
// ==================== //
console.log('%c👋 Hey there, curious developer!', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cI see you\'re checking out the code! That\'s awesome! 🚀', 'font-size: 14px; color: #764ba2;');
console.log('%cWant to activate party mode? Try the Konami Code! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 'font-size: 12px; color: #f5576c;');

// ==================== //
// Performance: Lazy Load Images //
// ==================== //
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== //
// Welcome Animation     //
// ==================== //
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero');
    hero.style.opacity = '0';
    
    setTimeout(() => {
        hero.style.transition = 'opacity 1s ease';
        hero.style.opacity = '1';
    }, 100);
});
