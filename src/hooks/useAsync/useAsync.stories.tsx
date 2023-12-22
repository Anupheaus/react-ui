import { createStories, StorybookHookProfiler } from '../../Storybook';
import { useAsync } from './useAsync';
import '@anupheaus/common';
import { useEffect, useState } from 'react';

createStories(({ createStory }) => ({
  name: 'Hooks/useAsync',
  module,
  stories: {
    'Basic usage': createStory({
      component: () => {
        return (
          <StorybookHookProfiler />
        );
      },
      test: async ({ testHook }) => {
        const { onRender, results } = await testHook(() => {
          const [dependency, setDependency] = useState(1);

          const useAsyncResponse = useAsync(() => {
            return new Promise(resolve => setTimeout(() => resolve(`beep ${dependency}`), 500));
          }, [dependency]);

          useEffect(() => {
            setTimeout(() => setDependency(2), 1500);
          }, []);

          return useAsyncResponse;
        });
        await new Promise<void>((resolve, reject) => {
          onRender(({ renderCount }) => {
            if (renderCount === 4) resolve();
          });
          setTimeout(() => reject(), 3000);
        });
        expect(results.size).toBe(4);
        expect([...results][0]).toBe({ isLoading: true });
        expect([...results][1]).toBe({ isLoading: false, response: 'beep 1' });
        expect([...results][2]).toBe({ isLoading: true, response: 'beep 1' });
        expect([...results][3]).toBe({ isLoading: false, response: 'beep 2' });
      },
    }),
  },
}));