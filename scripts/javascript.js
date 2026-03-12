// Smooth scroll for navigation

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Image carousel functionality

let carouselIndex = 0;
const carouselSlides = document.querySelectorAll('.carousel-slide');

function showSlide(index) {
    carouselSlides.forEach(slide => slide.classList.remove('active'));
    if (index >= carouselSlides.length) {
        carouselIndex = 0;
    }
    if (index < 0) {
        carouselIndex = carouselSlides.length - 1;
    }
    if (carouselSlides[carouselIndex]) {
        carouselSlides[carouselIndex].classList.add('active');
    }
}

function nextSlide() {
    carouselIndex++;
    showSlide(carouselIndex);
}

// Auto-rotate carousel every 5 seconds
setInterval(nextSlide, 5000);

// Show first slide initially
showSlide(carouselIndex);

// Mobile nav toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
}

// Restart typing animation when hero text enters viewport
const typingSpan = document.querySelector('.typing-span');
if (typingSpan) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // restart typing by removing and re-adding the class
                typingSpan.classList.remove('typing');
                // force reflow
                void typingSpan.offsetWidth;
                typingSpan.classList.add('typing');
                observer.unobserve(typingSpan);
            }
        });
    }, { threshold: 0.6 });

    observer.observe(typingSpan);
}

// sliding image carousel (separate from background slider)
const carouselImages = [
    'assets/carousel1.png',
    'assets/carousel2.png',
    'assets/carousel3.png'
];
let currentCarousel = 0;
const carouselImgEl = document.getElementById('carousel-image');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

function showCarousel(index) {
    if (index < 0) index = carouselImages.length - 1;
    if (index >= carouselImages.length) index = 0;
    currentCarousel = index;
    if (carouselImgEl) carouselImgEl.src = carouselImages[currentCarousel];
}

if (prevBtn) prevBtn.addEventListener('click', () => showCarousel(currentCarousel - 1));
if (nextBtn) nextBtn.addEventListener('click', () => showCarousel(currentCarousel + 1));

setInterval(() => showCarousel(currentCarousel + 1), 4000);

// Parallax effect for hero background
const heroBg = document.getElementById('hero-bg');
if (heroBg) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        heroBg.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.scroll-fade');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});



const bars = document.querySelectorAll('.bar[data-width]');

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const bar = entry.target;
      if (entry.isIntersecting) {
        // small delay so the transition is visible even on fast load
        setTimeout(() => {
          bar.style.width = bar.dataset.width + '%';
        }, 150);
      } else {
        bar.style.width = '0%';
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => skillsObserver.observe(bar));

// Parallax effect for skills background
const skillsBg = document.getElementById('skills-bg');
if (skillsBg) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const sectionTop = document.getElementById('skills').offsetTop;
        const scrollInSection = scrollPosition - sectionTop;
        if (scrollInSection > -window.innerHeight && scrollInSection < skillsBg.parentElement.offsetHeight) {
             skillsBg.style.transform = `translateY(${(scrollInSection) * 0.15}px)`;
        }
    });
}

// Set current year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Contact Form Handling with Toast
const contactForm = document.querySelector('form[action^="https://formspree.io"]');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Sending...';

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showToast('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    showToast(data.errors.map(error => error.message).join(", "), 'error');
                } else {
                    showToast('Oops! There was a problem submitting your form', 'error');
                }
            }
        } catch (error) {
            showToast('Oops! There was a problem submitting your form', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-red-500';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation';
    
    // pointer-events-auto is needed because the container has pointer-events-none
    toast.className = `${bgColor} text-white px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 translate-y-10 opacity-0 flex items-center gap-3 min-w-[300px] pointer-events-auto`;
    toast.innerHTML = `
        <i class="fa-solid ${icon} text-xl"></i>
        <span class="font-medium">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    });

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-10');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}