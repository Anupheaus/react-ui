import { ReactNode, useMemo } from 'react';
import { createComponent } from '../../components/Component';
import { LocaleContext, LocaleContextProps } from './LocaleContext';
import { Settings } from 'luxon';
import { LocaleSettings } from './LocaleModels';
import { useBound } from '../../hooks/useBound';

interface Props {
  settings: LocaleSettings;
  children: ReactNode;
  onChange?(settings: LocaleSettings): void;
}

export const LocaleProvider = createComponent('LocaleProvider', ({
  settings,
  children,
  onChange,
}: Props) => {

  if (settings) Settings.defaultLocale = settings?.locale;

  const handleChange = useBound((newSettings: LocaleSettings) => {
    Settings.defaultLocale = newSettings.locale;
    onChange?.(newSettings);
  });

  const context = useMemo<LocaleContextProps>(() => ({
    settings,
    onChange: handleChange,
  }), [settings]);

  return (
    <LocaleContext.Provider value={context}>
      {children}
    </LocaleContext.Provider>
  );
});
