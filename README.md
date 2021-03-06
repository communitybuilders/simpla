<p align="center">
  <a href="https://www.simpla.io">
    <img src="https://cdn.simpla.io/img/logo/logo-wordmark.png" alt="Simpla" width="300">
  </a> 
</p>

<p align="center">
  <a href="https://travis-ci.org/simplaio/simpla"><img src="https://travis-ci.org/simplaio/simpla.svg?branch=master" alt="Test status"></a>
  <img src="http://img.badgesize.io/https://unpkg.com/simpla?compression=gzip&label=size%20(gzip)" alt="Size (gzip)">
  <a href="https://www.npmjs.com/package/simpla"><img src="https://img.shields.io/npm/v/simpla.svg" alt="NPM version"></a>
  <a href="https://slack.simpla.io"><img src="http://slack.simpla.io/badge.svg" alt="Slack"></a>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome"> 
</p>
 
Simpla is a modular, open content framework for frontend developers. It's built on top of [Web Components](https://webcomponents.org), and powered by a JSON API. It integrates with any frontend stack. Use it to assemble your own modern CMS.

```html
<!-- Block of editable richtext -->
<simpla-text path="/text"></simpla-text>

<!-- An editable image -->
<img is="simpla-img" path="/img">

<!-- Dynamic collection -->
<simpla-collection path="/gallery" as="photo">
  <template>
    <img is="simpla-img" path="/gallery/[photo]/img">
    <simpla-text path="/gallery/[photo]/caption"></simpla-text>
  </template>
</simpla-collection>
```

<p align="center">
  <img src="https://cdn.simpla.io/img/laptop-demo.gif" width="600" alt="Demo of Simpla">
</p>

## Installation

Simpla is available on NPM and the Unpkg CDN as `simpla`. Setup a project on [simpla.io](https://www.simpla.io), then include the library and a polyfill for Web Components on your page. Initialize your project by calling `Simpla.init()`.

```html
<!-- Include Simpla and cross-browser polyfill, then init project -->
<script src="https://unpkg.com/webcomponents.js@^0.7.24/webcomponents-lite.min.js" async></script>
<script src="https://unpkg.com/simpla@^2.0.0"></script>
<script>
  // TODO: Replace 'project-id' with your Project ID
  Simpla.init('project-id');
</script>
```

You can also import Simpla as a UMD module:

```js
import Simpla from 'simpla';

window.Simpla = Simpla;
Simpla.init('project-id');
```

Install and add elements to your page with Bower (Yarn support coming soon) and HTML imports. You can find elements in the [elements catalogue](https://www.simpla.io/elements). 

```sh
$ bower install simpla-text simpla-img simpla-paths simpla-admin --save
```

```html
<link rel="import" href="/bower_components/simpla-text/simpla-text.html">
<link rel="import" href="/bower_components/simpla-img/simpla-img.html">
<link rel="import" href="/bower_components/simpla-admin/simpla-admin.html" async>
```

**[See full documentation & API references](https://www.simpla.io/docs)**

## Questions

For questions and support get in touch with the team or join the community on Slack:

- [#simpla](https://slack.simpla.io) Slack group
- [@simplaio](https://twitter.com/simplaio) Twitter
- [Simpla.io](https://www.simpla.io) website

## Contributing

There are lots of ways you can help push the Simpla project forward:

- **Feedback.** Try Simpla and let us know what works and what could be better - new features, API feebdack, new use-cases, breaking bugs, everything helps.

- **Reporting bugs.** If you find a bug please report it! Open an issue against this repository for problems with the core library and platform. For problems with elements, open an issue against the element's repository.

- **Submitting Pull Requests.** We happily accept PRs against both this repository and any of the elements. Your PR should address an existing issue or have been discussed previously to ensure it gets merged.

- **Build your own elements!** Simpla is an open ecosystem, build your own content elements and [publish them to the catalogue](https://github.com/simplaio/simpla-elements/#publishing-your-element).

## Following development

Simpla's development happens in the open:

- Track [releases](https://github.com/simplaio/simpla/releases) and [issues](https://github.com/simplaio/simpla/issues) here and on [element repositories](https://github.com/SimplaElements)
- Follow the public [development roadmap](https://trello.com/b/tZEZa1rN/simpla-public-roadmap)
- Follow us on Twitter [@simplaio](https://twitter.com/simplaio)
- Monitor platform status at [status.simpla.io](https://status.simpla.io)

***

MIT © 2017 [Simpla](https://www.simpla.io)
