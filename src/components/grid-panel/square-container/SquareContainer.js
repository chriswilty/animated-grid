import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

// TODO Some styles such as border colour should be settable as attributes.
const createTemplate = template`
  <style>
    ${commonStyle}
    
    :host {
      width: 100%;
      height: 100%;
      display: flex;
    }
    .wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .square {
      width: 100%;
      height: calc(100% + 2px);
      margin: -1px 0;
    }
  </style>
  <div class="wrapper">
    <div class="square">
      <slot></slot>
    </div>
  </div>
`;

class SquareContainer extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());
  }
}

window.customElements.define('square-container', SquareContainer);
