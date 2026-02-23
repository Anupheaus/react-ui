import { windowsDefinitionsManager } from './WindowDefinitionsManager';
import { createWindowIdFromArgs } from './WindowsUtils';

describe('windowsDefinitionsManager', () => {
  it('supports global registration', () => {
    const definition = () => () => null;
    windowsDefinitionsManager.registerGlobal('TestWindow', definition as never, false);
    expect(windowsDefinitionsManager.getGlobalDefinitionIds()).toContain('TestWindow');
    expect(windowsDefinitionsManager.getGlobalDefinition('TestWindow')).toBeDefined();
  });
});

describe('createWindowIdFromArgs', () => {
  it('returns definitionId when args are empty', () => {
    expect(createWindowIdFromArgs('MyWindow', [])).toBe('MyWindow');
  });

  it('produces same id for same args', () => {
    const id1 = createWindowIdFromArgs('MyWindow', ['arg1', 123]);
    const id2 = createWindowIdFromArgs('MyWindow', ['arg1', 123]);
    expect(id1).toBe(id2);
  });

  it('produces different ids for different args', () => {
    const id1 = createWindowIdFromArgs('MyWindow', ['arg1']);
    const id2 = createWindowIdFromArgs('MyWindow', ['arg2']);
    expect(id1).not.toBe(id2);
  });
});
