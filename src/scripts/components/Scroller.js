import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

export default class Scroller {
  constructor(element) {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    this.element = element;
    this.options = {
      hasSkew: false,
      hasScale: false,
      hasPinItems: false,
      hasHoriz: false,
    };

    this.setOptions();
    this.init();
  }

  init() {
    this.smoother = ScrollSmoother.create({
      wrapper: this.element,
      content:
        this.element.querySelector('#smooth-content') ||
        this.element.firstElementChild,
      smooth: 1.5,
      effects: true,
      smoothTouch: 0.1,
      onUpdate: (self) => this.onUpdateScroll(self),
      onStop: (self) => this.onStopScroll(self),
      ease: 'expo.out',
    });
  }

  onUpdateScroll(self) {
    if (this.options.hasSkew) this.updateSkew(self);
    if (this.options.hasScale) this.updateScale(self);
  }

  onStopScroll(self) {
    if (this.options.hasSkew) this.stopSkew(self);
    if (this.options.hasScale) this.stopScale(self);
  }

  initSkew() {
    this.skewTarget = this.element.querySelectorAll('[data-skew]');
    if (this.skewTarget.length > 0) {
      this.skewSetter = gsap.quickTo(this.skewTarget, 'skewY');
      this.skewSetter(0);
    }
  }

  updateSkew(self) {
    if (!this.skewSetter) return;
    const velocity = self.getVelocity();
    const force = 5;
    let skew = gsap.utils.mapRange(-1000, 1000, -force, force, velocity);
    skew = gsap.utils.clamp(-force, force, skew);

    this.skewSetter(skew);
  }

  stopSkew() {
    if (this.skewSetter) {
      this.skewSetter(0);
    }
  }

  initScale() {
    this.scaleImages = this.element.querySelectorAll('[data-scale]');
  }

  updateScale(self) {
    if (!this.scaleImages || !this.scaleImages.length) return;
    const velocity = self.getVelocity();
    const force = 0.02;
    let scale = gsap.utils.mapRange(-1000, 1000, force, -force, velocity);
    scale = gsap.utils.clamp(-force, force, scale);
    const finalScale = 1 + scale;

    gsap.set(this.scaleImages, { scale: finalScale });
  }

  stopScale() {
    if (!this.scaleImages || !this.scaleImages.length) return;
    gsap.to(this.scaleImages, {
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  }

  initPin() {
    const pinTargets = this.element.querySelectorAll('[data-pin-items]');

    pinTargets.forEach((target) => {
      const words = target.querySelectorAll('.caractere-mots');

      if (!words.length) return;

      // État initial : tous les mots sont baissés et invisibles
      gsap.set(words, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: target,
          pin: true,
          start: 'top top',
          end: '+=250%', // Longueur du scroll pendant le blocage
          scrub: 1, // Fluidité au scroll
          anticipatePin: 1,
        },
      });

      words.forEach((word, index) => {
        // 1. Le mot apparaît en montant légèrement vers le centre
        tl.to(word, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
        });

        // 2. Si ce n'est pas le dernier mot, il disparaît vers le haut
        if (index < words.length - 1) {
          tl.to(
            word,
            {
              opacity: 0,
              y: -40,
              duration: 0.8,
              ease: 'power2.in',
            },
            '+=0.6', // Temps de pause où le mot reste fixe à l'écran
          );
        }
      });
    });
  }

  setOptions() {
    if (this.element.querySelector('[data-skew]')) {
      this.options.hasSkew = true;
      this.initSkew();
    }
    if (this.element.querySelector('[data-scale]')) {
      this.options.hasScale = true;
      this.initScale();
    }
    if (this.element.querySelector('[data-pin-items]')) {
      this.options.hasPinItems = true;
      this.initPin();
    }
  }
}
