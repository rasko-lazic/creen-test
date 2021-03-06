const mix = require('laravel-mix');
const path = require('path')
// const LiveReloadPlugin = require('webpack-livereload-plugin')

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

let webpackConfig = {
  resolve: {
    alias: {
      "vue$": "vue/dist/vue.runtime.esm.js"
    }
  },
  plugins: [
    // new LiveReloadPlugin()
  ]
}

mix.options({
  hmrOptions: {
    port: 3030
  }
})


mix
  .webpackConfig(webpackConfig)
  .js('app.js', 'dist/js')
  .sass('../sass/app.scss', 'dist/css');
