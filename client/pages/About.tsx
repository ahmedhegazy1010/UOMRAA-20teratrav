import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EnhancedIslamicBackground from "@/components/EnhancedIslamicBackground";
import {
  ArrowRight,
  Shield,
  Award,
  Users,
  MapPin,
  Clock,
  Heart,
  Star,
  CheckCircle,
  Phone,
  MessageCircle,
  Plane,
  Hotel,
} from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, number: "10,000+", label: "عميل سعيد" },
    { icon: Plane, number: "500+", label: "رحلة ناجحة" },
    { icon: Award, number: "15+", label: "سنة خبرة" },
    { icon: Star, number: "4.9", label: "تقييم العملاء" },
  ];

  const services = [
    {
      icon: Plane,
      title: "تذاكر الطيران",
      description: "حجز تذاكر الطيران على أفضل الخطوط الجوية",
    },
    {
      icon: Hotel,
      title: "الإقامة الفندقية",
      description: "فنادق مختارة بعناية قريبة من الحرمين الشريفين",
    },
    {
      icon: Shield,
      title: "التأشيرات",
      description: "إنهاء جميع إجراءات التأشيرة بسهولة ويسر",
    },
    {
      icon: Users,
      title: "الإرشاد السياحي",
      description: "مرشدين متخصصين لإرضادكم طوال الرحلة",
    },
  ];

  const features = [
    "مرخص من وزارة السياحة والحج المصرية",
    "فريق عمل متخصص ومدرب على أعلى مستوى",
    "خدمة عملاء متاحة 24/7",
    "أسعار تنافسية بدون رسوم خفية",
    "تأمين شامل على جميع الرحلات",
    "برامج متنوعة تناسب جميع الميزانيات",
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
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
                من نحن
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
                شركة رائدة في تنظيم رحلات العمرة والحج، نسعى لتقديم أفضل الخدمات
                لضيوف الرحمن
              </p>
            </div>

            {/* About Content */}
            <Card className="bg-gray-900/80 backdrop-blur-md border-red-500/30 mb-12">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Heart className="w-6 h-6 ml-2 text-red-400" />
                  رسالتنا
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 leading-relaxed space-y-4">
                <p className="text-lg">
                  في <strong>تيراتراف</strong>، نؤمن بأن رحلة العمرة ليست مجرد
                  سفر، بل تجربة روحانية تتطلب العناية والاهتمام بكل التفاصيل.
                  نحن نقدم خدماتنا بكل حب وإخلاص لنساعدكم على أداء مناسككم في
                  راحة وطمأنينة.
                </p>
                <p className="text-lg">
                  منذ تأسيسنا عام 2009، نجحنا في خدمة أكثر من 10,000 حاج ومعتمر،
                  وحرصنا على تقديم أعلى مستويات الجودة والخدمة المتميزة. فريقنا
                  المتخصص يعمل بجد لضمان أن تكون رحلتكم إلى بيت الله الحرام ذكرى
                  لا تُنسى.
                </p>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/80 backdrop-blur-md border-red-500/30 text-center p-6 hover:scale-105 transition-transform duration-300"
                >
                  <stat.icon className="w-8 h-8 text-red-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </Card>
              ))}
            </div>

            {/* Services */}
            <Card className="bg-gray-900/80 backdrop-blur-md border-red-500/30 mb-12">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Shield className="w-6 h-6 ml-2 text-red-400" />
                  خدماتنا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 rtl:space-x-reverse p-4 bg-gray-800/50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {service.title}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-gray-900/80 backdrop-blur-md border-red-500/30 mb-12">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Award className="w-6 h-6 ml-2 text-red-400" />
                  لماذا تختار تيراتراف؟
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 rtl:space-x-reverse"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Our Promise */}
            <Card className="bg-gradient-to-r from-red-600/20 to-red-800/20 backdrop-blur-md border-red-500/30 mb-12">
              <CardContent className="text-center p-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  وعدنا لكم
                </h2>
                <p className="text-lg text-gray-200 leading-relaxed">
                  نتعهد بتقديم أفضل الخدمات وأعلى معايير الجودة في كل رحلة.
                  رضاكم هو هدفنا، وراحتكم هي أولويتنا. نحن هنا لنجعل رحلتكم
                  الروحانية تجربة لا تُنسى بإذن الله.
                </p>
                <div className="mt-6 flex justify-center">
                  <Badge className="bg-red-600 text-white px-6 py-2 text-lg">
                    ثقتكم شرف لنا
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-white">جاهزون لخدمتكم</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                تواصلوا معنا اليوم واتركوا لنا تنظيم رحلتكم المقدسة. فريقنا جاهز
                للإجابة على جميع استفساراتكم ومساعدتكم في اختيار الباقة
                المناسبة.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/")}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-lg"
                >
                  <Plane className="w-5 h-5 ml-2" />
                  اطلع على الباقات
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open("https://wa.me/201201666688", "_blank")
                  }
                  className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white px-8 py-3 text-lg"
                >
                  <MessageCircle className="w-5 h-5 ml-2" />
                  تواصل معنا
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
