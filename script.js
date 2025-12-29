// === TYPEWRITER EFFECT ===
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if(this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt" style="border-right: 2px solid #00f3ff; padding-right: 5px;">${this.txt}</span>`;

        let typeSpeed = 100;
        if(this.isDeleting) typeSpeed /= 2;

        if(!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if(this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// === CONTADOR ANIMADO ===
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if(current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// === ANIMAÇÕES DE SCROLL ===
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .fade-in-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Ativar contador quando stats section ficar visível
                if(entry.target.closest('.stats-section')) {
                    animateCounters();
                }
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// === MENU MOBILE ===
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if(menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Fechar menu ao clicar em um link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// === LOADER ===
function hideLoader() {
    const loader = document.getElementById('loader');
    if(loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500);
    }
}

// === HEADER SCROLL EFFECT ===
function headerScrollEffect() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if(window.scrollY > 100) {
            header.style.background = 'rgba(5, 5, 5, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 243, 255, 0.1)';
        } else {
            header.style.background = 'rgba(5, 5, 5, 0.9)';
            header.style.boxShadow = 'none';
        }
    });
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// === PARALLAX EFFECT NA IMAGEM ===
function initParallax() {
    const heroImage = document.querySelector('.hero-image-container');
    
    if(heroImage && window.innerWidth > 900) {
        window.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 50;
            const y = (window.innerHeight / 2 - e.pageY) / 50;
            
            heroImage.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
    // Typewriter
    const txtElement = document.querySelector('.txt-type');
    if(txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }
    
    // Outras inicializações
    hideLoader();
    initMobileMenu();
    handleScrollAnimations();
    headerScrollEffect();
    initSmoothScroll();
    initParallax();
});

// === ANIMAÇÃO DE ENTRADA INICIAL ===
window.addEventListener('load', () => {
    document.querySelectorAll('.hero-content, .hero-image-container').forEach(el => {
        el.classList.add('visible');
    });
});