// 实现这个项目的构建任务
const { src, dest, series, parallel, watch } = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const del = require('del');
const browserSync = require('browser-sync');

const plugins = loadPlugins();

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const clean = (done) => {
  del(['.temp', 'dist']);
  done();
}

const scripts = () => {
  return src('src/assets/scripts/**/*.js', { base: 'src' })
          .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
          .pipe(dest('.temp'))
          .pipe(browserSync.reload({ stream: true }));
}

const styles = () => {
  return src('src/assets/styles/**/*.scss', { base: 'src' })
          .pipe(plugins.sass())
          .pipe(dest('.temp'))
          .pipe(browserSync.reload({ stream: true }));
}

const pages = () => {
  return src('src/**/*.html', { base: 'src' })
          .pipe(plugins.swig({ data, defaults: { cache: false } }))
          .pipe(dest('.temp'))
          .pipe(browserSync.reload({ stream: true }));
}

const image = () => {
  return src('src/assets/images/**/*', { base: 'src' })
          .pipe(plugins.imagemin())
          .pipe(dest('dist'));
}

const font = () => {
  return src('src/assets/fonts/**/*', { base: 'src' })
          .pipe(plugins.imagemin())
          .pipe(dest('dist'));
}

const extra = () => {
  return src('public/**', { base: 'public' })
          .pipe(dest('dist'));
}

const server = () => {
  watch('src/assets/scripts/**/*.js', scripts);
  watch('src/assets/styles/**/*.scss', styles);
  watch('src/**/*.html', pages);
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], browserSync.reload);
  browserSync.init({
    notify: false,
    port: 8888,
    server: {
      baseDir: ['.temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });
}

const useref = () => {
  return src('.temp/*.html', { base: '.temp' })
    .pipe(plugins.useref({ searchPath: ['.temp', '.'] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest('dist'))
}

const compile = parallel(scripts, styles, pages);
const serve = series(clean, compile, server);
const build = series(
  clean,
  compile,
  useref,
  image,
  font,
  extra
);

module.exports = {
  clean,
  serve,
  build,
};
