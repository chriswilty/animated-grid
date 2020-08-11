import { commonStyle, spacing, timing } from 'src/common-style';
import { template } from 'src/tags/html';

const ATTR_URL = 'url';
const ATTR_NAME = 'name';
const ATTR_LINK = 'link';
const ATTR_SHOWLINK = 'showlink';

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
    .link {
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
    .link:hover {
      border-color: #efefef;
      color: #efefef;
      opacity: 0.8;
    }
    .link.show {
      display: inline-block;
    }
  </style>
  <div class="photo">
    <div class="label"></div>
    <a class="link" target="_blank"></a>
  </div>
`;


class PhotoBox extends HTMLElement {
  static get observedAttributes() {
    return [ATTR_URL, ATTR_NAME, ATTR_LINK, ATTR_SHOWLINK];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$photo = this._shadowRoot.querySelector('.photo');
    this.$label = this._shadowRoot.querySelector('.label');
    this.$link = this._shadowRoot.querySelector('.link');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue !== oldValue) {
      if (name === ATTR_URL) {
        this.$photo.style.background = `url(${newValue}) center/cover no-repeat`;
      } else if (name === ATTR_NAME) {
        this.$label.textContent = newValue;
        this.$label.classList[newValue ? 'add' : 'remove']('show');
      } else if (name === ATTR_LINK) {
        this.$link.textContent = newValue;
        this.$link.setAttribute('href', newValue || '#');
      } else if (name === ATTR_SHOWLINK) {
        this.$link.classList[newValue === null ? 'remove' : 'add']('show');
      }
    }
  }
}

window.customElements.define('photo-box', PhotoBox);
