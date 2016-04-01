const destPath = "build/";
const destUglyPath = destPath + "min/";
const srcPath  = "src/";

module.exports = function(grunt) {
  grunt.initConfig({
    babel: {
      options: {
//        sourceMap: true,
        presets: ['babel-preset-es2015']
      },
      dist: {
        files: {
          [`${destPath}SelectorString.js`]: `${srcPath}SelectorString.js`,
          [`${destPath}SelectorStringBasic.js`]: `${srcPath}SelectorStringBasic.js`,
        }
      }
    },
    uglify: {
      options: {
        mangle: true
      },
      my_target: {
        files: {
          [`${destUglyPath}SelectorString.min.js`]: `${destPath}SelectorString.js`,
          [`${destUglyPath}SelectorStringBasic.min.js`]: `${destPath}SelectorStringBasic.js`,
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');
  grunt.registerTask('default', ['babel', 'uglify']);
}
