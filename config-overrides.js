// config-overrides.js

const {
    override,
    fixBabelImports,
    addBabelPlugin,
    addWebpackAlias
} = require("customize-cra");

const rewireWebpackBundleAnalyzer = require('react-app-rewire-webpack-bundle-analyzer')

module.exports = override(
    fixBabelImports("babel-plugin-import", {
        libraryDirectory: 'es',
        style: true
    }),
    addBabelPlugin([
        "@babel/plugin-transform-typescript",
        { allowNamespaces: true }
    ]),
    //rewireWebpackBundleAnalyzer,
    /*addWebpackAlias({
        'react-dom$': 'react-dom/profiling',
    }),
    addLessLoader({
        javascriptEnabled: true,
        ident: 'postcss',
        sourceMap: true, // should skip in production
        importLoaders: true,
        localIdentName: '[name]__[local]___[hash:base64:5]'
    })*/
);