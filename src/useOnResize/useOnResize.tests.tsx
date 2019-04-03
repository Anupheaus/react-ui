import { FunctionComponent, CSSProperties } from 'react';
import { useOnResize } from './useOnResize';
import { mount, ReactWrapper } from 'enzyme';
import { ISize } from 'anux-common';

describe('useOnResize', () => {

  interface ITestConfig {
    full: ISize;
    visible: ISize;
  }

  function createTest(sizes: ITestConfig) {
    const state = {
      visible: { width: 0, height: 0 },
      prevVisible: { width: 0, height: 0 },
      visibleCount: 0,
      full: { width: 0, height: 0 },
      prevFull: { width: 0, height: 0 },
      fullCount: 0,
      component: undefined as ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>,
    };
    const Component: FunctionComponent<{ style: CSSProperties; }> = ({ style }) => {
      let watchForResizes = useOnResize({
        onVisible: (size, prevSize) => {
          state.visible = size;
          state.prevVisible = prevSize;
          state.visibleCount++;
        },
        onFull: (size, prevSize) => {
          state.full = size;
          state.prevFull = prevSize;
          state.fullCount++;
        },
      });

      const originalWatchForResizes = watchForResizes;
      watchForResizes = ((element: any) => {
        if (element) {
          element.clientWidth = sizes.visible.width;
          element.clientHeight = sizes.visible.height;
          element.scrollWidth = sizes.full.width;
          element.scrollHeight = sizes.full.height;
        }
        return originalWatchForResizes(element);
      }) as any;

      return (
        <div ref={watchForResizes} style={style}></div>
      );
    };
    document.body.innerHTML = '<div id="test"></div>';

    state.component = mount((
      <Component style={{ width: sizes.visible.width, height: sizes.visible.height }} />
    ));
    return state;
  }

  it('informs on first use', () => {
    const test = createTest({ full: { width: 200, height: 200 }, visible: { width: 200, height: 200 } });
    expect(test.full.width).to.eq(200);
    expect(test.full.height).to.eq(200);
    expect(test.fullCount).to.eq(1);
    expect(test.visible.width).to.eq(200);
    expect(test.visible.height).to.eq(200);
    expect(test.visibleCount).to.eq(1);
    expect(test.prevFull).to.eq(test.full);
    expect(test.prevVisible).to.eq(test.visible);
    test.component.unmount();
  });

  it('updates when resized using ResizeObserver', () => {
    const test = createTest({ full: { width: 200, height: 200 }, visible: { width: 200, height: 200 } });
    expect(test.full.width).to.eq(200);
    expect(test.full.height).to.eq(200);
    expect(test.fullCount).to.eq(1);
    const element = test.component.childAt(0).getDOMNode() as any;
    element.clientWidth = 300;
    element.clientHeight = 300;
    window['resizeObserver'].triggerOn(element);
    expect(test.full.width).to.eq(200);
    expect(test.full.height).to.eq(200);
    expect(test.fullCount).to.eq(1);
    test.component.unmount();
  });

});
