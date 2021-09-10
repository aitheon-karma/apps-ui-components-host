// vue.config.js
const lastArg = process.argv[process.argv.length - 1];
const buildMode = process.env.NODE_ENV;
const isDevelopment = buildMode === 'development';
const isWebComponentBuild = process.argv.includes('wc');

module.exports = {
  publicPath: isDevelopment ? '/ui' : '',
  configureWebpack: {
    externals: lastArg === 'component' ?  {
      'vue-chartjs':'Vuejscharts'
    }: {},
  },
  css: isWebComponentBuild ? undefined : {
    requireModuleExtension: false,
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/styles/global.scss";
        `
      }
    }
  },
  pages: isDevelopment ? {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
    demo: {
      template: 'demo/index.html',
      entry: 'demo/main.js',
      title: 'App Demo'
    },
  } : undefined,
  devServer: {
    port: 3000,
  },
  productionSourceMap: false,
}
