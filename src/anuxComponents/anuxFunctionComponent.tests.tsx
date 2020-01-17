import { mount } from 'enzyme';
import { ReactElement } from 'react';
import { anuxPureFunctionComponent } from './anuxFunctionComponent';

describe('anuxComponents', () => {

  describe('anuxPureFunctionComponent', () => {
    let originalWarning: typeof console.warn = null;
    let hasRaisedWarning = false;
    let warningArgs: any[] = [];

    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      originalWarning = console.warn;
      hasRaisedWarning = false;
      console.warn = function () {
        warningArgs = Array.from(arguments).slice(1);
        hasRaisedWarning = true;
      };
    });

    afterEach(() => {
      console.warn = originalWarning;
      originalWarning = null;
      hasRaisedWarning = false;
      warningArgs = [];
    });

    it('does not warn when the children are different', () => {
      const SubComponent = anuxPureFunctionComponent('SubComponent', ({
        children,
      }) => {
        return (
          <>
            {children || null}
          </>
        );
      });

      const Component = anuxPureFunctionComponent<{ index: number; somethingElse: string }>('Component', ({
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
      const SubComponent = anuxPureFunctionComponent<{ children(): ReactElement }>('SubComponent', ({
        children,
      }) => children());

      const Component = anuxPureFunctionComponent<{ index: number; somethingElse: string }>('Component', ({
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
      const SubComponent = anuxPureFunctionComponent<{ obj: Object }>('SubComponent', ({
        obj,
      }) => {
        return (
          <div>{obj.toString()}</div>
        );
      });

      const Component = anuxPureFunctionComponent<{ index: number; somethingElse: string }>('Component', ({
        index,
      }) => {
        // @ts-ignore
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
      expect(warningArgs[0].length).to.eq(1);
      expect(warningArgs[0][0]).to.eq('obj');
      component.unmount();
    });

    it('does not warn when the properties are different unnecessarily and in production mode', () => {
      process.env.NODE_ENV = 'production';
      const SubComponent = anuxPureFunctionComponent<{ obj: Object }>('SubComponent', ({
        obj,
      }) => {
        return (
          <div>{obj.toString()}</div>
        );
      });

      const Component = anuxPureFunctionComponent<{ index: number; somethingElse: string }>('Component', ({
        index,
      }) => {
        // @ts-ignore
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