const path = require("path");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  entry: "./start.ts",
  devtool: "inline-source-map",
  mode: "development",
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [new TsconfigPathsPlugin()],
    alias: {
      graphql$: path.resolve(__dirname, "./node_modules/graphql/index.js"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  output: {
    libraryTarget: "commonjs",
    filename: "start.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  target: "node",
};
