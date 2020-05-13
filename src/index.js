import { commonStyle } from 'src/common-style';
import * as animatedBoxAttributes from 'src/components/AnimatedBox';
import { template } from 'src/tags/html';

import 'src/components/AnimatedBox';
import 'src/components/SquareContainer';

const ATTR_MODE = "mode";

// TODO
// 1. Extract THIS container component from index file, and set child elements from outside.
// 2. Add side panel for displaying selected item.
// 3. Connect to some useful content ... Pinterest?

const createTemplate = template`
  <style>
    :host {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    ${commonStyle}
    
    .wrapper {
      display: flex;
      justify-content: center;
      width: 80vw;
      height: 90vh;
    }
    
    square-container {
      max-width: 90vh;
    }
    
    .number {
      font-size: 48px;
    }
  </style>

  <div class="wrapper">
    <square-container></square-container>
  </div>
`;

class App extends HTMLElement {
  static get observedAttributes() {
    return [ ATTR_MODE ];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$squareContainer = this._shadowRoot.querySelector('square-container');
    this.$boxes = [];

    // TODO Input array of elements which each take a "mode" attribute ("grid", "list")
    this.childElements = new Array(8).fill(0).map((_, i) => {
      const span = document.createElement('span');
      span.innerHTML = `${i + 1}`;
      span.classList.add('number');
      return span;
    });
  }

  connectedCallback() {
    this.$boxes = this.childElements.map((childNode, index, elements) => {
      const box = document.createElement('animated-box');

      box.setAttribute(animatedBoxAttributes.ATTR_INDEX, `${index}`);
      box.setAttribute(animatedBoxAttributes.ATTR_BOX_COUNT, `${elements.length}`);
      box.appendChild(childNode);
      box.addEventListener('click', this.onBoxClick.bind(this));

      return box;
    });
    this.$squareContainer.append(...this.$boxes);

    this.mode = 'grid';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === ATTR_MODE && newValue !== oldValue) {
      console.log(`${ATTR_MODE}=${newValue}`);

      this.$boxes.forEach(box => {
        box.setAttribute(animatedBoxAttributes.ATTR_MODE, newValue);
      });
    }
  }

  get mode() {
    return this.getAttribute(ATTR_MODE);
  }
  set mode(value) {
    this.setAttribute(ATTR_MODE, value);
  }

  onBoxClick({ target }) {
    this.$boxes.forEach(boxNode => {
      if (this.mode === 'grid' && boxNode.contains(target)) {
        boxNode.setAttribute(animatedBoxAttributes.ATTR_SELECTED, '');
      } else {
        boxNode.removeAttribute(animatedBoxAttributes.ATTR_SELECTED);
      }
    });
    this.mode = (this.mode === 'grid' ? 'list' : 'grid');
  }
}

window.customElements.define('app-root', App);
