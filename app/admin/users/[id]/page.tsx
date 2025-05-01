"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation"; // useParams import qilindi
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart2, FileText, Mail, Phone, Save, User, Wallet } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Label } from "@/components/ui/label";
import axios from "axios";

// Interfeyslar o'rniga, ma'lumotlarni to'g'ridan-to'g'ri ishlatamiz,
// lekin keladigan ma'lumot strukturasini yodda tutish muhim.

// Komponent
export default function UserDetailPage() { // params prop o'chirildi
  const router = useRouter();
  const params = useParams(); // useParams hook'i ishlatildi
  const userId = params?.id; // userId params'dan olinadi (string yoki undefined bo'lishi mumkin)

  const [activeTab, setActiveTab] = useState("profile");
  const [token, setToken] = useState(null);

  // State'lar (TypeScript interfeyslarisiz)
  const [userInfo, setUserInfo] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [paymentsHistoryUser, setPaymentsHistory] = useState([]);
  const [statistics, setStatistics] = useState(null);

  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Umumiy submitlar uchun

  // Forma uchun state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    study_place: "",
    grade: "",
    target_university: "",
    target_faculty: "",
    about_me: "",
  });

  // Tokenni olish uchun useEffect
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      // Agar token bo'lmasa, login sahifasiga o'tkazish kerak
      console.error("Token topilmadi, login sahifasiga yo'naltirilmoqda.");
      router.push("/");
    }
  }, [router]);

  // Xatolikni boshqarish uchun helper funksiya
  const handleApiError = useCallback((error, context) => {
    console.error(`${context} xatolik:`, error);
    let message = `Xatolik yuz berdi: ${context}.`;
    // Axios xatoligini tekshirish
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Token eskirgan yoki noto'g'ri
        localStorage.removeItem("token");
        setToken(null);
        router.push("/"); // Login sahifasiga yo'naltirish
        message = "Sessiya muddati tugadi. Iltimos, qayta kiring.";
      } else if (error.response?.data) {
        // Backenddan kelgan xatolikni ko'rsatishga harakat qilish
        const errorData = error.response.data;
        message = `Server xatoligi (${error.response.status}): ${JSON.stringify(errorData.detail || errorData)}`;
      } else {
        message = `Server bilan bog'lanishda xatolik: ${error.message}`;
      }
    } else if (error instanceof Error) {
       message = error.message;
    }
    alert(message); // Foydalanuvchiga xabarni ko'rsatish (yaxshiroq UI komponenti bilan almashtirish mumkin)
  }, [router]);


  // --- Ma'lumotlarni Olish Funksiyalari (useCallback bilan) ---

  const fetchUserData = useCallback(() => {
    // userId mavjudligini tekshiramiz
    if (!token || !userId) {
        console.log("Token yoki UserID mavjud emas, foydalanuvchi ma'lumotlari yuklanmaydi.");
        return;
    }
    setIsLoadingProfile(true);
    console.log(`Fetching user data for ID: ${userId} with token: ${token ? '...' : 'none'}`);
    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/users/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const userData = res.data;
        let status = 'Nofaol'; // Default status
        if (userData.is_active && !userData.is_blocked) {
            status = 'Faol';
        } else if (userData.is_blocked) {
            status = 'Bloklangan';
        }
        setUserInfo({...userData, status }); // Statusni qo'shib userInfo ni o'rnatamiz
        setFormData({
          full_name: userData.full_name || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
          address: userData.address || "",
          study_place: userData.study_place || "",
          grade: userData.grade || "",
          target_university: userData.target_university || "",
          target_faculty: userData.target_faculty || "",
          about_me: userData.about_me || "",
        });
      })
      .catch((err) => handleApiError(err, "Foydalanuvchi ma'lumotlarini olish"))
      .finally(() => setIsLoadingProfile(false));
  }, [token, userId, handleApiError]); // userId ni dependency ga qo'shamiz

  const fetchTestHistory = useCallback(() => {
    if (!token || !userId) return;
    setIsLoadingTests(true);
    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/users/${userId}/test-history/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // API javobini tekshiramiz (sahifalash bo'lsa .results ni olish kerak)
        const results = Array.isArray(res.data) ? res.data : res.data?.results;
        setTestHistory(Array.isArray(results) ? results : []); // Har doim massiv qaytarish
        console.log("Test tarixi:", results); // Konsolga chiqarish
      })
      .catch((err) => {
        handleApiError(err, "Test tarixini olish");
        setTestHistory([]); // Xatolik bo'lsa tozalash
      })
      .finally(() => setIsLoadingTests(false));
  }, [token, userId, handleApiError]); // userId ni dependency ga qo'shamiz

  const fetchPaymentsHistory = useCallback(() => {
    if (!token || !userId) return;
    setIsLoadingPayments(true);
    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/users/${userId}/payment-history/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const results = Array.isArray(res.data) ? res.data : res.data?.results;
         setPaymentsHistory(Array.isArray(results) ? results : []);
      })
      .catch((err) => {
          handleApiError(err, "To'lovlar tarixini olish");
          setPaymentsHistory([]);
      })
      .finally(() => setIsLoadingPayments(false));
  }, [token, userId, handleApiError]); // userId ni dependency ga qo'shamiz

  const fetchStatistics = useCallback(() => {
    if (!token || !userId) return;
    setIsLoadingStats(true);
    axios
      .get(`https://testonline.pythonanywhere.com/api/admin/users/${userId}/statistics/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStatistics(res.data); // Obyekt kelishi kutiladi
      })
      .catch((err) => {
          handleApiError(err, "Statistika olish");
          setStatistics(null);
      })
      .finally(() => setIsLoadingStats(false));
  }, [token, userId, handleApiError]); // userId ni dependency ga qo'shamiz

  // Asosiy ma'lumotlarni olish uchun useEffect
  useEffect(() => {
    // userId va token mavjud bo'lgandagina funksiyalarni chaqiramiz
    if (token && userId) {
      fetchUserData();
      fetchTestHistory();
      fetchPaymentsHistory();
      fetchStatistics();
    }
    // Agar userId o'zgarsa (nazariy jihatdan bu sahifada o'zgarmaydi, lekin to'g'ri dependency)
    // yoki token o'zgarsa (masalan, login/logout dan keyin) qayta chaqiriladi.
  }, [token, userId, fetchUserData, fetchTestHistory, fetchPaymentsHistory, fetchStatistics]);

  // --- Form Handlerlar ---
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // --- API Action Handlerlar ---
  const handleSaveChanges = () => {
    if (isSubmitting || !token || !userId || !userInfo) return;

    setIsSubmitting(true);

    const updatedData = {
      full_name: formData.full_name,
      phone_number: formData.phone_number || null,
      // email: formData.email, // Agar emailni tahrirlash mumkin bo'lsa
      birth_date: userInfo.birth_date, // Formada yo'q, originalini qoldiramiz
      gender: userInfo.gender,
      region: userInfo.region,
      study_place: formData.study_place || null,
      grade: formData.grade || null,
      address: formData.address || null,
      target_university: formData.target_university || null,
      target_faculty: formData.target_faculty || null,
      about_me: formData.about_me || null,
      // Boshqa maydonlar (role, balance, is_active, etc.) bu yerda o'zgartirilmaydi
    };

    axios
      // PATCH afzalroq, faqat o'zgargan maydonlarni yuboradi
      .patch(`https://testonline.pythonanywhere.com/api/admin/users/${userId}/`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => { // Javobda yangilangan User kelishi mumkin, uni ishlatsa ham bo'ladi
        alert("Ma'lumotlar muvaffaqiyatli yangilandi!");
        fetchUserData(); // Ma'lumotlarni qayta yuklash
      })
      .catch((error) => {
         handleApiError(error, "Ma'lumotlarni yangilash");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

   const handleBlockUser = () => {
    if (!token || !userId || isSubmitting) return;
    setIsSubmitting(true);
    axios.post(`https://testonline.pythonanywhere.com/api/admin/users/${userId}/block/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        alert("Foydalanuvchi muvaffaqiyatli bloklandi!");
        fetchUserData(); // Statusni yangilash uchun
      })
      .catch((err) => handleApiError(err, "Foydalanuvchini bloklash"))
      .finally(() => setIsSubmitting(false));
  };

  const handleUnblockUser = () => {
    if (!token || !userId || isSubmitting) return;
    setIsSubmitting(true);
    axios.post(`https://testonline.pythonanywhere.com/api/admin/users/${userId}/unblock/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        alert("Foydalanuvchi muvaffaqiyatli blokdan ochildi!");
        fetchUserData(); // Statusni yangilash uchun
      })
      .catch((err) => handleApiError(err, "Foydalanuvchini blokdan ochish"))
      .finally(() => setIsSubmitting(false));
  };

  const handleDeleteUser = () => {
    if (!token || !userId || isSubmitting) return;
    // Tasdiqlash dialogini ko'rsatish
    if (window.confirm("Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.")) {
      setIsSubmitting(true);
      axios.delete(`https://testonline.pythonanywhere.com/api/admin/users/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          // Odatda DELETE 204 No Content qaytaradi
          if (res.status === 204) {
             alert("Foydalanuvchi muvaffaqiyatli o'chirildi!");
             router.push("/admin/dashboard"); // Dashboardga qaytish
          } else {
             // Kamdan-kam hollarda 200 yoki 202 kelishi mumkin
             console.warn(`Foydalanuvchi o'chirildi, lekin kutilmagan status kodi: ${res.status}`);
             alert("Foydalanuvchi o'chirildi!");
             router.push("/admin/dashboard");
          }
        })
        .catch((err) => handleApiError(err, "Foydalanuvchini o'chirish"))
        .finally(() => setIsSubmitting(false));
    }
  };

  // Balansni to'ldirish sahifasiga o'tish
  const navigateToAddBalance = () => {
      if (userId) {
          router.push(`/admin/payments/add/${userId}`);
      } else {
          console.error("Balansni to'ldirish uchun UserID topilmadi.");
      }
  }

   // --- Render Logic ---

  // Agar UserID yo'q bo'lsa (URL'dan olinmagan bo'lsa)
  if (!userId) {
      return (
          <AdminLayout>
              <div className="p-6 text-center text-red-600">Foydalanuvchi ID si topilmadi. URL manzilini tekshiring.</div>
          </AdminLayout>
      );
  }

  // Agar boshlang'ich ma'lumotlar yuklanayotgan bo'lsa
  if (isLoadingProfile && !userInfo) {
    return (
      <AdminLayout>
        <div className="p-6 text-center">Foydalanuvchi ma'lumotlari yuklanmoqda...</div>
      </AdminLayout>
    );
  }

  // Agar yuklash tugagan va userInfo hali ham null bo'lsa (xatolik yoki topilmadi)
  if (!isLoadingProfile && !userInfo) {
     return (
      <AdminLayout>
         <div className="p-6">
             <Button variant="outline" className="mb-4" onClick={() => router.back()}>
                 <ArrowLeft className="h-4 w-4 mr-2" /> Orqaga
             </Button>
             <Card>
                <CardContent className="p-6 text-center text-red-600">
                    Foydalanuvchi topilmadi yoki ma'lumotlarni yuklashda xatolik yuz berdi.
                </CardContent>
             </Card>
         </div>
      </AdminLayout>
     );
  }

  // --- Status va Ranglarni Aniqlash Funksiyalari ---
  const getStatusVariant = (status) => {
      switch (status) {
          case 'Faol': return 'default';
          case 'Bloklangan': return 'destructive';
          case 'Nofaol': return 'secondary';
          default: return 'secondary';
      }
  };
   const getPaymentStatusVariant = (status) => {
    switch (status) {
      case 'completed':
      case 'success': return 'default'; // Yashil
      case 'pending':
      case 'processing': return 'secondary'; // Sariq/Kulrang
      case 'failed':
      case 'cancelled': return 'destructive'; // Qizil
      default: return 'outline';
    }
  };
   const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'completed':
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return '';
    }
  };
  const getTestStatusVariant = (status) => {
      switch (status) {
          case 'completed': return 'default'; // Yashil
          case 'in_progress': return 'secondary'; // Sariq
          case 'pending': return 'outline'; // Kulrang
          // Boshqa statuslar bo'lsa, qo'shish mumkin
          default: return 'outline';
      }
  };
   const getTestStatusClass = (status) => {
      switch (status) {
          case 'completed': return 'bg-green-100 text-green-800';
          case 'in_progress': return 'bg-yellow-100 text-yellow-800';
          case 'pending': return 'bg-gray-100 text-gray-800';
          default: return '';
      }
  };

  // --- JSX Render ---
  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center">
            <Button variant="outline" className="mr-4" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Orqaga
            </Button>
            <div>
              {/* userInfo mavjudligini tekshiramiz */}
              <h2 className="text-2xl font-bold mb-1">Foydalanuvchi: {userInfo?.full_name || 'Yuklanmoqda...'}</h2>
              <p className="text-gray-600">ID: {userId}</p>
            </div>
          </div>
          {/* Action Buttons (userInfo mavjud bo'lganda ko'rsatiladi) */}
          {userInfo && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleUnblockUser}
                disabled={isSubmitting || !userInfo.is_blocked}
                aria-label="Foydalanuvchini blokdan ochish"
              >
                Blokdan ochish
              </Button>
              <Button
                variant="outline"
                onClick={handleBlockUser}
                disabled={isSubmitting || userInfo.is_blocked || !userInfo.is_active}
                aria-label="Foydalanuvchini bloklash"
              >
                Bloklash
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={isSubmitting}
                aria-label="Foydalanuvchini o'chirish"
              >
                O'chirish
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="tests">Testlar</TabsTrigger>
            <TabsTrigger value="payments">To'lovlar</TabsTrigger>
            <TabsTrigger value="statistics">Statistika</TabsTrigger>
          </TabsList>

          {/* --- Profile Tab --- */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Side: Edit Form */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-blue-500" />Shaxsiy ma'lumotlarni tahrirlash</CardTitle>
                    <CardDescription>Foydalanuvchining asosiy ma'lumotlari</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Formani faqat userInfo yuklangandan keyin ko'rsatamiz */}
                    {isLoadingProfile && <div className="text-center">Forma yuklanmoqda...</div>}
                    {!isLoadingProfile && userInfo && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2"><Label htmlFor="full_name">To'liq ism</Label><Input id="full_name" value={formData.full_name} onChange={handleInputChange} disabled={isSubmitting} /></div>
                          {/* Emailni tahrirlash kerak bo'lsa: */}
                          {/* <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={handleInputChange} disabled={isSubmitting} /></div> */}
                          <div className="space-y-2"><Label htmlFor="phone_number">Telefon</Label><Input id="phone_number" value={formData.phone_number} onChange={handleInputChange} disabled={isSubmitting} placeholder="+998 XX XXX XX XX"/></div>
                          <div className="space-y-2"><Label htmlFor="address">Manzil</Label><Input id="address" value={formData.address} onChange={handleInputChange} disabled={isSubmitting} /></div>
                          <div className="space-y-2"><Label htmlFor="study_place">O'qish joyi</Label><Input id="study_place" value={formData.study_place} onChange={handleInputChange} disabled={isSubmitting} /></div>
                          <div className="space-y-2"><Label htmlFor="grade">Sinf/Kurs</Label><Input id="grade" value={formData.grade} onChange={handleInputChange} disabled={isSubmitting} /></div>
                          <div className="space-y-2"><Label htmlFor="target_university">Maqsad universitet</Label><Input id="target_university" value={formData.target_university} onChange={handleInputChange} disabled={isSubmitting} /></div>
                          <div className="space-y-2"><Label htmlFor="target_faculty">Maqsad fakultet</Label><Input id="target_faculty" value={formData.target_faculty} onChange={handleInputChange} disabled={isSubmitting} /></div>
                        </div>
                        <div className="space-y-2"><Label htmlFor="about_me">Qo'shimcha ma'lumotlar (Bio)</Label><Textarea id="about_me" value={formData.about_me} onChange={handleInputChange} rows={4} disabled={isSubmitting} /></div>
                        {/* Foydalanuvchi Holati (o'zgartirilmaydi, faqat ko'rsatiladi) */}
                        <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                          <div><Label className="text-sm font-medium">Foydalanuvchi Holati</Label></div>
                          <Badge variant={getStatusVariant(userInfo.status)}>{userInfo.status || 'Noma\'lum'}</Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={isSubmitting || isLoadingProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Saqlanmoqda...' : 'O\'zgarishlarni Saqlash'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Right Side: User Info & Balance */}
              <div>
                {/* User Info Card */}
                <Card className="mb-6">
                  <CardHeader><CardTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-blue-500" />Foydalanuvchi haqida</CardTitle></CardHeader>
                  <CardContent>
                    {isLoadingProfile && <div className="text-center">Yuklanmoqda...</div>}
                    {userInfo && (
                      <div className="flex flex-col items-center text-center">
                        {/* Profile Picture */}
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3 overflow-hidden">
                          {userInfo.profile_picture ? (
                              <img src={userInfo.profile_picture} alt={userInfo.full_name || 'Profil rasmi'} className="w-full h-full object-cover" />
                          ) : (
                              <User className="h-10 w-10 text-blue-600" />
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{userInfo.full_name}</h3>
                        <Badge variant="secondary" className="mb-3">{userInfo.role_display || userInfo.role}</Badge>
                        <div className="w-full space-y-1 text-sm text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 flex items-center"><Mail className="h-3 w-3 mr-1.5" />Email:</span>
                            <span className="truncate" title={userInfo.email}>{userInfo.email || '-'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 flex items-center"><Phone className="h-3 w-3 mr-1.5" />Telefon:</span>
                            <span>{userInfo.phone_number || '-'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Ro'yxatdan o'tgan:</span>
                            <span>{userInfo.date_joined ? new Date(userInfo.date_joined).toLocaleDateString() : '-'}</span>
                          </div>
                           <div className="flex items-center justify-between mt-2 pt-2 border-t">
                            <span className="text-gray-500">Holati:</span>
                            <Badge variant={getStatusVariant(userInfo.status)} size="sm">{userInfo.status || 'Noma\'lum'}</Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                {/* Balance Card */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><Wallet className="mr-2 h-5 w-5 text-blue-500" />Balans</CardTitle></CardHeader>
                  <CardContent>
                    {isLoadingProfile && <div className="text-center">Yuklanmoqda...</div>}
                    {userInfo && (
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-3">
                          {/* Balansni numberga o'tkazib, formatlaymiz */}
                          {Number(userInfo.balance || 0).toLocaleString('uz-UZ', { style: 'currency', currency: 'UZS', minimumFractionDigits: 0 })}
                        </div>
                        <Button className="w-full" onClick={navigateToAddBalance} disabled={isSubmitting || isLoadingProfile}>
                          Balansni to'ldirish
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* --- Tests Tab --- */}
          <TabsContent value="tests">
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-blue-500" />Testlar Tarixi</CardTitle>
                <CardDescription>Foydalanuvchining topshirgan testlari natijalari</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTests && <div className="text-center p-4">Test tarixi yuklanmoqda...</div>}
                {!isLoadingTests && testHistory.length === 0 && <div className="text-center p-4 text-gray-500">Test tarixi topilmadi.</div>}
                {!isLoadingTests && testHistory.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-3 font-medium">Natija ID</th>
                            <th className="text-left p-3 font-medium">Test Nomi</th>
                            <th className="text-left p-3 font-medium">Fan</th>
                            <th className="text-left p-3 font-medium">Boshlangan</th>
                            <th className="text-left p-3 font-medium">Tugatilgan</th>
                            <th className="text-right p-3 font-medium">Natija</th>
                            <th className="text-right p-3 font-medium">Foiz (%)</th>
                            <th className="text-center p-3 font-medium">Holat</th>
                            <th className="text-right p-3 font-medium">Amallar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testHistory.map((item) => (
                            <tr className="border-t hover:bg-muted/20" key={item.id}>
                              <td className="p-3">#{item.id}</td>
                              <td className="p-3">{item.test?.title || 'Noma\'lum'}</td>
                              <td className="p-3">{item.test?.subject?.name || 'N/A'}</td>
                              <td className="p-3">{item.start_time ? new Date(item.start_time).toLocaleString() : '-'}</td>
                              <td className="p-3">{item.end_time ? new Date(item.end_time).toLocaleString() : '-'}</td>
                              <td className="p-3 text-right font-medium">{item.score_display || item.score}</td>
                              <td className="p-3 text-right font-medium">{item.percentage?.toFixed(1) ?? '0.0'}%</td>
                              <td className="p-3 text-center">
                                <Badge
                                  variant={getTestStatusVariant(item.status)}
                                  className={getTestStatusClass(item.status)}
                                >
                                  {item.status_display || item.status}
                                </Badge>
                              </td>
                              <td className="p-3 text-right">
                                <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => router.push(`/admin/test-results/${item.id}`)}
                                   disabled={!item.id}
                                >
                                  Ko'rish
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                     {/* Sahifalash kerak bo'lsa, shu yerga qo'shiladi */}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- Payments Tab --- */}
          <TabsContent value="payments">
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Wallet className="mr-2 h-5 w-5 text-blue-500" />To'lovlar Tarixi</CardTitle>
                <CardDescription>Foydalanuvchining barcha moliyaviy operatsiyalari</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPayments && <div className="text-center p-4">To'lovlar tarixi yuklanmoqda...</div>}
                {!isLoadingPayments && paymentsHistoryUser.length === 0 && <div className="text-center p-4 text-gray-500">To'lovlar tarixi mavjud emas.</div>}
                {!isLoadingPayments && paymentsHistoryUser.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-3 font-medium">ID</th>
                            <th className="text-left p-3 font-medium">Turi</th>
                            <th className="text-left p-3 font-medium">Tavsif</th>
                             <th className="text-right p-3 font-medium">Summa</th>
                             <th className="text-left p-3 font-medium">Usul</th>
                            <th className="text-left p-3 font-medium">Sana</th>
                            <th className="text-center p-3 font-medium">Holat</th>
                            <th className="text-right p-3 font-medium">Amallar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentsHistoryUser.map((payment) => (
                            <tr className="border-t hover:bg-muted/20" key={payment.id}>
                              <td className="p-3">#{payment.id}</td>
                              <td className="p-3">
                                <Badge variant={payment.payment_type === 'deposit' ? 'default' : 'secondary'}>
                                    {payment.type_display || payment.payment_type}
                                </Badge>
                              </td>
                              <td className="p-3">{payment.description || '-'}</td>
                              <td className={`p-3 text-right font-medium ${Number(payment.amount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {payment.amount_display || `${Number(payment.amount || 0).toLocaleString('uz-UZ')} so'm`}
                              </td>
                              <td className="p-3">{payment.method_display || payment.payment_method || '-'}</td>
                              <td className="p-3">{payment.created_at ? new Date(payment.created_at).toLocaleString() : '-'}</td>
                              <td className="p-3 text-center">
                                <Badge
                                  variant={getPaymentStatusVariant(payment.status)}
                                  className={getPaymentStatusClass(payment.status)}
                                >
                                  {payment.status_display || payment.status}
                                </Badge>
                              </td>
                              <td className="p-3 text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/admin/payments/${payment.id}`)}
                                    disabled={!payment.id}
                                >
                                  Ko'rish
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                     {/* Sahifalash kerak bo'lsa, shu yerga qo'shiladi */}
                  </div>
                )}
              </CardContent>
               <CardFooter className="flex justify-end">
                    {/* Frontendda Excel/PDF generatsiya qilish logikasi bu tugmaga bog'lanadi */}
                    <Button variant="outline" disabled={isLoadingPayments || paymentsHistoryUser.length === 0}>
                        Hisobot Yuklash (Excel/PDF)
                    </Button>
               </CardFooter>
            </Card>
          </TabsContent>

          {/* --- Statistics Tab --- */}
          <TabsContent value="statistics">
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-blue-500" />Umumiy Statistika</CardTitle>
                <CardDescription>Foydalanuvchining asosiy ko'rsatkichlari</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStats && <div className="text-center p-4">Statistika yuklanmoqda...</div>}
                {!isLoadingStats && !statistics && <div className="text-center p-4 text-gray-500">Statistika ma'lumotlari mavjud emas yoki yuklashda xatolik.</div>}
                {/* Statistikani faqat mavjud bo'lganda ko'rsatamiz */}
                {statistics && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {/* Completed Tests Card */}
                       <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">Tugatilgan testlar</CardTitle>
                           <FileText className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                           <div className="text-2xl font-bold">{statistics.completed_tests ?? 0}</div>
                         </CardContent>
                       </Card>
                       {/* Average Score Card */}
                       <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">O'rtacha ball (%)</CardTitle>
                           <BarChart2 className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                           {/* average_score null bo'lishi mumkin */}
                           <div className="text-2xl font-bold">{statistics.average_score ? `${statistics.average_score.toFixed(1)}%` : 'N/A'}</div>
                           <p className="text-xs text-muted-foreground">Barcha tugatilgan testlar bo'yicha</p>
                         </CardContent>
                       </Card>
                       {/* Total Payments Card */}
                       <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">Jami to'lovlar</CardTitle>
                           <Wallet className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                            <div className="text-2xl font-bold">
                               {/* total_payments_display yoki formatlangan total_payments */}
                               {statistics.total_payments_display || Number(statistics.total_payments || 0).toLocaleString('uz-UZ', { style: 'currency', currency: 'UZS', minimumFractionDigits: 0 })}
                            </div>
                            <p className="text-xs text-muted-foreground">Barcha muvaffaqiyatli to'lovlar summasi</p>
                         </CardContent>
                       </Card>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}