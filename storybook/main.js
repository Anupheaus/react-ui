module.exports = {
  stories: ['../src/**/*.stories.@(tsx|ts)'],
  core: { builder: 'webpack5' },
  addons: [
    '@storybook/addon-essentials',
  ],
};