module.exports = function(eleventyConfig) {
  // Tell Eleventy to copy your CSS and Images to the final site
  eleventyConfig.addPassthroughCopy("src/assets");
  // Tell Eleventy to copy the Admin folder (for the CMS)
  eleventyConfig.addPassthroughCopy("src/admin");

  return {
    dir: {
      input: "src",      // Where you work
      output: "_site"    // Where the finished HTML goes
    }
  };
};
