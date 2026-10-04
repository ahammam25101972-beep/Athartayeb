import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HeartHandshake, RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Athar Tayyib Uncaught Error Boundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4" dir="rtl">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 mx-auto flex items-center justify-center border border-amber-200">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-stone-900 font-quran">
              حدث تنبيه غير متوقع في العرض
            </h2>

            <p className="text-xs text-stone-600 leading-relaxed">
              جميع بياناتك وصفحاتك التذكارية محفوظة بأمان. يمكنك إعادة تحميل الصفحة للعودة فوراً.
            </p>

            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة تشغيل التطبيق</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
