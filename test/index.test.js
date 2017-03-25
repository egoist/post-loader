import { join } from 'path'
import webpack from 'webpack'
import MFS from 'memory-fs'
import req from 'require-from-string'
import assign from 'deep-assign'

const globalConfig = {
  output: {
    path: __dirname,
    libraryTarget: 'commonjs2',
    filename: '[name].js'
  }
}

test('no options', () => {
  const config = assign({
    entry: {
      'no-options': join(__dirname, 'fixture/no-options.md')
    },
    module: {
      rules: [{
        test: /\.md$/,
        loader: require.resolve('../src')
      }]
    }
  }, globalConfig)

  const mfs = new MFS()

  let compiler
  try {
    compiler = webpack(config)
  } catch (err) {
    return Promise.reject(new Error(err.message))
  }

  compiler.outputFileSystem = mfs

  return runCompiler(compiler)
    .then(stats => {
      expect(!stats.hasErrors() && !stats.hasWarnings())
        .toBe(true)

      const outFile = mfs.readFileSync(join(config.output.path, 'no-options.js'), 'utf8')
      const json = req(outFile)
      expect(json.title).toBe('foo')
      expect(json.content).toBe('<p>no <strong>options</strong></p>\n')
    })
})

test('custom options', () => {
  const config = assign({
    entry: {
      'custom-options': join(__dirname, 'fixture/custom-options.md')
    },
    module: {
      rules: [{
        test: /\.md$/,
        loader: require.resolve('../src'),
        options: {
          html: true
        }
      }]
    }
  }, globalConfig)

  const mfs = new MFS()
  const compiler = webpack(config)
  compiler.outputFileSystem = mfs

  return runCompiler(compiler)
    .then(stats => {
      expect(!stats.hasErrors() && !stats.hasWarnings())
        .toBe(true)

      const outFile = mfs.readFileSync(join(config.output.path, 'custom-options.js'), 'utf8')
      const json = req(outFile)
      expect(json.title).toBe('foo')
      expect(json.content).toBe('<p>custom <br/><strong>options</strong></p>\n')
    })
})

test('use plugin', () => {
  const config = assign({
    entry: {
      'use-plugin': join(__dirname, 'fixture/use-plugin.md')
    },
    module: {
      rules: [{
        test: /\.md$/,
        loader: require.resolve('../src'),
        options: {
          use: [require('markdown-it-task-lists')]
        }
      }]
    }
  }, globalConfig)

  const mfs = new MFS()
  const compiler = webpack(config)
  compiler.outputFileSystem = mfs

  return runCompiler(compiler)
    .then(stats => {
      expect(!stats.hasErrors() && !stats.hasWarnings())
        .toBe(true)

      const outFile = mfs.readFileSync(join(config.output.path, 'use-plugin.js'), 'utf8')
      expect(req(outFile).content.indexOf('task-list') !== -1).toBe(true)
    })
})

function runCompiler(compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}
