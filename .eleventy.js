const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  
  // This maps the INTERNAL src/assets to the EXTERNAL /assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  const md = new markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  
  eleventyConfig.addFilter("markdown", (content) => {
    if (!content) return "";
    return md.render(content);
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
