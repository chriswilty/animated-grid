import { commonStyle, spacing, timing } from 'src/common-style';
import { getPage } from 'src/service/pexel';
import { template } from 'src/tags/html';

import 'src/components/grid-panel';
import 'src/components/grid-panel/photo-box';
import 'src/components/loading';
import 'src/components/view-panel';

import PexelImage from 'src/assets/pexels.png';

const createTemplate = template`
  <style>
    ${commonStyle}
    
    :host {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: ${spacing.xl};
      display: flex;
      overflow: hidden;
    }
    grid-panel {
      padding: 0;
      flex: 0 0 auto;
      transition: width ${timing.default}, padding-right ${timing.default};
    }
    grid-panel.groups {
      width: 100%;
    }
    grid-panel.groups.side {
      width: 25%;
      padding-right: ${spacing.xl};
    }
    grid-panel.groups.hide {
      width: 0;
      padding-right: 0;
    }
    grid-panel.photos {
      width: 75%;
    }
    grid-panel.photos.side {
      width: 25%;
      padding-right: ${spacing.xl};
    }
    grid-panel.photos.hide {
      width: 0;
      padding-right: 0;
    }
    grid-panel.hide {
      overflow: hidden;
    }
    view-panel {
      width: 75%;
      padding: 0;
      flex: 0 0 auto;
      transition: width ${timing.default};
    }
    view-panel.hide {
      width: 0;
    }
  </style>

  <grid-panel class="groups" mode="grid"></grid-panel>
  <grid-panel class="photos hide" mode="grid"></grid-panel>
  <view-panel class="hide"></view-panel>
`;

const createPhotoContainer = ({ name, photo, onClick }) => {
  const photoBox = document.createElement('photo-box');

  photoBox.setAttribute('url', photo.url.original);
  photoBox.setAttribute('link', photo.url.author);
  name && photoBox.setAttribute('name', name);

  photoBox.addEventListener('click', onClick);

  return photoBox;
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
    this._colours = ['red', 'yellow', 'green', 'blue'];

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
    this._groupElements.forEach(element => element.removeEventListener('click', this.onSelectGroup));

    Object.keys(this._photoElements).forEach(key =>
      this._photoElements[key].forEach(element => element.removeEventListener('click', this.onSelectPhoto))
    );

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
      this.$gridPanelGroups.classList.add('hide');
      this.$gridPanelPhotos.classList.add('side');
      this.$viewPanel.classList.remove('hide');
    } else {
      this.$gridPanelPhotos.setAttribute('selectedindex', '-1');
      this.$gridPanelPhotos.setAttribute('mode', 'grid');
      this.$gridPanelGroups.classList.remove('hide');
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
