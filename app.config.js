module.exports = {
  name: 'metaHub',
  displayName: 'metaHub',
  expo: {
    name: 'metaHub',
    slug: 'metahub',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    scheme: 'metahub',
    platforms: ['ios', 'android'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.metahub',
    },
    android: {
      package: 'com.metahub',
    },
    extra: {
      eas: {
        projectId: 'eb7b4461-08b7-4a6f-b255-d99efdfadc55',
      },
    },
  },
};
