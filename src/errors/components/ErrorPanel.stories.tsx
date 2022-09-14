import { anuxPureFC } from '../../anuxComponents';
import { ErrorPanel } from './ErrorPanel';
import { createStories } from '../../Storybook';

const GenerateAnError = anuxPureFC('GenerateAnError', () => {
  console.log('throwing error');
  throw new Error('This is an error');
  return null;
});

async function test1() {
  function test2() {
    async function test3() {
      throw new Error('This is an async error');
    }

    test3();
  }

  try {
    test2();
  } catch (error) {
    console.log('caught error', { error });
  }
}

createStories(() => ({
  module,
  name: 'Errors/Error Panel',
  stories: {
    'Main': () => {

      test1();

      return (
        <ErrorPanel>
          <GenerateAnError />
        </ErrorPanel>
      );
    },
    // 'Vertical': generateSamples({ isVertical: true }),
  },
}));
