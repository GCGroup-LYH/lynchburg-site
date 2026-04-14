const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  
  // This maps the INTERNAL src/assets to the EXTERNAL /assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  
  eleventyConfig.addPassthroughCopy("src/admin");
  

  const md = new markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  
  eleventyConfig.addFilter("markdown", (content) => {
    if (!content) return "";
    return md.render(content);
  });

  // Custom Date Filter
  eleventyConfig.addFilter("date", function(dateVal) {
    return new Date(dateVal).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
