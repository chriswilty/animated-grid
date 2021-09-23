import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

// TODO Some styles such as border colour could be modified via attributes.
const createTemplate = template`
  <style>
    ${commonStyle}
    
    :host {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }
  </style>
  <div class="wrapper">
    <slot></slot>
  </div>
`;

class SquareContainer extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());
    this.$wrapper = this._shadowRoot.querySelector('.wrapper');
    this.resizeWrapper = this.resizeWrapper.bind(this);
  }

  connectedCallback() {
    this.resizeWrapper();
    addEventListener('resize', this.resizeWrapper);
  }

  disconnectedCallback() {
    removeEventListener('resize', this.resizeWrapper);
  }

  resizeWrapper() {
    // TODO
    //   Add attributes to allow height and/or width to be fixed at 100% instead of auto-adjusting.
    //   For now, only adjust width, keep height at 100%.
    //this.$wrapper.style.maxHeight = `${this.clientWidth}px`;
    this.$wrapper.style.maxWidth = `${this.clientHeight}px`;
  }
}

window.customElements.define('square-container', SquareContainer);
