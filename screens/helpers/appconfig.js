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
  bucket: "visualgo",
  region: "eu-central-1",
  accessKey: "AKIAJJ2F7PIGCSVS72UQ",
  secretKey: "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",
  successActionStatus: 201,
  bucketAddress: 'https://s3.eu-central-1.amazonaws.com/visualgo/thumbnails/uploads/',
  baseBucketAddress: 'https://s3.eu-central-1.amazonaws.com/visualgo/uploads/'
}