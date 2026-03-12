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

// =============================================
// E-COMMERCE: CARRINHO DE COMPRAS
// =============================================

let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];

// Salvar carrinho no localStorage
function saveCart() {
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
}

// Atualizar contador do carrinho
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if(cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Animação de pulse quando adiciona item
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }
}

// Adicionar ao carrinho
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if(existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id,
            name,
            price,
            image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    renderCartItems();
    showNotification(`${name} adicionado à lista!`);
}

// Remover do carrinho
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    renderCartItems();
}

// Atualizar quantidade
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if(item) {
        item.quantity += change;
        if(item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCartItems();
        }
    }
}

// Renderizar itens do carrinho
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if(!cartItemsContainer) return;
    
    if(cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="item-price">R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <div class="cart-item-actions">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="item-qty">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    cartTotal.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// Toggle do Modal do Carrinho
function initCartModal() {
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if(cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Fechar ao clicar fora
        cartModal.addEventListener('click', (e) => {
            if(e.target === cartModal) {
                cartModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Checkout via WhatsApp
        if(checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if(cart.length === 0) {
                    showNotification('Seu carrinho está vazio!', 'error');
                    return;
                }
                
                let message = 'Olá Diego! Tenho interesse nos seguintes serviços:\n\n';
                let total = 0;
                
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    message += `• ${item.name} - R$ ${itemTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
                });
                
                message += `\n*Valor estimado: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*`;
                message += '\n\nGostaria de receber mais informações e um orçamento personalizado. 🚀';
                
                const whatsappUrl = `https://wa.me/5527999933283?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            });
        }
    }
}

// Notificação Toast
function showNotification(message, type = 'success') {
    // Remove notificação existente
    const existing = document.querySelector('.toast-notification');
    if(existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos inline para o toast
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00f3ff, #00c4cc)' : '#ff3366'};
        color: ${type === 'success' ? '#000' : '#fff'};
        padding: 15px 25px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.4s ease;
        box-shadow: 0 10px 30px rgba(0, 243, 255, 0.3);
    `;
    
    // Adicionar keyframes se não existir
    if(!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        toast.style.transition = '0.4s';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// =============================================
// FILTROS DE SERVIÇOS
// =============================================

function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card[data-category]');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Atualizar botão ativo
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            products.forEach(product => {
                const category = product.dataset.category;
                
                if(filter === 'all' || category === filter) {
                    product.style.display = 'block';
                    product.style.animation = 'fadeIn 0.5s ease';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
}

// =============================================
// COUNTDOWN DE OFERTAS
// =============================================

function initCountdown() {
    // Define tempo restante (12 horas a partir de agora)
    let endTime = localStorage.getItem('offer_end_time');
    
    if(!endTime || new Date(endTime) < new Date()) {
        // Resetar countdown para 12 horas
        endTime = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
        localStorage.setItem('offer_end_time', endTime);
    }
    
    function updateCountdown() {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end - now;
        
        if(diff <= 0) {
            // Resetar countdown
            endTime = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
            localStorage.setItem('offer_end_time', endTime);
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if(hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if(minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if(secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// =============================================
// BUSCA DE SERVIÇOS
// =============================================

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    if(searchInput) {
        const performSearch = () => {
            const query = searchInput.value.toLowerCase().trim();
            const products = document.querySelectorAll('.product-card');
            let found = false;
            
            products.forEach(product => {
                const name = product.querySelector('h3').textContent.toLowerCase();
                if(query === '' || name.includes(query)) {
                    product.style.display = 'block';
                    found = true;
                } else {
                    product.style.display = 'none';
                }
            });
            
            if(query && !found) {
                showNotification('Nenhum serviço encontrado', 'error');
            }
            
            // Scroll para seção de serviços
            if(query) {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }
        };
        
        searchBtn?.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') performSearch();
        });
    }
}

// =============================================
// NEWSLETTER
// =============================================

function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input').value;
            
            if(email) {
                const message = `Olá Diego! 👋\n\nQuero receber dicas exclusivas sobre presença digital.\n\n📧 Meu e-mail: ${email}`;
                const whatsappUrl = `https://wa.me/5527999933283?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                form.reset();
            }
        });
    }
}

// =============================================
// CATEGORIAS CLICÁVEIS
// =============================================

function initCategories() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            const filterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
            
            if(filterBtn) {
                filterBtn.click();
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
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
    
    // Inicializações originais
    hideLoader();
    initMobileMenu();
    handleScrollAnimations();
    headerScrollEffect();
    initSmoothScroll();
    initParallax();
    
    // Inicializações E-commerce
    updateCartCount();
    renderCartItems();
    initCartModal();
    initProductFilters();
    initCountdown();
    initSearch();
    initNewsletter();
    initCategories();
    
    // Inicializações Páginas Internas
    initFAQ();
    initContactForm();
});

// === ANIMAÇÃO DE ENTRADA INICIAL ===
window.addEventListener('load', () => {
    document.querySelectorAll('.hero-content, .hero-image-container').forEach(el => {
        el.classList.add('visible');
    });
});

// =============================================
// FAQ ACCORDION
// =============================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question?.addEventListener('click', () => {
            // Fechar outros itens
            faqItems.forEach(other => {
                if(other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                }
            });
            
            // Toggle item atual
            item.classList.toggle('active');
        });
    });
}

// =============================================
// FORMULÁRIO DE CONTATO
// =============================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const budget = document.getElementById('budget')?.value || '';
            const message = document.getElementById('message').value;
            
            // Montar mensagem para WhatsApp
            let whatsappMessage = `Olá Diego! 👋\n\n`;
            whatsappMessage += `*Solicitação de Orçamento*\n\n`;
            whatsappMessage += `📋 *Nome:* ${name}\n`;
            whatsappMessage += `📧 *E-mail:* ${email}\n`;
            whatsappMessage += `📱 *WhatsApp:* ${phone}\n`;
            whatsappMessage += `🎯 *Serviço:* ${service}\n`;
            if(budget) whatsappMessage += `💰 *Orçamento:* ${budget}\n`;
            whatsappMessage += `\n📝 *Mensagem:*\n${message}`;
            
            const whatsappUrl = `https://wa.me/5527999933283?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            
            showNotification('Redirecionando para WhatsApp...');
        });
    }
}