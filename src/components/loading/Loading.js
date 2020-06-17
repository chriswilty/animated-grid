import { commonStyle } from 'src/common-style';
import { template } from 'src/tags/html';

const createTemplate = template`
  <style>
    ${commonStyle}
    
    :host {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .wrapper {
      position: relative;
    }
    .loading {
      display: inline-block;
      width: 200px;
      height: 200px;
      background: center/cover no-repeat;
    }
    .mask {
      position: absolute;
      width: 100%;
      height: 0;
      border-radius: calc(100% / 8);
      padding-left: 100%;
      padding-bottom: 100%;
      overflow: hidden;
      background-color: #ff9900;
    }
    .mask:after {
      content: "";
      display: block;
      width: 0;
      height: 0;
      margin-left: -232px;
      margin-top: -32px;
      border: 132px solid rgba(0, 0, 0, 0.75);
      border-top-color: transparent;
      animation: spin 2.0s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg) }
      100% { transform: rotate(360deg) }
    }
  </style>
  
  <div class="wrapper">
    <div class="mask"></div>
    <div class="loading"></div>
  </div>
`;

class Loading extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$loading = this._shadowRoot.querySelector('.loading');
    this.$mask = this._shadowRoot.querySelector('.mask');
  }

  set image(imageFile) {
    this.$loading.style.backgroundImage = `url(${imageFile})`;
    this.$mask.style.backgroundColor = 'transparent';
  }
}

window.customElements.define('loading-spinner', Loading);
