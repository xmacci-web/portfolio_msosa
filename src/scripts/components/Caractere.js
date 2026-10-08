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

    /* --- 1. ACTIVATION DU THÈME CLAIR --- */
    ScrollTrigger.create({
      trigger: this.element,
      start: 'top 50%',
      onEnter: () => document.body.classList.add('theme-light'),
      onLeaveBack: () => document.body.classList.remove('theme-light'),
    });

    /* --- 2. RETRAIT DU THÈME CLAIR AU FOOTER --- */
    const footer = document.querySelector('footer'); // Modifie la balise ou la classe si ton footer a une autre classe (ex: '.contact' ou '.footer')
    if (footer) {
      ScrollTrigger.create({
        trigger: footer,
        start: 'top 80%', // Se déclenche dès que le haut du footer arrive à 80% du bas de l'écran
        onEnter: () => document.body.classList.remove('theme-light'),
        onLeaveBack: () => document.body.classList.add('theme-light'),
      });
    }

    /* --- 3. TIMELINE DE PINNING ET ANIMATION DES MOTS --- */
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
