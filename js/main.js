/* ============================================================
   F&R SERVICES - Main JavaScript
   Animations, Interactions, Effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ============ PRELOADER ============
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 3500);
    });

    // Fallback: hide preloader after 6s max
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
            document.body.style.overflow = 'auto';
            initAnimations();
        }
    }, 6000);

    // ============ CUSTOM CURSOR ============
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorOutline) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Smooth follow for outline
        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effect on interactive elements
        const hoverElements = document.querySelectorAll('a, button, .service-card, .gallery-item, input, textarea, select');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
                cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // ============ PARTICLES BACKGROUND ============
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.targetOpacity = this.opacity;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Twinkle effect
                if (Math.random() < 0.005) {
                    this.targetOpacity = Math.random() * 0.5 + 0.1;
                }
                this.opacity += (this.targetOpacity - this.opacity) * 0.02;

                // Wrap around
                if (this.x > canvas.width + 10) this.x = -10;
                if (this.x < -10) this.x = canvas.width + 10;
                if (this.y > canvas.height + 10) this.y = -10;
                if (this.y < -10) this.y = canvas.height + 10;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 160, 227, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles (fewer on mobile)
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 30 : 80;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawLines() {
            const maxDistance = 150;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 160, 227, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            if (!isMobile) drawLines();
            animationId = requestAnimationFrame(animateParticles);
        }

        animateParticles();

        // Pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animateParticles();
            }
        });
    }

    // ============ NAVBAR ============
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Add scrolled class
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlighting
        updateActiveNav();
        lastScroll = scrollY;
    });

    // Mobile toggle
    function closeMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openMenu() {
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close menu when tapping outside (mobile overlay)
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Active nav link based on scroll
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ============ SCROLL ANIMATIONS (IntersectionObserver) ============
    function initAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ============ COUNTER ANIMATION ============
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * target);
                        entry.target.textContent = current;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            entry.target.textContent = target;
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounters();

    // ============ SWIPER GALLERY ============
    if (typeof Swiper !== 'undefined') {
        new Swiper('.gallery-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                },
            },
            effect: 'slide',
            speed: 600,
        });
    }

    // ============ LIGHTBOX ============
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const galleryImages = document.querySelectorAll('.gallery-item img');

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            if (lightbox && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // ============ BACK TO TOP ============
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // ============ CONTACT FORM (WhatsApp redirect) ============
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const email = document.getElementById('email').value;
            const servicio = document.getElementById('servicio').value;
            const mensaje = document.getElementById('mensaje').value;

            // Build WhatsApp message
            let whatsappMsg = `¡Hola F&R Services! 👋\n\n`;
            whatsappMsg += `*Nombre:* ${nombre}\n`;
            whatsappMsg += `*Teléfono:* ${telefono}\n`;
            if (email) whatsappMsg += `*Email:* ${email}\n`;
            whatsappMsg += `*Servicio:* ${servicio}\n`;
            whatsappMsg += `*Mensaje:* ${mensaje}\n`;

            const encodedMsg = encodeURIComponent(whatsappMsg);
            const whatsappURL = `https://wa.me/584128823?text=${encodedMsg}`;

            // Animate button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span>¡Redirigiendo a WhatsApp!</span> <i class="fab fa-whatsapp"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #25d366, #128c7e)';

            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                
                // Reset form after a moment
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = '<span>Enviar Mensaje</span> <i class="fas fa-paper-plane"></i>';
                    submitBtn.style.background = '';
                }, 2000);
            }, 500);
        });
    }

    // ============ BUTTON RIPPLE EFFECT ============
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ============ SMOOTH SCROLL FOR ANCHOR LINKS ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============ TILT EFFECT ON SERVICE CARDS ============
    const tiltCards = document.querySelectorAll('.service-card');
    
    if (window.matchMedia('(pointer: fine)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                
                // Move glow
                const glow = card.querySelector('.service-card-glow');
                if (glow) {
                    glow.style.left = `${x - rect.width}px`;
                    glow.style.top = `${y - rect.height}px`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ============ PARALLAX ON HERO FLOATS ============
    if (window.matchMedia('(pointer: fine)').matches) {
        const heroFloats = document.querySelectorAll('.hero-float');
        
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            
            heroFloats.forEach((float, index) => {
                const speed = (index + 1) * 15;
                float.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }

    // ============ MAGNETIC BUTTON EFFECT ============
    const magneticBtns = document.querySelectorAll('.btn-glow');
    
    if (window.matchMedia('(pointer: fine)').matches) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ============ TEXT REVEAL ON HERO ============
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const lines = heroTitle.querySelectorAll('span');
        lines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(30px)';
            line.style.transition = `opacity 0.6s ease ${index * 0.15 + 0.3}s, transform 0.6s ease ${index * 0.15 + 0.3}s`;
            
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, 100);
        });
    }

    // ============ DYNAMIC YEAR ============
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    console.log('%c F&R Services %c Website loaded successfully! ', 
        'background: #00a0e3; color: white; padding: 8px 16px; border-radius: 4px 0 0 4px; font-weight: bold;',
        'background: #0d1b2a; color: #00a0e3; padding: 8px 16px; border-radius: 0 4px 4px 0;'
    );
});
