import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminLogin from "@/pages/AdminLogin";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          {/* Loading animation */}
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse mx-auto">
            <span className="text-white font-bold text-2xl">T</span>
          </div>

          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>

          <p className="text-gray-400 text-lg" dir="rtl">
            جاري التحقق من صلاحيات الوصول...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLogin={() => {
          // Force a re-render by updating the auth context
          window.location.reload();
        }}
      />
    );
  }

  // If authenticated, show the protected content
  return <>{children}</>;
}
