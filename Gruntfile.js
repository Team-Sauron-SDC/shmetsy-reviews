module.exports = (grunt) => {
  grunt.loadNpmTasks('grunt-run');

  grunt.initConfig({
    run: {
      options: {
        // ...
      },
      npm_build: {
        cmd: 'npm',
        args: [
          'run',
          'build',
        ],
      },
      npm_start: {
        cmd: 'npm',
        args: [
          'start',
        ],
      },
    },
  });

  grunt.registerTask('default', ['run:npm_build', 'run:npm_start']);
};
