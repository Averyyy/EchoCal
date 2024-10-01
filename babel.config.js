module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // Add the necessary Babel plugins with consistent loose mode
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    ['@babel/plugin-transform-class-properties', {loose: true}],
    ['@babel/plugin-transform-private-methods', {loose: true}],
    ['@babel/plugin-transform-private-property-in-object', {loose: true}],
    'react-native-reanimated/plugin',
  ],
};
