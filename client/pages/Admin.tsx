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

  // Settings state moved to component level
  const [companySettings, setCompanySettings] = useState({
    company_name: "تيراتراف",
    phone_primary: "0225750707",
    phone_secondary: "01201666688",
    whatsapp: "201201666688",
    email: "info@teratrav.com",
    address: "القاهرة، مصر",
    working_hours_weekdays: "9:00 ص - 9:00 م",
    working_hours_friday: "2:00 م - 9:00 م",
    license_number: "12345",
    tax_number: "67890",
  });

  const [adminUsers, setAdminUsers] = useState([
    {
      id: 1,
      username: "admin",
      role: "مدير عام",
      active: true,
      last_login: "منذ ساعة",
    },
    {
      id: 2,
      username: "operator",
      role: "مشغل",
      active: true,
      last_login: "منذ يومين",
    },
  ]);

  const [systemSettings, setSystemSettings] = useState({
    site_maintenance: false,
    allow_registrations: true,
    auto_backup: true,
    email_notifications: true,
    sms_notifications: false,
    max_booking_days: 60,
    booking_deposit_percentage: 30,
  });

  const [newAdmin, setNewAdmin] = useState({
    username: "",
    password: "",
    role: "operator",
  });

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Settings helper functions
  const handleCompanySettingsUpdate = async () => {
    // Here you would normally send to API
    alert("تم حفظ إعدادات الشركة بنجاح!");
  };

  const handleSystemSettingsUpdate = async () => {
    // Here you would normally send to API
    alert("تم حفظ إعدادات النظام بنجاح!");
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.username || !newAdmin.password) {
      alert("يرجى ملء جميع البيانات المطلوبة");
      return;
    }
    // Here you would normally send to API
    const newUser = {
      id: Date.now(),
      username: newAdmin.username,
      role: newAdmin.role === "admin" ? "مدير عام" : "مشغل",
      active: true,
      last_login: "لم يسجل دخول بعد",
    };
    setAdminUsers([...adminUsers, newUser]);
    setNewAdmin({ username: "", password: "", role: "operator" });
    alert("تم إضافة المستخدم بنجاح!");
  };

  const toggleAdminStatus = (id: number) => {
    setAdminUsers(
      adminUsers.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user,
      ),
    );
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
        setStats(statsData.data.stats || null);
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
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "لوحة الت��كم", icon: BarChart3 },
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">إدارة الباقات</h2>
          <p className="text-gray-300">إدارة باقات العمرة المتاحة</p>
        </div>
        <Button
          onClick={() => setShowPackageModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          إضافة باقة جديدة
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
                  الأسعار: {pkg.price_double} - {pkg.price_quad} ج
                </div>
                {(pkg.price_infant || pkg.price_child) && (
                  <div className="text-xs space-y-1">
                    {pkg.price_infant && <div>رضيع: {pkg.price_infant} ج</div>}
                    {pkg.price_child && <div>طفل: {pkg.price_child} ج</div>}
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
                    onClick={() => handleEditPackage(pkg)}
                    className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                  >
                    تحديث
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletePackage(pkg.id)}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-gray-900/95 border-red-500/30 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white">
                {editingPackage ? "تحديث الباقة" : "إضافة باقة جديدة"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    اسم الباقة
                  </label>
                  <input
                    type="text"
                    value={packageForm.name}
                    onChange={(e) =>
                      setPackageForm({ ...packageForm, name: e.target.value })
                    }
                    className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                    placeholder="مثال: عمرة رمضان"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    المدة
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
                    placeholder="4 ليالي"
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
                    placeholder="2 ليالي"
                  />
                </div>
                <div className="space-y-2">
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
                    سعر الغرفة الثنائية
                  </label>
                  <input
                    type="number"
                    value={packageForm.price_double}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        price_double: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    سعر الغرفة الثلاثية
                  </label>
                  <input
                    type="number"
                    value={packageForm.price_triple}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        price_triple: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                    placeholder="45000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    سعر الغرفة الرباعية
                  </label>
                  <input
                    type="number"
                    value={packageForm.price_quad}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        price_quad: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                    placeholder="40000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    سعر الطفل
                  </label>
                  <input
                    type="number"
                    value={packageForm.price_child || ""}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        price_child: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                    placeholder="30000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    سعر الرضيع
                  </label>
                  <input
                    type="number"
                    value={packageForm.price_infant || ""}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        price_infant: e.target.value
                          ? parseInt(e.target.value)
                          : null,
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
                      setPackageForm({ ...packageForm, status: e.target.value })
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
                    setEditingPackage(null);
                    resetPackageForm();
                  }}
                  className="border-gray-600 text-gray-300"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleSavePackage}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {editingPackage ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
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
                        📅 تار��خ السفر:{" "}
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

  const renderInquiries = () => (
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
            <p className="text-gray-300 text-lg">لا توجد استفسارات حتى الآن</p>
          </Card>
        ) : (
          inquiries.map((inquiry: any) => (
            <Card
              key={inquiry.id}
              className="bg-gray-900/80 border-red-500/30 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <MessageSquare className="w-5 h-5 ml-2 text-red-400" />
                    {inquiry.name}
                  </CardTitle>
                  <Badge
                    className={
                      inquiry.status === "new"
                        ? "bg-blue-100 text-blue-800"
                        : inquiry.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : inquiry.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                    }
                  >
                    {inquiry.status === "new"
                      ? "جديد"
                      : inquiry.status === "in_progress"
                        ? "قيد المعالجة"
                        : inquiry.status === "resolved"
                          ? "تم الحل"
                          : "مغلق"}
                  </Badge>
                </div>
                <CardDescription className="text-gray-300">
                  تاريخ الاستفسار:{" "}
                  {new Date(inquiry.created_at).toLocaleDateString("ar-EG")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2 text-gray-300">
                      <div>📞 الهاتف: {inquiry.phone}</div>
                      {inquiry.email && <div>📧 الإيميل: {inquiry.email}</div>}
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded p-4">
                    <h4 className="text-sm font-semibold text-white mb-2">
                      الاستفسار:
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {inquiry.message}
                    </p>
                  </div>

                  {inquiry.admin_response && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
                      <h4 className="text-sm font-semibold text-green-400 mb-2">
                        رد الإدارة:
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {inquiry.admin_response}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderSettings = () => {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">إعدادات النظام</h2>
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
                  value={companySettings.company_name}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      company_name: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={companySettings.email}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  الهاتف الرئيسي
                </label>
                <input
                  type="tel"
                  value={companySettings.phone_primary}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      phone_primary: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  الهاتف الثانوي
                </label>
                <input
                  type="tel"
                  value={companySettings.phone_secondary}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      phone_secondary: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  واتساب
                </label>
                <input
                  type="tel"
                  value={companySettings.whatsapp}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      whatsapp: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  العنوان
                </label>
                <input
                  type="text"
                  value={companySettings.address}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      address: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  ساعات العمل (السبت - الخميس)
                </label>
                <input
                  type="text"
                  value={companySettings.working_hours_weekdays}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      working_hours_weekdays: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  ساعات العمل (الجمعة)
                </label>
                <input
                  type="text"
                  value={companySettings.working_hours_friday}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      working_hours_friday: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  رقم الترخيص
                </label>
                <input
                  type="text"
                  value={companySettings.license_number}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      license_number: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  الرقم الضريبي
                </label>
                <input
                  type="text"
                  value={companySettings.tax_number}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      tax_number: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleCompanySettingsUpdate}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                حفظ إعدادات الشركة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Users Management */}
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
            {/* Current Admin Users */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">
                المستخدمون الحاليون
              </h4>
              <div className="space-y-3">
                {adminUsers.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div
                        className={`w-3 h-3 rounded-full ${admin.active ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <div>
                        <p className="text-white font-medium">
                          {admin.username}
                        </p>
                        <p className="text-gray-400 text-sm">{admin.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <span className="text-gray-400 text-xs">
                        {admin.last_login}
                      </span>
                      <Button
                        size="sm"
                        variant={admin.active ? "destructive" : "default"}
                        onClick={() => toggleAdminStatus(admin.id)}
                        className="text-xs"
                      >
                        {admin.active ? "إيقاف" : "تفعيل"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Admin */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">
                إضافة مستخدم جديد
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    اسم المستخدم
                  </label>
                  <input
                    type="text"
                    value={newAdmin.username}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, username: e.target.value })
                    }
                    className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                    placeholder="username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, password: e.target.value })
                    }
                    className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    الدور
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, role: e.target.value })
                    }
                    className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                  >
                    <option value="operator">مشغل</option>
                    <option value="admin">مدير عام</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleAddAdmin}
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
              إعدادات النظام
            </CardTitle>
            <CardDescription className="text-gray-300">
              إعدادات عامة للموقع والنظام
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">
                  الصيانة والأمان
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">وضع الصيانة</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.site_maintenance}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            site_maintenance: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">السماح بالتسجيل</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.allow_registrations}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            allow_registrations: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      النسخ الاحتياطي التلقائي
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.auto_backup}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            auto_backup: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">الإشعارات</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      إشعارات البريد الإلكتروني
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.email_notifications}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            email_notifications: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      إشعارات الرسائل القصيرة
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.sms_notifications}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            sms_notifications: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">
                  إعدادات الحجز
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      الحد الأقصى لأيام الحجز المسبق
                    </label>
                    <input
                      type="number"
                      value={systemSettings.max_booking_days}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          max_booking_days: parseInt(e.target.value),
                        })
                      }
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                      min="1"
                      max="365"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      نسبة العربون المطلوب (%)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.booking_deposit_percentage}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          booking_deposit_percentage: parseInt(e.target.value),
                        })
                      }
                      className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                      min="10"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSystemSettingsUpdate}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                حفظ إعدادات النظام
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database & Backup */}
        <Card className="bg-gray-900/80 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Package className="w-5 h-5 ml-2 text-orange-400" />
              النسخ الاحتياطي والصيانة
            </CardTitle>
            <CardDescription className="text-gray-300">
              إدارة النسخ الاحتياطي وصيانة قاعدة البيانات
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
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "packages":
        return renderPackages();
      case "bookings":
        return renderBookings();
      case "inquiries":
        return renderInquiries();
      case "settings":
        return renderSettings();
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
              <span className="text-lg font-bold text-white">لوحة الت��كم</span>
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
