import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {
      fastRefresh: true,
      builder: {
        useSWC: true,
        fsCache: true,
      },
    },
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: config => {
    const a = {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@anupheaus/common': path.resolve(__dirname, '../../common/src'),
        },
      },
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
    console.log(a);
    return a;
  },
};

export default config;
