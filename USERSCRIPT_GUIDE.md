# 🚀 دليل تثبيت واستخدام Auto Login Helper

## 📖 المحتويات
- [ما هو Auto Login Helper؟](#ما-هو-auto-login-helper)
- [التثبيت السريع](#التثبيت-السريع)
- [كيفية الاستخدام](#كيفية-الاستخدام)
- [المصفوفات المدعومة](#المصفوفات-المدعومة)
- [أمثلة عملية](#أمثلة-عملية)
- [حل المشاكل](#حل-المشاكل)

---

## 🎯 ما هو Auto Login Helper؟

سكريبت Tampermonkey متقدم يقوم بـ:
- ✅ ملء حقول تسجيل الدخول تلقائياً من معاملات URL
- ✅ محاكاة الكتابة الحقيقية للتوافق مع React/Vue/Angular
- ✅ إرسال النموذج تلقائياً (اختياري)
- ✅ دعم أكثر من 100 نمط مختلف لحقول تسجيل الدخول
- ✅ يعمل مع cPanel, Plesk, DirectAdmin, WordPress وغيرها

---

## 🔧 التثبيت السريع

### الخطوة 1: تثبيت Tampermonkey

اختر متصفحك:

**Google Chrome / Microsoft Edge**
1. افتح [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
2. اضغط "Add to Chrome" أو "إضافة إلى Edge"
3. أكّد التثبيت

**Firefox**
1. افتح [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/tampermonkey/)
2. اضغط "Add to Firefox"
3. أكّد التثبيت

**Safari**
1. افتح [App Store](https://apps.apple.com/app/tampermonkey/id1482490089)
2. قم بتنزيل وتثبيت Tampermonkey

### الخطوة 2: تثبيت السكريبت

#### الطريقة الأولى: من الملف مباشرة
1. افتح ملف `public/auto-login.user.js` في محرر نصوص
2. حدد وانسخ **كل المحتوى** (Ctrl+A ثم Ctrl+C)
3. افتح Tampermonkey في متصفحك (أيقونة Tampermonkey → Dashboard)
4. اضغط على علامة "+" أو "Create a new script"
5. امسح المحتوى الافتراضي والصق السكريبت المنسوخ
6. اضغط File → Save أو (Ctrl+S)

#### الطريقة الثانية: الاستيراد المباشر
1. افتح Tampermonkey Dashboard
2. اضغط على "Utilities"
3. في قسم "Import from file"، اختر ملف `auto-login.user.js`
4. أكّد الاستيراد

### الخطوة 3: التحقق من التثبيت

1. افتح Tampermonkey Dashboard
2. يجب أن ترى "Auto Login Helper - تسجيل دخول تلقائي" في القائمة
3. تأكد أن المربع بجانبه أخضر (مفعّل)

✅ **تم التثبيت بنجاح!**

---

## 💡 كيفية الاستخدام

### الاستخدام الأساسي

1. في تطبيق Host Vault، افتح أي بطاقة استضافة
2. اضغط على زر **"فتح مع البيانات"**
3. سيتم فتح رابط بالشكل:
   ```
   https://example.com:2083?username=user123&password=pass123&auto_submit=true
   ```
4. السكريبت سيعمل تلقائياً:
   - ✓ يبحث عن حقول تسجيل الدخول
   - ✓ يملأ اسم المستخدم وكلمة المرور
   - ✓ يرسل النموذج تلقائياً (بعد 0.8 ثانية)

### الاستخدام اليدوي

إذا أردت استخدام السكريبت مع أي موقع:

```
https://any-website.com/login?username=YOUR_USER&password=YOUR_PASS&auto_submit=true
```

**ملاحظة:** 
- احذف `&auto_submit=true` إذا أردت ملء الحقول فقط بدون إرسال تلقائي

---

## 🔍 المصفوفات المدعومة

السكريبت يدعم **أكثر من 100 نمط** للبحث عن حقول تسجيل الدخول:

### حقل اسم المستخدم (Username Field)

#### البحث حسب `name` attribute:
```html
<input name="user">
<input name="username">
<input name="userName">
<input name="user_name">
<input name="user-name">
<input name="login">
<input name="loginname">
<input name="email">
<input name="account">
<input name="userid">
<input name="user_id">
<input name="cpanel_user">
<input name="login_name">
<input name="log">
<input name="user_login">
```

#### البحث حسب `id` attribute:
```html
<input id="user">
<input id="username">
<input id="login">
<input id="email">
<input id="user_id">
<input id="input-user">
<input id="txt-username">
<input id="signin-username">
```

#### البحث حسب `type` attribute:
```html
<input type="text">
<input type="email">
<input type="tel">
```

#### البحث حسب `placeholder`:
```html
<input placeholder="Username">
<input placeholder="Enter your username">
<input placeholder="Email">
<input placeholder="اسم المستخدم">
```

#### البحث حسب `autocomplete`:
```html
<input autocomplete="username">
<input autocomplete="email">
```

#### البحث حسب `data-*` attributes:
```html
<input data-testid="user">
<input data-test="username">
<input data-qa="login-field">
```

### حقل كلمة المرور (Password Field)

#### البحث حسب `name` attribute:
```html
<input name="pass">
<input name="password">
<input name="passwd">
<input name="pwd">
<input name="user_pass">
<input name="userpass">
<input name="login_pass">
<input name="cpanel_pass">
```

#### البحث حسب `id` attribute:
```html
<input id="pass">
<input id="password">
<input id="passwd">
<input id="pwd">
<input id="user_pass">
<input id="input-password">
<input id="signin-password">
```

#### البحث حسب `type`:
```html
<input type="password">
```

### زر الإرسال (Submit Button)

السكريبت يبحث عن:
```html
<!-- By type -->
<button type="submit">
<input type="submit">

<!-- By name/id -->
<button name="login">
<button id="login_submit">
<button id="btnLogin">
<input id="wp-submit">

<!-- By class -->
<button class="btn-login">
<button class="login-btn">
<div class="login-btn"><button>Login</button></div>

<!-- Generic -->
<form><button>Login</button></form>
```

---

## 📚 أمثلة عملية

### مثال 1: cPanel
```html
<form id="login_form" action="/login/" method="post">
    <input name="user" id="user" type="text">
    <input name="pass" id="pass" type="password">
    <button type="submit" id="login_submit">Log in</button>
</form>
```

**الرابط:**
```
https://example.com:2083?username=cpanel_user&password=mypass123&auto_submit=true
```

**النتيجة:**
- ✓ يعثر على الحقول: `name="user"` و `name="pass"`
- ✓ يملأ الحقول
- ✓ يضغط على `button[type="submit"]`

---

### مثال 2: WordPress
```html
<form name="loginform" action="/wp-login.php" method="post">
    <input type="text" name="log" id="user_login">
    <input type="password" name="pwd" id="user_pass">
    <input type="submit" name="wp-submit" id="wp-submit" value="Log In">
</form>
```

**الرابط:**
```
https://mysite.com/wp-admin?username=admin&password=secretpass&auto_submit=true
```

**النتيجة:**
- ✓ يعثر على الحقول: `name="log"` و `name="pwd"`
- ✓ يملأ الحقول
- ✓ يضغط على `#wp-submit`

---

### مثال 3: موقع بتصميم حديث (React/Vue)
```html
<form>
    <input 
        type="email" 
        placeholder="Enter your email"
        data-testid="email-input"
        autocomplete="email">
    <input 
        type="password" 
        placeholder="Enter your password"
        data-testid="pass-input"
        autocomplete="current-password">
    <button class="btn-login">Sign In</button>
</form>
```

**الرابط:**
```
https://modern-site.com/login?username=user@email.com&password=mypass&auto_submit=true
```

**النتيجة:**
- ✓ يعثر على الحقول: `type="email"` و `type="password"`
- ✓ يستخدم `nativeInputValueSetter` للتوافق مع React
- ✓ يطلق أحداث `InputEvent` للتوافق مع Vue
- ✓ يضغط على `.btn-login`

---

## 🛠️ حل المشاكل

### المشكلة 1: الحقول لا تُملأ

**الحل:**
1. افتح Console (F12)
2. ستجد رسائل تشخيصية مثل:
   ```
   🔐 Auto Login Helper v2.0: تم اكتشاف بيانات تسجيل الدخول
   🔍 البحث عن حقل اسم المستخدم...
   ✗ لم يتم العثور على حقل اسم المستخدم
   📋 الحقول الموجودة في الصفحة:
     - type="text" name="custom_user" id="my_username" placeholder=""
   ```
3. إذا كان الموقع يستخدم اسم غير قياسي، أضفه للسكريبت:
   - افتح السكريبت في Tampermonkey
   - ابحث عن `USERNAME_PATTERNS`
   - أضف `'custom_user'` إلى مصفوفة `names`

### المشكلة 2: النموذج لا يُرسل تلقائياً

**الأسباب المحتملة:**
- الموقع يستخدم AJAX معقد
- الموقع يستخدم Captcha
- الموقع يستخدم MFA/2FA

**الحل:**
- السكريبت سيملأ الحقول على الأقل
- اضغط Enter أو زر تسجيل الدخول يدوياً
- أو احذف `&auto_submit=true` من الرابط

### المشكلة 3: السكريبت لا يعمل أبداً

**التحقق:**
1. افتح Tampermonkey Dashboard
2. تأكد أن السكريبت مفعّل (أخضر)
3. تأكد أن `@match *://*/*` موجود في السكريبت
4. أعد تحميل الصفحة

### المشكلة 4: يعمل مع بعض المواقع وليس الكل

**هذا طبيعي!** السكريبت يدعم معظم الأنماط الشائعة، لكن:
- بعض المواقع تستخدم أسماء فريدة جداً
- بعض المواقع تستخدم Shadow DOM
- بعض المواقع تحمّل النماذج ديناميكياً بعد فترة طويلة

**الحل:** استخدم خاصية "نسخ جميع المعلومات" والصق البيانات يدوياً

---

## 🔐 الأمان والخصوصية

### ✅ آمن تماماً
- السكريبت يعمل **محلياً** في متصفحك فقط
- لا يرسل أي بيانات لأي سيرفر خارجي
- لا يحفظ أي معلومات
- الكود مفتوح المصدر - يمكنك مراجعته

### ⚠️ تحذيرات
- **لا تشارك الروابط التي تحتوي على بيانات تسجيل الدخول**
- استخدم هذه الميزة فقط على شبكات آمنة
- الروابط تظهر في History - امسحها إذا لزم الأمر
- بعض الخوادم قد تسجّل URL parameters في logs

---

## 📊 إحصائيات الدعم

| الفئة | العدد | الوصف |
|------|-------|-------|
| **أسماء حقول Username** | 35+ | name, id, placeholder patterns |
| **أسماء حقول Password** | 25+ | name, id, placeholder patterns |
| **أنواع الحقول** | 4 | text, email, tel, password |
| **أنماط زر Submit** | 15+ | buttons, inputs, classes, ids |
| **Data Attributes** | 4 | data-testid, data-test, data-qa, data-cy |
| **Autocomplete** | 4 | username, email, password, current-password |
| **اللغات** | 4 | English, Arabic, Spanish, French |

**المجموع:** أكثر من **100 نمط مختلف** مدعوم!

---

## 🎓 نصائح متقدمة

### نصيحة 1: تفعيل Console دائماً
عند استخدام السكريبت لأول مرة مع موقع جديد، افتح Console لمشاهدة ما يحدث.

### نصيحة 2: اختبر بدون auto_submit أولاً
```
?username=test&password=test
```
بدون `&auto_submit=true` لترى إذا كان يملأ الحقول بشكل صحيح.

### نصيحة 3: استخدم URL Encoding
إذا كانت كلمة المرور تحتوي على رموز خاصة:
```javascript
const encodedPassword = encodeURIComponent('P@ssw0rd!#$');
// النتيجة: P%40ssw0rd!%23%24
```

### نصيحة 4: إضافة Delay للمواقع البطيئة
في السكريبت، غيّر:
```javascript
setTimeout(() => {
    submitForm();
}, 800); // زد الرقم إلى 1500 أو 2000 للمواقع البطيئة
```

---

## 📞 الدعم

إذا واجهت مشكلة:
1. راجع قسم [حل المشاكل](#حل-المشاكل)
2. تحقق من Console (F12) للرسائل التشخيصية
3. تأكد من تحديث السكريبت لآخر إصدار
4. شارك رسائل Console عند طلب المساعدة

---

## 📝 التحديثات

### v2.0 (الحالي)
- ✅ دعم أكثر من 100 نمط
- ✅ محاكاة الكتابة الحقيقية
- ✅ دعم React/Vue/Angular
- ✅ محاولات متعددة ذكية
- ✅ رسائل تشخيص مفصلة
- ✅ مراقبة DOM الديناميكي

### v1.0
- ✅ الإصدار الأولي الأساسي

---

**استمتع باستخدام Auto Login Helper! 🎉**
