export function initrofileresultSection() {
  const section = document.getElementById("profile-result");
  if (!section) return;

  // Анимация появления списка
  const items = section.querySelectorAll(".reveal");
  if (items.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show"); // убери если нужно один раз
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((el) => observer.observe(el));
  }

  // Живой фон
  const glow = document.getElementById("profile-glow-bg");
  if (!glow) return;
  section.addEventListener("mousemove", (e) => {
    const rect = section.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    glow.style.background = `radial-gradient(ellipse 42% 30% at ${x}% ${y}%, rgba(34,197,94,0.22) 0%, transparent 78%)`;
  });
  section.addEventListener("mouseleave", () => {
    glow.style.background = `radial-gradient(ellipse 40% 28% at 50% 55%, rgba(34,197,94,0.22) 0%, transparent 80%)`;
  });
}
