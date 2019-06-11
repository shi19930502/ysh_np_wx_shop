var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var zipName = 'WX'

// 清空dist文件夹
gulp.task('clean', function() {
	gulp.src([
		'dist/*',
		zipName + '.zip',
		'dist'
	]).pipe(plugins.clean());
})

// 压缩dist文件夹
gulp.task('getZip', function () {
		return gulp
				.src('dist/**/*')
				.pipe(plugins.zip(zipName + '.zip'))
				.pipe(gulp.dest('./'));
});

// 将默认的任务代码放在这
gulp.task('default', () => {
	console.log('build success!!')
});
