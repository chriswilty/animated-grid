import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

import 'src/components/SquareBox';

const ATTR_MODE = "mode";

// TODO
// 1. Instead of hard-coding box divs, calculate required number according to number of child elements set.
// 2. Extract box to separate component.
const numberOfSquares = numNodes => {
  let side = 1;
  while (numNodes > Math.pow(side, 2)) {
    side += 1;
  }
  return Math.pow(side, 2);
};

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
    
    square-box {
      max-width: 90vh;
    }
    
    .box {
      margin: 1px;
      border: 2px solid forestgreen;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      font-size: 64px;
    }
    .box.grid {
      width: calc(100% / 3 - 2px);
      height: calc(100% / 3 - 2px);
    }
    .box.list {
      width: calc(100% - 2px);
      height: calc(100% / 9 - 2px);
    }
  </style>

  <div class="wrapper">
    <square-box>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
    </square-box>
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

    this.$boxes = this._shadowRoot.querySelectorAll('.box');

    // array of elements which each take a "mode" attribute ("grid", "list")
    this.childElements = new Array(9).fill(0).map((_, i) => i + 1);
  }

  connectedCallback() {
    this.mode = 'grid';
    this.$boxes.forEach((node, index) => {
      node.innerHTML = `${this.childElements[index]}`;
      node.addEventListener('click', () => {
        this.mode = (this.mode === 'grid' ? 'list' : 'grid');
      });
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === ATTR_MODE && newValue !== oldValue) {
      console.log(`${ATTR_MODE}=${newValue}`);
      this.$boxes.forEach(box => {
        oldValue && box.classList.remove(oldValue);
        box.classList.add(newValue);
      });
    }
  }

  get mode() {
    return this.getAttribute(ATTR_MODE);
  }
  set mode(value) {
    this.setAttribute(ATTR_MODE, value);
  }
}

window.customElements.define('app-root', App);
