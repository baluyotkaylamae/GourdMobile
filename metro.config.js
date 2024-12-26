const { getDefaultConfig } = require('expo/metro-config');

// Extend the default Metro configuration
const config = getDefaultConfig(__dirname);

// Add support for `.bin` file extensions
config.resolver.assetExts.push('bin', 'json');

module.exports = config;
