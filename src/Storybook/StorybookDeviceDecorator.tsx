import type { Decorator } from '@storybook/react-webpack5';
import type { DeviceType } from '../theme';
import { StorybookDeviceProvider } from './StorybookDeviceProvider';

// The toolbar's neutral option: defer to whatever the story declares via `parameters.device`.
const followStory = 'auto';

/**
 * Resolves the device a story should render as. The Device toolbar wins when set to a concrete device,
 * otherwise the story's own `parameters.device` applies, otherwise we fall back to `web`.
 */
function resolveStoryDevice(toolbarDevice: unknown, parameterDevice: unknown): DeviceType {
  if (typeof toolbarDevice === 'string' && toolbarDevice !== followStory) return toolbarDevice as DeviceType;
  if (typeof parameterDevice === 'string') return parameterDevice as DeviceType;
  return 'web';
}

/** Global decorator that lets any story be rendered as a web, tablet, or mobile device. */
export const StorybookDeviceDecorator: Decorator = (Story, { globals, parameters }) => {
  const device = resolveStoryDevice(globals['device'], parameters['device']);
  return (
    <StorybookDeviceProvider device={device}>
      <Story />
    </StorybookDeviceProvider>
  );
};
