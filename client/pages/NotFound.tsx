import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );

    // إعادة توجيه تلقائية إلى الصفحة الرئيسية بعد 3 ثواني
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center text-white p-8 rounded-lg bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-2xl">
        <div className="mb-6">
          <h1 className="text-6xl font-bold mb-4 text-red-400">404</h1>
          <h2 className="text-2xl font-semibold mb-2">الصفحة غير موجودة</h2>
          <p className="text-lg text-slate-300 mb-6">
            عذراً، لم نتمكن من العثور على الصفحة المطلوبة
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg"
            size="lg"
          >
            <Home className="w-5 h-5 ml-2" />
            عودة للصفحة الرئيسية
          </Button>

          <p className="text-sm text-slate-400 flex items-center justify-center">
            <ArrowRight className="w-4 h-4 ml-1" />
            سيتم إعادة التوجيه تلقائياً بعد 3 ثواني
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
