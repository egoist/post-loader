import { join } from 'path'
import webpack from 'webpack'
import MFS from 'memory-fs'
import assign from 'deep-assign'
import marked3 from 'marked3'
import req from 'require-from-string'

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
      const res = req(outFile)
      delete res.data.date
      expect(res).toMatchSnapshot()
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
          render(md) {
            return marked3(md)
          }
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
      const res = req(outFile)
      delete res.data.date
      expect(res).toMatchSnapshot()
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
