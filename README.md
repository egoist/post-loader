# post-loader

[![NPM version](https://img.shields.io/npm/v/post-loader.svg?style=flat)](https://npmjs.com/package/post-loader) [![NPM downloads](https://img.shields.io/npm/dm/post-loader.svg?style=flat)](https://npmjs.com/package/post-loader) [![Build Status](https://img.shields.io/circleci/project/egoist/post-loader/master.svg?style=flat)](https://circleci.com/gh/egoist/post-loader) [![codecov](https://codecov.io/gh/egoist/post-loader/branch/master/graph/badge.svg)](https://codecov.io/gh/egoist/post-loader) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

## Install

```bash
yarn add post-loader --dev
```

## Usage

```js
const postLoader = require('post-loader')

module.exports = {
  module: {
    rules: [{
      test: /\.md$/,
      loader: 'post-loader'
    }]
  }
}
```

## Example

Given `my-blog-post.md`:

```markdown
---
title: hello there
---
post **body**
```

Yields:

```js
{
  "data": {
    "title": "hello there",
    "date": "2017-02-28T14:57:59.000Z"
  },
  "content": "post **body**",
  "html": null
}
```

Which is `require-able` in other files:

```js
import post from './my-blog-post.md'

console.log(post.data.title)
//=> hello there
```

*Note:* We automatically set `date` to the birthtime of the file if no `date` is set in front-matter.

## Use a markdown parser

```js
const postLoader = require('post-loader')

module.exports = {
  module: {
    rules: [{
      test: /\.md$/,
      loader: 'post-loader',
      options: {
        render(markdown) {
          return someMarkdownParser.toHTML(markdown)
        }
      }
    }]
  }
}
```

Given the same markdown content as used above, it yields:

```js
{
  "data": {
    "title": "hello there",
    "date": "2017-02-28T14:57:59.000Z"
  },
  "content": "post **body**",
  "html": "<p>post <strong>options</strong></p>\\\\n\\"
}
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**post-loader** © [egoist](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/egoist/post-loader/contributors)).

> [egoistian.com](https://egoistian.com) · GitHub [@egoist](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)
