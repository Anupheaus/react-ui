import { Component, ReactNode } from 'react';
import { AnuxError } from '../../errors/types/AnuxError';

interface Props {
  onError(error: AnuxError): JSX.Element | null;
  children?: ReactNode;
}

interface State {
  error: AnuxError | undefined;
}

export class LocalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: undefined };
    this.clearError = this.clearError.bind(this);
  }

  static getDerivedStateFromError(error: Error): State {
    return { error: new AnuxError({ error }) };
  }

  public render() {
    const error = this.state.error;
    if (error != null) return this.props.onError(error);
    return (<>{this.props.children ?? null}</>);
  }

  private clearError() {
    this.setState({ error: undefined });
  }
}