import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedIslamicBackground from "@/components/EnhancedIslamicBackground";
import {
  ArrowRight,
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

export default function Privacy() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Database,
      title: "جمع المعلومات",
      content: [
        "نقوم بجمع المع��ومات الشخصية التي تقدمها لنا طوعياً عند:",
        "• إنشاء حساب أو حجز رحلة",
        "• الاتصال بخدمة العملاء",
        "• الاشتراك في النشرة الإخبارية",
        "• استخدام موقعنا الإلكتروني",
        "",
        "المعلومات التي نجمعها تشمل:",
        "• الاسم الكامل ومعلومات الهوية",
        "• عنوان البريد الإلكتروني ورقم الهاتف",
        "• عنوان السكن ومعلومات الدفع",
        "• تفضيلات السفر والمتطلبات الخاصة",
      ],
    },
    {
      icon: Lock,
      title: "استخدام المعلومات",
      content: [
        "نستخدم المعلومات المجمعة للأغراض التالية:",
        "• معالجة وإدارة حجوزات العمرة والحج",
        "• تقديم خدمة العملاء والدعم الفني",
        "• إرسال تأكيدات الحجز والتحديثات المهمة",
        "• تحسين خدماتنا وتطوير منتجات جديدة",
        "• الامتثال للمتطلبات القانونية والتنظيمية",
        "",
        "لن نستخدم معلوماتك لأغراض تسويقية دون موافقتك الصريحة.",
      ],
    },
    {
      icon: UserCheck,
      title: "مشاركة المعلومات",
      content: [
        "قد نشارك معلوماتك الشخصية مع:",
        "• شركات الطيران والفنادق لإتمام حجوزاتك",
        "• السلطات الحكومية للحصول على التأشيرات",
        "• شركات التأمين لتوفير التغطية التأمينية",
        "• مقدمي الخدمات الذين يساعدوننا في تشغيل أعمالنا",
        "",
        "جميع الأطراف الثالثة ملزمة بحماية معلوماتك وفقاً لاتفاقيات السرية.",
        "لن نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة.",
      ],
    },
    {
      icon: Shield,
      title: "حماية المعلومات",
      content: [
        "نتخذ تدابير أمنية صارمة لحماية معلوماتك:",
        "• تشفير SSL لجميع عمليات نقل البيانات",
        "• خوادم آمنة مع جدران حماية متقدمة",
        "• تحديث منتظم لأ��ظمة الأمان",
        "• تدريب الموظفين على أفضل ممارسات الأمن",
        "• وصول محدود للمعلومات الشخصية حسب الحاجة",
        "",
        "رغم كل الاحتياطات، لا يمكن ضمان الأمان التام عبر الإنترنت 100%.",
      ],
    },
    {
      icon: Eye,
      title: "حقوقك",
      content: [
        "لديك الحقوق التالية فيما يتعلق بمعلوماتك الشخصية:",
        "• الحق في الوصول إلى معلوماتك المحفوظة لدينا",
        "• الحق في تصحيح أي معلومات غير صحيحة",
        "• الحق في طلب حذف معلوماتك (في حدود القانون)",
        "• الحق في الاعتراض على معالجة معلوماتك",
        "• الحق في نقل معلوماتك إلى مقدم خدمة آخر",
        "",
        "لممارسة أي من هذه الحقوق، يرجى الاتصال بنا.",
      ],
    },
    {
      icon: AlertTriangle,
      title: "ملفات تعريف الارتباط",
      content: [
        "نستخدم ملفات تعريف الارتباط (Cookies) لـ:",
        "• تحسين تجربة استخدام الموقع",
        "• تذكر تفضيلاتك وإعداداتك",
        "• تحليل حركة المرور على الموقع",
        "• تقديم محتوى مخصص",
        "",
        "يمكنك تعطيل ملفات تعريف الارتباط من إعدادات المتصفح،",
        "لكن هذا قد يؤثر على وظائف الموقع.",
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
                src="https://cdn.builder.io/o/assets%2F6e6933d312b74b23a89dafd2e32a307b%2F331dc497cf8948eeab1b0314f9019b47?alt=media&token=d7e14e32-f441-4824-978d-9df3e06b6cc7&apiKey=6e6933d312b74b23a89dafd2e32a307b"
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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                سياسة الخصوصية
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
                نحن ملتزمون بحماية خصوصيتك وأمان معلوماتك الشخصية
              </p>
            </div>

            {/* Important Notice */}
            <Card className="bg-gradient-to-r from-blue-900/40 to-blue-800/40 backdrop-blur-md border-blue-500/50 mb-8">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <Lock className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-blue-100 mb-2">
                      التزامنا بالخصوصية
                    </h3>
                    <p className="text-blue-200 leading-relaxed">
                      في تيراتراف، نؤمن بأن خصوصيتك حق أساسي. نتعامل مع معلوماتك
                      الشخصية بأقصى درجات الحذر والمسؤولية، ونلتزم بأعلى معايير
                      الأمان والشفافية.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/80 backdrop-blur-md border-red-500/30"
                >
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center">
                      <section.icon className="w-6 h-6 ml-2 text-blue-400" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.content.map((line, lineIndex) => (
                        <p
                          key={lineIndex}
                          className={`text-gray-200 leading-relaxed ${
                            line.startsWith("•") ? "mr-4" : ""
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Information */}
            <Card className="bg-gradient-to-r from-green-900/40 to-green-800/40 backdrop-blur-md border-green-500/50 mt-12">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-green-100 mb-4">
                    للاستفسار حول سياسة الخصوصية
                  </h3>
                  <p className="text-green-200 mb-6">
                    إذا كان لديك أي أسئلة حول سياسة الخصوصية أو ترغب في ممارسة
                    حقوقك المتعلقة بالبيانات، لا تتردد في التواصل معنا
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
                        window.open("mailto:info@teratrav.com", "_blank")
                      }
                      className="border-green-400 text-green-300 hover:bg-green-600 hover:text-white px-6 py-3"
                    >
                      البريد الإلكتروني
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates Notice */}
            <Card className="bg-gradient-to-r from-amber-900/40 to-amber-800/40 backdrop-blur-md border-amber-500/50 mt-8">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <AlertTriangle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-amber-100 mb-2">
                      تحديثات السياسة
                    </h3>
                    <p className="text-amber-200 leading-relaxed">
                      قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سنقوم بإشعارك
                      بأي تغييرات مهمة عبر البريد الإلكتروني أو من خلال إشعار
                      واضح على موقعنا الإلكتروني.
                    </p>
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
