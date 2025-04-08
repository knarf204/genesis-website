document.addEventListener('DOMContentLoaded', () => {
    // Initialize all image sliders
    const sliders = document.querySelectorAll('.image-slider');
    
    sliders.forEach(slider => {
        const container = slider.querySelector('.slider-container');
        const dots = slider.querySelectorAll('.slider-dot');
        let currentIndex = 0;
        let autoSlideInterval;
        
        // Update slider position
        const updateSlider = (index) => {
            container.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        };
        
        // Reset auto-slide timer
        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % dots.length;
                updateSlider(currentIndex);
            }, 5000);
        };
        
        // Handle dot clicks
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider(currentIndex);
                resetAutoSlide();
            });
        });
        
        // Initialize auto-slide
        resetAutoSlide();
        
        // Pause auto-slide on hover
        slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        
        // Resume auto-slide on mouse leave
        slider.addEventListener('mouseleave', resetAutoSlide);
    });
    
    // Gallery image lightbox functionality
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
            
            // Add fadeOut animation style if not already present
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