/**
 * Vue CLI Configuration File
 * Proyecto Aromancia - Haute Parfumerie
 * Asignatura: Programación II
 */

const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist',
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'index.html',
      title: 'Aromancia - Haute Parfumerie'
    }
  },
  devServer: {
    port: 3000,
    open: false
  }
});
