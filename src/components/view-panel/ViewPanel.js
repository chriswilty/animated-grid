import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

const DEFAULT_TRANSITION_SECS = 0.8;

const createTemplate = template`
  <style>
    ${commonStyle}
    
    :host {
      position: absolute;
      left: 100%;
      top: 0;
      bottom: 0;
      width: 60%;
      display: flex;
      transition: left ${DEFAULT_TRANSITION_SECS}s;
    }
    .wrapper {
      width: 100%;
      height: 100%;
      border: 2px solid #cfcfcf;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
  
  <div class="wrapper"></div>
`;

class ViewPanel extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$host = this._shadowRoot.host;
    this.$wrapper = this._shadowRoot.querySelector('.wrapper');
  }

  set contentElement(element) {
    console.log(element);
    if (element === null) {
      this.$host.style.left = '100%';
    } else {
      this.$wrapper.firstChild && this.$wrapper.firstChild.remove();
      this.$wrapper.appendChild(element.cloneNode(true));
      this.$host.style.left = '40%';
    }
  }
}

window.customElements.define('view-panel', ViewPanel);
