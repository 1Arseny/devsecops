import { animateHeroSection } from './sections/hero.js';
import { animateAboutSection } from './sections/about.js';
import { initCourseAccordion } from './sections/courseAccordion.js';

document.addEventListener('DOMContentLoaded', () => {
  animateHeroSection();
  animateAboutSection();
  initCourseAccordion();
});
