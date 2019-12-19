const path = require('path')
const nodeExternals = require('webpack-node-externals')
const packageJson = require('./package.json')

module.exports = (env) => {

  const version = packageJson.version
  const buildType = env.BUILD_TYPE

  let config = {}
  if (buildType === 'sdk-script') {

    config = {
      entry: {
        main: './src/userbase-js/index.js'
      },
      output: {
        path: path.join(__dirname, '../../build/script/'),
        filename: `userbase-${version}.js`,
        library: 'userbase',
        libraryExport: 'default'
      },
      target: 'web'
    }

  } else if (buildType === 'npm-package') {

    config = {
      entry: {
        main: './src/userbase-js/'
      },
      output: {
        path: path.join(__dirname, '../../npm_build/userbase-js/'),
        filename: 'index.js',
        libraryTarget: 'umd' // makes default exportable
      },
      target: 'node',
      externals: [nodeExternals()] // ignores node modules
    }

  } else {
    throw new Error('Unknown build type')
  }

  return {
    ...config,
    devtool: 'source-map',
    resolve: {
      extensions: ['.js'],
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          use: ['source-map-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                'emotion',
                ['@babel/plugin-transform-runtime', { corejs: 3, useESModules: true, version: "^7.7.6" }]
              ]
            }
          }
        }
      ]
    }
  }
}
