module.exports = function(eleventyConfig) {
  
  // This maps the INTERNAL src/assets to the EXTERNAL /assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
