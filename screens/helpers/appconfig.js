export default ApplicationConfig = (() => {
    let instance = null;
    return class ApplicationConfig {
      static getInstance() {
        if (instance == null) {
          instance = new ApplicationConfig();
        }
        return instance;
      }

      isHVM() {
        if (ApplicationConfig.getInstance().me != undefined) {
          return ApplicationConfig.getInstance().me.role === 1;
        }
      }

      isSM() {
        if (ApplicationConfig.getInstance().me != undefined) {
          return ApplicationConfig.getInstance().me.role === 0;
        }
      }
    }
})();

export const AWS_OPTIONS = {
  keyPrefix: "uploads/",
  bucket: "visualgotest-hosting-mobilehub-922920593",
  region: "us-east-1",
  accessKey: "AKIAJJ2F7PIGCSVS72UQ",
  secretKey: "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",
  successActionStatus: 201,
  bucketAddress: 'https://s3.amazonaws.com/visualgotest-hosting-mobilehub-922920593/uploads/'
}