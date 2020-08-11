import { commonStyle, timing } from 'src/common-style';
import { template } from 'src/tags/html';

const createTemplate = template`
  <style>
    ${commonStyle}
    
    :host {
      position: relative;
      display: flex;
    }
    .wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: 2px solid #cfcfcf;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close {
      position: absolute;
      top: 6px;
      right: 6px;
      z-index: 100;
      width: 36px;
      height: 36px;
      border: 2px solid rgba(207, 207, 207, 0.6);
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(105, 105, 105, 0.6);
      opacity: 0;
      cursor: pointer;
      transition:
        border-color ${timing.fadeInOut} ease,
        background-color ${timing.fadeInOut} ease,
        opacity ${timing.default} cubic-bezier(0.3, 1.0, 0.3, 1.0);
    }
    .close.show {
      opacity: 1;
      transition-timing-function: ease, ease, cubic-bezier(0.9, 0.1, 0.5, 0.5);
    }
    .close span {
      font-size: 24px;
      font-weight: bold;
      color: rgba(207, 207, 207, 0.6);
      transition: color ${timing.fadeInOut};
    }
    .close:hover {
      border-color: rgba(239, 239, 239, 0.8);
      background-color: rgba(105, 105, 105, 0.8);
    }
    .close:hover span {
      color: rgba(239, 239, 239, 0.8);
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
      this.$close.classList.remove('show');
    } else {
      const contentEl = element.cloneNode(true);
      contentEl.setAttribute('showlink', '');
      this.$wrapper.lastChild && this.$wrapper.lastChild.remove();
      this.$wrapper.appendChild(contentEl);
      this.$close.classList.add('show');
    }
  }
}

window.customElements.define('view-panel', ViewPanel);
