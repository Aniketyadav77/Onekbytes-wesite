'use client';

import React, { ReactNode, ReactElement } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-8 max-w-md w-full">
              <h1 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong</h1>
              <p className="text-gray-300 mb-4">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
              {this.state.error && (
                <details className="text-xs text-gray-400 mb-4">
                  <summary className="cursor-pointer hover:text-gray-300 mb-2">Error details</summary>
                  <pre className="bg-gray-900 p-2 rounded overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        );
    }

    return this.props.children as ReactElement;
  }
}
