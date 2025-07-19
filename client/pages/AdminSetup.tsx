import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EnhancedIslamicBackground from "@/components/EnhancedIslamicBackground";
import { Users, Key, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminSetup() {
  const [createForm, setCreateForm] = useState({
    username: "hegazy",
    password: "hegazy01550",
    role: "admin",
  });

  const [resetForm, setResetForm] = useState({
    username: "hegazy",
    newPassword: "hegazy01550",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreateUser = async () => {
    if (!createForm.username || !createForm.password) {
      setError("يرجى ملء جميع البيانات");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createForm),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`تم إنشاء المستخدم بنجاح! يمكنك الآن تسجيل الدخول بالبيانات التالية:
        اسم المستخدم: ${createForm.username}
        كلمة المرور: ${createForm.password}`);
      } else {
        setError(data.message || "فشل في إنشاء المستخدم");
      }
    } catch (err) {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetForm.username || !resetForm.newPassword) {
      setError("يرجى ملء جميع البيانات");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetForm),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`تم تحديث كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بالبيانات التالية:
        اسم المستخدم: ${resetForm.username}
        كلمة المرور الجديدة: ${resetForm.newPassword}`);
      } else {
        setError(data.message || "فشل في تحديث كلمة المرور");
      }
    } catch (err) {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 rtl relative"
      dir="rtl"
    >
      <EnhancedIslamicBackground />

      <div className="w-full max-w-4xl space-y-6 relative z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            إعداد لوحة الإدارة
          </h1>
          <p className="text-gray-300">
            صفحة مساعدة لإنشاء المستخدم أو إعادة تعيين كلمة المرور
          </p>
        </div>

        {message && (
          <Alert className="bg-green-900/20 border-green-500/50">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200 whitespace-pre-line">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="bg-red-900/20 border-red-500/50">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create User */}
          <Card className="bg-gray-900/80 backdrop-blur-md border-red-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 ml-2 text-blue-400" />
                إنشاء مستخدم جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">اسم المستخدم</Label>
                <Input
                  type="text"
                  value={createForm.username}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, username: e.target.value })
                  }
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="hegazy"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">كلمة المرور</Label>
                <Input
                  type="text"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="hegazy01550"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">الدور</Label>
                <select
                  value={createForm.role}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, role: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-md text-white"
                >
                  <option value="admin">مدير</option>
                  <option value="operator">مشغل</option>
                </select>
              </div>

              <Button
                onClick={handleCreateUser}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "جاري الإنشاء..." : "إنشاء مستخدم"}
              </Button>
            </CardContent>
          </Card>

          {/* Reset Password */}
          <Card className="bg-gray-900/80 backdrop-blur-md border-red-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="w-5 h-5 ml-2 text-green-400" />
                إعادة تعيي�� كلمة المرور
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">اسم المستخدم</Label>
                <Input
                  type="text"
                  value={resetForm.username}
                  onChange={(e) =>
                    setResetForm({ ...resetForm, username: e.target.value })
                  }
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="hegazy"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">كلمة المرور الجديدة</Label>
                <Input
                  type="text"
                  value={resetForm.newPassword}
                  onChange={(e) =>
                    setResetForm({ ...resetForm, newPassword: e.target.value })
                  }
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="hegazy01550"
                />
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Login Section */}
        <Card className="bg-gray-900/80 backdrop-blur-md border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-white">
              بيانات تسجيل الدخول المتاحة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-white font-semibold mb-2">
                  المستخدم الافتراضي
                </h4>
                <p className="text-gray-300">
                  اسم المستخدم: <span className="text-blue-400">admin</span>
                </p>
                <p className="text-gray-300">
                  كلمة المرور:{" "}
                  <span className="text-blue-400">teratrav2024</span>
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-white font-semibold mb-2">مستخدم هجازي</h4>
                <p className="text-gray-300">
                  اسم المستخدم: <span className="text-green-400">hegazy</span>
                </p>
                <p className="text-gray-300">
                  كلمة المرور:{" "}
                  <span className="text-green-400">hegazy01550</span>
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-4 justify-center">
              <Button
                onClick={() => (window.location.href = "/admin")}
                className="bg-red-600 hover:bg-red-700 text-white px-8"
              >
                الذهاب إلى صفحة تسجيل الدخول
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
