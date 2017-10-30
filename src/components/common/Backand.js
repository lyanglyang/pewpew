import backand from '@backand/vanilla-sdk';
const ANONYMOUS_TOKEN = 'fb44c3c7-d0ca-40a6-81d1-5bd6484af3be';
backand.init({
  appName: 'pewpew',
  signUpToken: "cf706c34-ce4b-45f1-80c0-2a517fef995b",
  anonymousToken: ANONYMOUS_TOKEN,
  runSocket: true,
});

export default backand;
