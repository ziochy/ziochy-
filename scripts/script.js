// Animasi Scroll untuk Level Cards
document.addEventListener('DOMContentLoaded', () => {
    const levelCards = document.querySelectorAll('.level-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__zoomIn');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    levelCards.forEach(card => {
        observer.observe(card);
    });
}); 