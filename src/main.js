import { animateHeroSection } from './sections/hero.js';
import { initwhycourseAnimation } from './sections/why-course.js';
import { initSkillsCanvasAnimation } from './sections/skills-canvas.js';
import { initcourseprogramAnimation } from './sections/course-program.js';
import { initrofileresultSection } from './sections/profile-result.js';
import { initAuthorSection } from './sections/author.js';

document.addEventListener('DOMContentLoaded', () => {
  animateHeroSection();
  initwhycourseAnimation();
  initSkillsCanvasAnimation();
  initcourseprogramAnimation();
  initrofileresultSection();
  initAuthorSection();

});
