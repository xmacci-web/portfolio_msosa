export default class Accordion {
  constructor(element) {
    this.element = element;
    this.container = this.element.querySelectorAll('.js-acc-header');
    this.options = {
      notClosing: false,
      autoOpen: false,
    };
    this.setOptions();
    this.init();
  }

  init() {
    for (let i = 0; i < this.container.length; i++) {
      const container = this.container[i];
      if ('autoOpen' in container.dataset) {
        container.classList.add('is-active');
      }
      container.addEventListener('click', this.initAccordion.bind(this));
    }
  }

  initAccordion(event) {
    const target = event.currentTarget;
    const wasActive = target.classList.contains('is-active');

    if (!this.options.notClosing) {
      for (let i = 0; i < this.container.length; i++) {
        const container = this.container[i];
        container.classList.remove('is-active');
      }
    }

    if (!wasActive) {
      target.classList.add('is-active');
    } else if (this.options.notClosing) {
      target.classList.remove('is-active');
    }
  }
  setOptions() {
    if ('notClosing' in this.element.dataset) {
      this.options.notClosing = true;
    }
  }
}
