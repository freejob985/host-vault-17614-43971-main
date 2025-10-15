# دليل تسجيل الدخول التلقائي - Host Vault

## الميزات الجديدة المضافة

### 1. معاملات URL شاملة
تم إضافة معاملات إضافية لدعم جميع أنواع النماذج:

- `username` - اسم المستخدم
- `password` - كلمة المرور  
- `auto_submit` - الإرسال التلقائي (true/false)
- `form_id` - معرف النموذج (افتراضي: login_form)
- `username_field` - اسم حقل المستخدم (افتراضي: user)
- `password_field` - اسم حقل كلمة المرور (افتراضي: pass)
- `submit_button` - معرف زر الإرسال (افتراضي: login_submit)

### 2. مصفوفات شاملة لجميع أنواع الحقول

#### حقول اسم المستخدم:
- **أسماء الحقول**: user, username, email, login, account, userid, etc.
- **معرفات الحقول**: user, username, email, login, account, userid, etc.
- **أنواع الحقول**: text, email, tel
- **نصوص placeholder**: username, email, login, etc.
- **نصوص autocomplete**: username, email, login

#### حقول كلمة المرور:
- **أسماء الحقول**: pass, password, passwd, pwd, user_pass, login_pass, etc.
- **معرفات الحقول**: pass, password, passwd, pwd, user_pass, login_pass, etc.
- **أنواع الحقول**: password
- **نصوص placeholder**: password, pass word, enter password, etc.
- **نصوص autocomplete**: current-password, password

#### أزرار الإرسال:
- **أنواع الأزرار**: submit, button
- **أسماء الأزرار**: login, signin, submit, send, enter, etc.
- **معرفات الأزرار**: login, signin, submit, login_submit, etc.
- **فئات CSS**: login-btn, submit-btn, btn-login, etc.

### 3. أنظمة حقن متعددة

#### النظام المباشر (auto-login-direct.html):
- واجهة مستخدم محسنة
- معاينة النموذج
- اختبار التعبئة
- تعليمات مفصلة
- نسخ البيانات بسهولة

#### النظام التقليدي (auto-login.html):
- حقن مباشر للكود
- استخدام postMessage
- معلومات تشخيصية مفصلة

### 4. دعم شامل لجميع أنواع لوحات التحكم

- **cPanel**: user, pass
- **Plesk**: login_name, passwd
- **DirectAdmin**: username, password
- **WordPress**: user_login, user_pass
- **FTP/SSH**: username, password
- **أنواع أخرى**: دعم شامل لجميع الأنماط

## كيفية الاستخدام

### الطريقة الأولى: استخدام الصفحة المباشرة

1. انقر على "فتح مع البيانات" في بطاقة الاستضافة
2. ستفتح صفحة `auto-login-direct.html`
3. اتبع التعليمات المعروضة
4. استخدم Tampermonkey للتعبئة التلقائية

### الطريقة الثانية: استخدام الرابط المباشر

```
https://yoursite.com/auto-login-direct.html?url=https://target-site.com&username=youruser&password=yourpass&auto_submit=true
```

### الطريقة الثالثة: استخدام Tampermonkey

1. ثبت إضافة Tampermonkey
2. انسخ محتوى `auto-login.user.js`
3. أنشئ سكريبت جديد في Tampermonkey
4. الصق الكود واحفظه
5. اذهب إلى الموقع المستهدف

## حل المشاكل الشائعة

### المشكلة: لا يتم ملء الحقول
**الحل:**
1. تأكد من تثبيت Tampermonkey
2. تحقق من أن السكريبت مفعل
3. استخدم أزرار "نسخ البيانات" كبديل
4. جرب الرابط المباشر مع المعاملات

### المشكلة: لا يتم إرسال النموذج
**الحل:**
1. تأكد من أن `auto_submit=true`
2. تحقق من معرف زر الإرسال
3. جرب الضغط على Enter يدوياً

### المشكلة: حقن الكود لا يعمل
**الحل:**
1. استخدم `auto-login-direct.html` بدلاً من `auto-login.html`
2. استخدم Tampermonkey للتعبئة التلقائية
3. انسخ البيانات يدوياً

## أمثلة على الاستخدام

### مثال 1: cPanel
```
?url=https://cpanel.example.com&username=admin&password=123456&auto_submit=true&username_field=user&password_field=pass&submit_button=login_submit
```

### مثال 2: WordPress
```
?url=https://example.com/wp-admin&username=admin&password=123456&auto_submit=true&username_field=user_login&password_field=user_pass&submit_button=wp-submit
```

### مثال 3: Plesk
```
?url=https://plesk.example.com&username=admin&password=123456&auto_submit=true&username_field=login_name&password_field=passwd&submit_button=login_submit
```

## الملفات المحدثة

1. `public/auto-login.html` - النظام التقليدي مع تحسينات
2. `public/auto-login-direct.html` - النظام المباشر الجديد
3. `public/auto-login.user.js` - سكريبت Tampermonkey محسن
4. `public/test-login.html` - صفحة اختبار
5. `src/components/HostingCard.tsx` - مكون البطاقة محدث

## الدعم التقني

إذا واجهت أي مشاكل:

1. تحقق من console المتصفح للأخطاء
2. تأكد من صحة البيانات في URL
3. جرب النسخ اليدوي للبيانات
4. استخدم صفحة الاختبار `test-login.html`

---

**ملاحظة**: هذا النظام مصمم ليكون آمناً وسهل الاستخدام. تأكد من استخدامه فقط على المواقع التي تثق بها.
