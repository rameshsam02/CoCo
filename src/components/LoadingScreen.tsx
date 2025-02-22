
import { useState, useEffect } from "react";

export const LoadingScreen = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      {/* Background with data visualization pattern */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234338ca' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Glassmorphic container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-12 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center gap-8 animate-fade-in-up">
          {/* Visual element - Animated graph/chart icon */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 animate-pulse">
              <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500">
                <path 
                  d="M10,90 L90,90 M10,50 L90,50 M10,10 L90,10" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  fill="none"
                  className="opacity-20"
                />
                <path 
                  d="M10,90 L30,50 L50,70 L70,30 L90,10" 
                  stroke="currentColor" 
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-draw"
                />
              </svg>
            </div>
          </div>

          {/* Loading text */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Research in Progress{dots}
            </h2>
            <p className="text-white/80 text-sm">
              Analyzing data and generating insights
            </p>
          </div>

          {/* Loading spinner */}
          <div className="loading-spinner" />
        </div>
      </div>
    </div>
  );
};
