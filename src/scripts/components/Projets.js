import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

export default class Projets {
  constructor(element) {
    gsap.registerPlugin(ScrollTrigger);

    this.element = element;
    this.cards = this.element.querySelectorAll('.projet-card');
    this.dots = this.element.querySelectorAll('.projet-pagination .dot');
    this.pagination = this.element.querySelector('.projet-pagination');

    this.init();
  }

  init() {
    if (!this.cards.length || !this.dots.length) return;

    if (this.pagination) {
      ScrollTrigger.create({
        trigger: this.element,
        start: 'top top',
        end: 'bottom bottom',
        pin: this.pagination,
        pinSpacing: false,
      });
    }

    this.cards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => this.setActiveDot(index),
        onEnterBack: () => this.setActiveDot(index),
      });
    });

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (this.cards[index]) {
          this.cards[index].scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  setActiveDot(activeIndex) {
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }
}
