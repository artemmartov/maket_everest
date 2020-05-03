const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;
console.log("DEEEV", isDev);

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all"
    }
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserWebpackPlugin()
    ];
  }
  return config;
};

const filename = ext => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssLoader = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      }
    },
    "css-loader"
  ];

  if (extra) {
    loaders.push(extra);
  }
  return loaders;
};







module.exports = {
  mode: "development",
  entry: {
    main: "./src/js/index.js"
  },
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename("css")
    })
  ],
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoader()
      },
      {
        test: /\.less$/,
        use: cssLoader('less-loader')
      },
      {
        test: /\.(sass|scss)$/,
        use:  cssLoader('sass-loader')
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ["file-loader"]
      }
    ]
  }
};
