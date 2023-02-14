const path = require("path");

module.exports = {
  id: 'material-ui',
  webpack: (config, env) => {
    config.resolve.alias = {
      "@kidztime": path.resolve(__dirname, "./core/"),
      "@ktwebsite": path.resolve(__dirname, "./views/"),
    };
    config.devtool = process.env.NODE_ENV === "production" ? "none" : "source-map";
    
    return config;
  },
};
