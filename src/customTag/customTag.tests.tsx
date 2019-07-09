import { mount } from 'enzyme';
import { CustomTag } from './customTag';
import { useRef, FunctionComponent, MutableRefObject } from 'react';

describe.only('customTag', () => {

  function createWrapper() {
    const result = {
      Component: null as FunctionComponent,
      ref: null as MutableRefObject<HTMLElement>,
    };

    result.Component = () => {
      const ref = useRef<HTMLElement>(null);
      result.ref = ref;
      return (
        <CustomTag name="testing-wrapper" ref={ref}></CustomTag>
      );
    };

    return result;
  }

  it('can create a custom tag', () => {
    const component = mount((
      <CustomTag name="my-tag" />
    ));
    expect(component.html()).to.eq('<my-tag></my-tag>');
    component.unmount();
  });

  it('can create a custom tag with some attributes', () => {
    const component = mount((
      <CustomTag name="my-tag" className="boo" style={{ backgroundColor: 'red' }} />
    ));
    expect(component.html()).to.eq('<my-tag class="boo" style="background-color: red;"></my-tag>');
    component.unmount();
  });

  it('can forward a ref to the underlying element', () => {
    const result = createWrapper();
    const component = mount((
      <result.Component />
    ));
    expect(result.ref.current).to.have.property('children').and.be.instanceOf(window['HTMLCollection']);
    component.unmount();
  });

});
