import { PureComponent } from 'react';
import { AnuxErrorHandler } from './ErrorHandler';
import { ErrorHandlerProps } from './models';

interface Props extends ErrorHandlerProps { }

interface State {
  error: Error | undefined;
}

export class AnuxErrorBoundary extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: undefined };
    this.clearError = this.clearError.bind(this);
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  public render() {
    return (<AnuxErrorHandler {...this.props} error={this.state.error} onClearError={this.clearError} />);
  }

  private clearError() {
    this.setState({ error: undefined });
  }

}
