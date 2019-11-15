// For info about this file refer to webpack and webpack-hot-middleware documentation
// For info on how we're generating bundles with hashed filenames for cache busting: https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.w99i89nsz
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import path from 'path';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  __DEV__: false,
};

export default {
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
    // To support react-hot-loader
    alias: {
      'react-dom': '@hot-loader/react-dom',
      Components: path.resolve(__dirname, '../src/client/components/'),
      Styles: path.resolve(__dirname, '../src/client/styles/'),
      Assets: path.resolve(__dirname, '../src/client/assets/'),
      Common: path.resolve(__dirname, '../src/client/common/'),
    },
  },
  devtool: 'source-map', // more info:https://webpack.js.org/guides/production/#source-mapping and https://webpack.js.org/configuration/devtool/
  entry: path.resolve(__dirname, '../src/client/index'),
  target: 'web',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../src/server/public'),
    publicPath: '/',
    filename: '[name].[contenthash].js',
  },
  plugins: [
    // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new webpack.DefinePlugin(GLOBALS),

    // Generate an external css file with a hash in the filename
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),

    // Generate HTML file that contains references to generated bundles. See here for how this works: https://github.com/ampedandwired/html-webpack-plugin#basic-usage
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/client/index.ejs'),
      favicon: path.resolve(__dirname, '../src/client/favicon.ico'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
      // Note that you can add custom options here if you need to handle other custom logic in index.html
      // To track JavaScript errors via TrackJS, sign up for a free trial at TrackJS.com and enter your token below.
      trackJSToken: '',
    }),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, '../src/client/assets'), to: 'assets' },
      {
        from: path.resolve(__dirname, '../src/client/manifest.json'),
        to: './',
      },
    ]),
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      importWorkboxFrom: 'cdn',
      navigateFallback: '/index.html',
      navigateFallbackBlacklist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp('^/_'),
        // Exclude any URLs whose last part seems to be a file extension
        // as they're likely a resource and not a SPA route.
        // URLs containing a "?" character won't be blacklisted as they're likely
        // a route with query params (e.g. auth callbacks).
        new RegExp('/[^/?]+\\.[^/]+$'),
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream',
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml',
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /(\.css|\.scss|\.sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('cssnano'), require('autoprefixer')],
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, '../src/client')],
              },
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
};
