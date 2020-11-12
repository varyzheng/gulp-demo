# gulp 自动化构建demo

项目构建主要有3个功能：
1. 编译文件，能将浏览器无法直接运行的源代码编译为浏览器可以运行的代码，依赖模块：
* `gulp-babel`: gulp的babel插件
* `@babel/core`：分析代码生成抽象语法树（Abstract Syntax Tree），不对代码做改变
* `@babel/preset-env`：会把ES6+语法编译为ES5语法，但不会做API上的支持
* `gulp-sass`: 编译sass，scss文件
* `gulp-swig`: 编译html文件，处理模板引擎里边的变量


2. 内置服务器便于进行本地调试，可以实时预览项目改动，即时刷新页面，依赖模块：
* `browser-sync`: 用于做内置服务器，处理代码和浏览器显示内容的同步


3. 能对项目进行构建，并生成可以在生产环境直接使用的文件
* `gulp-useref gulp-if`: 结合使用，对html模板中有build标记的js，css进行合并
* `gulp-clean-css`: 压缩css
* `gulp-htmlmin`: 压缩html
* `gulp-uglify`: 压缩js
* `gulp-imagemin`: 压缩图片

### 公共依赖：
* `gulp`: gulp构建的基础模块
* `gulp-load-plugins`: 自动引入项目中安装的所有依赖模块
* `del`: node的删除模块，可以删除指定文件夹，贯穿整个构建流程，用于清空旧代码

### 构建脚本暴露了3个任务，分别是`clean`, `serve`, 和`build`。  

### 总结
1. gule任务通过管道来进行组合，每个gulp插件都返回流对象。
2. browser-sync模块引入后可以直接`init()`，无需提前调用`create()`方法创建bs对象
3. build任务中，图片，字体，及其他额外文件的拷贝可以并行，但必须等`compile`任务和`useref`任务完成后，否则同时向`dist`目录写文件有可能造成报错。
