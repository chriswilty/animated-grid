import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

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
      width: 100%;
      height: 100%;
      overflow: hidden;
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
    if (element === null) {
      this.$host.style.left = '100%';
    } else {
      this.$wrapper.firstChild && this.$wrapper.firstChild.remove();
      this.$wrapper.appendChild(element.cloneNode(true));
      this.$host.style.left = 'calc(100% / 3)';
    }
  }
}

window.customElements.define('view-panel', ViewPanel);
