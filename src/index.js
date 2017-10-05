import matter from 'gray-matter'
import loaderUtils from 'loader-utils'

function postLoader(source) {
  this.cacheable && this.cacheable()

  const { data, content } = matter(source)
  const stat = this.fs.statSync(this.resourcePath)

  const options = loaderUtils.getOptions(this) || {}

  const post = {
    data: {
      date: stat.birthtime,
      ...data
    },
    content,
    html: options.render ? options.render(content) : null
  }

  return `module.exports = ${JSON.stringify(post)}`
}

export default postLoader
