import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EnhancedIslamicBackground from "@/components/EnhancedIslamicBackground";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Users,
  Phone,
  Mail,
  User,
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight,
  Home,
  AlertCircle,
} from "lucide-react";

interface Package {
  id: number;
  name: string;
  duration: string;
  mecca_stay: string;
  medina_stay: string;
  itinerary: string;
  price_double: number;
  price_triple: number;
  price_quad: number;
  price_infant?: number;
  price_child?: number;
  popular: boolean;
}

interface BookingForm {
  customer_name: string;
  phone: string;
  email: string;
  room_type: string;
  adults_count: number;
  children_count: number;
  infants_count: number;
  travel_date: string;
  special_requests: string;
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const packageId = searchParams.get("package");

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<BookingForm>({
    customer_name: "",
    phone: "",
    email: "",
    room_type: "double",
    adults_count: 2,
    children_count: 0,
    infants_count: 0,
    travel_date: "",
    special_requests: "",
  });

  // Fetch package details
  useEffect(() => {
    if (packageId) {
      fetchPackageDetails();
    } else {
      setLoading(false);
    }
  }, [packageId]);

  const fetchPackageDetails = async () => {
    try {
      const response = await fetch(`/api/packages/${packageId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedPackage(data.data);
      } else {
        setError("لم يتم العثور على الباقة المطلوبة");
      }
    } catch (err) {
      setError("خطأ في تحميل بيانات الباقة");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedPackage) return 0;

    let basePrice = 0;
    const { adults_count, children_count, infants_count, room_type } = formData;

    // Base price per adult based on room type
    switch (room_type) {
      case "double":
        basePrice = selectedPackage.price_double;
        break;
      case "triple":
        basePrice = selectedPackage.price_triple;
        break;
      case "quad":
        basePrice = selectedPackage.price_quad;
        break;
      default:
        basePrice = selectedPackage.price_double;
    }

    const adultsTotal = adults_count * basePrice;
    const childrenTotal =
      children_count * (selectedPackage.price_child || basePrice * 0.7);
    const infantsTotal =
      infants_count * (selectedPackage.price_infant || basePrice * 0.3);

    return adultsTotal + childrenTotal + infantsTotal;
  };

  const handleInputChange = (
    field: keyof BookingForm,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const totalPrice = calculateTotalPrice();
      const bookingData = {
        ...formData,
        package_id: packageId,
        total_price: totalPrice,
        travelers_count:
          formData.adults_count +
          formData.children_count +
          formData.infants_count,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to WhatsApp with booking details
        const whatsappMessage = `السلام عليك��، تم إرسال طلب حجز جديد:\n\n📋 الباقة: ${selectedPackage?.name}\n👤 الاسم: ${formData.customer_name}\n📞 الهاتف: ${formData.phone}\n👥 المسافرون: ${formData.adults_count + formData.children_count + formData.infants_count} أشخاص\n💰 المجموع: ${totalPrice.toLocaleString()} جنيه\n\nيرجى التواصل معي لإتمام الحجز.`;
        window.open(
          `https://wa.me/201201666688?text=${encodeURIComponent(whatsappMessage)}`,
          "_blank",
        );
      } else {
        setError(data.message || "حدث خطأ في إرسال الحجز");
      }
    } catch (err) {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen rtl relative" dir="rtl">
        <EnhancedIslamicBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-center">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl">جاري تحميل بيانات الباقة...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen rtl relative" dir="rtl">
        <EnhancedIslamicBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Card className="bg-gray-900/80 backdrop-blur-md border-red-500/30 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              خطأ في تحميل الباقة
            </h2>
            <p className="text-gray-300 mb-6">
              {error || "لم يتم العثور على الباقة المطلوبة"}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-red-600 hover:bg-red-700"
            >
              العودة للصفحة الرئيسية
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen rtl relative" dir="rtl">
        <EnhancedIslamicBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Card className="bg-gray-900/80 backdrop-blur-md border-green-500/30 p-8 text-center max-w-md">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              تم إرسال طلب الحجز بنجاح!
            </h2>
            <p className="text-gray-300 mb-6">
              شكراً لك، تم إرسال طلب حجزك بنجاح. سيتواصل معك فريقنا قريباً
              لإتمام الحجز.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                العودة للصفحة الرئيسية
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open("https://wa.me/201201666688", "_blank")
                }
                className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
              >
                تواصل عبر الواتساب
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-lg font-bold text-white">تيراتراف</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Package Summary */}
            <Card className="bg-gray-900/80 backdrop-blur-md border-red-500/30 mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-white flex items-center">
                    <Calendar className="w-6 h-6 ml-2 text-red-400" />
                    {selectedPackage.name}
                  </CardTitle>
                  {selectedPackage.popular && (
                    <Badge className="bg-red-500 text-white">
                      الأكثر طلباً
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-gray-300">
                      {selectedPackage.duration}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Home className="w-4 h-4 text-green-600" />
                    <span className="text-gray-300">
                      مكة: {selectedPackage.mecca_stay}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Home className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-300">
                      المدينة: {selectedPackage.medina_stay}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-900/80 backdrop-blur-md border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center">
                      <Users className="w-6 h-6 ml-2 text-red-400" />
                      بيانات الحجز
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <Alert className="mb-6 bg-red-900/20 border-red-500/50">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-200">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <User className="w-5 h-5 ml-2 text-red-400" />
                          البيانات الشخصية
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="customer_name"
                              className="text-gray-300"
                            >
                              الاسم الكامل *
                            </Label>
                            <Input
                              id="customer_name"
                              value={formData.customer_name}
                              onChange={(e) =>
                                handleInputChange(
                                  "customer_name",
                                  e.target.value,
                                )
                              }
                              className="bg-gray-800/50 border-gray-600 text-white"
                              placeholder="ادخل اسمك الكامل"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="phone" className="text-gray-300">
                              رقم الهاتف *
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className="bg-gray-800/50 border-gray-600 text-white"
                              placeholder="01xxxxxxxxx"
                              required
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Label htmlFor="email" className="text-gray-300">
                              البريد الإلكتروني
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="bg-gray-800/50 border-gray-600 text-white"
                              placeholder="example@email.com"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Travel Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <MapPin className="w-5 h-5 ml-2 text-red-400" />
                          تفاصيل السفر
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="room_type"
                              className="text-gray-300"
                            >
                              نوع الغرفة *
                            </Label>
                            <Select
                              value={formData.room_type}
                              onValueChange={(value) =>
                                handleInputChange("room_type", value)
                              }
                            >
                              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                                <SelectValue placeholder="اختر نوع الغرفة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="double">
                                  ثنائي (
                                  {selectedPackage.price_double?.toLocaleString()}{" "}
                                  ج)
                                </SelectItem>
                                <SelectItem value="triple">
                                  ثلاثي (
                                  {selectedPackage.price_triple?.toLocaleString()}{" "}
                                  ج)
                                </SelectItem>
                                <SelectItem value="quad">
                                  رباعي (
                                  {selectedPackage.price_quad?.toLocaleString()}{" "}
                                  ج)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label
                              htmlFor="travel_date"
                              className="text-gray-300"
                            >
                              تاريخ السفر المفضل
                            </Label>
                            <Input
                              id="travel_date"
                              type="date"
                              value={formData.travel_date}
                              onChange={(e) =>
                                handleInputChange("travel_date", e.target.value)
                              }
                              className="bg-gray-800/50 border-gray-600 text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Travelers Count */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <Users className="w-5 h-5 ml-2 text-red-400" />
                          عدد المسافرين
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label
                              htmlFor="adults_count"
                              className="text-gray-300"
                            >
                              البالغون *
                            </Label>
                            <Select
                              value={formData.adults_count.toString()}
                              onValueChange={(value) =>
                                handleInputChange(
                                  "adults_count",
                                  parseInt(value),
                                )
                              }
                            >
                              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label
                              htmlFor="children_count"
                              className="text-gray-300"
                            >
                              الأطفال (2-12 سنة)
                            </Label>
                            <Select
                              value={formData.children_count.toString()}
                              onValueChange={(value) =>
                                handleInputChange(
                                  "children_count",
                                  parseInt(value),
                                )
                              }
                            >
                              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 1, 2, 3, 4].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label
                              htmlFor="infants_count"
                              className="text-gray-300"
                            >
                              الرُضع (أقل من سنتين)
                            </Label>
                            <Select
                              value={formData.infants_count.toString()}
                              onValueChange={(value) =>
                                handleInputChange(
                                  "infants_count",
                                  parseInt(value),
                                )
                              }
                            >
                              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 1, 2].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Special Requests */}
                      <div>
                        <Label
                          htmlFor="special_requests"
                          className="text-gray-300"
                        >
                          طلبات خاصة
                        </Label>
                        <textarea
                          id="special_requests"
                          value={formData.special_requests}
                          onChange={(e) =>
                            handleInputChange(
                              "special_requests",
                              e.target.value,
                            )
                          }
                          className="w-full min-h-[100px] p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 resize-none"
                          placeholder="أي طلبات خاصة أو ملاحظات..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 text-lg font-bold"
                      >
                        {submitting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                            جاري إرسال الطلب...
                          </div>
                        ) : (
                          "إرسال طلب الحجز"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Price Summary */}
              <div>
                <Card className="bg-gray-900/80 backdrop-blur-md border-red-500/30 sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">
                      ملخص التكلفة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">
                          البالغون ({formData.adults_count}):
                        </span>
                        <span className="text-white font-semibold">
                          {(
                            formData.adults_count *
                            (formData.room_type === "double"
                              ? selectedPackage.price_double
                              : formData.room_type === "triple"
                                ? selectedPackage.price_triple
                                : selectedPackage.price_quad)
                          ).toLocaleString()}{" "}
                          ج
                        </span>
                      </div>

                      {formData.children_count > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">
                            الأطفال ({formData.children_count}):
                          </span>
                          <span className="text-white font-semibold">
                            {(
                              formData.children_count *
                              (selectedPackage.price_child ||
                                (formData.room_type === "double"
                                  ? selectedPackage.price_double
                                  : formData.room_type === "triple"
                                    ? selectedPackage.price_triple
                                    : selectedPackage.price_quad) * 0.7)
                            ).toLocaleString()}{" "}
                            ج
                          </span>
                        </div>
                      )}

                      {formData.infants_count > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">
                            الرُضع ({formData.infants_count}):
                          </span>
                          <span className="text-white font-semibold">
                            {(
                              formData.infants_count *
                              (selectedPackage.price_infant ||
                                (formData.room_type === "double"
                                  ? selectedPackage.price_double
                                  : formData.room_type === "triple"
                                    ? selectedPackage.price_triple
                                    : selectedPackage.price_quad) * 0.3)
                            ).toLocaleString()}{" "}
                            ج
                          </span>
                        </div>
                      )}
                    </div>

                    <hr className="border-gray-600" />

                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">المجموع:</span>
                      <span className="text-red-400">
                        {calculateTotalPrice().toLocaleString()} جنيه
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 text-center">
                      * الأسعار شاملة جميع الخدمات المذكورة
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
