import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedIslamicBackground from "@/components/EnhancedIslamicBackground";
import { ArrowRight, FileText, AlertCircle, CheckCircle } from "lucide-react";

export default function Terms() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "شروط الحجز والإلغاء",
      items: [
        "يجب دفع عربون لا يقل عن 30% من قيمة الباقة عند الحجز",
        "إلغاء الحجز قبل 60 يوماً من تاريخ السفر: خصم 20% من المبلغ المدفوع",
        "إلغاء الحجز قبل 30 يوماً من تاريخ السفر: خصم 50% من المبلغ المدفوع",
        "إلغاء الحجز قبل أقل من 30 يوماً: خصم 100% من المبلغ المدفوع",
        "في حالة عدم الحصول على التأشيرة، يتم استرداد كامل المبلغ باستثناء مصاريف التأشيرة",
      ],
    },
    {
      title: "المسؤوليات والالتزامات",
      items: [
        "تتحمل الشركة مسؤولية تنفيذ الخدمات المتفق عليها حسب البرنامج",
        "العميل مسؤول عن صحة وسلامة المستندات المقدمة",
        "الشركة غير مسؤولة عن تأخير أو إلغاء الرحلات بسبب ظروف خارجة عن إرادتها",
        "العميل مسؤول عن الالتزام بقوانين وأنظمة المملكة العربية السعودية",
        "الشركة محق في إنهاء الخدمة في حالة مخالفة العميل للأنظمة",
      ],
    },
    {
      title: "الأسعار والدفع",
      items: [
        "الأسعار المعلنة شاملة لجميع الخدمات المذكورة في البرنامج",
        "قد تتغير الأسعار بناءً على تغيير أسعار الطيران أو الفنادق",
        "يتم الدفع بالعملة المحلية (الجنيه المصري) ما لم يُذكر خلاف ذلك",
        "جميع المدفوعات غير قابلة للاسترداد إلا وفقاً لشروط الإلغاء",
        "الشركة محق في طلب دفع رسوم إضافية في حالة زيادة التكاليف",
      ],
    },
    {
      title: "التأمين والسلامة",
      items: [
        "جميع الرحلات مؤمن عليها بتأمين شامل ضد المخاطر",
        "التأمين يشمل العلاج الطبي الطارئ والإخلاء الطبي",
        "العميل مسؤول عن الإفصاح عن أي حالة طبية خاصة",
        "الشركة محق في رفض السفر للعملاء غير اللائقين صحياً",
        "يُنصح العملاء بأخذ التطعيمات اللازمة قبل السفر",
      ],
    },
  ];

  return (
    <div className="min-h-screen rtl relative" dir="rtl">
      <EnhancedIslamicBackground />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-600/30">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-gray-300 hover:text-red-400 p-2"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              العودة
            </Button>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F6e6933d312b74b23a89dafd2e32a307b%2Fd916b8a876584dc48a2246340e732356?format=webp&width=800"
                alt="تيراتراف"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg font-bold text-white">تيراتراف</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
                الشروط والأحكام
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
                يرجى قراءة الشروط والأحكام بعناية قبل إتمام عملية الحجز
              </p>
            </div>

            {/* Important Notice */}
            <Card className="bg-gradient-to-r from-red-900/40 to-red-800/40 backdrop-blur-md border-red-500/50 mb-8">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <AlertCircle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-red-100 mb-2">
                      تنبيه مهم
                    </h3>
                    <p className="text-red-200 leading-relaxed">
                      بإتمام عملية الحجز، فإنك توافق على جميع الشروط والأحكام
                      المذكورة أدناه. يُنصح بطباعة هذه الصفحة للرجوع إليها عند
                      الحاجة.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/80 backdrop-blur-md border-red-500/30"
                >
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center">
                      <CheckCircle className="w-6 h-6 ml-2 text-green-400" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start space-x-3 rtl:space-x-reverse"
                        >
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-200 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact for Questions */}
            <Card className="bg-gradient-to-r from-green-900/40 to-green-800/40 backdrop-blur-md border-green-500/50 mt-12">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-green-100 mb-4">
                    هل لديك أسئلة حول الشروط والأحكام؟
                  </h3>
                  <p className="text-green-200 mb-6">
                    فريق خدمة العملاء لدينا جاهز للإجابة على جميع استفساراتك
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => navigate("/#contact")}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                    >
                      تواصل معنا
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open("https://wa.me/201201666688", "_blank")
                      }
                      className="border-green-400 text-green-300 hover:bg-green-600 hover:text-white px-6 py-3"
                    >
                      واتساب
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Updated */}
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                آخر تحديث: {new Date().toLocaleDateString("ar-EG")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
