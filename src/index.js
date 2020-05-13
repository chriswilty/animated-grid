import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

import 'src/components/SquareBox';

const ATTR_MODE = "mode";
const TRANSITION_SECS = 1.0;

// TODO
// 1. Light refactoring.
// 2. Extract box to separate component.
// 3. Extract THIS component from index file, and set child elements from outside.

const lengthOfSquare = numNodes => {
  let side = 1;
  while (numNodes > Math.pow(side, 2)) {
    side += 1;
  }
  return side;
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
      border: 2px solid #cfcfcf;
    }
    
    .box {
      position: absolute;
      margin: 0;
      border: 2px solid #cfcfcf;
      border-radius: 8px;
      padding: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      transition: width ${TRANSITION_SECS}s, height ${TRANSITION_SECS}s, left ${TRANSITION_SECS}s, top ${TRANSITION_SECS}s;
    }
    .box.selected {
      border-color: #3f9f3f;
    }
    .number {
      font-size: 48px;
    }
  </style>

  <div class="wrapper">
    <square-box>
      
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

    this.$squareBox = this._shadowRoot.querySelector('square-box');
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
    this.$boxes = this.childElements.map(childNode => {
      const box = document.createElement('div');

      box.appendChild(childNode);
      box.classList.add('box');
      box.addEventListener('click', this.onBoxClick.bind(this));

      return box;
    });
    this.$squareBox.append(...this.$boxes);

    this.mode = 'grid';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === ATTR_MODE && newValue !== oldValue) {
      console.log(`${ATTR_MODE}=${newValue}`);

      let topLength, sideLength;
      if (newValue === 'grid') {
        topLength = lengthOfSquare(this.$boxes.length);
        sideLength = topLength;
      } else {
        topLength = 1;
        sideLength = this.$boxes.length;
      }

      this.$boxes.forEach((box, index) => {
        const row = Math.floor(index / topLength);
        const col = index % topLength;
        box.style.width = `calc(100% / ${topLength} - 2px)`;
        box.style.height = `calc(100% / ${sideLength} - 2px)`;
        box.style.top = `calc(100% / ${sideLength} * ${row} + 1px)`;
        box.style.left = `calc(100% / ${topLength} * ${col} + 1px)`;
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
      const func = this.mode === 'grid' && boxNode === target ? 'add' : 'remove';
      boxNode.classList[func]('selected');
    });
    this.mode = (this.mode === 'grid' ? 'list' : 'grid');
  }
}

window.customElements.define('app-root', App);
