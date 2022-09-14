import { createStories, StorybookHookProfiler } from '../Storybook';
import { useAsync } from './useAsync';
import 'anux-common';
import expect from 'expect.js';
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
        expect(results.size).to.be(4);
        expect([...results][0]).to.eql({ isLoading: true });
        expect([...results][1]).to.eql({ isLoading: false, response: 'beep 1' });
        expect([...results][2]).to.eql({ isLoading: true, response: 'beep 1' });
        expect([...results][3]).to.eql({ isLoading: false, response: 'beep 2' });
      },
    }),
  },
}));