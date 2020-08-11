export const commonStyle = `
  :host {
    box-sizing: border-box;
    font-family: sans-serif;
    font-size: 16px;
  }
  :host * {
    box-sizing: border-box;
  }
  :host input {
    font-size: inherit;
  }`;

export const spacing = {
  xxs: '3px',
  xs: '6px',
  s: '9px',
  m: '12px',
  l: '15px',
  xl: '18px',
  xxl: '24px'
};

export const timing = {
  default: '0.6s',
  fadeInOut: '0.15s'
};
