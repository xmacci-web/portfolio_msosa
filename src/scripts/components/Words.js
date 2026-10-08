import { gsap } from 'gsap';

export default class Words {
  constructor(element, options = {}) {
    this.element = element;

    this.options = Object.assign(
      {
        selector: '.js-rotate-item',
        duration: 3000,
        animDuration: 0.5,
        delay: 0.2,
        yOffset: 30,
      },
      options,
    );

    this.spans = Array.from(
      this.element.querySelectorAll(this.options.selector),
    );
    this.currentIndex = 0;

    this.init();
  }

  init() {
    if (!this.spans.length) return;

    // Cache tous les textes sauf le premier
    gsap.set(this.spans, { opacity: 0, y: this.options.yOffset });
    gsap.set(this.spans[0], { opacity: 1, y: 0 });

    this.startLoop();
  }

  startLoop() {
    setInterval(() => {
      const currentText = this.spans[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.spans.length;
      const nextText = this.spans[this.currentIndex];

      // Disparition de l'ancien texte vers le haut
      gsap.to(currentText, {
        opacity: 0,
        y: -this.options.yOffset,
        duration: this.options.animDuration,
        ease: 'power2.in',
      });

      // Apparition du nouveau texte depuis le bas
      gsap.fromTo(
        nextText,
        { opacity: 0, y: this.options.yOffset },
        {
          opacity: 1,
          y: 0,
          duration: this.options.animDuration,
          delay: this.options.delay,
          ease: 'power2.out',
        },
      );
    }, this.options.duration);
  }
}
