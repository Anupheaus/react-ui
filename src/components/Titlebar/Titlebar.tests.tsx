import { render } from '@testing-library/react';
import { Titlebar } from './Titlebar';

/** jsdom lays nothing out, so a test says how wide the titlebar's parts need to be and how wide it is. */
function stubTitlebarWidths({ scrollWidth, clientWidth }: { scrollWidth: number; clientWidth: number }): void {
  const widthOf = (element: HTMLElement, width: number) => (element.tagName.toLowerCase() === 'titlebar' ? width : 0);
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function scrollWidthOf(this: HTMLElement) { return widthOf(this, scrollWidth); });
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function clientWidthOf(this: HTMLElement) { return widthOf(this, clientWidth); });
}

function renderTitlebar(wrapWhenCrowded: boolean) {
  return render(
    <Titlebar title="Coverage Supplies" icon={<span data-icon="x" />} endAdornment={<button type="button">close</button>} wrapWhenCrowded={wrapWhenCrowded}>
      <button type="button">Import prices</button>
    </Titlebar>,
  );
}

afterEach(() => { vi.restoreAllMocks(); });

describe('Titlebar', () => {
  it('keeps the icon and the title together in one heading, ahead of the content and the end adornment', () => {
    const { container } = renderTitlebar(false);

    const titlebar = container.querySelector('titlebar') as HTMLElement;
    expect(Array.from(titlebar.children).map(child => child.tagName.toLowerCase())).toEqual(['titlebar-heading', 'titlebar-content', 'titlebar-end-adornment']);
    expect(titlebar.querySelector('titlebar-heading [data-icon="x"]')).not.toBeNull();
    expect(titlebar.querySelector('titlebar-heading titlebar-title')?.textContent).toBe('Coverage Supplies');
  });

  it('stays on one row while its parts fit', () => {
    stubTitlebarWidths({ scrollWidth: 800, clientWidth: 800 });

    const { container } = renderTitlebar(true);

    expect(container.querySelector('titlebar.is-crowded')).toBeNull();
  });

  it('wraps when it is asked to and its parts need more width than it has', () => {
    stubTitlebarWidths({ scrollWidth: 640, clientWidth: 270 });

    const { container } = renderTitlebar(true);

    expect(container.querySelector('titlebar.is-crowded')).not.toBeNull();
  });

  it('never wraps unless it is asked to', () => {
    stubTitlebarWidths({ scrollWidth: 640, clientWidth: 270 });

    const { container } = renderTitlebar(false);

    expect(container.querySelector('titlebar.is-crowded')).toBeNull();
  });
});
