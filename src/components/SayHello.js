import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

export const ATTR_NAME = 'name';

const createTemplate = template`
  <style>
    ${commonStyle}
    
    .greeting {
      font-size: 1.5rem;
      font-weight: 600;
    }
  </style>
  <div class="greeting">
    &ldquo;Well, hello <span></span>!&rdquo;
  </div>
`;

class SayHello extends HTMLElement {
  static get observedAttributes() {
    return [ATTR_NAME];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$greeting = this._shadowRoot.querySelector('.greeting');
    this.$nameSpan = this._shadowRoot.querySelector('span');
  }

  attributeChangedCallback(_name, oldValue, newValue) {
    if (newValue !== oldValue) {
      if (newValue && newValue.trim()) {
        this.$nameSpan.textContent = newValue;
        this.$greeting.removeAttribute('hidden');
      } else {
        this.$nameSpan.textContent = '';
        this.$greeting.setAttribute('hidden', '')
      }

    }
  }
}

window.customElements.define('say-hello', SayHello);
