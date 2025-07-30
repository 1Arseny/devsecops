export function initLearningJourneySection() {
  const section = document.getElementById('learning-journey');
  if (!section) return;
  const steps = Array.from(section.querySelectorAll('.journey-step'));
  const path = section.querySelector('#journey-path');
  const bubbles = Array.from(section.querySelectorAll('.step-bubble'));
  const btn = section.querySelector('#start-journey-btn');
  const commentMain = section.querySelector('#student-comment-main');

  // Комментарии для каждого шага (можно менять текст)
  const comments = [
    "Стартуем с основ! 🚀",
    "Автоматизация — это сила!",
    "Контейнеры теперь не страшны!",
    "K8s — теперь мой дом!",
    "Compliance на практике!",
    "Готов стать DevSecOps!"
  ];

  // Пошаговая анимация (осталась прежней)
  let shown = false;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !shown) {
      shown = true;
      steps.forEach((el, idx) => {
        setTimeout(() => {
          el.classList.remove('opacity-0', 'translate-y-7');
          el.classList.add('opacity-100', 'translate-y-0');
        }, idx * 230);
      });
      if (path) {
        path.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1)';
        path.style.strokeDashoffset = 0;
      }
      observer.disconnect();
    }
  }, { threshold: 0.12 });
  observer.observe(section);

  if (path) {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    setTimeout(() => { path.style.strokeDashoffset = len; }, 100);
  }

  // "Путь" + комментарии (наверх)
  let animating = false;
  btn?.addEventListener('click', () => {
    if (animating) return;
    animating = true;
    // Scroll to top of section
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Reset
    bubbles.forEach(b => {
      b.textContent = '';
      b.classList.remove('ring-8','ring-[#fff]', 'bg-gradient-to-tr', 'from-[#ffd600]', 'to-[#13e0ba]');
    });

    // Сбросить комментарий
    commentMain.style.opacity = 0;
    commentMain.style.transform = "translateY(-10px)";
    setTimeout(()=>{
      commentMain.textContent = '';
    }, 280);

    // Step-by-step
    let idx = 0;
    function nextStep() {
      // Hide previous
      if (idx > 0) {
        bubbles[idx-1].textContent = '';
        bubbles[idx-1].classList.remove('ring-8','ring-[#fff]', 'bg-gradient-to-tr', 'from-[#ffd600]', 'to-[#13e0ba]');
      }
      // Show current
      bubbles[idx].innerHTML = '👨‍🎓';
      bubbles[idx].classList.add('ring-8','ring-[#fff]', 'bg-gradient-to-tr', 'from-[#ffd600]', 'to-[#13e0ba]');
      // Показываем комментарий
      commentMain.textContent = comments[idx];
      commentMain.style.opacity = 1;
      commentMain.style.transform = "translateY(0)";
      setTimeout(() => {
        idx++;
        if (idx < bubbles.length) {
          nextStep();
        } else {
          setTimeout(() => {
            // Show final state
            bubbles.forEach(b => {
              b.innerHTML = '✅';
              b.classList.remove('ring-8','ring-[#fff]', 'bg-gradient-to-tr', 'from-[#ffd600]', 'to-[#13e0ba]');
            });
            commentMain.textContent = "Поздравляем, вы прошли весь путь!";
            commentMain.style.opacity = 1;
            commentMain.style.transform = "translateY(0)";
            animating = false;
          }, 1600);
        }
      }, 1600); // <--- ТУТ меняй скорость анимации шага!
    }
    setTimeout(() => nextStep(), 300); // Немного задержки после нажатия
  });
}
