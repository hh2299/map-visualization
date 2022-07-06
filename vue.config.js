
module.exports = {
  devServer: {
    // assetsSubDirectory: 'static',
    port: 8088,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:7084/',  //这生产环境改
        secure: false,
        changeOrigin: false,
        // pathRewrite: {
        //   '^/api': '/'
        // }
      },
      '/static': {
        target: 'http://localhost:8080/',
        secure: false,
        changeOrigin: false,
        pathRewrite: {
          '/static': ''
        }
      }
    },

  },
  publicPath: './',
  // port: 8080,
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
}
