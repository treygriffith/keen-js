module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    
    concat: {
      options: {
        stripBanners: true,
        process: function(src, filepath) {
          var namespace = (grunt.option("namespace") || false);
          src = ((namespace) ? src.replace("'Keen'", "'" + namespace + "'") : src);
          return "  // Source: " + filepath + "\n" + src;
        }
      },
      all: {
        src: [
          "src/intro.js", 
          "src/track.js", 
          "src/plugins/keen-pageviews.js",
          "src/plugins/keen-async-loading.js",
          "src/query.js", 
          "src/visualize.js",
          "src/lib/base64.js",
          "src/lib/json2.js",
          "src/lib/jquery.documentReady.js", 
          "src/outro.js"
        ],
        dest: "dist/<%= pkg.name %>-<%= pkg.version %>.js"
      },
      track: {
        src: [
          "src/intro.js", 
          "src/track.js", 
          "src/plugins/keen-pageviews.js", 
          "src/plugins/keen-async-loading.js",
          "src/lib/base64.js",
          "src/lib/json2.js",
          "src/outro.js"
        ],
        dest: "dist/<%= pkg.name %>-<%= pkg.version %>.track.js"
      },
      query: {
        src: [
          "src/intro.js", 
          "src/query.js", 
          "src/lib/base64.js",
          "src/lib/json2.js",
          "src/outro.js"
        ],
        dest: "dist/<%= pkg.name %>-<%= pkg.version %>.query.js"
      },
      visualize: {
        src: [
          "src/intro.js", 
          "src/query.js", 
          "src/visualize.js",
          "src/lib/base64.js",
          "src/lib/json2.js",
          "src/lib/jquery.documentReady.js", 
          "src/outro.js"
        ],
        dest: "dist/<%= pkg.name %>-<%= pkg.version %>.visualize.js"
      },
      loader: {
        src: "src/loader.js",
        dest: "dist/<%= pkg.name %>-<%= pkg.version %>.loader.js"
      }
    },
    
    uglify: {
      options : {
        beautify : {
          ascii_only : true
        }    
      },
      dist: {
        files: {
          "dist/<%= pkg.name %>-<%= pkg.version %>.min.js": "dist/<%= pkg.name %>-<%= pkg.version %>.js",
          "dist/<%= pkg.name %>-<%= pkg.version %>.track.min.js": "dist/<%= pkg.name %>-<%= pkg.version %>.track.js",
          "dist/<%= pkg.name %>-<%= pkg.version %>.query.min.js": "dist/<%= pkg.name %>-<%= pkg.version %>.query.js",
          "dist/<%= pkg.name %>-<%= pkg.version %>.visualize.min.js": "dist/<%= pkg.name %>-<%= pkg.version %>.visualize.js",
          "dist/<%= pkg.name %>-<%= pkg.version %>.loader.min.js": "dist/<%= pkg.name %>-<%= pkg.version %>.loader.js"
        }
      }
    },

    watch: {
      javascript: {
        files: "src/**/*.js",
        tasks: [ "concat", "uglify" ]
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["concat", "uglify"]);
};
