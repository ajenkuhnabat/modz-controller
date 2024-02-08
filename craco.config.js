module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            // Add fallbacks for missing core modules
            webpackConfig.resolve.fallback = {
                ...webpackConfig.resolve.fallback,
                fs: false, // 'fs-extra',
                path: false, // require.resolve("path-browserify"), // Use path-browserify as a fallback
                os: false, // require.resolve("os-browserify/browser") // Use os-browserify as a fallback
            };
            return webpackConfig;
        }
    }
};