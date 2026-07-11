const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8081',
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
    },
  },
});