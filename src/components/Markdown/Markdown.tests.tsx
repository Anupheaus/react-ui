import { render } from '@testing-library/react';
import { UIState } from '../../providers/UIStateProvider';
import { Markdown } from './Markdown';

// The preview renders raw HTML (rehype-raw), so markdown that carries an iframe, a script, an event handler or a
// javascript: link would run same-origin. Callers sanitise what they pass in, but the component is a second barrier.

const HOSTILE_MARKDOWN = [
  '<iframe srcdoc="<script>parent.hacked = true</script>"></iframe>',
  '',
  '<script>window.hacked = true;</script>',
  '',
  '<img src="x" onerror="window.hacked = true">',
  '',
  '[click me](javascript:alert(1))',
].join('\n');

const TERMS_MARKDOWN = [
  '# Terms and conditions',
  '',
  '## Payment',
  '',
  '- A **deposit** is due on acceptance.',
  '- The balance is due on fitting.',
  '',
  'Read more at [our website](https://example.com/terms), [email us](mailto:office@example.com) or [call us](tel:01234567890).',
].join('\n');

class IntersectionObserverStub {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

function renderMarkdown(value: string, isReadOnly: boolean): HTMLElement {
  const { container } = render(
    <UIState isReadOnly={isReadOnly}>
      <Markdown value={value} />
    </UIState>,
  );
  return container;
}

describe('Markdown', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe.each([
    { mode: 'read-only', isReadOnly: true },
    { mode: 'live preview', isReadOnly: false },
  ])('$mode', ({ isReadOnly }) => {
    it('renders no iframe, script, event handler or javascript: link', () => {
      const container = renderMarkdown(HOSTILE_MARKDOWN, isReadOnly);
      const preview = container.querySelector('.wmde-markdown');

      expect(preview).not.toBeNull();
      expect(preview?.querySelector('iframe')).toBeNull();
      expect(preview?.querySelector('script')).toBeNull();
      expect(preview?.querySelector('[onerror]')).toBeNull();
      expect(preview?.querySelector('a[href^="javascript:"]')).toBeNull();
    });

    it('still renders headings, lists, bold and https, mailto and tel links', () => {
      const container = renderMarkdown(TERMS_MARKDOWN, isReadOnly);
      const preview = container.querySelector('.wmde-markdown');

      expect(preview?.querySelector('h1')?.textContent).toContain('Terms and conditions');
      expect(preview?.querySelector('h2')?.textContent).toContain('Payment');
      expect(preview?.querySelectorAll('ul > li')).toHaveLength(2);
      expect(preview?.querySelector('strong')?.textContent).toBe('deposit');
      expect(preview?.querySelector('a[href="https://example.com/terms"]')?.textContent).toBe('our website');
      expect(preview?.querySelector('a[href="mailto:office@example.com"]')?.textContent).toBe('email us');
      expect(preview?.querySelector('a[href="tel:01234567890"]')?.textContent).toBe('call us');
    });
  });
});
