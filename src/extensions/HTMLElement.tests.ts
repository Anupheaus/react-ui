import './HTMLElement';

describe('HTMLElement.parentElements()', () => {
  it('returns an empty array for an element with no parent', () => {
    const el = document.createElement('div');
    expect(el.parentElements()).toEqual([]);
  });

  it('returns all ancestor elements up to the document root', () => {
    const grandparent = document.createElement('section');
    const parent = document.createElement('div');
    const child = document.createElement('span');
    grandparent.appendChild(parent);
    parent.appendChild(child);
    document.body.appendChild(grandparent);

    const ancestors = child.parentElements();
    expect(ancestors[0]).toBe(parent);
    expect(ancestors[1]).toBe(grandparent);
    expect(ancestors).toContain(document.body);

    document.body.removeChild(grandparent);
  });

  it('stops at the specified untilElement (exclusive)', () => {
    const grandparent = document.createElement('section');
    const parent = document.createElement('div');
    const child = document.createElement('span');
    grandparent.appendChild(parent);
    parent.appendChild(child);
    document.body.appendChild(grandparent);

    const ancestors = child.parentElements(grandparent);
    expect(ancestors).toEqual([parent]);

    document.body.removeChild(grandparent);
  });

  it('returns an empty array when the immediate parent is the until-element', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    parent.appendChild(child);
    document.body.appendChild(parent);

    const ancestors = child.parentElements(parent);
    expect(ancestors).toEqual([]);

    document.body.removeChild(parent);
  });
});

describe('HTMLElement.parentNodes()', () => {
  it('returns an empty array for a detached node with no parent', () => {
    const el = document.createElement('div');
    expect(el.parentNodes()).toEqual([]);
  });

  it('returns all ancestor nodes when called without a limit', () => {
    const grandparent = document.createElement('section');
    const parent = document.createElement('div');
    const child = document.createElement('span');
    grandparent.appendChild(parent);
    parent.appendChild(child);
    document.body.appendChild(grandparent);

    const nodes = child.parentNodes();
    expect(nodes[0]).toBe(parent);
    expect(nodes.length).toBeGreaterThan(0);

    document.body.removeChild(grandparent);
  });

  it('stops at the specified untilNode (exclusive)', () => {
    const grandparent = document.createElement('section');
    const parent = document.createElement('div');
    const child = document.createElement('span');
    grandparent.appendChild(parent);
    parent.appendChild(child);
    document.body.appendChild(grandparent);

    const nodes = child.parentNodes(grandparent);
    expect(nodes).toEqual([parent]);

    document.body.removeChild(grandparent);
  });
});

describe('HTMLElement.isUnderCoordinates()', () => {
  it('returns false for coordinates outside the element (jsdom returns zero dimensions)', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(el.isUnderCoordinates({ x: 9999, y: 9999 })).toBe(false);
    document.body.removeChild(el);
  });
});
