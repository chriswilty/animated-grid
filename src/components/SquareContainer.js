import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

// TODO Some styles such as border colour should be settable as attributes.
const createTemplate = template`
  <style>
    :host {
      width: 100%;
      height: 100%;
      display: flex;
      overflow: hidden;
    }
    
    ${commonStyle}
    
    .wrapper {
      position: relative;
      width: 100%;
      margin: auto;
      padding-bottom: 100%;
    }
    .square {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      border: 2px solid #cfcfcf;
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
