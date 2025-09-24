// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ["babel-preset-expo"],
//     plugins: ["nativewind/babel", "react-native-reanimated/plugin"],
//   };
// };

module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],

    plugins,
  };
};
