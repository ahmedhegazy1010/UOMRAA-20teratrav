import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EnhancedIslamicBackground from "@/components/EnhancedIslamicBackground";
import {
  Settings,
  Package,
  Users,
  MessageSquare,
  BarChart3,
  Menu,
  X,
  DollarSign,
  TrendingUp,
  UserCheck,
  Eye,
  EyeOff,
  Lock,
  User,
  AlertCircle,
} from "lucide-react";

interface User {
  id: string;
  username: string;
  role: string;
}

export default function AdminDashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Login form state
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Package management state
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [packageForm, setPackageForm] = useState({
    name: "",
    duration: "",
    mecca_stay: "",
    medina_stay: "",
    itinerary: "",
    price_double: "",
    price_triple: "",
    price_quad: "",
    price_child: "",
    price_infant: "",
    status: "active",
    popular: false,
  });
  const [packageLoading, setPackageLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const storedUser = localStorage.getItem("admin_user");

      if (!token || !storedUser) {
        setIsLoading(false);
        return;
      }

      // Verify token with server
      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth token
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        setCredentials({ username: "", password: "" });
        loadDashboardData();
      } else {
        setLoginError(data.message || "فشل في تسجيل الدخول");
      }
    } catch (err) {
      setLoginError("خطأ في الاتصال بالخادم");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setUser(null);
    setIsAuthenticated(false);
    setCredentials({ username: "", password: "" });
    setActiveSection("dashboard");
  };

  const loadDashboardData = async () => {
    setDataLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [packagesRes, statsRes, bookingsRes, inquiriesRes] =
        await Promise.all([
          fetch("/api/packages", { headers }),
          fetch("/api/stats", { headers }),
          fetch("/api/bookings", { headers }),
          fetch("/api/inquiries", { headers }),
        ]);

      if (packagesRes.ok) {
        const packagesData = await packagesRes.json();
        setPackages(packagesData.data || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data?.stats || null);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.data || []);
      }

      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json();
        setInquiries(inquiriesData.data || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    if (loginError) setLoginError("");
  };

  // Package management functions
  const resetPackageForm = () => {
    setPackageForm({
      name: "",
      duration: "",
      mecca_stay: "",
      medina_stay: "",
      itinerary: "",
      price_double: "",
      price_triple: "",
      price_quad: "",
      price_child: "",
      price_infant: "",
      status: "active",
      popular: false,
    });
  };

  const handleSavePackage = async () => {
    if (!packageForm.name?.trim() || !packageForm.duration?.trim()) {
      alert("يرجى ملء اسم الباقة ��المدة على الأقل");
      return;
    }

    if (
      !packageForm.price_double ||
      !packageForm.price_triple ||
      !packageForm.price_quad
    ) {
      alert("يرجى ملء جميع أسعار الغرف");
      return;
    }

    setPackageLoading(true);
    try {
      const token = localStorage.getItem("admin_token");

      // Prepare data with proper types
      const packageData = {
        name: packageForm.name.trim(),
        duration: packageForm.duration.trim(),
        mecca_stay: packageForm.mecca_stay.trim() || "",
        medina_stay: packageForm.medina_stay.trim() || "",
        itinerary: packageForm.itinerary.trim() || "",
        price_double: packageForm.price_double,
        price_triple: packageForm.price_triple,
        price_quad: packageForm.price_quad,
        price_child: packageForm.price_child || "",
        price_infant: packageForm.price_infant || "",
        status: packageForm.status,
        popular: packageForm.popular,
      };

      console.log("Sending package data:", packageData);

      const response = await fetch("/api/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(packageData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("تم إضافة الباقة بنجاح!");
        setShowPackageModal(false);
        resetPackageForm();
        loadDashboardData(); // Reload packages
      } else {
        alert(data.message || "حدث خطأ في إضافة الباقة");
      }
    } catch (error) {
      console.error("Error saving package:", error);
      alert("حدث خطأ في إضافة الباقة");
    } finally {
      setPackageLoading(false);
    }
  };

  // Sidebar items
  const sidebarItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: BarChart3 },
    { id: "packages", label: "الباقات", icon: Package },
    { id: "bookings", label: "الحجوزات", icon: Users },
    { id: "inquiries", label: "الاستفسارات", icon: MessageSquare },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];

  // Render loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
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

  // Render login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 rtl relative"
        dir="rtl"
      >
        <EnhancedIslamicBackground />

        <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border-red-500/30 shadow-2xl shadow-red-500/20 animate-fadeInUp relative z-10">
          <CardHeader className="text-center space-y-4">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-red-500/30 animate-pulse bg-white/10 backdrop-blur-sm">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F6e6933d312b74b23a89dafd2e32a307b%2Fd916b8a876584dc48a2246340e732356?format=webp&width=800"
                  alt="تيراتراف"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <CardTitle className="text-2xl font-bold text-white">
              تسجيل دخول الإدارة
            </CardTitle>
            <p className="text-gray-400">
              ادخل بيانات تسجيل الدخول للوصول إلى لوحة التحكم
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {loginError && (
              <Alert className="bg-red-900/20 border-red-500/50 animate-slideDown">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  {loginError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300 font-medium">
                  اسم المستخدم
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className="pr-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                    placeholder="ادخل اسم المستخدم"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 font-medium">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pr-10 pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                    placeholder="ادخل كلمة المرور"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 text-lg shadow-lg shadow-red-500/30 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? (
                  <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري تسجيل الدخول...</span>
                  </div>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 text-center mb-2">
                بيانات تجريبية:
              </p>
              <div className="text-xs text-gray-500 space-y-1 text-center">
                <p>
                  المستخدم:{" "}
                  <span className="text-red-400 font-mono">admin</span>
                </p>
                <p>
                  كلمة المر��ر:{" "}
                  <span className="text-red-400 font-mono">teratrav2024</span>
                </p>
                <p className="text-xs text-gray-600 mt-2">أو</p>
                <p>
                  المستخدم:{" "}
                  <span className="text-green-400 font-mono">hegazy</span>
                </p>
                <p>
                  كلمة المرور:{" "}
                  <span className="text-green-400 font-mono">hegazy01550</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="absolute bottom-4 text-center text-gray-500 text-sm">
          <p>© 2024 تيراتراف - جميع الحقوق محفوظة</p>
        </div>
      </div>
    );
  }

  // Render main dashboard (simplified version)
  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h2>
        <p className="text-gray-300">نظرة عامة على أداء الموقع والحجوزات</p>
      </div>

      {dataLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card
              key={index}
              className="bg-gray-900/80 border-red-500/30 animate-pulse"
            >
              <CardContent className="p-6">
                <div className="h-20 bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900/80 border-red-500/30 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">
                    إجمالي الباقات
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {packages.length}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                    <span className="text-sm text-green-400">متاح</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border-red-500/30 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">
                    إجمالي الحجوزات
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {bookings.length}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-blue-500 ml-1" />
                    <span className="text-sm text-blue-400">طلب</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border-red-500/30 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">
                    الاستفسارات
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {inquiries.length}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-yellow-500 ml-1" />
                    <span className="text-sm text-yellow-400">استفسار</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border-red-500/30 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">
                    النظام
                  </p>
                  <p className="text-2xl font-bold text-white">فعال</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                    <span className="text-sm text-green-400">يعمل بنجاح</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "packages":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  إدارة الباقات
                </h2>
                <p className="text-gray-300">إدارة باقات العمرة المتاحة</p>
              </div>
              <Button
                onClick={() => setShowPackageModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
              >
                إض��فة باقة جديدة
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {packages.map((pkg: any) => (
                <Card
                  key={pkg.id}
                  className="bg-gray-900/80 border-red-500/30 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-white">{pkg.name}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {pkg.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>مكة: {pkg.mecca_stay}</div>
                      <div>المدينة: {pkg.medina_stay}</div>
                      <div>
                        الأسعار: {pkg.price_double?.toLocaleString()} -{" "}
                        {pkg.price_quad?.toLocaleString()} ج
                      </div>
                      {(pkg.price_infant || pkg.price_child) && (
                        <div className="text-xs space-y-1">
                          {pkg.price_infant && (
                            <div>
                              رضيع: {pkg.price_infant?.toLocaleString()} ج
                            </div>
                          )}
                          {pkg.price_child && (
                            <div>
                              طفل: {pkg.price_child?.toLocaleString()} ج
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge
                          className={
                            pkg.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {pkg.status === "active" ? "نشط" : "غير نشط"}
                        </Badge>
                        {pkg.popular && (
                          <Badge className="bg-red-100 text-red-800">
                            الأكثر طلباً
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            alert("سيتم إضافة ميزة التحديث قريباً!")
                          }
                          className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                        >
                          تحديث
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("هل أنت متأكد من حذف هذه الباقة؟")) {
                              alert("سيتم إضافة ميزة الحذف قريباً!");
                            }
                          }}
                          className="text-red-400 hover:bg-red-600"
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Package Modal */}
            {showPackageModal && (
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowPackageModal(false);
                    resetPackageForm();
                  }
                }}
              >
                <Card className="w-full max-w-4xl bg-gray-900/95 border-red-500/30 max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle className="text-white">
                      إضافة باقة جديدة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          اسم الباقة *
                        </label>
                        <input
                          type="text"
                          value={packageForm.name}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                          placeholder="مثال: عمرة رمضان"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          المدة *
                        </label>
                        <input
                          type="text"
                          value={packageForm.duration}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              duration: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                          placeholder="مثال: 7 أيام / 6 ليالي"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          الإقامة بمكة
                        </label>
                        <input
                          type="text"
                          value={packageForm.mecca_stay}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              mecca_stay: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                          placeholder="4 ليالي - فندق 4 نجوم"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          الإقامة بالمدينة
                        </label>
                        <input
                          type="text"
                          value={packageForm.medina_stay}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              medina_stay: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                          placeholder="2 ليالي - فندق 4 نجوم"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-300">
                          خط السير
                        </label>
                        <input
                          type="text"
                          value={packageForm.itinerary}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              itinerary: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                          placeholder="القاهرة - جدة - مكة - المدينة"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          سعر الغرفة الثنائية *
                        </label>
                        <input
                          type="number"
                          value={packageForm.price_double}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              price_double: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                          placeholder="50000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          سعر الغرفة الثلاثية *
                        </label>
                        <input
                          type="number"
                          value={packageForm.price_triple}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              price_triple: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                          placeholder="45000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          سعر الغرفة الرباعية *
                        </label>
                        <input
                          type="number"
                          value={packageForm.price_quad}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              price_quad: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                          placeholder="40000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          سعر الطفل (اختياري)
                        </label>
                        <input
                          type="number"
                          value={packageForm.price_child}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              price_child: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                          placeholder="30000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          سعر الرضيع (اختياري)
                        </label>
                        <input
                          type="number"
                          value={packageForm.price_infant}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              price_infant: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                          placeholder="15000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          الحالة
                        </label>
                        <select
                          value={packageForm.status}
                          onChange={(e) =>
                            setPackageForm({
                              ...packageForm,
                              status: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                        >
                          <option value="active">نشط</option>
                          <option value="inactive">غير نشط</option>
                        </select>
                      </div>
                      <div className="space-y-2 flex items-center">
                        <label className="flex items-center space-x-2 rtl:space-x-reverse text-gray-300">
                          <input
                            type="checkbox"
                            checked={packageForm.popular}
                            onChange={(e) =>
                              setPackageForm({
                                ...packageForm,
                                popular: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                          />
                          <span>الأكثر طلباً</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPackageModal(false);
                          resetPackageForm();
                        }}
                        className="border-gray-600 text-gray-300"
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={handleSavePackage}
                        disabled={packageLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {packageLoading ? "جاري الحفظ..." : "إضافة"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );
      case "bookings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                إدارة الحجوزات
              </h2>
              <p className="text-gray-300">عرض وإدارة طلبات الحجز</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {bookings.length === 0 ? (
                <Card className="bg-gray-900/80 border-red-500/30 p-8 text-center">
                  <p className="text-gray-300 text-lg">
                    لا توجد حجوزات حتى الآن
                  </p>
                </Card>
              ) : (
                bookings.map((booking: any) => (
                  <Card
                    key={booking.id}
                    className="bg-gray-900/80 border-red-500/30 hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Users className="w-5 h-5 ml-2 text-red-400" />
                        {booking.customer_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2 text-gray-300">
                          <div>📞 الهاتف: {booking.phone}</div>
                          <div>🏨 نوع الغرفة: {booking.room_type}</div>
                        </div>
                        <div className="space-y-2 text-gray-300">
                          <div>📦 الباقة: {booking.package_name}</div>
                          <div className="text-lg font-bold text-red-400">
                            💰 المجموع: {booking.total_price?.toLocaleString()}{" "}
                            ج
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      case "inquiries":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                إدارة الاستفسارات
              </h2>
              <p className="text-gray-300">عرض ومتابعة استفسارات العملاء</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {inquiries.length === 0 ? (
                <Card className="bg-gray-900/80 border-red-500/30 p-8 text-center">
                  <p className="text-gray-300 text-lg">
                    لا توجد استفسارات حتى الآن
                  </p>
                </Card>
              ) : (
                inquiries.map((inquiry: any) => (
                  <Card
                    key={inquiry.id}
                    className="bg-gray-900/80 border-red-500/30 hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <MessageSquare className="w-5 h-5 ml-2 text-red-400" />
                        {inquiry.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2 text-gray-300">
                            <div>📞 الهاتف: {inquiry.phone}</div>
                            {inquiry.email && (
                              <div>📧 الإيميل: {inquiry.email}</div>
                            )}
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded p-4">
                          <h4 className="text-sm font-semibold text-white mb-2">
                            الاس��فسار:
                          </h4>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {inquiry.message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                إعدادات النظام
              </h2>
              <p className="text-gray-300">إدارة إعدادات الموقع والشركة</p>
            </div>

            {/* Company Settings */}
            <Card className="bg-gray-900/80 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 ml-2 text-red-400" />
                  إعدادات الشركة
                </CardTitle>
                <CardDescription className="text-gray-300">
                  معلومات الشركة الأساسية وبيانات الاتصال
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      اسم الشركة
                    </label>
                    <input
                      type="text"
                      defaultValue="تيراتراف"
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      defaultValue="info@teratrav.com"
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      الهاتف الرئيسي
                    </label>
                    <input
                      type="tel"
                      defaultValue="0225750707"
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      واتساب
                    </label>
                    <input
                      type="tel"
                      defaultValue="201201666688"
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">
                      العنوان
                    </label>
                    <input
                      type="text"
                      defaultValue="القاهرة، مصر"
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => alert("تم حفظ إعدادات الشركة بنجاح!")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    حفظ إعدادات الشركة
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card className="bg-gray-900/80 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <UserCheck className="w-5 h-5 ml-2 text-blue-400" />
                  إدارة المستخدمين
                </CardTitle>
                <CardDescription className="text-gray-300">
                  إضافة وإدارة مستخدمي لوحة التحكم
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    المستخدمون الحاليون
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div>
                          <p className="text-white font-medium">admin</p>
                          <p className="text-gray-400 text-sm">مدير عام</p>
                        </div>
                      </div>
                      <span className="text-gray-400 text-xs">نشط</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div>
                          <p className="text-white font-medium">hegazy</p>
                          <p className="text-gray-400 text-sm">مدير</p>
                        </div>
                      </div>
                      <span className="text-gray-400 text-xs">نشط</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    إضافة مستخدم جديد
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="اسم المستخدم"
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                    />
                    <input
                      type="password"
                      placeholder="كلمة المرور"
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                    />
                    <Button
                      onClick={() => alert("سيتم إضافة هذه الميزة قريباً!")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      إضافة مستخدم
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card className="bg-gray-900/80 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 ml-2 text-purple-400" />
                  إعد��دات النظام العامة
                </CardTitle>
                <CardDescription className="text-gray-300">
                  إعداد��ت عامة للموقع والنظام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white h-12"
                    onClick={() => alert("جاري إنشاء نسخة احتياطية...")}
                  >
                    إنشاء نسخة احتياطية
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white h-12"
                    onClick={() => alert("جاري تحسين قاعدة البيانات...")}
                  >
                    تحسين قاعدة البيانات
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white h-12"
                    onClick={() => {
                      if (confirm("هل أنت متأكد من مسح الملفات المؤقتة؟")) {
                        alert("تم مسح الملفات المؤقتة بنجاح!");
                      }
                    }}
                  >
                    مسح الملفات المؤقتة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  // Render main dashboard interface
  return (
    <div className="min-h-screen rtl relative overflow-hidden" dir="rtl">
      <EnhancedIslamicBackground />

      {/* Mobile Header */}
      <div className="lg:hidden bg-black/90 backdrop-blur-md shadow-lg shadow-red-500/20 border-b border-red-600/30 px-4 py-3 relative z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-red-600/20 transition-all duration-300"
            >
              <Menu className="w-6 h-6 text-red-400" />
            </button>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="text-lg font-bold text-white">
                لوحة تحكم تيراتراف
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-64 bg-gray-900/95 backdrop-blur-md shadow-2xl shadow-red-500/20 border-l border-red-600/30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-red-600/30">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="text-lg font-bold text-white">لوحة التحكم</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={handleLogout}
                className="p-2 rounded-md hover:bg-red-600/20 transition-all duration-300 text-red-400 hover:text-red-300"
                title="تسجيل خروج"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-600/20 transition-all duration-300 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-red-600/30">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{user?.username}</p>
                <p className="text-gray-400 text-xs">مدير ال��ظام</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-red-600/20 text-red-400 shadow-lg shadow-red-500/20"
                      : "text-gray-300 hover:text-red-400 hover:bg-red-600/10"
                  }`}
                >
                  <item.icon className="w-5 h-5 ml-3" />
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:mr-64 relative">
          <main className="p-6 relative z-10">{renderContent()}</main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
