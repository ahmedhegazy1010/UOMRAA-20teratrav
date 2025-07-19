import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings,
  Package,
  Users,
  MessageSquare,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";

// Sample data
const packagesData = [
  {
    id: 1,
    name: "باقة 8 أيام",
    duration: "8 أيام",
    meccaStay: "4 ليالي - فندق 4 نجوم",
    medinaStay: "3 ليالي - فندق 4 نجوم",
    priceDouble: 25000,
    priceTriple: 23000,
    priceQuad: 21000,
    status: "active",
    bookings: 15,
  },
  {
    id: 2,
    name: "باقة 10 أيام",
    duration: "10 أيام",
    meccaStay: "5 ليال�� - فندق 5 ��جوم",
    medinaStay: "4 ليالي - فندق 5 نجوم",
    priceDouble: 35000,
    priceTriple: 32000,
    priceQuad: 29000,
    status: "active",
    bookings: 28,
  },
  {
    id: 3,
    name: "باقة 14 يوم",
    duration: "14 يوم",
    meccaStay: "7 ليالي - فندق فاخر",
    medinaStay: "6 ليالي - فندق فاخر",
    priceDouble: 45000,
    priceTriple: 42000,
    priceQuad: 38000,
    status: "active",
    bookings: 12,
  },
];

const bookingsData = [
  {
    id: 1,
    customerName: "��حمد محمد",
    phone: "01234567890",
    email: "ahmed@example.com",
    package: "باقة 10 أيام",
    roomType: "ثنائي",
    travelers: 2,
    totalPrice: 70000,
    status: "pending",
    date: "2024-01-15",
    notes: "يفضل فندق قريب من الحرم",
  },
  {
    id: 2,
    customerName: "فاطمة علي",
    phone: "01987654321",
    email: "fatima@example.com",
    package: "باقة 8 أيام",
    roomType: "رباعي",
    travelers: 4,
    totalPrice: 84000,
    status: "confirmed",
    date: "2024-01-20",
    notes: "",
  },
  {
    id: 3,
    customerName: "محمود حسن",
    phone: "01555666777",
    email: "mahmoud@example.com",
    package: "باقة 14 يوم",
    roomType: "ثلاثي",
    travelers: 3,
    totalPrice: 126000,
    status: "completed",
    date: "2024-01-10",
    notes: "عميل مكرر",
  },
];

const inquiriesData = [
  {
    id: 1,
    customerName: "سارة أحمد",
    phone: "01111222333",
    message: "أريد الاستفسار عن باقة العمرة لشهر رمضان",
    date: "2024-01-22",
    status: "new",
  },
  {
    id: 2,
    customerName: "عبدالله محمد",
    phone: "01444555666",
    message: "��ل يمكن تخصيص باقة خاصة لمجموعة من 20 شخص؟",
    date: "2024-01-21",
    status: "replied",
  },
];

