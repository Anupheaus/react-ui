import { Typography } from '@mui/material';
import { ReactNode, useContext } from 'react';
import { anuxPureFC } from '../anuxComponents';
import { theme } from '../theme';
import { StorybookContext } from './StorybookContext';

interface StyleProps {
  width: string | number | undefined;
  height: string | number | undefined;
}

const useStyles = theme.createStyles((_ignore, { width, height }: StyleProps) => ({
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
    width: width ?? 'max-content',
    height,
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
}));

interface Props {
  title: ReactNode;
  notes?: ReactNode;
  width?: string | number;
  height?: string | number;
}

export const StorybookComponent = anuxPureFC<Props>('StorybookComponent', ({
  title,
  notes,
  width,
  height,
  children = null,
}) => {
  const { classes, join } = useStyles({ width, height });
  const { isTestBorderVisible } = useContext(StorybookContext);
  if (children == null) return null;
  return (
    <div className={classes.storybookComponent}>
      <Typography className={classes.title} variant={'h5'}>{title}</Typography>
      {notes != null && <Typography className={classes.notes} variant={'body1'}>{notes}</Typography>}
      <div className={join(classes.componentTestArea, isTestBorderVisible && classes.showBorder)}>
        {children}
      </div>
    </div>
  );
});
