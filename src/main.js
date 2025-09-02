// main.js
import { animateHeroSection } from './sections/hero.js';
import { initwhycourseAnimation } from './sections/why-course.js';
import { initSkillsCanvasAnimation } from './sections/skills-canvas.js';
import { initcourseprogramAnimation } from './sections/course-program.js';
import { initrofileresultSection } from './sections/profile-result.js';
import { initAuthorSection } from './sections/author.js';
import { initForwhomSection } from './sections/for-whom.js';
import { initRealcasesSection } from './sections/real-cases.js';
import { initLearningFormatSection } from './sections/format.js';
import { initLearningJourneySection } from './sections/learning-journey.js';
import { initPriceSectionCanvas, initPriceForm } from './sections/price-canvas.js';
import { initFaqSectionCanvas, initFaqAccordion } from "./sections/faq.js";

function enableSmoothScroll(offsetPx = -300) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;

      e.preventDefault();

      const y = el.getBoundingClientRect().top + window.pageYOffset - offsetPx;
      window.scrollTo({
        top: y,
        behavior: reduce ? 'auto' : 'smooth'
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  animateHeroSection();
  initwhycourseAnimation();
  initSkillsCanvasAnimation();
  initcourseprogramAnimation();
  initrofileresultSection();
  initAuthorSection();
  initForwhomSection();
  initRealcasesSection();
  initLearningFormatSection();
  initLearningJourneySection();
  initPriceSectionCanvas();
  initPriceForm();
  initFaqSectionCanvas();
  initFaqAccordion(); 
});
enableSmoothScroll();