module.exports = {
  stories: ['../src/**/*.stories.@(tsx|ts)'],
  core: { builder: 'webpack5' },
  staticDirs: ['./public'],
  addons: [
    '@storybook/addon-essentials',
    'storybook-dark-mode',
  ],
  webpackFinal: async config => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [{
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        }, {
          test: /\.tsx?$/i,
          loader: 'ts-loader',
          options: {
            onlyCompileBundledFiles: true,
            transpileOnly: true,
            compilerOptions: {
              noEmit: false,
            },
          },
        }],
      },
    };
  },
};
