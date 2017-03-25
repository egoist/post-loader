import MarkdownIt from 'markdown-it'
import fm from 'front-matter'
import loaderUtils from 'loader-utils'

function parse(content, options) {
  options = options || {}
  const use = options.use
  delete options.use

  const md = new MarkdownIt(options)

  if (use) {
    for (const plugin of use) {
      md.use(plugin)
    }
  }

  const { attributes, body } = fm(content)
  const parsed = md.render(body)

  return { ...attributes, content: parsed }
}

function postLoader(content) {
  this.cacheable && this.cacheable()

  const stat = this.fs.statSync(this.resourcePath)

  const post = Object.assign({
    date: stat.birthtime
  }, parse(content, loaderUtils.getOptions(this)))

  return `module.exports = ${JSON.stringify(post)}`
}

postLoader.parse = parse

export default postLoader
