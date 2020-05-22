import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

import * as animatedBoxAttributes from './animated-box';
import './animated-box';
import './square-container';

export const ATTR_MODE = "mode";

const onSelectEvent = itemIndex => new CustomEvent('onSelect', { detail: itemIndex });

// TODO Sort out that width-based-on-vh measurement?
const createTemplate = template`
  <style>
    :host {
      position: relative;
      width: 100%;
      display: flex;
    }
    ${commonStyle}
    
    .wrapper {
      display: flex;
      justify-content: center;
      width: 100%;
    }
    
    square-container {
      max-width: calc(100vh - 48px);
    }
  </style>

  <div class="wrapper">
    <square-container></square-container>
  </div>
`;

class GridPanel extends HTMLElement {
  static get observedAttributes() {
    return [ ATTR_MODE ];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$squareContainer = this._shadowRoot.querySelector('square-container');
    this.$boxes = [];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === ATTR_MODE && newValue !== oldValue) {
      console.log(`${ATTR_MODE}=${newValue}`);

      this.$boxes.forEach(box => {
        box.setAttribute(animatedBoxAttributes.ATTR_MODE, newValue);
      });
    }
  }

  set contentElements([...elements]) {
    const onClick = this.boxClicked.bind(this);

    this.$boxes = elements.map((childNode, index) => {
      const box = document.createElement('animated-box');
      box.setAttribute(animatedBoxAttributes.ATTR_INDEX, `${index}`);
      box.setAttribute(animatedBoxAttributes.ATTR_BOXCOUNT, `${elements.length}`);
      box.setAttribute(animatedBoxAttributes.ATTR_MODE, this.mode);
      box.appendChild(childNode);
      box.addEventListener('click', onClick);
      return box;
    });

    this.$squareContainer.append(...this.$boxes);
  }

  boxClicked({ target }) {
    let selectedIndex = null;

    this.$boxes.forEach((boxNode, index) => {
      if (this.mode === 'grid' && boxNode.contains(target)) {
        boxNode.setAttribute(animatedBoxAttributes.ATTR_SELECTED, '');
        selectedIndex = index;
      } else {
        boxNode.removeAttribute(animatedBoxAttributes.ATTR_SELECTED);
      }
    });

    this.dispatchEvent(onSelectEvent(selectedIndex));
  }

  get mode() {
    return this.getAttribute(ATTR_MODE);
  }
}

window.customElements.define('grid-panel', GridPanel);
