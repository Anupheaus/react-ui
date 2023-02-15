import { Error as CommonError } from '@anupheaus/common';
import { Component, ReactNode } from 'react';

interface Props {
  onError(error: CommonError): JSX.Element | null;
  children?: ReactNode;
}

interface State {
  error: CommonError | undefined;
}

export class LocalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: undefined };
    this.clearError = this.clearError.bind(this);
  }

  static getDerivedStateFromError(error: Error): State {
    return { error: new CommonError({ error }) };
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