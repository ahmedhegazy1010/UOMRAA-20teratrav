import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  // توجيه المستخدم مباشرة إلى صفحة باقات العمرة الرئيسية
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/umrah");
    }, 500);
    return () => clearTimeout(timer);
  }, [navigate]);

  // عرض شاشة تحميل بسيطة أثناء التوجيه
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          تيراتراف للسياحة والسفر
        </h1>
        <p className="text-green-600">جاري التحميل...</p>
      </div>
    </div>
  );
}

type DemoResponse = {
  message: string;
};
