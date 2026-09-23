export default class Tabs {
  constructor(element) {
    this.element = element;
    this.onglets = element.querySelectorAll('.js-tab');
    this.contenus = element.querySelectorAll('.js-tab-content');
    this.selectedType = '';
    this.defaultTab = this.element.dataset.defaultTab;
    this.options = {
      defaultTab: '',
    };

    this.init();
  }

  init() {
    this.setOptions();

    // Boucle pour ajouter un clic sur les boutons des onglets
    for (let i = 0; i < this.onglets.length; i++) {
      const onglet = this.onglets[i];
      onglet.addEventListener('click', this.selectOnglet.bind(this));
    }

    this.activeStartup();
  }

  selectOnglet(element) {
    const isActive = element.currentTarget.classList.contains('is-active');

    for (let i = 0; i < this.onglets.length; i++) {
      const onglet = this.onglets[i];
      onglet.classList.remove('is-active');
    }

    if (isActive) {
      element.currentTarget.classList.remove('is-active');
      this.selectedType = '';
    }

    if (!isActive) {
      element.currentTarget.classList.add('is-active');
      this.selectedType = element.currentTarget.dataset.tabId;
    }

    this.showContenu();
  }

  showContenu() {
    const contenus = this.element.querySelectorAll('[data-tab-content-id]');

    for (let i = 0; i < contenus.length; i++) {
      const contenu = contenus[i];
      contenu.classList.remove('is-active');

      if (this.selectedType == contenu.dataset.tabContentId) {
        contenu.classList.add('is-active');
      } else {
        contenu.classList.remove('is-active');
      }
    }
  }

  activeStartup() {
    const ongletActive = this.element.querySelector('.js-tab');
    const contenuActive = this.element.querySelector('.js-tab-content');

    const contenus = this.element.querySelectorAll('[data-tab-content-id]');
    const onglets = this.element.querySelectorAll('[data-tab-id]');

    // Onglet actif par défaut lorsque data-default-tab n'est pas présent
    if (!this.defaultTab) {
      ongletActive.classList.add('is-active');
      contenuActive.classList.add('is-active');
    }

    // Onglet actif selon la valeur du data-default-tab
    for (let i = 0; i < contenus.length; i++) {
      const contenu = contenus[i];

      if (this.defaultTab == contenu.dataset.tabContentId) {
        contenu.classList.add('is-active');
      }
    }

    for (let i = 0; i < onglets.length; i++) {
      const onglet = onglets[i];

      if (this.defaultTab == onglet.dataset.tabId) {
        onglet.classList.add('is-active');
      }
    }
  }

  setOptions() {
    if ('defaultTab' in this.element.dataset) {
      this.options.defaultTab = this.element.dataset.defaultTab;
    }
  }
}
