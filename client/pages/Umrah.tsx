import React, { useState, useEffect } from "react";
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
  Clock,
  Home,
} from "lucide-react";

export default function Umrah() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch packages from API
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages/active");
      const data = await response.json();
      if (data.success) {
        setPackages(data.data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const openWhatsApp = (packageInfo?: string) => {
    const phoneNumber = "201201666688";
    const baseMessage = "السلام عليكم، أريد الاستفسار عن باقات العمرة";
    const message = packageInfo
      ? `${baseMessage}\n\nباقة ${packageInfo}`
      : baseMessage;
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const includedItems = [
    { icon: Shield, text: "رسوم التأشيرة" },
    { icon: Plane, text: "تذاكر الطيران" },
    { icon: Hotel, text: "الإقامة الكاملة بفنادق مكة والمدينة" },
    { icon: Users, text: "التنقلات الداخلية بأحدث الباصات" },
    { icon: CheckCircle, text: "إشراف كامل من فريق تيراتراف" },
    { icon: MapPin, text: "زيارات دينية" },
    { icon: Gift, text: "هدايا وشنطة عمرة" },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 rtl overflow-x-hidden"
      dir="rtl"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Moving red particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-500 rounded-full opacity-70 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Islamic Geometric Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.4'%3E%3Cpath d='M40 40l20-20v40l-20-20zm-20 0l20 20H0l20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/5 to-black/30" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-red-600/30 shadow-lg shadow-red-500/20 transition-all duration-500">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse transform hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-white bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                تيراتراف
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <button
                onClick={() => scrollToSection("packages")}
                className="text-gray-300 hover:text-red-400 transition-all duration-300 font-medium relative group"
              >
                رحلات العمرة
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-300 hover:text-red-400 transition-all duration-300 font-medium relative group"
              >
                تواصل معنا
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </nav>

            {/* CTA Button */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 shadow-lg shadow-red-500/30 transform hover:scale-105 transition-all duration-300 animate-pulse"
              >
                احجز الآن
              </Button>
              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 transform hover:scale-110 transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="w-6 h-0.5 bg-red-400 mb-1 transition-all duration-300"></div>
                <div className="w-6 h-0.5 bg-red-400 mb-1 transition-all duration-300"></div>
                <div className="w-6 h-0.5 bg-red-400 transition-all duration-300"></div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-red-600/30 py-4 animate-slideDown">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection("packages")}
                  className="text-gray-300 hover:text-red-400 transition-all duration-300 px-4 text-right font-medium transform hover:translate-x-2"
                >
                  رحلات العمرة
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-300 hover:text-red-400 transition-all duration-300 px-4 text-right font-medium transform hover:translate-x-2"
                >
                  تواصل معنا
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-black/80 via-red-900/20 to-black/60 relative">
            <img
              src="/kaaba-placeholder.svg"
              alt="الكعبة المشرفة"
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-red-900/20 to-black/50"></div>
            {/* Animated overlay elements */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-60"></div>
              <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse opacity-80"></div>
              <div
                className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping opacity-50"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6">
          <div className="backdrop-blur-md bg-black/30 rounded-3xl p-6 sm:p-8 md:p-12 border border-red-500/30 shadow-2xl shadow-red-500/20 transform hover:scale-105 transition-all duration-700 animate-fadeInUp">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent animate-pulse">
              رحلات العمرة - المولد النبوي الشريف
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-10 text-gray-200 leading-relaxed animate-slideInLeft">
              سافر مع تيراتراف براحة وأمان – باقات متنوعة وخدمة مميزة
            </p>
            <Button
              size="lg"
              onClick={() => scrollToSection("packages")}
              className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-10 py-6 text-xl font-bold rounded-full shadow-2xl shadow-red-500/40 transform hover:scale-110 transition-all duration-500 animate-bounce border-2 border-red-400/50"
            >
              اكتشف الباقات
            </Button>

            {/* Floating elements around button */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-red-400 rounded-full animate-spin opacity-30"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 border-2 border-white rounded-full animate-ping opacity-40"></div>
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
        className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-red-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 border-2 border-red-400 rounded-full animate-spin slow"></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-gradient-animate">
              باقات العمرة المميزة
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-6 animate-shimmer"></div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              اختر الباقة التي تناسبك من مجموعة متنوعة من الخيارات المدروسة
              بعناية
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl mx-auto">
              {[...Array(3)].map((_, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/80 backdrop-blur-sm border-red-500/30 animate-pulse"
                >
                  <div className="h-64 bg-gray-700 rounded"></div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl mx-auto">
              {packages.map((pkg: any, index) => (
                <Card
                  key={pkg.id}
                  className={`relative overflow-hidden transform hover:scale-105 transition-all duration-500 bg-gray-900/80 backdrop-blur-sm border-red-500/30 shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 animate-fadeInUp ${
                    pkg.popular ? "ring-2 ring-red-400 animate-glow" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 text-sm font-bold animate-pulse shadow-lg">
                        الأكثر طلباً
                      </Badge>
                    </div>
                  )}

                  <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-shimmer"></div>

                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30 animate-float">
                        <Clock size={36} />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white mb-3 animate-slideInLeft">
                      {pkg.duration}
                    </CardTitle>
                    <CardDescription className="text-gray-300 text-lg">
                      برنامج شامل ومتكامل
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Stay Details */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 rtl:space-x-reverse">
                        <Home className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-white">
                            الإقامة بمكة
                          </p>
                          <p className="text-gray-300 text-sm">
                            {pkg.mecca_stay}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 rtl:space-x-reverse">
                        <Home className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-white">
                            الإقامة بالمدينة
                          </p>
                          <p className="text-gray-300 text-sm">
                            {pkg.medina_stay}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 rtl:space-x-reverse">
                        <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-white">خط السير</p>
                          <p className="text-gray-300 text-sm">
                            {pkg.itinerary}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                      <h4 className="font-bold text-white text-center mb-3">
                        السعر للفرد
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">ثنائي:</span>
                          <span className="font-bold text-red-400">
                            {pkg.price_double?.toLocaleString()} جنيه
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">ثلاثي:</span>
                          <span className="font-bold text-red-400">
                            {pkg.price_triple?.toLocaleString()} جنيه
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">رباعي:</span>
                          <span className="font-bold text-red-400">
                            {pkg.price_quad?.toLocaleString()} جنيه
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() =>
                        openWhatsApp(`${pkg.duration} - ${pkg.itinerary}`)
                      }
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/30 animate-glow"
                    >
                      احجز الآن
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-32 h-32 border border-red-500 rounded-full animate-pulse"></div>
          <div
            className="absolute bottom-10 left-10 w-24 h-24 border-2 border-red-400 rounded-full animate-spin"
            style={{ animationDuration: "10s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-gradient-animate">
              الأسعار تشمل
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              خدمات شاملة ومتكاملة لضمان رحلة مريحة ومباركة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {includedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 rtl:space-x-reverse p-6 bg-gray-900/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-red-500/20"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-gray-200 font-semibold text-lg">
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
        className="py-20 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              تواصل معنا
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              فريقنا جاهز لمساعدتك في أي وقت
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Phone Numbers */}
              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 bg-gray-900/80 border-red-500/30">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">اتصل بنا</h3>
                <div className="space-y-3">
                  <a
                    href="tel:0225750707"
                    className="block text-xl font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    0225750707
                  </a>
                  <a
                    href="tel:1201666688"
                    className="block text-xl font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    1201666688
                  </a>
                </div>
              </Card>

              {/* WhatsApp */}
              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 bg-gray-900/80 border-red-500/30">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">واتساب</h3>
                <Button
                  onClick={() => openWhatsApp()}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
                >
                  تواصل عبر الواتساب
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => openWhatsApp()}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate-pulse"
          aria-label="تواصل عبر الواتساب"
        >
          <MessageCircle size={24} />
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-red-600/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Description */}
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start space-x-2 rtl:space-x-reverse mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
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
                <button
                  onClick={() => openWhatsApp()}
                  className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={20} />
                </button>
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
