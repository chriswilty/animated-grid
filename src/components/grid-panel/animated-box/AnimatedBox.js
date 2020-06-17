import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

export const ATTR_INDEX = 'index';
export const ATTR_BOXCOUNT = 'boxcount';
export const ATTR_MODE = 'mode';
export const ATTR_SELECTED = 'selected';
export const ATTR_TRANSITION = 'transition';
const DEFAULT_TRANSITION_SECS = 0.8;

const calculateGridLength = numNodes => {
  let side = 1;
  while (numNodes > Math.pow(side, 2)) {
    side += 1;
  }
  return side;
};

const createTemplate = template`
  <style>
    ${commonStyle}
    
    .box {
      position: absolute;
      overflow: hidden;
      margin: 0;
      border: 2px solid #cfcfcf;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      transition: width ${DEFAULT_TRANSITION_SECS}s, height ${DEFAULT_TRANSITION_SECS}s, left ${DEFAULT_TRANSITION_SECS}s, top ${DEFAULT_TRANSITION_SECS}s;
    }
    .box.selected {
      border-color: #ff9900;
    }
  </style>
  <div class="box">
    <slot></slot>
  </div>
`;

class AnimatedBox extends HTMLElement {
  static get observedAttributes() {
    return [ATTR_INDEX, ATTR_BOXCOUNT, ATTR_MODE, ATTR_SELECTED, ATTR_TRANSITION];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());
    this.$box = this._shadowRoot.querySelector('.box');

    this._gridLength = 0;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === ATTR_SELECTED && newValue !== oldValue) {
      const func = newValue !== null ? 'add' : 'remove';
      this.$box.classList[func]('selected');
    } else if (name === ATTR_TRANSITION && newValue !== oldValue) {
      const secs = newValue || DEFAULT_TRANSITION_SECS;
      this.$box.style.transition = `width ${secs}s, height ${secs}s, left ${secs}s, top ${secs}s`;
    } else {
      if (name === ATTR_BOXCOUNT && newValue !== oldValue) {
        this._gridLength = calculateGridLength(newValue);
      }
      if (newValue !== oldValue) {
        this.setNewPosition();
      }
    }
  }

  setNewPosition() {
    const mode = this.getAttribute(ATTR_MODE);
    const index = this.getAttribute(ATTR_INDEX);
    const boxCount = this.getAttribute(ATTR_BOXCOUNT);

    if (boxCount && mode && index !== undefined) {
      let topLength, sideLength;
      if (mode === 'grid') {
        topLength = this._gridLength;
        sideLength = topLength;
      } else {
        topLength = 1;
        sideLength = boxCount;
      }

      const row = Math.floor(index / topLength);
      const col = index % topLength;
      this.$box.style.width = `calc(100% / ${topLength} - 2px)`;
      this.$box.style.height = `calc(100% / ${sideLength} - 2px)`;
      this.$box.style.top = `calc(100% / ${sideLength} * ${row} + 1px)`;
      this.$box.style.left = `calc(100% / ${topLength} * ${col} + 1px)`;
    }
  }
}

window.customElements.define('animated-box', AnimatedBox);
