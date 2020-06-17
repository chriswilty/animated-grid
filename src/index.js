import { commonStyle } from 'src/common-style';
import { getPage } from 'src/service/pexel';
import { template } from 'src/tags/html';

import 'src/components/grid-panel';
import 'src/components/loading';
import 'src/components/view-panel';

import PexelImage from 'src/assets/pexels.png';

const DEFAULT_TRANSITION_SECS = 0.8;
const SPACING_XL = 18;

const createTemplate = template`
  <style>
    ${commonStyle}
    
    :host {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
    }
    grid-panel {
      padding: ${SPACING_XL}px;
      transition: width ${DEFAULT_TRANSITION_SECS}s;
    }
    grid-panel.side {
      width: calc(100% / 3);
    }
    view-panel {
      padding: ${SPACING_XL}px ${SPACING_XL}px ${SPACING_XL}px 0;
      transition: left ${DEFAULT_TRANSITION_SECS}s;
    }
  </style>

  <grid-panel mode="grid"></grid-panel>
  <view-panel></view-panel>
`;

class App extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$gridPanel = this._shadowRoot.querySelector('grid-panel');
    this.$viewPanel = this._shadowRoot.querySelector('view-panel');

    this._contentElements = [];
  }

  connectedCallback() {
    const loadingSpinner = document.createElement('loading-spinner');
    loadingSpinner.image = PexelImage;
    this.$gridPanel.contentElements = [loadingSpinner];

    this._loadContent();

    // TODO
    // - Add a close button to view panel.
  }

  async _loadContent() {
    const { photos } = await getPage({ searchTerm: 'red', pageSize: 9 });

    this._contentElements = photos.map(photo => {
      const container = document.createElement('div');
      container.style.background = `url(${photo.url.original}) center/cover no-repeat`;
      container.style.width = '100%';
      container.style.height = '100%';
      return container;
    });

    this.$gridPanel.contentElements = this._contentElements;
    this.$gridPanel.addEventListener('onSelect', ({ detail: selectedIndex }) => {
      // TODO Fix this so always select element and always list mode
      this.$gridPanel.setAttribute('mode', selectedIndex === null ? 'grid' : 'list');
      this.$gridPanel.classList[selectedIndex === null ? 'remove' : 'add']('side');
      this.$viewPanel.contentElement = (selectedIndex !== null ? this._contentElements[selectedIndex] : null);
    });
  }
}

window.customElements.define('app-root', App);
