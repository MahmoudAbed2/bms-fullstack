# BMS Fullstack Project

هذا المشروع يتكون من جزئين:

- **Backend:** باستخدام Spring Boot وJava.
- **Frontend:** باستخدام React.

---

## المتطلبات

- Java 17 أو أحدث
- Maven
- Node.js + npm

---

## طريقة التشغيل

### 1. تشغيل الـ Backend

```bash
cd backend
mvn spring-boot:run
```

الخادم سيعمل على `http://localhost:8080`

---

### 2. تشغيل الـ Frontend

```bash
cd frontend
npm install
npm start
```

الواجهة ستفتح تلقائيًا على `http://localhost:3000` وتتصل بـ backend تلقائيًا عبر proxy.

---

## بنية المجلد

```
bms-fullstack/
│
├── backend/          ← مشروع Spring Boot
│
└── frontend/         ← مشروع React
```

---

## ملاحظات

- يتم تخزين بيانات الجلسات في قاعدة بيانات SQLite محلية.
- يمكن تحسين الواجهة لاحقًا لإظهار رسم بياني أو تنبيهات للأسعار.
