'use strict'
const path = require('path')
// const glob = require('glob')
/* const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); */
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
	 publicPath: '/',
	  outputDir: 'dist',
	 assetsDir: 'static',
	  lintOnSave: false, // 关闭 eslint检查
  // 是否为生产环境构建生成 source map？
  productionSourceMap: false,
  configureWebpack: (config) => {
	  // 入口文件
	  /* config.entry.app = ['babel-polyfill', './src/main.js']; */
	  // 删除console插件
	 /* let plugins = [
	    new UglifyJsPlugin({
	      uglifyOptions: {
	        compress: {
	          warnings: false,
	          drop_console:true,
	          drop_debugger:true
	        },
	        output:{
	          // 去掉注释内容
	          comments: false,
	        }
	      },
	      sourceMap: false,
	      parallel: true,
	    }),
	  ]; */
	  // 只有打包生产环境才需要将console删除
	 /* if(process.env.VUE_APP_build_type=='production'){
	    config.plugins = [...config.plugins, ...plugins];
	  } */
  },
	   // alias 配置
	 chainWebpack: config => {
	   if (process.env.use_analyzer) {
	     config
	       .plugin('webpack-bundle-analyzer')
	       .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
	   }
	   // // 移除 prefetch 插件
	   // config.plugins.delete('prefetch')
	   // 设置路径别名
	   config.resolve.alias
	     .set('@', resolve('src'))
	     .set('views', resolve('src/views'))
	     .set('assets', resolve('src/assets'))
	     .set('components', resolve('src/components'))

	   // set svg-sprite-loader
	   config.module
	     .rule('svg')
	     .exclude.add(resolve('src/icons'))
	     .end()
	   config.module
	     .rule('icons')
	     .test(/\.svg$/)
	     .include.add(resolve('src/icons'))
	     .end()
	     .use('svg-sprite-loader')
	     .loader('svg-sprite-loader')
	     .options({
	       symbolId: 'icon-[name]'
	     })
	     .end()

	   // set preserveWhitespace 去掉元素之间空白
	   config.module
	     .rule('vue')
	     .use('vue-loader')
	     .loader('vue-loader')
	     .tap(options => {
	       options.compilerOptions.preserveWhitespace = true
	       return options
	     })
	     .end()

	   config
	     // https://webpack.js.org/configuration/devtool/#development
	     .when(process.env.NODE_ENV === 'development',
	       config => config.devtool('cheap-source-map')
	     )
	 },
	 css: {
	  loaderOptions: {
	    sass: {
	    /*  prependData: `@import "@/styles/variables.scss";` */
	    }
	  }
  },
  devServer: {
    proxy: {
      '/spc': {
        target: 'http://localhost:8000',
        ws: true,
        changeOrigin: true
      }
    }
	// proxy: {
	// 	'/spc': {
	// 	  target: 'http://192.168.1.228:8000',
	// 	  ws: true,
	// 	  changeOrigin: true
	// 	}
	//   }
  }
}
