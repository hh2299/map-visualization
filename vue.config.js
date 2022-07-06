
module.exports = {
  devServer: {
    proxy: {
      '/api': {
            target: '192.168.31.33:7083',
            secure: false,
            changeOrigin: true,
            pathRewrite: {
                '/api': ''
            }
        }
    }
},
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
}
