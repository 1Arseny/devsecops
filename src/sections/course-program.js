export function initcourseprogramAnimation() {
    const section = document.getElementById("course-program");
    if (!section) return;
    const list = section.querySelector('.program-list');
    const items = Array.from(list.querySelectorAll('li'));

    let shown = false;
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !shown) {
        shown = true;
        items.forEach((li, idx) => {
            setTimeout(() => {
            li.classList.remove('opacity-0', 'translate-y-8');
            li.classList.add('opacity-100', 'translate-y-0');
            }, idx * 120);
        });
        observer.disconnect();
        }
    }, { threshold: 0.18 });
    observer.observe(section);
}