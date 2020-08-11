# Web Components demo: animated photo viewer

## Preamble

This is my pet project for learning about vanilla Web Components. There are several libraries and
almost-frameworks out there that attempt to make life easier when working with Web Components and
Custom Elements (e.g.
[LitElement](https://lit-element.polymer-project.org/),
[Hybrids](https://hybrids.js.org/)
) but I thought I'd start by learning the underlying technology, and then move on to Hybrids - which
looks awesome 😁

The idea was to create a photo viewer / inspiration finder with an animated grid of squares. The
grid component which morphs between grid and list mode is designed to be flexible enough to use in a
variety of projects; future work will extract it into a library project.

This project uses the wonderful [Pexels](https://www.pexels.com/) as a photo source.

#### Next steps

- Add a Categories grid, linking to the Groups grid, with some default categories.
- Load categories and groups from LocalStorage, saving defaults if not found.
- Ability to add group to existing category, and update LocalStorage.
- Ability to add category, and update LocalStorage.
- Popup asking for Pexels API key, maybe storing to LocalStorage ("Remember me" checkbox)
- Navigation through pages of photos (currently you get just one page of up to 9 photos).
- Add screenshots to this readme.
- Extract `<animated-grid>` custom element to library project.

## Installation

This project uses Yarn 2 in [Zero-Installs](https://yarnpkg.com/features/zero-installs) mode, so
there is no initial installation required aside from cloning or forking the repo;
just run `yarn start` to spin up the demo app.

## Run (developer mode)

* `yarn start`
* visit `http://localhost:8080`

## Build and Run (production mode)

* `yarn build`
* `yarn dlx serve dist`
* visit `http://localhost:5000`
