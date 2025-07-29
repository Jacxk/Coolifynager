const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Performance optimizations
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Enable tree shaking and dead code elimination
config.transformer.unstable_allowRequireContext = true;

// Optimize for production builds
if (process.env.NODE_ENV === 'production') {
  config.transformer.minifierPath = require.resolve('metro-minify-terser');
}

module.exports = withNativeWind(config, { input: "./global.css" });
