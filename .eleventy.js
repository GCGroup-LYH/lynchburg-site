const eleventySass = require("eleventy-sass");

module.exports = function(eleventyConfig) {
  
  //  ADD THE SASS PLUGIN (The new "Engine")
  eleventyConfig.addPlugin(eleventySass, {
    compileOptions: {
      permalink: function(contents, inputPath) {
        // This ensures your SCSS file becomes a CSS file in the build folder
        return (data) => "/assets/css/main.css";
      }
    }
  });

  //  KEEP EXISTING PASSTHROUGHS (The "Body")
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  // Note: We removed src/assets/css passthrough because 
  // the Sass plugin is now "creating" that folder automatically.

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
