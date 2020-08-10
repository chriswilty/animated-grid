import { commonStyle } from 'src/common-style';
import { getPage } from 'src/service/pexel';
import { template } from 'src/tags/html';

import 'src/components/grid-panel';
import 'src/components/loading';
import 'src/components/view-panel';

import PexelImage from 'src/assets/pexels.png';

const DEFAULT_TRANSITION_SECS = 0.8;
const SPACING_XXS = 3;
const SPACING_XS = 6;
const SPACING_XL = 18;

const createTemplate = template`
  <style>
    ${commonStyle}
    
    :host {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: ${SPACING_XL}px;
      display: flex;
      overflow: hidden;
    }
    grid-panel.groups {
      width: 100%;
      padding: 0;
      flex: 1 0 auto;
      transition: width ${DEFAULT_TRANSITION_SECS}s;
    }
    grid-panel.groups.side {
      width: 25%;
    }
    grid-panel.groups.hide {
      width: 0;
    }
    grid-panel.photos {
      width: 75%;
      padding: 0;
      flex: 1 0 auto;
      transition: width ${DEFAULT_TRANSITION_SECS}s, padding-left ${DEFAULT_TRANSITION_SECS}s;
    }
    grid-panel.photos.side {
      width: 25%;
      padding-left: ${SPACING_XL}px;
    }
    grid-panel.photos.hide {
      width: 0;
    }
    view-panel {
      width: 75%;
      padding: 0 0 0 ${SPACING_XL}px;
      flex: 1 1 auto;
      transition: padding-left ${DEFAULT_TRANSITION_SECS}s;
    }
    view-panel.hide {
      padding-left: 0;
    }
    .photo {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .photo .label {
      display: inline-block;
      border: 2px solid #cfcfcf;
      border-radius: 6px;
      padding: ${SPACING_XXS}px ${SPACING_XS}px;
      background-color: dimgrey;
      color: #cfcfcf;
      opacity: 0.85;
      font-size: 150%;
    }
  </style>

  <grid-panel class="groups" mode="grid"></grid-panel>
  <grid-panel class="photos hide" mode="grid"></grid-panel>
  <view-panel class="hide"></view-panel>
`;

// TODO Extract this to a separate component!
const createPhotoContainer = ({ name, photo, onClick }) => {
  const container = document.createElement('div');
  container.setAttribute('name', name);
  container.style.background = `url(${photo.url.original}) center/cover no-repeat`;
  // Class not working cos it's in the wrong shadow dom! Hence the need to extract this component.
  container.classList.add('photo');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.addEventListener('click', onClick);

  if (name) {
    const label = document.createElement('div');
    label.classList.add('label');
    label.style.display = 'inline-block';
    label.style.border = '2px solid #cfcfcf';
    label.style.borderRadius = '6px';
    label.style.padding = `${SPACING_XXS}px ${SPACING_XS}px`;
    label.style.backgroundColor = 'dimgrey';
    label.style.color = '#cfcfcf';
    label.style.opacity = '0.85';
    label.style.fontSize = '125%';
    label.appendChild(document.createTextNode(name));
    container.appendChild(label);
  }

  return container;
};

class App extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$gridPanelGroups = this._shadowRoot.querySelector('grid-panel.groups');
    this.$gridPanelPhotos = this._shadowRoot.querySelector('grid-panel.photos');
    this.$viewPanel = this._shadowRoot.querySelector('view-panel');

    this.onSelectGroup = this.onSelectGroup.bind(this);
    this.onSelectPhoto = this.onSelectPhoto.bind(this);
    this.onClosePhoto = this.onClosePhoto.bind(this);

    // TODO Extract from localstorage, with default written to LS if not found?
    this._colours = ['red', 'orange', 'green', 'blue'];

    this._loadingSpinner = null;
    this._groupElements = [];
    this._photoElements = {};
  }

  connectedCallback() {
    this._loadingSpinner = document.createElement('loading-spinner');
    this._loadingSpinner.image = PexelImage;

    this._loadGroups();
  }

  disconnectedCallback() {
    this.$viewPanel.removeEventListener('onClose', this.onClosePhoto);
  }

  async _loadGroups() {
    const onClick = this.onSelectGroup;

    this.$gridPanelGroups.contentElements = [this._loadingSpinner];
    this._groupElements = await Promise.all(
      this._colours.map(async name => {
        const { photos } = await getPage({ searchTerm: name, pageSize: 1 });
        return createPhotoContainer({ name, photo: photos[0], onClick });
      })
    );

    this.$gridPanelGroups.contentElements = this._groupElements;
    this.$viewPanel.addEventListener('onClose', this.onClosePhoto);

    // TODO Close icon and onClose handler for groups panel?

    // TODO Load photos for all groups in background, or wait for click?

  }


  async _loadPhotos(searchTerm) {
    const onClick = this.onSelectPhoto;

    if (!this._photoElements[searchTerm]) {
      this.$gridPanelPhotos.contentElements = [this._loadingSpinner];
      const { photos } = await getPage({ searchTerm, pageSize: 9 });
      this._photoElements[searchTerm] = photos.map(photo => createPhotoContainer({ photo, onClick }));
    }

    this.$gridPanelPhotos.contentElements = this._photoElements[searchTerm];
  }

  onSelectGroup({ target }) {
    const selectedIndex = target ? this._groupElements.findIndex(element => element.contains(target)) : -1;
    this.$gridPanelGroups.setAttribute('selectedindex', `${selectedIndex}`);

    if (selectedIndex >= 0) {
      this.$gridPanelGroups.setAttribute('mode', 'list');
      this.$gridPanelGroups.classList.add('side');
      this.$gridPanelPhotos.classList.remove('hide');
      this._loadPhotos(this._groupElements[selectedIndex].getAttribute('name'));
    } else {
      this.$gridPanelGroups.setAttribute('mode', 'grid');
      this.$gridPanelGroups.classList.remove('side');
      this.$gridPanelPhotos.classList.add('hide');
    }
  }

  onSelectPhoto({ target }) {
    let selectedIndex;

    if (target) {
      const groupIndex = this.$gridPanelGroups.getAttribute('selectedindex');
      const groupName = this._groupElements[groupIndex].getAttribute('name')
      selectedIndex = this._photoElements[groupName].findIndex(element => element === target)

      this.$gridPanelPhotos.setAttribute('selectedindex', `${selectedIndex}`);
      this.$gridPanelPhotos.setAttribute('mode', 'list');
      this.$gridPanelPhotos.classList.add('side');
      this.$viewPanel.classList.remove('hide');
    } else {
      this.$gridPanelPhotos.setAttribute('selectedindex', '-1');
      this.$gridPanelPhotos.setAttribute('mode', 'grid');
      this.$gridPanelPhotos.classList.remove('side');
      this.$viewPanel.classList.add('hide');
    }
    this.$viewPanel.contentElement = target;
  }

  onClosePhoto() {
    this.onSelectPhoto({ target: null });
  }
}

window.customElements.define('app-root', App);
