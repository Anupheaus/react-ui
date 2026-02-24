import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-onboarding',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  core: {
    builder: {
      name: '@storybook/builder-webpack5',
      options: { fsCache: false },
    },
  },
  swc: (config: Record<string, unknown>) => ({
    ...config,
    jsc: {
      ...(config.jsc as object ?? {}),
      parser: {
        syntax: 'typescript',
        tsx: true,
        decorators: true,
      },
      transform: {
        legacyDecorator: true,
        react: {
          runtime: 'automatic',
        },
      },
    },
  }),
  webpackFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      async_hooks: false,
      fs: false,
      path: false,
      util: false,
    };
    return config;
  },
};
export default config;