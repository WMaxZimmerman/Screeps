module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'william.m.zimmerman@gmail.com',
                password: 'M@xz1992',
                branch: 'master',
                ptr: false
            },
            dist: {
                src: ['modules/*.js']
            }
        }
    });
}
