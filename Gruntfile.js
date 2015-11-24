module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        // First concatenate...
        concat: {   
            dist: {
                src: [
                    "Src/Game.js",
                    "Src/Objects.js",
                    "Src/GameUtils.js"
                ],
                dest: "Src/src.js"
            }
        },
        // ... then minify.
        uglify: {
            build: {
                src: "Src/src.js",
                dest: "Src/src.min.js"
            }
        }
    });
    // Note: only uglifying straight away may cause runtime errors.
    grunt.loadNpmTasks("grunt-contrib-concat");

    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["concat","uglify"]);

};