export function initCourseAccordion() {
  const toggles = document.querySelectorAll('.accordion-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;

      // Закрыть остальные
      document.querySelectorAll('.accordion-content').forEach(el => {
        if (el !== content) el.classList.add('hidden');
      });

      content.classList.toggle('hidden');
    });
  });
}
