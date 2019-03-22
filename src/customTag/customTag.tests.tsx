import { mount } from 'enzyme';
import { CustomTag } from './customTag';
import { CustomTagPrefix } from './customTagPrefix';

describe('customTag', () => {

  [
    { prefix: '', title: 'without prefix' },
    { prefix: 'test', title: 'with prefix' },
  ].forEach(({ prefix, title }) => {

    const prefixWithSeparator = prefix.length > 0 ? `${prefix}-` : '';

    describe(title, () => {

      it('can create a custom tag', () => {
        const component = mount((
          <CustomTagPrefix prefix={prefix}>
            <CustomTag name="my-tag" />
          </CustomTagPrefix>
        ));
        expect(component.html()).to.eq(`<${prefixWithSeparator}my-tag></${prefixWithSeparator}my-tag>`);
        component.unmount();
      });

      it('can create a custom tag with some attributes', () => {
        const component = mount((
          <CustomTagPrefix prefix={prefix}>
            <CustomTag name="my-tag" className="boo" style={{ backgroundColor: 'red' }} />
          </CustomTagPrefix>
        ));
        expect(component.html()).to.eq(`<${prefixWithSeparator}my-tag class="boo" style="background-color: red;"></${prefixWithSeparator}my-tag>`);
        component.unmount();
      });

    });

  });

});
