import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

import 'src/components/grid-panel';

// TODO
// 1. Add right-side panel for displaying selected item.
// 2. Connect to some useful content ... Pinterest?

const createTemplate = template`
  <style>
    :host {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      padding: 24px;
      display: flex;
    }
    ${commonStyle}
  </style>

  <grid-panel mode="grid"></grid-panel>
`;

class App extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$gridPanel = this._shadowRoot.querySelector('grid-panel');

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
    });
  }
}

window.customElements.define('app-root', App);
