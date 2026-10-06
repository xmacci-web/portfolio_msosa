import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

export default class Caractere {
  constructor(element) {
    gsap.registerPlugin(ScrollTrigger);

    this.element = element;
    this.words = Array.from(this.element.querySelectorAll('.caractere-mots'));

    this.init();
  }

  init() {
    if (!this.element || !this.words.length) return;

    /* --- 1. GESTION DU THÈME DÉFINITIF POUR LE RESTE DE LA PAGE --- */
    ScrollTrigger.create({
      trigger: this.element,
      start: 'top 50%', // Active le fond blanc dès le milieu de la section
      onEnter: () => document.body.classList.add('theme-light'),
      onLeaveBack: () => document.body.classList.remove('theme-light'), // Remet en noir SEULEMENT si on remonte
    });

    /* --- 2. TIMELINE DE PINNING ET ANIMATION DES MOTS --- */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.element,
        start: 'top top',
        end: '+=2000',
        pin: true,
        scrub: 1,
      },
    });

    // Apparition progressive de chaque mot
    this.words.forEach((word) => {
      tl.fromTo(
        word,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        '+=0.5',
      );
    });

    tl.to(this.words, { opacity: 0, y: -30, duration: 1, stagger: 0.2 }, '+=1');
  }
}
