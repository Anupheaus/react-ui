import { FunctionComponent, ReactNode } from 'react';
import { IRecord } from 'anux-common';
import { mount, ReactWrapper } from 'enzyme';
import { useDataState, DataWithState, SetDataStateAction } from './useDataState';

interface IFilter extends IRecord {
  field: string;
  value: string;
}

interface IFilterState {
  isActive: boolean;
}

const filterStateKey = Symbol('something');

describe('useDataState', () => {

  describe('with multiple items', () => {

    interface IProps {
      filters: IFilter[];
      data: (IFilterState & IRecord)[];
      children(currentFilters: DataWithState<IFilter, typeof filterStateKey, IFilterState>[], updateFilterState: SetDataStateAction<IFilter, IFilterState>,
        data: (IFilterState & IRecord)[]): ReactNode;
    }

    interface ITestConfig {
      filters?: IFilter[];
      data?: (IFilterState & IRecord)[];
    }

    function createTestState(config: ITestConfig) {
      config = {
        filters: [],
        data: [],
        ...config,
      };

      const TestComponent: FunctionComponent<IProps> = ({ filters, data, children }) => {
        const [cf, ufs, d] = useDataState(filters, data, filterStateKey, filterStateDataItem => ({
          isActive: true,
          ...filterStateDataItem,
        }));

        return (
          <>
            {children(cf, ufs, d)}
          </>
        );
      };

      const info = {
        currentFilters: null as DataWithState<IFilter, typeof filterStateKey, IFilterState>[],
        updateFilterState: null as SetDataStateAction<IFilter, IFilterState>,
        data: null as (IFilterState & IRecord)[],
        renderCount: 0,
        component: null as ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>,
        dispose() { component.unmount(); },
      };

      const component = mount((
        <TestComponent filters={config.filters} data={config.data}>
          {(f, ufs, d) => {
            info.currentFilters = f;
            info.updateFilterState = ufs;
            info.data = d;
            info.renderCount++;
            return null;
          }}
        </TestComponent>
      ));

      info.component = component;

      return info;
    }

    it('can apply state to items without data', () => {
      const filters: IFilter[] = [
        { id: Math.uniqueId(), field: 'my field', value: 'my value' },
      ];
      const { dispose, currentFilters } = createTestState({ filters });

      expect(currentFilters).to.be.instanceOf(Array).and.have.lengthOf(1);

      const currentFilter = currentFilters[0];
      expect(currentFilter).to.be.an('object');
      expect(currentFilter).to.have.property('id').that.is.a('string').and.has.lengthOf(36);
      expect(currentFilter).to.have.property('field', 'my field');
      expect(currentFilter).to.have.property('value', 'my value');
      expect(currentFilter[filterStateKey]).to.be.an('object');
      expect(currentFilter[filterStateKey]).to.have.property('isActive', true);

      dispose();
    });

    it('can apply the correct state to the correct item', () => {
      const filters: IFilter[] = [
        { id: Math.uniqueId(), field: 'my field 1', value: 'my value 1' },
        { id: Math.uniqueId(), field: 'my field 2', value: 'my value 2' },
      ];
      const data: (IFilterState & IRecord)[] = [
        { id: filters[1].id, isActive: false },
        { id: filters[0].id, isActive: true },
      ];
      const { dispose, currentFilters } = createTestState({ filters, data });

      expect(currentFilters).to.be.instanceOf(Array).and.have.lengthOf(2);

      filters.forEach(filter => {
        const currentFilter = currentFilters.findById(filter.id);
        expect(currentFilter).to.be.an('object');
        expect(currentFilter).to.have.property('id', filter.id);
        expect(currentFilter).to.have.property('field', filter.field);
        expect(currentFilter).to.have.property('value', filter.value);
        const state = data.findById(filter.id);
        const currentState = currentFilter[filterStateKey];
        expect(currentState).to.be.an('object');
        expect(currentState).to.have.property('isActive', state.isActive);
      });

      dispose();
    });

    it('can update a filter state', () => {
      const filters: IFilter[] = [
        { id: Math.uniqueId(), field: 'my field 1', value: 'my value 1' },
        { id: Math.uniqueId(), field: 'my field 2', value: 'my value 2' },
      ];
      const data: (IFilterState & IRecord)[] = [
        { id: filters[1].id, isActive: false },
        { id: filters[0].id, isActive: true },
      ];
      const state = createTestState({ filters, data });

      expect(state.currentFilters[1][filterStateKey].isActive).to.be.false;
      expect(state.renderCount).to.eq(1);
      expect(state.data.map(d => d.isActive)).to.eql([false, true]);
      state.updateFilterState(filters[1], { isActive: true });
      expect(state.currentFilters[1][filterStateKey].isActive).to.be.true;
      expect(state.renderCount).to.eq(2);
      expect(state.data.map(d => d.isActive)).to.eql([true, true]);

      state.dispose();
    });

    it('can have new data and the item states are refreshed', () => {
      const filters: IFilter[] = [
        { id: Math.uniqueId(), field: 'my field 1', value: 'my value 1' },
        { id: Math.uniqueId(), field: 'my field 2', value: 'my value 2' },
      ];
      let data: (IFilterState & IRecord)[] = [
        { id: filters[1].id, isActive: false },
        { id: filters[0].id, isActive: true },
      ];
      const state = createTestState({ filters, data });

      data = data.map(i => ({ ...i }));
      data[0].isActive = true;

      expect(state.currentFilters[1][filterStateKey].isActive).to.be.false;
      expect(state.renderCount).to.eq(1);
      expect(state.data.map(d => d.isActive)).to.eql([false, true]);
      state.component.setProps({ data });
      expect(state.currentFilters[1][filterStateKey].isActive).to.be.true;
      expect(state.renderCount).to.eq(2);
      expect(state.data.map(d => d.isActive)).to.eql([true, true]);

      state.dispose();
    });

  });

  describe('with a single item', () => {

    interface IProps {
      filter: IFilter;
      data: IFilterState & IRecord;
      children(currentFilter: DataWithState<IFilter, typeof filterStateKey, IFilterState>, updateFilterState: SetDataStateAction<IFilter, IFilterState>,
        data: IFilterState & IRecord): ReactNode;
    }

    interface ITestConfig {
      filter?: IFilter;
      data?: IFilterState & IRecord;
    }

    function createTestState(config: ITestConfig) {
      config = {
        filter: null,
        data: null,
        ...config,
      };

      const TestComponent: FunctionComponent<IProps> = ({ filter, data, children }) => {
        const [cf, ufs, d] = useDataState(filter, data, filterStateKey, filterStateDataItem => ({
          isActive: true,
          ...filterStateDataItem,
        }));

        return (
          <>
            {children(cf, ufs, d)}
          </>
        );
      };

      const info = {
        currentFilter: null as DataWithState<IFilter, typeof filterStateKey, IFilterState>,
        updateFilterState: null as SetDataStateAction<IFilter, IFilterState>,
        data: null as IFilterState & IRecord,
        renderCount: 0,
        component: null as ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>,
        dispose() { component.unmount(); },
      };

      const component = mount((
        <TestComponent filter={config.filter} data={config.data}>
          {(f, ufs, d) => {
            info.currentFilter = f;
            info.updateFilterState = ufs;
            info.data = d;
            info.renderCount++;
            return null;
          }}
        </TestComponent>
      ));

      info.component = component;

      return info;
    }

    it('can apply state to items without data', () => {
      const filter: IFilter = { id: Math.uniqueId(), field: 'my field', value: 'my value' };
      const { dispose, currentFilter } = createTestState({ filter });

      expect(currentFilter).to.be.an('object');
      expect(currentFilter).to.have.property('id').that.is.a('string').and.has.lengthOf(36);
      expect(currentFilter).to.have.property('field', 'my field');
      expect(currentFilter).to.have.property('value', 'my value');
      expect(currentFilter[filterStateKey]).to.be.an('object');
      expect(currentFilter[filterStateKey]).to.have.property('isActive', true);

      dispose();
    });

    it('can apply the correct state to the correct item', () => {
      const filter: IFilter = { id: Math.uniqueId(), field: 'my field 1', value: 'my value 1' };
      const data: IFilterState & IRecord = { id: filter.id, isActive: true };
      const { dispose, currentFilter } = createTestState({ filter, data });

      expect(currentFilter).to.be.an('object');
      expect(currentFilter).to.have.property('id', filter.id);
      expect(currentFilter).to.have.property('field', filter.field);
      expect(currentFilter).to.have.property('value', filter.value);
      const currentState = currentFilter[filterStateKey];
      expect(currentState).to.be.an('object');
      expect(currentState).to.have.property('isActive', data.isActive);

      dispose();
    });

    it('can update a filter state', () => {
      const filter: IFilter = { id: Math.uniqueId(), field: 'my field 1', value: 'my value 1' };
      const data: IFilterState & IRecord = { id: filter.id, isActive: false };
      const state = createTestState({ filter, data });

      expect(state.currentFilter[filterStateKey].isActive).to.be.false;
      expect(state.renderCount).to.eq(1);
      state.updateFilterState(filter, { isActive: true });
      expect(state.currentFilter[filterStateKey].isActive).to.be.true;
      expect(state.renderCount).to.eq(2);

      state.dispose();
    });

    it('can have new data and the item states are refreshed', () => {
      const filter: IFilter = { id: Math.uniqueId(), field: 'my field 1', value: 'my value 1' };
      let data: IFilterState & IRecord = { id: filter.id, isActive: false };
      const state = createTestState({ filter, data });

      data = { ...data };
      data.isActive = true;

      expect(state.currentFilter[filterStateKey].isActive).to.be.false;
      expect(state.renderCount).to.eq(1);
      state.component.setProps({ data });
      expect(state.currentFilter[filterStateKey].isActive).to.be.true;
      expect(state.renderCount).to.eq(2);

      state.dispose();
    });

  });

});
