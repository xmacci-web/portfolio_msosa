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

  setOptions() {
    if (this.element.querySelector('[data-skew]')) {
      this.options.hasSkew = true;
      this.initSkew();
    }
    if (this.element.querySelector('[data-scale]')) {
      this.options.hasScale = true;
      this.initScale();
    }
  }
}
