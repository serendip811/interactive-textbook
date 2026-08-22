import { Component, type ErrorInfo, type ReactNode } from 'react';
export class ErrorBoundary extends Component<{ children: ReactNode }, { error?: Error }> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Player rendering failed', error, info); }
  render() { if (this.state.error) return <main className="fatal" role="alert"><h1>화면을 표시하지 못했습니다.</h1><p>{this.state.error.message}</p><button onClick={() => this.setState({ error: undefined })}>다시 시도</button></main>; return this.props.children; }
}
