import { commonStyle, spacing, timing } from 'src/common-style';
import { getPage } from 'src/service/pexel';
import { template } from 'src/tags/html';

import 'src/components/grid-panel';
import 'src/components/loading';
import 'src/components/photo-box';
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
    grid-panel.collections {
      width: 100%;
    }
    grid-panel.collections.side {
      width: 25%;
      padding-right: ${spacing.xl};
    }
    grid-panel.collections.hide {
      width: 0;
      padding-right: 0;
    }
    grid-panel.categories {
      width: 75%;
    }
    grid-panel.categories.side {
      width: 25%;
      padding-right: ${spacing.xl};
    }
    grid-panel.categories.hide {
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
  
  <grid-panel class="collections" mode="grid"></grid-panel>
  <grid-panel class="categories hide" mode="grid"></grid-panel>
  <grid-panel class="photos hide" mode="grid"></grid-panel>
  <view-panel class="hide"></view-panel>
`;

const createPhotoContainer = ({ name, url, credit, onClick }) => {
  const photoBox = document.createElement('photo-box');

  photoBox.setAttribute('url', url);
  name && photoBox.setAttribute('name', name);
  credit && photoBox.setAttribute('crediturl', credit.url);
  credit && photoBox.setAttribute('creditname', credit.name);
  credit && photoBox.setAttribute('showcredit', '');
  photoBox.addEventListener('click', onClick);

  return photoBox;
};

class App extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(createTemplate());

    this.$gridPanelCollections = this._shadowRoot.querySelector('grid-panel.collections');
    this.$gridPanelCategories = this._shadowRoot.querySelector('grid-panel.categories');
    this.$gridPanelPhotos = this._shadowRoot.querySelector('grid-panel.photos');
    this.$viewPanel = this._shadowRoot.querySelector('view-panel');

    this.onSelectCollection = this.onSelectCollection.bind(this);
    this.onSelectCategory = this.onSelectCategory.bind(this);
    this.onSelectPhoto = this.onSelectPhoto.bind(this);
    this.onClosePhoto = this.onClosePhoto.bind(this);

    // TODO Extract from localstorage, with default written to LS if not found?
    this._collections = {
      seasons: ['spring', 'summer', 'autumn', 'winter'],
      colours: ['red', 'yellow', 'green', 'blue'],
      animals: ['cat', 'tiger', 'cheetah', 'dog', 'fox', 'wolf', 'cow', 'wildebeest', 'buffalo'],
      structures: ['bridge', 'building', 'staircase', 'tower']
    };

    this._loadingSpinner = null;
    this._collectionElements = [];
    this._categoryElements = {};
    this._photoElements = {};
  }

  connectedCallback() {
    this._loadingSpinner = document.createElement('loading-spinner');
    this._loadingSpinner.image = PexelImage;

    this._loadCollections();
  }

  disconnectedCallback() {
    this._collectionElements.forEach(element => element.removeEventListener('click', this.onSelectCollection))

    Object.keys(this._categoryElements).forEach(key =>
        this._categoryElements[key].forEach(element => element.removeEventListener('click', this.onSelectCategory))
    );

    Object.keys(this._photoElements).forEach(key =>
        this._photoElements[key].forEach(element => element.removeEventListener('click', this.onSelectPhoto))
    );

    this.$viewPanel.removeEventListener('onClose', this.onClosePhoto);
  }

  async _loadCollections() {
    const onClick = this.onSelectCollection;

    this.$gridPanelCollections.contentElements = [this._loadingSpinner];
    this._collectionElements = await Promise.all(
        Object.entries(this._collections).map(async ([collection, [category]]) => {
          const { photos: [{ url }] } = await getPage({ searchTerm: category, pageSize: 1 });
          return createPhotoContainer({ name: collection, url: url.original, onClick });
        })
    );

    this.$gridPanelCollections.contentElements = this._collectionElements;
    // TODO Navigate back to collections view? Or not necessary?
  }

  async _loadCategories(collection) {
    const onClick = this.onSelectCategory;

    if (!this._categoryElements[collection]) {
      this.$gridPanelCategories.contentElements = [this._loadingSpinner];
      this._categoryElements[collection] = await Promise.all(
          this._collections[collection].map(async category => {
            const { photos: [{ url }] } = await getPage({ searchTerm: category, pageSize: 1 });
            return createPhotoContainer({ name: category, url: url.original, onClick });
          })
      );
    }

    this.$gridPanelCategories.contentElements = this._categoryElements[collection];
    this.$viewPanel.addEventListener('onClose', this.onClosePhoto);
  }

  async _loadPhotos(category) {
    const onClick = this.onSelectPhoto;

    if (!this._photoElements[category]) {
      this.$gridPanelPhotos.contentElements = [this._loadingSpinner];
      const { photos } = await getPage({ searchTerm: category, pageSize: 9 });
      this._photoElements[category] = photos.map(
          ({ url, credit }) => createPhotoContainer({ url: url.original, credit, onClick })
      );
    }

    this.$gridPanelPhotos.contentElements = this._photoElements[category];
  }

  onSelectCollection({ target }) {
    if (target) {
      const collectionIndex = this._collectionElements.findIndex(element => element.contains(target));
      const collectionName = this._collectionElements[collectionIndex].getAttribute('name');

      this.$gridPanelCollections.setAttribute('selectedindex', `${collectionIndex}`);
      this.$gridPanelCollections.setAttribute('mode', 'list');
      this.$gridPanelCollections.classList.add('side');
      this.$gridPanelCategories.classList.remove('hide');
      this._loadCategories(collectionName);
    } else {
      this.$gridPanelCollections.setAttribute('mode', 'grid');
      this.$gridPanelCollections.classList.remove('side');
      this.$gridPanelCategories.classList.add('hide');
    }
  }

  onSelectCategory({ target }) {
    if (target) {
      const collectionIndex = this.$gridPanelCollections.getAttribute('selectedindex');
      const collectionName = this._collectionElements[collectionIndex].getAttribute('name');
      const categoryIndex = this._categoryElements[collectionName].findIndex(element => element.contains(target));
      const categoryName = this._categoryElements[collectionName][categoryIndex].getAttribute('name');

      this.$gridPanelCategories.setAttribute('selectedindex', `${categoryIndex}`);
      this.$gridPanelCategories.setAttribute('mode', 'list');
      this.$gridPanelCollections.classList.add('hide');
      this.$gridPanelCategories.classList.add('side');
      this.$gridPanelPhotos.classList.remove('hide');
      this._loadPhotos(categoryName);
    } else {
      this.$gridPanelCollections.classList.remove('hide');
      this.$gridPanelCategories.setAttribute('mode', 'grid');
      this.$gridPanelCategories.classList.remove('side');
      this.$gridPanelPhotos.classList.add('hide');
    }
  }

  onSelectPhoto({ target }) {
    const collectionIndex = this.$gridPanelCollections.getAttribute('selectedindex');
    const collectionName = this._collectionElements[collectionIndex].getAttribute('name');
    const categoryIndex = this.$gridPanelCategories.getAttribute('selectedindex');
    const categoryName = this._categoryElements[collectionName][categoryIndex].getAttribute('name');

    if (target) {
      const photoIndex = this._photoElements[categoryName].findIndex(element => element.contains(target));

      this.$gridPanelPhotos.setAttribute('selectedindex', `${photoIndex}`);
      this.$gridPanelPhotos.setAttribute('mode', 'list');
      this.$gridPanelCategories.classList.add('hide');
      this.$gridPanelPhotos.classList.add('side');
      this._photoElements[categoryName].forEach(photoElement => photoElement.removeAttribute('showcredit'));

      this.$viewPanel.photo = {
        url: target.getAttribute('url'),
        creditUrl: target.getAttribute('crediturl')
      };
      this.$viewPanel.classList.remove('hide');
    } else {
      this.$gridPanelPhotos.setAttribute('selectedindex', '-1');
      this.$gridPanelPhotos.setAttribute('mode', 'grid');
      this.$gridPanelCategories.classList.remove('hide');
      this.$gridPanelPhotos.classList.remove('side');
      this._photoElements[categoryName].forEach(photoElement => photoElement.setAttribute('showcredit', ''));

      this.$viewPanel.classList.add('hide');
      this.$viewPanel.photo = {};
    }
  }

  onClosePhoto() {
    this.onSelectPhoto({ target: null });
  }
}

window.customElements.define('app-root', App);
