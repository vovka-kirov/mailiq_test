'use strict';

//
// modules
const 
	gulp         = require('gulp'),
	rename       = require('gulp-rename'),
	del          = require('del'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglify'),
	sass         = require('gulp-sass')(require('sass')),
	postcss      = require('gulp-postcss'),
	autoprefixer = require('autoprefixer');
	
	
//
// paths	
const root     = "./htm/";
const bld      = "./build/";
const bld_root = "./build/htm/";

const paths = {
	scss : {
		src    : root + "__scss/**/*.*",
		style  : root + "__scss/style.scss",
		dest   : root + "css/"
	},
	css : {
		src:  root + "css/style.css",
		dest: bld_root + "css/",
		min: "style.min.css"
	}
};


//
// functions
//

// scss -> css
function scss(){
	return (
		gulp
			.src(paths.scss.style)
			.pipe(sass({precision: 8, outputStyle: 'expanded'}).on('error', sass.logError))
			.pipe(gulp.dest(paths.scss.dest))
	);
};
exports.scss = scss;


// css [build]
function css(){
	return (
		gulp
			.src(paths.css.src)
			
			// add prefixes
			.pipe(postcss([
				autoprefixer(['> 0.5%', 'ie > 9', 'ios > 8', 'android > 2.1']),
			]))			
			.pipe(gulp.dest(paths.css.dest))
			
			// create min version
			.pipe(sass({precision: 8, outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(rename(paths.css.min))
			.pipe(gulp.dest(paths.css.dest))
	);
};
exports.css = css;


// watcher
function watch(){
	gulp.watch(paths.scss.src, scss);
};
exports.watch = watch;


// clean [build]
function clean() {
  return del(bld + "**");
}


// scripts [build]
// function scripts(){
	// return (
		// gulp.src(root + "js/*.*")
		// .pipe(concat('proj.js'))
		// .pipe(gulp.dest(bld_root + 'js/'))
		// .pipe(uglify())
		// .pipe(rename('proj.min.js'))
		// .pipe(gulp.dest(bld_root + 'js/'))
	// );		
// };
// exports.scripts = scripts;

// copy [build]
function copies(){
	return (
		gulp
			.src([
				root + "index.html",
				root + "fonts/**",
				root + "i/**",
				root + "js/libs/**",				
			], {base: root})
			.pipe(gulp.dest(bld_root))
	);	
};
exports.copies = copies;


//
// dev process
//
var dev = gulp.series(
	scss,       // compile css
	watch       // let`s watch
);


//
// build process
var build = gulp.series(
	clean,      // clean build dir
	// svg2js,      // update svg sprite 
	// tpl,        // compile html
	// tpl_build,  // compile html to build
	scss,       // compile css
	css,        // change css to build (prefix, min)
	// scripts,    // concat js
	copies      // copy to ./build: fonts, images, js libs 
);


//
// tasks 
//
gulp.task('default', dev);

gulp.task('dev', dev);
gulp.task('build', build);