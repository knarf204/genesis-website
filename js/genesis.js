document.addEventListener('DOMContentLoaded', () => {
    // ===============================
    // Loader: Show only on first visit
    // ===============================
    const loader = document.getElementById('loader-wrapper');
    
    const pageLogo = document.querySelector('.logo img');

    if (loader) {
        loader.style.display = 'flex';
        loader.style.opacity = '1';
        loader.style.visibility = 'visible';
        document.body.classList.add('loading');

        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';

            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.remove('loading');

                if (pageLogo) {
                    pageLogo.classList.add('animate-logo');
                    pageLogo.addEventListener('animationend', () => {
                        pageLogo.classList.remove('animate-logo');
                    }, { once: true });
                }
            }, 600);
        }, 2500);
    } else {
        document.body.classList.remove('loading');

        if (pageLogo) {
            setTimeout(() => {
                pageLogo.classList.add('animate-logo');
                pageLogo.addEventListener('animationend', () => {
                    pageLogo.classList.remove('animate-logo');
                }, { once: true });
            }, 300);
        }
    }

    // ===============================
    // Mobile Menu Toggle
    // ===============================
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // ===============================
    // Image Sliders
    // ===============================
    const sliders = document.querySelectorAll('.image-slider');

    sliders.forEach(slider => {
        const container = slider.querySelector('.slider-container');
        const dots = slider.querySelectorAll('.slider-dot');
        const items = slider.querySelectorAll('.slider-item');

        let currentIndex = 0;
        let autoSlideInterval;

        const updateSlider = (index) => {
            container.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        };

        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % dots.length;
                updateSlider(currentIndex);
            }, 5000);
        };

        if (dots.length > 0 && container) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateSlider(currentIndex);
                    resetAutoSlide();
                });
            });

            resetAutoSlide();

            slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            slider.addEventListener('mouseleave', resetAutoSlide);
        }
    });

    let counterAnimationId = null;

    const startWhyIconCounter = () => {
        const counter = document.querySelector('.why-icon');
        if (!counter) return;

        if (counterAnimationId) {
            cancelAnimationFrame(counterAnimationId);
            counterAnimationId = null;
        }

        const start = 1;
        const end = 20;
        const duration = 2800;
        const startTime = performance.now();

        const easeOutQuad = (t) => t * (2 - t);

        const update = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuad(progress);
            const currentValue = Math.max(start, Math.round(start + (end - start) * eased));

            counter.textContent = `${currentValue}+`;

            if (progress < 1) {
                counterAnimationId = requestAnimationFrame(update);
            } else {
                counter.classList.add('why-icon-highlight');
                counterAnimationId = null;
                setTimeout(() => {
                    counter.classList.remove('why-icon-highlight');
                }, 700);
            }
        };

        counterAnimationId = requestAnimationFrame(update);
    };

    const scheduleWhyIconCounter = () => {
        const counter = document.querySelector('.why-icon');
        const loader = document.getElementById('loader-wrapper');
        const delay = loader ? 3200 : 0;
        let counterStarted = false;

        if (!counter) return;
        counter.textContent = '1+';

        const resetCounter = () => {
            counterStarted = false;
            if (counterAnimationId) {
                cancelAnimationFrame(counterAnimationId);
                counterAnimationId = null;
            }
            counter.textContent = '1+';
            counter.classList.remove('why-icon-highlight');
        };

        const startWhenVisible = () => {
            if (counterStarted) return;
            counterStarted = true;
            startWhyIconCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    startWhenVisible();
                } else if (!entry.isIntersecting) {
                    resetCounter();
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -20% 0px'
        });

        setTimeout(() => {
            observer.observe(counter);
        }, delay);
    };

    scheduleWhyIconCounter();

    // ===============================
    // Gallery Image Lightbox
    // ===============================
    document.querySelectorAll('.gallery-image').forEach(image => {
        image.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0,0,0,0.9);
                z-index: 1000;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: zoom-out;
                animation: fadeIn 0.3s ease;
            `;

            const enlargedImg = new Image();
            enlargedImg.src = image.src;
            enlargedImg.style.cssText = `
                max-width: 90vw;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 10px;
                box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            `;

            if (!document.querySelector('#lightbox-animations')) {
                const style = document.createElement('style');
                style.id = 'lightbox-animations';
                style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes fadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }

            overlay.appendChild(enlargedImg);
            document.body.appendChild(overlay);

            overlay.addEventListener('click', () => {
                overlay.style.animation = 'fadeOut 0.3s ease';
                overlay.addEventListener('animationend', () => overlay.remove());
            });
        });
    });
});
