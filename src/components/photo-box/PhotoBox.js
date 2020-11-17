import { commonStyle, spacing, timing } from 'src/common-style';
import { template } from 'src/tags/html';

const ATTR_URL = 'url';
const ATTR_NAME = 'name';
const ATTR_CREDIT_URL = 'crediturl';
const ATTR_CREDIT_NAME = 'creditname';
const ATTR_SHOW_CREDIT = 'showcredit';

const createTemplate = template`
  <style>
    ${commonStyle}
    
    :host {
      width: 100%;
      height: 100%;
    }
    
    .photo {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .label {
      display: none;
      border: 2px solid #cfcfcf;
      border-radius: 6px;
      padding: ${spacing.xxs} ${spacing.xs};
      background-color: dimgrey;
      color: #cfcfcf;
      opacity: 0.85;
      font-size: 150%;
    }
    .label.show {
      display: inline-block;
    }
    .credit {
      display: none;
      position: absolute;
      bottom: ${spacing.xs};
      left: auto;
      right: auto;
      border: 1px solid #cfcfcf;
      border-radius: 6px;
      padding: ${spacing.xxs} ${spacing.xs};
      background-color: dimgrey;
      color: #cfcfcf;
      opacity: 0.5;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      transition: border-color ${timing.fadeInOut}, color ${timing.fadeInOut}, opacity ${timing.fadeInOut};
    }
    .credit:hover {
      border-color: #efefef;
      color: #efefef;
      opacity: 0.8;
    }
    .credit.show {
      display: inline-block;
    }
  </style>
  <div class="photo">
    <div class="label"></div>
    <a class="credit" target="_blank"></a>
  </div>
`;


class PhotoBox extends HTMLElement {
  static get observedAttributes() {
    return [ATTR_URL, ATTR_NAME, ATTR_CREDIT_URL, ATTR_CREDIT_NAME, ATTR_SHOW_CREDIT];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$photo = this._shadowRoot.querySelector('.photo');
    this.$label = this._shadowRoot.querySelector('.label');
    this.$credit = this._shadowRoot.querySelector('.credit');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue !== oldValue) {
      if (name === ATTR_URL && newValue) {
        this.$photo.style.background = `url(${newValue}) center/cover no-repeat`;
      } else if (name === ATTR_NAME) {
        this.$label.textContent = newValue;
        this.$label.classList.add('show');
      } else if (name === ATTR_CREDIT_URL) {
        this.$credit.setAttribute('href', newValue || '');
      } else if (name === ATTR_CREDIT_NAME) {
        this.$credit.textContent = newValue;
      } else if (name === ATTR_SHOW_CREDIT) {
        this.$credit.classList[newValue === null ? 'remove' : 'add']('show');
      }
    }
  }
}

window.customElements.define('photo-box', PhotoBox);
