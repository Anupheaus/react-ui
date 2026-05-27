import { TABLE_BODY_SCROLLER_GUTTER_OVERRIDE, TABLE_BODY_SCROLLER_SCROLLBAR_GUTTER } from './tableBodyScrollerLayout';

describe('tableBodyScrollerLayout', () => {
  it('keeps the body scroller on scrollbar-gutter auto so pinned row actions do not drift', () => {
    expect(TABLE_BODY_SCROLLER_SCROLLBAR_GUTTER).toBe('auto');
  });

  it('targets the body scroller-container with the gutter override', () => {
    expect(TABLE_BODY_SCROLLER_GUTTER_OVERRIDE).toEqual({
      '& scroller-container': {
        scrollbarGutter: 'auto',
      },
    });
  });
});
