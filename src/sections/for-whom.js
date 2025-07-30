export function initForwhomSection() {
  const section = document.getElementById("for-whom");
  if (!section) return;
  const list = section.querySelector('.forwhom-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('li'));

  // Анимация появления
  let shown = false;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !shown) {
      shown = true;
      items.forEach((li, idx) => {
        setTimeout(() => {
          li.classList.remove('opacity-0', 'translate-y-8');
          li.classList.add('opacity-100', 'translate-y-0');
        }, idx * 170);
      });
      observer.disconnect();
    }
  }, { threshold: 0.14 });
  observer.observe(section);

  // Взаимодействие с кнопками
  const btns = document.querySelectorAll('.profile-btn');
  btns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      // Убрать выделение со всех
      btns.forEach(b => b.classList.remove('ring', 'ring-indigo-400'));
      btn.classList.add('ring', 'ring-indigo-400');
      // Подсветить соответствующий пункт
      items.forEach((li, i) => {
        li.classList.toggle('bg-indigo-900/60', i === idx);
      });
      // Текст результата
      document.getElementById('forwhom-result').textContent =
        "Курс действительно для вас! Уже готовим стартовый пакет материалов.";
    });
  });
}
