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
import { initPriceSectionCanvas } from './sections/price-canvas.js';
import { initFaqSectionCanvas } from "./sections/faq.js";

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
  initFaqSectionCanvas();

});
