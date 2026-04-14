import type { EmailDefinition, ReactUIEmail } from './EmailModels';

export function createEmail<Name extends string, Args extends unknown[]>(
  name: Name,
  definition: EmailDefinition<Args>,
): ReactUIEmail<Name, Args> {
  return { name, definition };
}
