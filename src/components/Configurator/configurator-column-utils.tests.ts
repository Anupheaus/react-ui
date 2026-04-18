import { convertFirstCellIntoConfiguratorItem, isFirstItem } from './configurator-column-utils';

describe('convertFirstCellIntoConfiguratorItem', () => {
  it('returns a ConfiguratorItem with id "first-cell"', () => {
    const item = convertFirstCellIntoConfiguratorItem(undefined, () => null);
    expect(item.id).toBe('first-cell');
  });

  it('uses firstCell.label as text when label is a string', () => {
    const item = convertFirstCellIntoConfiguratorItem({ label: 'My Label' } as any, () => null);
    expect(item.text).toBe('My Label');
  });

  it('falls back to "Item" when label is absent', () => {
    const item = convertFirstCellIntoConfiguratorItem(undefined, () => null);
    expect(item.text).toBe('Item');
  });

  it('attaches the renderCell function', () => {
    const render = () => null;
    const item = convertFirstCellIntoConfiguratorItem(undefined, render);
    expect(item.renderCell).toBe(render);
  });
});

describe('isFirstItem', () => {
  it('returns true for items created by convertFirstCellIntoConfiguratorItem', () => {
    const item = convertFirstCellIntoConfiguratorItem(undefined, () => null);
    expect(isFirstItem(item)).toBe(true);
  });

  it('returns false for regular items', () => {
    const regularItem = { id: 'other', text: 'Other', data: {}, subItems: [] } as any;
    expect(isFirstItem(regularItem)).toBe(false);
  });
});
