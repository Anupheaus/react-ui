import { Button } from '../../../../Button';
import { createComponent } from '../../../../Component';
import { Icon } from '../../../../Icon';
import { GridAction } from '../../actions';

interface Props {
  onRefresh(): void;
}

export const GridRefreshAction = createComponent('GridRefreshAction', ({
  onRefresh,
}: Props) => {
  return (
    <GridAction id={'grid-refresh-action'} ordinal={8000}>
      <Button size={'small'} onClick={onRefresh}><Icon name={'grid-refresh'} /></Button>
    </GridAction>
  );
});
