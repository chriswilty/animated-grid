import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

const BUTTON_FADE_SECS = 0.15;

const createTemplate = template`
  <style>
    ${commonStyle}
    
    :host {
      position: absolute;
      left: 100%;
      top: 0;
      bottom: 0;
      width: calc(100% * 2 / 3);
      display: flex;
    }
    .wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: 2px solid #cfcfcf;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 48px;
      height: 48px;
      border: 2px solid #cfcfcf;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: white;
      cursor: pointer;
      transition: border-color ${BUTTON_FADE_SECS}s;
    }
    .close span {
      font-size: 42px;
      font-weight: bold;
      color: #cfcfcf;
      transition: color ${BUTTON_FADE_SECS}s;
    }
    .close:hover {
      border-color: #9f9f9f;
    }
    .close:hover span {
      color: #6f6f6f;
    }
  </style>
  
  <div class="wrapper">
    <div class="close"><span>X</span></div>
  </div>
`;

class ViewPanel extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$host = this._shadowRoot.host;
    this.$wrapper = this._shadowRoot.querySelector('.wrapper');
    this.$close = this._shadowRoot.querySelector('.close');
  }

  connectedCallback() {
    this.$close.addEventListener('click', () => this.dispatchEvent(new CustomEvent('onClose')));
  }

  set contentElement(element) {
    if (element === null) {
      this.$host.style.left = '100%';
    } else {
      this.$wrapper.lastChild && this.$wrapper.lastChild.remove();
      this.$wrapper.appendChild(element.cloneNode(true));
      this.$host.style.left = 'calc(100% / 3)';
    }
  }
}

window.customElements.define('view-panel', ViewPanel);
