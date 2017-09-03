'use strict';

const gulp = require( 'gulp' ),
      sass = require( 'gulp-sass' ),
      autoprefixer = require( 'gulp-autoprefixer' ),
      pug = require( 'gulp-pug'),
      sourcemaps = require( 'gulp-sourcemaps' ),
      del = require( 'del' ),
      browserSync = require( 'browser-sync').create();


// Variables de rutas
var paths = {
  sass: {
    src: './www/src/scss/**/*.scss',
    dest: './www/dist/css'
  },
  pug: {
    src: './www/src/pug/**/*.pug',
    dest: './www/dist/views'
  }
}


// Compila archivos .SCSS a .CSS
gulp.task( 'sass', function () {
  return gulp.src( paths.sass.src )
    .pipe( sass.sync()
      .on( 'error', sass.logError ) )
    .pipe( sourcemaps.init())
    .pipe( autoprefixer({
      versions: [ 'last 2 browsers' ] // Prefijos para navegadores viejos
    }))
    .pipe(sass({
      outputStyle: 'compressed' // Tipo de salida del archivo CSS
    }))
    .pipe( sourcemaps.write( 'maps' ) )
    .pipe( gulp.dest( paths.sass.dest) )
    .pipe( browserSync.stream() );
});


// Compila archivos .PUG a .HTML
gulp.task( 'pug', () => {
  return gulp.src( paths.pug.src )
  .pipe(pug({
    pretty: true
  }))
  .pipe( gulp.dest( paths.pug.dest ))
});


// Elimina archivos cuando este en desarrollo
// Por ejemplo, elimina los mapas generados por SASS
gulp.task( 'cleanup', () => {
  del( paths.sass.dest + '/maps/*' );
  del( paths.sass.dest + '/maps/' );
});


// Sincroniza el navegador con los cambios realizados en archivos .HTML, .CSS, .JS
gulp.task( 'browser-sync', [ 'sass', 'pug'], () => {
  browserSync.init({
    // browser: 'google chrome',
    server: {
      baseDir: './',
      index: '/www/dist/views/index.html'
    }
  });
});


// Ejecuta todas las tareas
gulp.task( 'watch', () => {
  gulp.watch( paths.sass.src, [ 'sass' ] );
  gulp.watch( paths.pug.src, [ 'pug' ] );
  gulp.watch( './**/*.html' ).on( 'change', browserSync.reload );
});


// Ejecuta la tarea predeterminada
gulp.task( 'default', [ 'watch', 'browser-sync']);