function AdminContent() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const stats = [
    {
      title: "إجمالي الحجوزات",
      value: "55",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+12%",
    },
    {
      title: "المبي��ات الشهري���",
      value: "2.4M",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "+8%",
    },
    {
      title: "الاستفسارات الجديدة",
      value: "23",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "+15%",
    },
    {
      title: "العملاء الجدد",
      value: "89",
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "+25%",
    },
  ];

  const sidebarItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: BarChart3 },
    { id: "packages", label: "الباقات", icon: Package },
    { id: "bookings", label: "الحجوزات", icon: Calendar },
    { id: "inquiries", label: "الاستفسارات", icon: MessageSquare },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "نشط", className: "bg-green-100 text-green-800" },
      inactive: { label: "غير نشط", className: "bg-gray-100 text-gray-800" },
      pending: {
        label: "في الانتظار",
        className: "bg-yellow-100 text-yellow-800",
      },
      confirmed: { label: "مؤكد", className: "bg-blue-100 text-blue-800" },
      completed: { label: "مكتمل", className: "bg-green-100 text-green-800" },
      cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
      new: { label: "جديد", className: "bg-orange-100 text-orange-800" },
      replied: { label: "تم الرد", className: "bg-green-100 text-green-800" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h2>
        <p className="text-gray-600">نظرة عامة على أداء الموقع والحجوزات</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-gray-900/80 border-red-500/30 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 transform hover:scale-105 animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                    <span className="text-sm text-green-600">{stat.trend}</span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الحجوزات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookingsData.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {booking.customerName}
                    </p>
                    <p className="text-sm text-gray-600">{booking.package}</p>
                  </div>
                  <div className="text-left">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الاستفسارات الجديدة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inquiriesData.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {inquiry.customerName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>
                  <div className="mr-3">{getStatusBadge(inquiry.status)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPackages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            إدارة الباقات
          </h2>
          <p className="text-gray-600">إدارة باقات العمرة المتاحة</p>
        </div>
        <Dialog open={isAddingPackage} onOpenChange={setIsAddingPackage}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة باقة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة باقة جديدة</DialogTitle>
              <DialogDescription>أدخل تفاصيل الباقة الجديدة</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">اسم ��لباقة</Label>
                  <Input id="name" placeholder="مثال: باقة 10 أيام" />
                </div>
                <div>
                  <Label htmlFor="duration">المدة</Label>
                  <Input id="duration" placeholder="مثال: 10 أيام" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mecca">الإقامة بمكة</Label>
                  <Input id="mecca" placeholder="مثال: 5 ليالي - فندق 5 نجوم" />
                </div>
                <div>
                  <Label htmlFor="medina">الإقامة بالمدينة</Label>
                  <Input
                    id="medina"
                    placeholder="مثال: 4 ليالي - فندق 5 نجوم"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="double">سعر الثنائي</Label>
                  <Input id="double" type="number" placeholder="25000" />
                </div>
                <div>
                  <Label htmlFor="triple">سعر الثلاثي</Label>
                  <Input id="triple" type="number" placeholder="23000" />
                </div>
                <div>
                  <Label htmlFor="quad">سعر الرباعي</Label>
                  <Input id="quad" type="number" placeholder="21000" />
                </div>
              </div>
              <div>
                <Label htmlFor="description">وصف الباقة</Label>
                <Textarea
                  id="description"
                  placeholder="تفاصيل إضافية عن الباقة..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 rtl:space-x-reverse">
              <Button
                variant="outline"
                onClick={() => setIsAddingPackage(false)}
              >
                إلغاء
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700">
                حفظ الباقة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">اسم الباقة</TableHead>
                <TableHead className="text-right">المدة</TableHead>
                <TableHead className="text-right">الإقامة</TableHead>
                <TableHead className="text-right">الأسعار</TableHead>
                <TableHead className="text-right">الحجوزات</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packagesData.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>{pkg.duration}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>مكة: {pkg.meccaStay}</div>
                      <div>المدينة: {pkg.medinaStay}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>ثنائي: {pkg.priceDouble.toLocaleString()} ج</div>
                      <div>ثلاثي: {pkg.priceTriple.toLocaleString()} ج</div>
                      <div>رباعي: {pkg.priceQuad.toLocaleString()} ج</div>
                    </div>
                  </TableCell>
                  <TableCell>{pkg.bookings}</TableCell>
                  <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          إدارة الحجوزات
        </h2>
        <p className="text-gray-600">متابعة وإدارة حجوزات العملاء</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="البحث في الحجوزات..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحجوزات</SelectItem>
            <SelectItem value="pending">في الانتظار</SelectItem>
            <SelectItem value="confirmed">مؤكدة</SelectItem>
            <SelectItem value="completed">مكتملة</SelectItem>
            <SelectItem value="cancelled">ملغاة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">اسم العميل</TableHead>
                <TableHead className="text-right">معلومات الاتصال</TableHead>
                <TableHead className="text-right">الباقة</TableHead>
                <TableHead className="text-right">التفاصيل</TableHead>
                <TableHead className="text-right">المبلغ الإجمالي</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingsData.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{booking.customerName}</div>
                      <div className="text-xs text-gray-500">
                        {booking.date}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center mb-1">
                        <Phone className="w-3 h-3 ml-1" />
                        {booking.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 ml-1" />
                        {booking.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{booking.package}</div>
                      <div className="text-gray-500">
                        غرفة {booking.roomType}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{booking.travelers} مسافر</div>
                      {booking.notes && (
                        <div className="text-gray-500 max-w-xs truncate">
                          {booking.notes}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {booking.totalPrice.toLocaleString()} ج
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderInquiries = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          إدارة الاستفسارات
        </h2>
        <p className="text-gray-600">الرد على استفسارات العملاء</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {inquiriesData.map((inquiry) => (
          <Card key={inquiry.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {inquiry.customerName}
                </CardTitle>
                {getStatusBadge(inquiry.status)}
              </div>
              <CardDescription className="flex items-center space-x-4 rtl:space-x-reverse text-sm">
                <span className="flex items-center">
                  <Phone className="w-4 h-4 ml-1" />
                  {inquiry.phone}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 ml-1" />
                  {inquiry.date}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{inquiry.message}</p>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <MessageSquare className="w-4 h-4 ml-1" />
                  رد
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 ml-1" />
                  اتصال
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات</h2>
        <p className="text-gray-600">إعدادات الموقع والنظام</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات الشركة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company-name">اسم الشرك��</Label>
              <Input id="company-name" defaultValue="تيراتراف" />
            </div>
            <div>
              <Label htmlFor="phone1">الهاتف الأول</Label>
              <Input id="phone1" defaultValue="0225750707" />
            </div>
            <div>
              <Label htmlFor="phone2">الهاتف الثاني</Label>
              <Input id="phone2" defaultValue="1201666688" />
            </div>
            <div>
              <Label htmlFor="whatsapp">رقم الواتساب</Label>
              <Input id="whatsapp" defaultValue="201201666688" />
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700">
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إعدادات النظام</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currency">العملة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر العملة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="egp">جن��ه م��ري (ج)</SelectItem>
                  <SelectItem value="sar">ريال سعودي (ر.س)</SelectItem>
                  <SelectItem value="usd">دولار أمريكي ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">اللغة الافتراضية</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر اللغة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">المنطقة الزمنية</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنطقة الزمنية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cairo">القاهرة (GMT+2)</SelectItem>
                  <SelectItem value="riyadh">الرياض (GMT+3)</SelectItem>
                  <SelectItem value="mecca">مكة (GMT+3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700">
              حفظ الإعدادات
            </Button>
          </CardContent>
        </Card>
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
        return renderInquiries();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black rtl relative overflow-hidden"
      dir="rtl"
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-500/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
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
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
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
