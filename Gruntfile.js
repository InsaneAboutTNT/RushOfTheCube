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
        clean: {
            build: {
                src: ["Build"]
            }
        },
        copy: {
            build: {
                src: ["index.html", "Fonts/*", "Src/*", "Audio/*", "Style.css", "Textures.json", "Textures.png"],
                dest: "Build",
                expand: true
            }
        },
        "string-replace": {
            build: {
                files: {
                    "Build/": "index.html"
                },
                options: {
                    replacements: [
                        {
                            pattern: "<!-- Start DEVIMPORTS -->",
                            replacement: "<!-- Start DEVIMPORTS"
                        }, {
                            pattern: "<!-- End DEVIMPORTS -->",
                            replacement: "-- End DEVIMPORTS -->"
                        }, {
                            pattern: "<!--<script src=\"Src/src.min.js\"></script>-->",
                            replacement: "<script src=\"Src/src.min.js\"></script>"
                        }
                    ]
                }
            }
        },
        // First concatenate...
        concat: {   
            dist: {
                src: [
//                    "Src/Credits.js",
//                    "Src/Game.js",
//                    "Src/GameOver.js",
//                    "Src/GameUtils.js",
//                    "Src/Menu.js",
//                    "Src/Obstacles.js",
//                    "Src/Player.js",
//                    "Src/Setup.js"
                    "Build/Src/Game.js", // Force Game.js to come first.
                    "Build/Src/*.js",
                    "!Build/Src/phaser.min.js"
                ],
                dest: "Build/Src/src.js"
            }
        },
        // ... then minify.
        uglify: {
            build: {
                src: "Build/Src/src.js",
                dest: "Build/Src/src.min.js"
            }
        }
    });
    // Note: only uglifying straight away may cause runtime errors.
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-string-replace");
    grunt.loadNpmTasks("grunt-audiosprite");

    grunt.registerTask("build", ["clean", "copy", "string-replace", "concat", "uglify"]);
    grunt.registerTask("audiosprite", ["audiosprite"]);

};
