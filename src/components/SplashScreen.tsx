import { useEffect, useState } from 'react';
import { Server } from 'lucide-react';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-accent to-primary animate-in fade-in duration-500">
      <div className="text-center space-y-6 animate-in zoom-in duration-700">
        {/* Logo/Icon */}
        <div className="relative mx-auto w-32 h-32">
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl animate-pulse"></div>
          <div className="relative bg-white rounded-3xl p-6 shadow-2xl">
            <Server className="w-full h-full text-primary" strokeWidth={1.5} />
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg animate-in slide-in-from-bottom-4 duration-700 delay-300">
            مدير الاستضافات
          </h1>
          <p className="text-white/90 text-lg animate-in slide-in-from-bottom-4 duration-700 delay-500">
            إدارة آمنة وسهلة لاستضافاتك
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="flex justify-center gap-2 animate-in fade-in duration-700 delay-700">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
