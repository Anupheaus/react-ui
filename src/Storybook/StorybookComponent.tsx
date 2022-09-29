import { Typography } from '@mui/material';
import { CSSProperties, ReactNode, useContext, useMemo } from 'react';
import { pureFC } from '../anuxComponents';
import { StorybookContext } from './StorybookContext';

interface Props {
  title: ReactNode;
  notes?: ReactNode;
  width?: string | number;
  height?: string | number;
}

export const StorybookComponent = pureFC<Props>()('StorybookComponent', {
  storybookComponent: {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'column',
  },
  title: {
    paddingBottom: 12,
  },
  notes: {
    paddingBottom: 12,
  },
  componentTestArea: {
    display: 'flex',
    flex: 'none',
    position: 'relative',
  },
  showBorder: {
    padding: 10,

    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderStyle: 'dashed',
      borderWidth: '10px 0',
      borderImage: 'repeating-linear-gradient(90deg, #D0D7DC, #D0D7DC 10px, #7c8084 10px, #7c8084 20px) 1',
      pointerEvents: 'none',
    },

    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderStyle: 'solid',
      borderWidth: '0 10px',
      borderImage: 'repeating-linear-gradient(0deg, #D0D7DC, #D0D7DC 10px, #7c8084 10px, #7c8084 20px) 1',
      pointerEvents: 'none',
    }
  },
}, ({
  title,
  notes,
  width,
  height,
  theme: {
    css,
    join,
  },
  children = null,
}) => {
  const { isTestBorderVisible } = useContext(StorybookContext);

  const style = useMemo<CSSProperties>(() => ({
    width: width ?? 'max-content',
    height,
  }), [width, height]);

  if (children == null) return null;

  return (
    <div className={css.storybookComponent}>
      <Typography className={css.title} variant={'h5'}>{title}</Typography>
      {notes != null && <Typography className={css.notes} variant={'body1'}>{notes}</Typography>}
      <div className={join(css.componentTestArea, isTestBorderVisible && css.showBorder)} style={style}>
        {children}
      </div>
    </div>
  );
});
