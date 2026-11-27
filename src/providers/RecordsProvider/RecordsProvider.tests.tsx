import { render } from '@testing-library/react';
import { RecordsProvider } from './RecordsProvider';
import { useRecordsProvider } from './useRecordsProvider';

interface Item { id: string; name: string; }

const items: Item[] = [{ id: 'a', name: 'Alpha' }, { id: 'b', name: 'Beta' }];

describe('RecordsProvider get()', () => {
  it('gives every record as an array with no id, and the one record with an id', () => {
    let provider: ReturnType<typeof useRecordsProvider<Item>> | undefined;
    function Reader() { provider = useRecordsProvider<Item>('items'); return null; }
    render(<RecordsProvider typeId="items" records={items}><Reader /></RecordsProvider>);

    const all = provider!.get();
    expect(Array.isArray(all)).toBe(true);
    expect(all).toEqual(items);
    expect(provider!.get('b')).toEqual(items[1]);
    expect(provider!.get('missing')).toBeUndefined();
  });
});
