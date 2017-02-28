import MarkdownIt from 'markdown-it'
import fm from 'front-matter'
import loaderUtils from 'loader-utils'

export default function (content) {
  this.cacheable && this.cacheable()

  const options = loaderUtils.getOptions(this) || {}

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

  return `module.exports = ${JSON.stringify({ ...attributes, content: parsed })}`
}
