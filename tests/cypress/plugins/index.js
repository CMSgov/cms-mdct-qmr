export default async (on, config) => {
  // e2e testing node events setup code
  // set default size for headless mode
  on("before:browser:launch", (browser = {}, launchOptions) => {
    if (browser.name === "chrome" && browser.isHeadless) {
      launchOptions.args.push("--window-size=1400,9000");
      launchOptions.args.push("--force-device-scale-factor=1");
    }
    return launchOptions;
  });

  on("task", {
    log(message) {
      console.log(message);

      return null;
    },
    table(message) {
      console.table(message);

      return null;
    },
  });
};
