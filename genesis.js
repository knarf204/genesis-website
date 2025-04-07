document.addEventListener('DOMContentLoaded', () => {
    // Initialize all image sliders
    const sliders = document.querySelectorAll('.image-slider');

    sliders.forEach(slider => {
        const container = slider.querySelector('.slider-container');
        const dots = slider.querySelectorAll('.slider-dot');
        let currentIndex = 0;

        // Update slider position
        const updateSlider = (index) => {
            container.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        };

        // Handle dot clicks
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider(currentIndex);
                resetAutoSlide();
            });
        });

        // Auto-slide functionality
        let autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % dots.length;
            updateSlider(currentIndex);
        }, 5000);

        // Pause auto-slide on hover
        slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));

        // Resume auto-slide on mouse leave
        slider.addEventListener('mouseleave', resetAutoSlide);

        // Reset auto-slide timer
        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % dots.length;
                updateSlider(currentIndex);
            }, 5000);
        };
    });
});
