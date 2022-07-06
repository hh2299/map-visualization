
module.exports = {
  devServer: {
    proxy: {
      '/api': {
            target: 'http://localhost:8081/',
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
