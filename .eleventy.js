module.exports = function(eleventyConfig) {
  
  // 1. Copy the CMS dashboard folder as-is
  eleventyConfig.addPassthroughCopy("src/admin");

  eleventyConfig.addPassthroughCopy("src/assets");

  // 2. Copy the Image and Font folders specifically
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");

  // 3. DO NOT copy src/assets/scss (Sass handles this separately)
  
  // 4. (Optional) If you have a favicon or a _redirects file
  eleventyConfig.addPassthroughCopy("src/_redirects");

  return {
    dir: {
      input: "src",
      output: "_site" // This is where the compiled site lives
    }
  };
};
