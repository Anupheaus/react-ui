/* eslint-disable no-console */
import { mount } from 'enzyme';
import { ReactElement } from 'react';
import { anuxPureFC } from './anuxFunctionComponent';

describe('anuxComponents', () => {

  describe('anuxPureFunctionComponent', () => {
    let originalWarning: typeof console.warn;
    let hasRaisedWarning = false;
    let warningArgs: unknown[] = [];

    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      originalWarning = console.warn;
      hasRaisedWarning = false;
      console.warn = function (...args: unknown[]) {
        warningArgs = args.slice(1);
        hasRaisedWarning = true;
      };
    });

    afterEach(() => {
      console.warn = originalWarning;
      hasRaisedWarning = false;
      warningArgs = [];
    });

    it('does not warn when the children are different', () => {
      const SubComponent = anuxPureFC('SubComponent', ({
        children,
      }) => {
        return (
          <>
            {children ?? null}
          </>
        );
      });

      const Component = anuxPureFC<{ index: number; somethingElse: string }>('Component', ({
        index
      }) => {
        return (
          <SubComponent>{index}</SubComponent>
        );
      });

      const component = mount(<Component index={0} somethingElse={'hey'} />);
      expect(hasRaisedWarning).to.be.false;
      component.setProps({ somethingElse: 'blah' });
      expect(hasRaisedWarning).to.be.false;
      component.unmount();
    });

    it('does warn when the children are different unnecessarily', () => {
      const SubComponent = anuxPureFC<{ children(): ReactElement }>('SubComponent', ({
        children,
      }) => children());

      const Component = anuxPureFC<{ index: number; somethingElse: string }>('Component', ({
        index
      }) => {
        return (
          <SubComponent>{() => <div>{index}</div>}</SubComponent>
        );
      });

      const component = mount(<Component index={0} somethingElse={'hey'} />);
      expect(hasRaisedWarning).to.be.false;
      component.setProps({ somethingElse: 'blah' });
      expect(hasRaisedWarning).to.be.true;
      component.unmount();
    });

    it('does warn when the properties are different unnecessarily', () => {
      const SubComponent = anuxPureFC<{ obj: Object }>('SubComponent', ({
        obj,
      }) => {
        return (
          <div>{obj.toString()}</div>
        );
      });

      const Component = anuxPureFC<{ index: number; somethingElse: string }>('Component', ({
        index,
      }) => {
        const _ignore = index;

        return (
          <SubComponent obj={{ something: 'hey' }} />
        );
      });

      const component = mount(<Component index={0} somethingElse={'hey'} />);
      expect(hasRaisedWarning).to.be.false;
      expect(warningArgs.length).to.eq(0);
      component.setProps({ somethingElse: 'blah' });
      expect(hasRaisedWarning).to.be.true;
      expect(warningArgs.length).to.eq(1);
      expect((warningArgs[0] as []).length).to.eq(1);
      expect((warningArgs[0] as string[])[0]).to.eq('obj');
      component.unmount();
    });

    it('does not warn when the properties are different unnecessarily and in production mode', () => {
      process.env.NODE_ENV = 'production';
      const SubComponent = anuxPureFC<{ obj: Object }>('SubComponent', ({
        obj,
      }) => {
        return (
          <div>{obj.toString()}</div>
        );
      });

      const Component = anuxPureFC<{ index: number; somethingElse: string }>('Component', ({
        index,
      }) => {
        const _ignore = index;

        return (
          <SubComponent obj={{ something: 'hey' }} />
        );
      });

      const component = mount(<Component index={0} somethingElse={'hey'} />);
      expect(hasRaisedWarning).to.be.false;
      component.setProps({ somethingElse: 'blah' });
      expect(hasRaisedWarning).to.be.false;
      component.unmount();
    });

  });

});