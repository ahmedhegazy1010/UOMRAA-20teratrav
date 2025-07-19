import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MessageCircle,
  Plane,
  Hotel,
  Shield,
  MapPin,
  Gift,
  Users,
  Facebook,
  Instagram,
  CheckCircle,
  Star,
  Clock,
  Home,
} from "lucide-react";

// Dummy package data
const packages = [
  {
    id: 1,
    duration: "8 أيام",
    meccaStay: "4 ليالي - فندق 4 نجوم",
    medinaStay: "3 ليالي - فندق 4 نجوم",
    itinerary: "مكة - المدينة - مكة",
    priceDouble: "25,000",
    priceTriple: "23,000",
    priceQuad: "21,000",
    popular: false,
    color: "bg-amber-500",
  },
  {
    id: 2,
    duration: "10 أيام",
    meccaStay: "5 ليالي - فندق 5 نجوم",
    medinaStay: "4 ليالي - فندق 5 نجوم",
    itinerary: "مكة - المدينة - مكة",
    priceDouble: "35,000",
    priceTriple: "32,000",
    priceQuad: "29,000",
    popular: true,
    color: "bg-emerald-500",
  },
  {
    id: 3,
    duration: "14 يوم",
    meccaStay: "7 ليالي - فندق فاخر",
    medinaStay: "6 ليالي - فندق فاخر",
    itinerary: "مكة - المدينة - مكة",
    priceDouble: "45,000",
    priceTriple: "42,000",
    priceQuad: "38,000",
    popular: false,
    color: "bg-purple-500",
  },
];

const includedItems = [
  { icon: Shield, text: "رسوم التأشيرة" },
  { icon: Plane, text: "تذاكر الطيران" },
  { icon: Hotel, text: "الإقامة الكاملة بفنادق مكة والمدينة" },
  { icon: Users, text: "التنقلات الداخلية بأحدث الباصات" },
  { icon: CheckCircle, text: "إشراف كامل من فريق تيراتراف" },
  { icon: MapPin, text: "زيارات دينية" },
  { icon: Gift, text: "هدايا وشنطة عمرة" },
];

export default function Umrah() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-amber-50 to-white rtl"
      dir="rtl"
    >
      {/* Islamic Geometric Pattern Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.3'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15 0l15 15H0l15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">تيراتراف</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <a
                href="#packages"
                className="text-gray-700 hover:text-amber-600 transition-colors"
              >
                رحلات العمرة
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-amber-600 transition-colors"
              >
                تواصل معنا
              </a>
            </nav>

            {/* CTA Button */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2">
                احجز الآن
              </Button>
              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
                <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
                <div className="w-6 h-0.5 bg-gray-600"></div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-amber-200 py-4">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#packages"
                  className="text-gray-700 hover:text-amber-600 transition-colors px-4"
                >
                  رحلات العمرة
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-amber-600 transition-colors px-4"
                >
                  تواصل معنا
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-black/60 to-black/30 relative">
            <img
              src="/kaaba-placeholder.svg"
              alt="الكعبة المشرفة"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 border border-white/20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              رحلات العمرة - المولد النبوي الشريف
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100 leading-relaxed">
              سافر مع تيراتراف براحة وأمان – باقات متنوعة وخدمة مميزة
            </p>
            <Button
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
            >
              اكتشف الباقات
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section
        id="packages"
        className="py-20 bg-gradient-to-b from-white to-amber-50"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              باقات العمرة المميزة
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اختر الباقة التي تناسبك من مجموعة متنوعة من الخيارات المدروسة
              بعناية
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300 ${pkg.popular ? "ring-2 ring-amber-400 shadow-2xl" : "shadow-lg"}`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-amber-500 text-white px-3 py-1 text-sm font-semibold">
                      الأكثر طلباً
                    </Badge>
                  </div>
                )}

                <div className={`h-2 ${pkg.color}`}></div>

                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div
                      className={`w-16 h-16 ${pkg.color} rounded-full flex items-center justify-center text-white`}
                    >
                      <Clock size={32} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.duration}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    برنامج شامل ومتكامل
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Stay Details */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <Home className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          الإقامة بمكة
                        </p>
                        <p className="text-gray-600 text-sm">{pkg.meccaStay}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <Home className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          الإقامة بالمدينة
                        </p>
                        <p className="text-gray-600 text-sm">
                          {pkg.medinaStay}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">خط السير</p>
                        <p className="text-gray-600 text-sm">{pkg.itinerary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-bold text-gray-900 text-center mb-3">
                      السعر للفرد
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">ثنائي:</span>
                        <span className="font-bold text-amber-600">
                          {pkg.priceDouble} جنيه
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">ثلاثي:</span>
                        <span className="font-bold text-amber-600">
                          {pkg.priceTriple} جنيه
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">رباعي:</span>
                        <span className="font-bold text-amber-600">
                          {pkg.priceQuad} جنيه
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-200">
                    احجز الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              الأسعار تشمل
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              خدمات شاملة ومتكاملة لضمان رحلة مريحة ومباركة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {includedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 rtl:space-x-reverse p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-gray-800 font-semibold text-lg">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-b from-white to-gray-100"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              تواصل معنا
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              فريقنا جاهز لمساعدتك في أي وقت
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Phone Numbers */}
              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  اتصل بنا
                </h3>
                <div className="space-y-3">
                  <a
                    href="tel:0225750707"
                    className="block text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    0225750707
                  </a>
                  <a
                    href="tel:1201666688"
                    className="block text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    1201666688
                  </a>
                </div>
              </Card>

              {/* WhatsApp */}
              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  واتساب
                </h3>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300">
                  تواصل عبر الواتساب
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Description */}
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start space-x-2 rtl:space-x-reverse mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-xl font-bold">تيراتراف</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                رحلات العمرة والحج بأعلى معايير الجودة والخدمة المميزة
              </p>
            </div>

            {/* Social Media */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">تابعنا على</h3>
              <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} TeraTrav. جميع الحقوق محفوظة
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Powered by TeraTrav.com
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
