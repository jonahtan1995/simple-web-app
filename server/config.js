require("dotenv").config();

const config = {
  GITHUB_API_URL: "https://api.github.com",
  LOCAL_API_URL: "http://localhost:3030",
  GITHUB_TOKEN: process.env.GITHUB_ACCESS_TOKEN ?? "your-token",
};

module.exports = config;
