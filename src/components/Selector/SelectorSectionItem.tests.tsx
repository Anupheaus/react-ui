import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { createElement } from 'react';
import { SelectorSectionItem } from './SelectorSectionItem';
import { UIStateContexts } from '../../providers/UIStateProvider/UIStateContexts';
import type { ReactListItem } from '../../models';

const makeItem = (overrides: Partial<ReactListItem> = {}): ReactListItem => ({
  id: 'item-1',
  text: 'Option A',
  ...overrides,
});

const noop = () => undefined;

describe('SelectorSectionItem', () => {
  describe('when not read-only', () => {
    it('calls onSelect when clicked', () => {
      const onSelect = vi.fn();
      const item = makeItem();
      const { container } = render(
        <SelectorSectionItem item={item} width={0} isSelected={false} onUpdateWidth={noop} onSelect={onSelect} />
      );
      fireEvent.click(container.querySelector('selector-section-item')!);
      expect(onSelect).toHaveBeenCalledWith(item);
    });

    it('does not have is-read-only class', () => {
      const { container } = render(
        <SelectorSectionItem item={makeItem()} width={0} isSelected={false} onUpdateWidth={noop} onSelect={noop} />
      );
      expect(container.querySelector('selector-section-item')!.className).not.toContain('is-read-only');
    });

    it('calls item.onClick when clicked', () => {
      const onClick = vi.fn();
      const item = makeItem({ onClick });
      const { container } = render(
        <SelectorSectionItem item={item} width={0} isSelected={false} onUpdateWidth={noop} onSelect={noop} />
      );
      fireEvent.click(container.querySelector('selector-section-item')!);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('when read-only (via UIState context)', () => {
    const renderReadOnly = (onSelect = vi.fn()) => {
      const item = makeItem();
      const { container } = render(
        createElement(
          UIStateContexts.isReadOnlyContext.Provider,
          { value: true },
          <SelectorSectionItem item={item} width={0} isSelected={false} onUpdateWidth={noop} onSelect={onSelect} />,
        )
      );
      return { container, item, onSelect };
    };

    it('does not call onSelect when clicked', () => {
      const onSelect = vi.fn();
      const { container } = renderReadOnly(onSelect);
      fireEvent.click(container.querySelector('selector-section-item')!);
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('has is-read-only class on the item element', () => {
      const { container } = renderReadOnly();
      expect(container.querySelector('selector-section-item')!.className).toContain('is-read-only');
    });

    it('does not call item.onClick when clicked', () => {
      const onClick = vi.fn();
      const item = makeItem({ onClick });
      render(
        createElement(
          UIStateContexts.isReadOnlyContext.Provider,
          { value: true },
          <SelectorSectionItem item={item} width={0} isSelected={false} onUpdateWidth={noop} onSelect={noop} />,
        )
      );
      // no click fired here — just verifying onClick was never called from mount
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not call item.onClick when item element is clicked', () => {
      const onClick = vi.fn();
      const item = makeItem({ onClick });
      const { container } = render(
        createElement(
          UIStateContexts.isReadOnlyContext.Provider,
          { value: true },
          <SelectorSectionItem item={item} width={0} isSelected={false} onUpdateWidth={noop} onSelect={noop} />,
        )
      );
      fireEvent.click(container.querySelector('selector-section-item')!);
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
