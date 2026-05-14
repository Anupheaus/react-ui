import { render, screen } from '@testing-library/react';
import { createComponentOverrides } from './createComponentOverrides';

describe('createComponentOverrides', () => {

  describe('overrideProps', () => {
    it('returns the original props when no Overrides wrapper is present', () => {
      const { overrideProps } = createComponentOverrides();

      const TestComp = () => {
        const props = overrideProps({ value: 'original' });
        return <div data-testid="result">{props.value as string}</div>;
      };

      render(<TestComp />);
      expect(screen.getByTestId('result')).toHaveTextContent('original');
    });

    it('merges Overrides props into the component props', () => {
      const { overrideProps, Overrides } = createComponentOverrides();

      const TestComp = ({ value }: { value: string }) => {
        const props = overrideProps({ value });
        return <div data-testid="result">{props.value as string}</div>;
      };

      render(
        <Overrides value="overridden">
          <TestComp value="original" />
        </Overrides>
      );
      expect(screen.getByTestId('result')).toHaveTextContent('overridden');
    });

    it('override props take precedence over component props', () => {
      const { overrideProps, Overrides } = createComponentOverrides();

      const TestComp = ({ a, b }: { a: string; b: string }) => {
        const props = overrideProps({ a, b });
        return <div data-testid="result">{`${props.a as string}|${props.b as string}`}</div>;
      };

      render(
        <Overrides b="override-b">
          <TestComp a="original-a" b="original-b" />
        </Overrides>
      );
      expect(screen.getByTestId('result')).toHaveTextContent('original-a|override-b');
    });

    it('component props not present in Overrides are passed through unchanged', () => {
      const { overrideProps, Overrides } = createComponentOverrides();

      const TestComp = ({ a, b }: { a: string; b: string }) => {
        const props = overrideProps({ a, b });
        return <div data-testid="result">{`${props.a as string}|${props.b as string}`}</div>;
      };

      render(
        <Overrides b="override-b">
          <TestComp a="only-a" b="ignored-b" />
        </Overrides>
      );
      expect(screen.getByTestId('result')).toHaveTextContent('only-a|override-b');
    });
  });

  describe('Overrides component', () => {
    it('renders its children', () => {
      const { Overrides } = createComponentOverrides();

      render(
        <Overrides>
          <div data-testid="child">hello</div>
        </Overrides>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('context isolation between instances', () => {
    it('two instances have independent contexts', () => {
      const { overrideProps: overrideA, Overrides: OverridesA } = createComponentOverrides();
      const { overrideProps: overrideB, Overrides: OverridesB } = createComponentOverrides();

      const CompA = ({ value }: { value: string }) => {
        const props = overrideA({ value });
        return <div data-testid="a">{props.value as string}</div>;
      };

      const CompB = ({ value }: { value: string }) => {
        const props = overrideB({ value });
        return <div data-testid="b">{props.value as string}</div>;
      };

      render(
        <OverridesA value="override-a">
          <OverridesB value="override-b">
            <CompA value="original" />
            <CompB value="original" />
          </OverridesB>
        </OverridesA>
      );

      expect(screen.getByTestId('a')).toHaveTextContent('override-a');
      expect(screen.getByTestId('b')).toHaveTextContent('override-b');
    });

    it('OverridesA does not affect a component using a different instance', () => {
      const { Overrides: OverridesA } = createComponentOverrides();
      const { overrideProps: overrideB } = createComponentOverrides();

      const CompB = ({ value }: { value: string }) => {
        const props = overrideB({ value });
        return <div data-testid="b">{props.value as string}</div>;
      };

      render(
        <OverridesA value="should-not-appear">
          <CompB value="original" />
        </OverridesA>
      );

      expect(screen.getByTestId('b')).toHaveTextContent('original');
    });
  });

});
