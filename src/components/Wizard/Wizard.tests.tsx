import React from 'react';
import { render } from '@testing-library/react';
import { WizardStep } from './Wizard/WizardStep';

describe('WizardStep', () => {
  it('throws when rendered outside a Wizard', () => {
    expect(() => render(<WizardStep>content</WizardStep>)).toThrow('WizardStep must be a child of Wizard');
  });
});
