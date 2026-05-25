// ASA-USA Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // Active nav link on scroll — only on homepage (anchor-based nav)
    const isHomePage = window.location.pathname === '/' ||
        window.location.pathname.endsWith('index.html') ||
        window.location.pathname.endsWith('/');
    const sections = document.querySelectorAll('section[id]');

    if (isHomePage && sections.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            sections.forEach(section => {
                if (pageYOffset >= section.offsetTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Testimonial Slider
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
    });

    // Auto-advance testimonials
    setInterval(function() {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }, 6000);

    // Gallery Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const ITEMS_PER_PAGE = 16;
    let currentFilter = 'all';
    let visibleCount = ITEMS_PER_PAGE;

    function applyFilter() {
        let shown = 0;
        galleryItems.forEach(item => {
            const match = currentFilter === 'all' || item.dataset.category === currentFilter;
            if (match && shown < visibleCount) {
                item.classList.remove('hidden');
                shown++;
            } else {
                item.classList.add('hidden');
            }
        });
        const total = currentFilter === 'all'
            ? galleryItems.length
            : document.querySelectorAll(`.gallery-item[data-category="${currentFilter}"]`).length;
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = shown < total ? 'inline-flex' : 'none';
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            visibleCount = ITEMS_PER_PAGE;
            applyFilter();
        });
    });

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            visibleCount += ITEMS_PER_PAGE;
            applyFilter();
        });
    }

    applyFilter();

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentLightboxIndex = 0;
    let activeItems = [];

    function getActiveItems() {
        return Array.from(galleryItems).filter(i => !i.classList.contains('hidden'));
    }

    function openLightbox(index) {
        activeItems = getActiveItems();
        currentLightboxIndex = index;
        const item = activeItems[currentLightboxIndex];
        lightboxImg.src = item.querySelector('img').src;
        lightboxImg.alt = item.querySelector('img').alt;
        lightboxCaption.textContent = item.querySelector('span').textContent;
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${activeItems.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    galleryItems.forEach((item, idx) => {
        item.addEventListener('click', function() {
            activeItems = getActiveItems();
            const activeIdx = activeItems.indexOf(item);
            if (activeIdx !== -1) openLightbox(activeIdx);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    if (lightboxPrev) lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex - 1 + activeItems.length) % activeItems.length;
        openLightbox(currentLightboxIndex);
    });

    if (lightboxNext) lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex + 1) % activeItems.length;
        openLightbox(currentLightboxIndex);
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Add animation to sections
    const animateElements = document.querySelectorAll('.impact-card, .stats-card, .event-card, .news-card, .gallery-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Stats counter animation
    const statsNumbers = document.querySelectorAll('.stats-number');
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue);
                
                if (!isNaN(numericValue)) {
                    animateCounter(target, numericValue);
                }
                
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statsNumbers.forEach(stat => statsObserver.observe(stat));

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 30);
    }

    // Donate amount button toggle
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');
    amountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            amountBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            if (customAmountInput) customAmountInput.value = '';
        });
    });
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            if (this.value) amountBtns.forEach(b => b.classList.remove('active'));
        });
    }

    // Lazy-load all images that don't already have loading attribute
    document.querySelectorAll('img:not([loading])').forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
});
