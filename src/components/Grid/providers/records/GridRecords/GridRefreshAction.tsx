import { Button } from '../../../../Button';
import { createComponent } from '../../../../Component';
import { GridAction } from '../../actions';

interface Props {
  onRefresh(): void;
}

export const GridRefreshAction = createComponent('GridRefreshAction', ({
  onRefresh,
}: Props) => {
  return (
    <GridAction id={'grid-refresh-action'} ordinal={8000}>
      <Button icon={'grid-refresh'} size={'small'} onClick={onRefresh} />
    </GridAction>
  );
});
