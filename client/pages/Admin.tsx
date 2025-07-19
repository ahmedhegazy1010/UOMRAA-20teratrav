import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import EnhancedIslamicBackground from "@/components/EnhancedIslamicBackground";
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
} from "lucide-react";

function AdminContent() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Fetch data from API
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [packagesRes, statsRes, bookingsRes] = await Promise.all([
        fetch("/api/packages", { headers }),
        fetch("/api/stats", { headers }),
        fetch("/api/bookings", { headers }),
      ]);

      if (packagesRes.ok) {
        const packagesData = await packagesRes.json();
        setPackages(packagesData.data || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data.stats || null);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: BarChart3 },
    { id: "packages", label: "الباقات", icon: Package },
    { id: "bookings", label: "الحجوزات", icon: Users },
    { id: "inquiries", label: "الاستفسارات", icon: MessageSquare },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h2>
        <p className="text-gray-300">نظرة عامة على أداء الموقع والحجوزات</p>
      </div>

      {loading ? (
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
          {stats &&
            Object.values(stats).map((stat: any, index) => (
              <Card
                key={index}
                className="bg-gray-900/80 border-red-500/30 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 transform hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        <span className="text-sm text-green-400">
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );

  const renderPackages = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">إدارة الباقات</h2>
        <p className="text-gray-300">إدارة باقات العمرة المتاحة</p>
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
                  الأسعار: {pkg.price_double} - {pkg.price_quad} ج
                </div>
                {(pkg.price_infant || pkg.price_child) && (
                  <div className="text-xs space-y-1">
                    {pkg.price_infant && <div>رضيع: {pkg.price_infant} ج</div>}
                    {pkg.price_child && <div>طفل: {pkg.price_child} ج</div>}
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-between">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">إدارة الحجوزات</h2>
        <p className="text-gray-300">عرض وإدارة طلبات الحجز</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {bookings.length === 0 ? (
          <Card className="bg-gray-900/80 border-red-500/30 p-8 text-center">
            <p className="text-gray-300 text-lg">لا توجد حجوزات حتى الآن</p>
          </Card>
        ) : (
          bookings.map((booking: any) => (
            <Card
              key={booking.id}
              className="bg-gray-900/80 border-red-500/30 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 ml-2 text-red-400" />
                    {booking.customer_name}
                  </CardTitle>
                  <Badge
                    className={
                      booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                    }
                  >
                    {booking.status === "pending"
                      ? "في الانتظار"
                      : booking.status === "confirmed"
                        ? "مؤكد"
                        : booking.status === "cancelled"
                          ? "ملغي"
                          : "مكتمل"}
                  </Badge>
                </div>
                <CardDescription className="text-gray-300">
                  تاريخ الطلب:{" "}
                  {new Date(booking.created_at).toLocaleDateString("ar-EG")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2 text-gray-300">
                    <div>📞 الهاتف: {booking.phone}</div>
                    {booking.email && <div>📧 الإيميل: {booking.email}</div>}
                    <div>🏨 نوع الغرفة: {booking.room_type}</div>
                    <div>👥 عدد المسافرين: {booking.travelers_count}</div>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <div>📦 الباقة: {booking.package_name}</div>
                    <div>⏱️ المدة: {booking.package_duration}</div>
                    {booking.travel_date && (
                      <div>
                        📅 تاريخ السفر:{" "}
                        {new Date(booking.travel_date).toLocaleDateString(
                          "ar-EG",
                        )}
                      </div>
                    )}
                    <div className="text-lg font-bold text-red-400">
                      💰 المجموع: {booking.total_price?.toLocaleString()} ج
                    </div>
                  </div>
                </div>
                {booking.special_requests && (
                  <div className="mt-4 p-3 bg-gray-800/50 rounded">
                    <h4 className="text-sm font-semibold text-white mb-2">
                      طلبات خاصة:
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {booking.special_requests}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "packages":
        return renderPackages();
      case "bookings":
        return renderBookings();
      case "inquiries":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">الاستفسارات</h2>
            <p className="text-gray-300">قريباً...</p>
          </div>
        );
      case "settings":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">الإعدادات</h2>
            <p className="text-gray-300">قريباً...</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen rtl relative overflow-hidden" dir="rtl">
      {/* Enhanced Islamic Animated Background */}
      <EnhancedIslamicBackground />

      {/* Mobile Header */}
      <div className="lg:hidden bg-black/90 backdrop-blur-md shadow-lg shadow-red-500/20 border-b border-red-600/30 px-4 py-3">
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
                <p className="text-gray-400 text-xs">مدير النظام</p>
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

export default function Admin() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}
