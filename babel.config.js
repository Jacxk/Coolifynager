module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { 
        jsxImportSource: "nativewind",
        // Enable tree shaking and dead code elimination
        useBuiltIns: "usage",
        corejs: 3,
      }],
      "nativewind/babel",
    ],
    plugins: [
      // Enable React Fast Refresh for better development experience
      process.env.NODE_ENV !== "production" && "react-refresh/babel",
    ].filter(Boolean),
  };
};
