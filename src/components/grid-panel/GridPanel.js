import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

import * as animatedBoxAttributes from './animated-box';
import './animated-box';
import './square-container';

const ATTR_MODE = 'mode';
const ATTR_SELECTEDINDEX = 'selectedindex';

const createTemplate = template`
  <style>
    ${commonStyle}
    
    :host {
      display: flex;
    }
  </style>
  <square-container></square-container>
`;

class GridPanel extends HTMLElement {
  static get observedAttributes() {
    return [ ATTR_MODE, ATTR_SELECTEDINDEX ];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$squareContainer = this._shadowRoot.querySelector('square-container');
    this.$boxes = [];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue !== oldValue) {
      if (name === ATTR_MODE) {
        this.$boxes.forEach(box => {
          box.setAttribute(animatedBoxAttributes.ATTR_MODE, newValue);
        });
      } else if (name === ATTR_SELECTEDINDEX) {
        const selectedIndex = parseInt(newValue);
        this.$boxes.forEach((box, index) => {
          index === selectedIndex
            ? box.setAttribute(animatedBoxAttributes.ATTR_SELECTED, '')
            : box.removeAttribute(animatedBoxAttributes.ATTR_SELECTED);
        });
      }
    }
  }

  set contentElements([...elements]) {
    this.$boxes = elements.map((childNode, index) => {
      const box = document.createElement('animated-box');
      box.setAttribute(animatedBoxAttributes.ATTR_INDEX, `${index}`);
      box.setAttribute(animatedBoxAttributes.ATTR_BOXCOUNT, `${elements.length}`);
      box.setAttribute(animatedBoxAttributes.ATTR_MODE, this.mode);
      box.appendChild(childNode);
      return box;
    });

    this.$squareContainer.textContent = ''; // Quick way to remove all children of an element
    this.$squareContainer.append(...this.$boxes);
  }

  get mode() {
    return this.getAttribute(ATTR_MODE);
  }
}

window.customElements.define('grid-panel', GridPanel);
