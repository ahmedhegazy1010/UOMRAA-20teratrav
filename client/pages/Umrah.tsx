import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EnhancedIslamicBackground from "@/components/EnhancedIslamicBackground";
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
  AlertCircle,
  Send,
} from "lucide-react";

// لا توجد بيانات افتراضية - النظام يبدأ فارغاً

export default function Umrah() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");

  // Fetch packages from API
  useEffect(() => {
    fetchPackages();

    // إعادة تحميل الباقات كل 30 ثانية لضمان الحصول على أحدث البيانات
    const interval = setInterval(fetchPackages, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchPackages = async () => {
    try {
      console.log("Fetching packages from API...");
      const response = await fetch("/.netlify/functions/packages");
      const data = await response.json();
      console.log("Packages API response:", data);

      if (data.success && data.data) {
        console.log("Setting packages from API:", data.data);
        setPackages(data.data);
      } else {
        console.log("API returned empty or failed - keeping empty packages");
        setPackages([]);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      console.log("Keeping empty packages due to error");
      setPackages([]);
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (response.ok) {
        setContactSuccess(true);
        setContactForm({ name: "", phone: "", email: "", message: "" });

        // Send to WhatsApp as well
        const whatsappMessage = `استفسار جديد من الموقع:\n\nالاسم: ${contactForm.name}\nالهاتف: ${contactForm.phone}\nا��إيميل: ${contactForm.email}\nالرسالة: ${contactForm.message}`;
        window.open(
          `https://wa.me/201201666688?text=${encodeURIComponent(whatsappMessage)}`,
          "_blank",
        );
      } else {
        setContactError(data.message || "حدث خطأ في إرسال الاستفسار");
      }
    } catch (err) {
      setContactError("خطأ في الاتصال بالخادم");
    } finally {
      setContactLoading(false);
    }
  };

  const handleContactInputChange = (field: string, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const includedItems = [
    { icon: Shield, text: "رسوم التأشيرة" },
    { icon: Plane, text: "تذاكر الطيران" },
    { icon: Hotel, text: "الإقامة الكاملة بفنادق مكة والمدينة" },
    { icon: Users, text: "التنقلات الداخلية بأحدث الباصات" },
    { icon: CheckCircle, text: "إشراف كامل من فريق تيراتراف" },
    { icon: MapPin, text: "مزارات دينية" },
    { icon: Gift, text: "هدايا وشنطة عمرة" },
  ];

  return (
    <div className="min-h-screen rtl overflow-x-hidden relative" dir="rtl">
      {/* Enhanced Islamic Animated Background */}
      <EnhancedIslamicBackground />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-600/30 shadow-lg shadow-red-500/20 transition-all duration-500 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg shadow-red-500/30 animate-pulse bg-white/10 backdrop-blur-sm">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F6e6933d312b74b23a89dafd2e32a307b%2Fd916b8a876584dc48a2246340e732356?format=webp&width=800"
                  alt="تيراتراف"
                  className="w-full h-full object-contain"
                />
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
                onClick={() => navigate("/about")}
                className="text-gray-300 hover:text-red-400 transition-all duration-300 font-medium relative group"
              >
                من نحن
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
                onClick={() => scrollToSection("packages")}
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
        {/* Background Image with Enhanced Overlay */}
        <div className="absolute inset-0">
          <div className="w-full h-full relative">
            <img
              src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
              alt="الكعبة المشرفة"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-red-900/30 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
          </div>
        </div>

        {/* Islamic Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top decorative corners */}
          <div className="absolute top-10 right-10 opacity-20">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              className="text-red-400"
            >
              <path
                d="M40 10 L50 25 L65 25 L53 35 L58 50 L40 42 L22 50 L27 35 L15 25 L30 25 Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="absolute top-10 left-10 opacity-20">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              className="text-red-400 transform scale-x-[-1]"
            >
              <path
                d="M40 10 L50 25 L65 25 L53 35 L58 50 L40 42 L22 50 L27 35 L15 25 L30 25 Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Bottom decorative corners */}
          <div className="absolute bottom-10 right-10 opacity-20">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              className="text-red-400 transform rotate-180"
            >
              <path
                d="M40 10 L50 25 L65 25 L53 35 L58 50 L40 42 L22 50 L27 35 L15 25 L30 25 Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="absolute bottom-10 left-10 opacity-20">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              className="text-red-400 transform rotate-180 scale-x-[-1]"
            >
              <path
                d="M40 10 L50 25 L65 25 L53 35 L58 50 L40 42 L22 50 L27 35 L15 25 L30 25 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Hero Content with New Design */}
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6">
          {/* Main Content Container */}
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 300"
                className="text-red-500"
              >
                <defs>
                  <pattern
                    id="islamicPattern"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M20 5 L25 15 L35 15 L28 22 L30 32 L20 27 L10 32 L12 22 L5 15 L15 15 Z"
                      fill="currentColor"
                      opacity="0.3"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#islamicPattern)" />
              </svg>
            </div>

            {/* Main Title */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-fadeInUp flex flex-col"
              style={{ animationDelay: "0.2s" }}
            >
              <span
                className="bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent pb-7 mx-auto"
                style={{ margin: "-5px auto 0" }}
              >
                عمرة مقبولة
              </span>
              <span
                className="bg-gradient-to-r from-red-400 via-red-300 to-red-400 bg-clip-text text-transparent mx-auto"
                style={{
                  fontFamily: "Cairo, sans-serif",
                  margin: "-5px auto 35px",
                  padding: "20px 0 28px",
                }}
              >
                العمرة معانا اسهل
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-xl sm:text-2xl md:text-3xl mb-12 text-gray-200 leading-relaxed mx-auto animate-fadeInUp"
              style={{ animationDelay: "0.4s", maxWidth: "999px" }}
            >
              سافر مع تيراتراف براحة وأمان – باقات متنوعة وخدمة مميزة لرحلة
              روحانية لا تُنسى
            </p>

            {/* Action Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-fadeInUp"
              style={{ animationDelay: "0.6s" }}
            >
              <Button
                size="lg"
                onClick={() => scrollToSection("packages")}
                className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl shadow-red-500/50 transform hover:scale-110 transition-all duration-500 border-2 border-red-400/30 hover:border-red-300/50 relative overflow-hidden group"
              >
                <span className="relative z-10">اكتشف الباقات</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => openWhatsApp()}
                className="border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 px-10 py-6 text-lg font-semibold rounded-full backdrop-blur-md bg-white/10 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                استفسر الآن
              </Button>
            </div>

            {/* Islamic Pattern Divider */}
            <div
              className="flex justify-center items-center animate-fadeInUp"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="text-red-400"
                >
                  <path
                    d="M12 2L15 9H22L16.5 13.5L18.5 22L12 17L5.5 22L7.5 13.5L2 9H9L12 2Z"
                    fill="currentColor"
                    opacity="0.8"
                  />
                </svg>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
          <div className="flex flex-col items-center space-y-2"></div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 relative overflow-hidden z-10">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-red-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 border-2 border-red-400 rounded-full animate-spin slow"></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2
              className="text-4xl md:text-6xl font-bold text-white mb-6 text-gradient-animate"
              style={{ padding: "21px 0 25px" }}
            >
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
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl mx-auto">
              {packages.map((pkg: any, index) => (
                <Card
                  key={pkg.id}
                  className={`relative overflow-hidden transform hover:scale-105 transition-all duration-500 bg-gray-900/60 backdrop-blur-md border-red-500/30 shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 animate-fadeInUp ${
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
                      {pkg.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300 text-lg">
                      {pkg.duration} - برنامج شامل ومتكامل
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
                        {pkg.price_infant && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">رضيع:</span>
                            <span className="font-bold text-yellow-400">
                              {pkg.price_infant?.toLocaleString()} جنيه
                            </span>
                          </div>
                        )}
                        {pkg.price_child && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">طفل:</span>
                            <span className="font-bold text-green-400">
                              {pkg.price_child?.toLocaleString()} جنيه
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate(`/booking?package=${pkg.id}`)}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/30 animate-glow"
                    >
                      احجز الآن
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Card className="bg-gray-900/60 backdrop-blur-md border-red-500/30 shadow-2xl shadow-red-500/20 p-8 max-w-md mx-auto">
                <CardContent>
                  <Package className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    لا توجد باقات متاحة حالياً
                  </h3>
                  <p className="text-gray-300 mb-4">
                    سيتم إضافة الباقات قريباً. تابعنا للحصول على آخر التحديثات.
                  </p>
                  <Button
                    onClick={() => openWhatsApp()}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="w-4 h-4 ml-2" />
                    تواصل معنا
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 relative overflow-hidden z-10">
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
                className="flex items-center space-x-4 rtl:space-x-reverse p-6 bg-gray-900/60 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-red-500/20"
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
      <section id="contact" className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              تواصل معنا
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              فريقنا جاهز لمساعدتك في أي وقت
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card className="bg-gray-900/60 backdrop-blur-md border-red-500/30 shadow-2xl shadow-red-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center">
                    <Send className="w-6 h-6 ml-2 text-red-400" />
                    أرسل استفسارك
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contactSuccess && (
                    <Alert className="mb-6 bg-green-900/20 border-green-500/50">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <AlertDescription className="text-green-200">
                        تم إرسال استفسارك بنجاح! سنتواصل معك قريباً.
                      </AlertDescription>
                    </Alert>
                  )}

                  {contactError && (
                    <Alert className="mb-6 bg-red-900/20 border-red-500/50">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-200">
                        {contactError}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-name" className="text-gray-300">
                          الاسم الكامل *
                        </Label>
                        <Input
                          id="contact-name"
                          value={contactForm.name}
                          onChange={(e) =>
                            handleContactInputChange("name", e.target.value)
                          }
                          className="bg-gray-800/50 border-gray-600 text-white"
                          placeholder="ادخل اسمك الكامل"
                          required
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="contact-phone"
                          className="text-gray-300"
                        >
                          رقم الهاتف *
                        </Label>
                        <Input
                          id="contact-phone"
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) =>
                            handleContactInputChange("phone", e.target.value)
                          }
                          className="bg-gray-800/50 border-gray-600 text-white"
                          placeholder="01xxxxxxxxx"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contact-email" className="text-gray-300">
                        البريد الإلكتروني
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) =>
                          handleContactInputChange("email", e.target.value)
                        }
                        className="bg-gray-800/50 border-gray-600 text-white"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="contact-message"
                        className="text-gray-300"
                      >
                        رسالتك *
                      </Label>
                      <textarea
                        id="contact-message"
                        value={contactForm.message}
                        onChange={(e) =>
                          handleContactInputChange("message", e.target.value)
                        }
                        className="w-full min-h-[120px] p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 resize-none"
                        placeholder="اكتب استفسارك أو رسالتك هنا..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={contactLoading}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 text-lg font-bold"
                    >
                      {contactLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                          جاري الإرسال...
                        </div>
                      ) : (
                        <>
                          <Send className="w-5 h-5 ml-2" />
                          إرسال الاستفسار
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                {/* Phone Numbers */}
                <Card className="p-6 bg-gray-900/60 backdrop-blur-md border-red-500/30 shadow-2xl shadow-red-500/20">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        اتصل بنا
                      </h3>
                      <div className="space-y-1">
                        <a
                          href="tel:0225750707"
                          className="block text-red-400 hover:text-red-300 transition-colors"
                        >
                          0225750707
                        </a>
                        <a
                          href="tel:01201666688"
                          className="block text-red-400 hover:text-red-300 transition-colors"
                        >
                          01201666688
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* WhatsApp */}
                <Card className="p-6 bg-gray-900/60 backdrop-blur-md border-red-500/30 shadow-2xl shadow-red-500/20">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">
                        واتساب
                      </h3>
                      <Button
                        onClick={() => openWhatsApp()}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transform hover:scale-105 transition-all duration-300"
                      >
                        تو��صل الآن
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Working Hours */}
                <Card className="p-6 bg-gray-900/60 backdrop-blur-md border-red-500/30 shadow-2xl shadow-red-500/20">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        ساعات العمل
                      </h3>
                      <div className="text-gray-300 text-sm space-y-1">
                        <div>السبت - الخميس: 9:00 ص - 9:00 م</div>
                        <div>الجمعة: 2:00 م - 9:00 م</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
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
      <footer className="bg-gray-900/80 backdrop-blur-md text-white py-12 border-t border-red-600/30 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Description */}
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start space-x-2 rtl:space-x-reverse mb-4">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F6e6933d312b74b23a89dafd2e32a307b%2Fd916b8a876584dc48a2246340e732356?format=webp&width=800"
                    alt="تيراتراف"
                    className="w-full h-full object-contain"
                  />
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

            {/* Links and Copyright */}
            <div className="text-center md:text-left">
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-4">
                <button
                  onClick={() => navigate("/terms")}
                  className="text-gray-400 hover:text-red-400 text-sm transition-colors"
                >
                  الشروط والأحكام
                </button>
                <button
                  onClick={() => navigate("/privacy")}
                  className="text-gray-400 hover:text-red-400 text-sm transition-colors"
                >
                  سياسة الخصوصية
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="text-gray-400 hover:text-red-400 text-sm transition-colors"
                >
                  من نحن
                </button>
              </div>
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
