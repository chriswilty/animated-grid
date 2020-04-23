import { commonStyle } from 'src/common-style';
import 'src/components/SayHello';
import * as sayHelloAttributes from 'src/components/SayHello';
import { template } from 'src/tags/html';

const createTemplate = template`
  <style>
    ${commonStyle}
    
    input {
      display: block;
      margin: 4px 0 16px;
      border: 2px solid #3399ff;
      padding: 8px 12px;
      font-size: inherit;
    }
    .wrapper {
      padding: 0 8px
    }
  </style>

  <div>
    <h1>WebComponents template</h1>
    <div class="wrapper">
      <p>In time-honoured fashion ....</p>
      <label>
        What's your name, son?
        <input type="text" />
      </label>
      <say-hello></say-hello>
    </div>
  </div>
`;

class App extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$input = this._shadowRoot.querySelector('input');
    const $sayHello = this._shadowRoot.querySelector('say-hello');
    $sayHello.setAttribute(sayHelloAttributes.ATTR_NAME, "");

    this.$input.addEventListener('input', ({ target: { value } }) => {
      $sayHello.setAttribute(sayHelloAttributes.ATTR_NAME, value);
    });
  }

  connectedCallback() {
    this.$input.focus();
  }
}

window.customElements.define('app-root', App);
