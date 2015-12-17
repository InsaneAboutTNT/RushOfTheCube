module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        audiosprite: {
            all: {
                output: "Audio/Audiosprite",
                files: "Audio/Death.ogg Audio/Ping.ogg",
                export: "ogg",
                ogg_to_oga: false
            }
        },
        // First concatenate...
        concat: {   
            dist: {
                src: [
                    "Src/Credits.js",
                    "Src/Game.js",
                    "Src/GameOver.js",
                    "Src/GameUtils.js",
                    "Src/Menu.js",
                    "Src/Obstacles.js",
                    "Src/Player.js",
                    "Src/Setup.js"
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
    
    grunt.loadNpmTasks("grunt-audiosprite");

    grunt.registerTask("default", ["audiosprite", "concat", "uglify"]);

};