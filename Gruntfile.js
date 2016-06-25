module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'js/blox.js',
                dest: 'js/blox.min.js'
            }
        },
        postcss: {
            options: {
                map: false,

                processors: [
                    require('autoprefixer')({
                        browsers: ['last 1 version']
                    }),
                    require('cssnano')()
                ]
            },
            dist: {
                src: 'style.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');

    grunt.registerTask('default', ['uglify']);

};
