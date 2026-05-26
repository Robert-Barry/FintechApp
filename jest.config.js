// jest.config.js
module.exports = {
  // Use the core react-native preset directly to completely bypass jest-expo's broken setup script
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: [],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['babel-preset-expo'] }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo-router|@react-navigation|react-navigation)/)',
  ],
};