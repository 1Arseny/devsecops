export function animateAboutSection() {
  const elements = document.querySelectorAll('#about .fade-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-6');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  elements.forEach((el) => observer.observe(el));
  const cards = document.querySelectorAll('.feature-card');

  const observer2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-6');
        observer2.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
  });

  cards.forEach(card => observer2.observe(card));
}
