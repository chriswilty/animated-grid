import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

import 'src/components/grid-panel';
import 'src/components/view-panel';

const DEFAULT_TRANSITION_SECS = 0.8;
const SPACING_XL = 18;

// TODO
// 1. Add right-side panel for displaying selected item.
// 2. Connect to some useful content ... Pinterest?

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
      width: 40%;
    }
    view-panel {
      padding: ${SPACING_XL}px ${SPACING_XL}px ${SPACING_XL}px 0;
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
    this._contentElements = new Array(8).fill(0).map((_, i) => {
      const span = document.createElement('span');
      span.innerHTML = `${i + 1}`;
      span.style.fontSize = '48px';
      return span;
    });

    this.$gridPanel.contentElements = this._contentElements;
    this.$gridPanel.addEventListener('onSelect', ({ detail: selectedIndex }) => {
      this.$gridPanel.setAttribute('mode', selectedIndex === null ? 'grid' : 'list');
      this.$gridPanel.classList[selectedIndex === null ? 'remove' : 'add']('side');
      this.$viewPanel.contentElement = (selectedIndex !== null ? this._contentElements[selectedIndex] : null);
    });
  }
}

window.customElements.define('app-root', App);
