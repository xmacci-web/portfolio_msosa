import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
export default class Scroller {
  constructor(element) {
    console.log('allo');

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    this.options = {
      hasSkew: false,
      hasScale: false,
      hasPinItems: false,
      hasHoriz: false,
    };

    this.element = element;
    this.setOptions();
    this.init();
  }
  init() {
    const scroller = ScrollSmoother.create({
      smooth: 1.5,
      effects: true,
      smoothTouch: 0.1,
      onUpdate: this.onUpdateScroll.bind(this),
      onStop: this.onStopScroll.bind(this),
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
  //skew Controls
  initSkew() {
    this.skewSetter = gsap.quickTo('img', 'skewY');
    this.skewSetter(0);
  }
  updateSkew(self) {
    const velocity = self.getVelocity();
    const force = 5;
    let skew = gsap.utils.mapRange(-1000, 1000, -force, force, velocity);
    skew = gsap.utils.clamp(-force, force, skew);

    this.skewSetter(skew);
  }
  stopSkew() {
    this.skewSetter(0);
  }

  // Scale Controls

  initScale() {
    this.scaleImages = this.element.querySelectorAll('img');
  }

  updateScale(self) {
    const velocity = self.getVelocity();
    const force = 0.02;
    let scale = gsap.utils.mapRange(-1000, 1000, force, -force, velocity);
    scale = gsap.utils.clamp(-force, force, scale);
    const finalScale = 1 + scale;

    gsap.set(this.scaleImages, { scale: finalScale });
  }

  stopScale() {
    gsap.to(this.scaleImages, {
      scale: 1,
      duration: 0.5,
      ease: 'ease.out',
    });
  }
  //Pinned Controls
  initPins() {
    const pinnedItems = this.element.querySelectorAll('.js-pinned');
    for (let i = 0; i < pinnedItems.length; i++) {
      const pinnedItem = pinnedItems[i];
      ScrollTrigger.create({
        pin: pinnedItem,
        trigger: pinnedItem.parentElement,
        start: 'center center',
        end: '80% center',
        markers: true,
      });
    }
  }

  //Horiz Controls
  initHoriz() {
    const sectionsHoriz = this.element.querySelectorAll('.js-horiz');

    for (let i = 0; i < sectionsHoriz.length; i++) {
      const sectionHoriz = sectionsHoriz[i];
      const panels = sectionHoriz.querySelectorAll('.js-panel');
      const nbPanels = panels.length;
      const buffer = 200;

      gsap.to(panels, {
        xPercent: -100 * (nbPanels - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionHoriz,
          pin: true,
          scrub: 1,
          snap: 1 / (nbPanels - 1),
          end: () => `+=${sectionHoriz.offsetWidth * (nbPanels - 1) + buffer}`,
          anticipatePin: 1,
        },
      });
    }
  }

  setOptions() {
    if ('skew' in this.element.dataset) {
      this.options.hasSkew = true;
      this.initSkew();
    }
    if ('scale' in this.element.dataset) {
      this.options.hasScale = true;
      this.initScale();
    }
    if ('pinItems' in this.element.dataset) {
      this.options.hasPinItems = true;
      this.initPins();
    }
    if ('horiz' in this.element.dataset) {
      this.options.hasHoriz = true;
      this.initHoriz();
    }
  }
}
