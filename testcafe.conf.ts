export default {
  concurrency: 1,
  selectorTimeout: 10000,
  assertionTimeout: 10000,
  pageLoadTimeout: 30000,
  speed: 0.8,
  skipJsErrors: false,
  skipUncaughtErrors: false,
  browserAliases: {
    chrome: "chrome --no-sandbox --disable-dev-shm-usage",
  },
  videoOptions: {
    singleFile: true,
    failedOnly: true,
  },
  screenshotOptions: {
    path: "./screenshots",
    failedOnly: true,
  },
  reporter: ["spec", "json"],
  resolvePath: "./tests/fixtures",
  disablePageCaching: true,
  disableMultipleWindows: false,
  quarantineMode: {
    successThreshold: 1,
    mode: "spec",
  },
};
