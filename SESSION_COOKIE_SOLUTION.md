# حل مشكلة "Your session cookie is invalid" - Auto Login Advanced

## 🚨 المشكلة:
عند محاولة تسجيل الدخول، تظهر رسالة "Your session cookie is invalid. Please log in again."

## 🔍 سبب المشكلة:
1. **كوكيز الجلسة منتهية الصلاحية**
2. **كوكيز قديمة أو تالفة**
3. **مشاكل في إدارة الجلسة**
4. **قيود الأمان في المتصفح**

## ✅ الحل الشامل:

تم إنشاء **صفحة الحلول المتقدمة** (`auto-login-advanced.html`) مع **4 حلول مختلفة**:

### 🔄 الحل الأول: إعادة تحميل الجلسة
**للمشاكل البسيطة**

```javascript
// حل 1: إعادة تحميل الجلسة
console.log('🔄 إعادة تحميل الجلسة...');

// حذف الكوكيز
document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

// إعادة تحميل الصفحة
setTimeout(() => {
    window.location.reload();
}, 1000);
```

### 🍪 الحل الثاني: إدارة الكوكيز
**للمشاكل المتوسطة**

```javascript
// حل 2: إدارة الكوكيز
console.log('🍪 إدارة الكوكيز...');

// حذف جميع الكوكيز
document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

// حذف localStorage
try {
    localStorage.clear();
    console.log('✅ تم حذف localStorage');
} catch(e) {
    console.log('⚠ لا يمكن حذف localStorage:', e.message);
}

// حذف sessionStorage
try {
    sessionStorage.clear();
    console.log('✅ تم حذف sessionStorage');
} catch(e) {
    console.log('⚠ لا يمكن حذف sessionStorage:', e.message);
}

// إعادة تحميل الصفحة
setTimeout(() => {
    window.location.reload();
}, 2000);
```

### ⚡ الحل الثالث: حقن متقدم
**للمشاكل المعقدة - الأفضل**

```javascript
// حل 3: حقن متقدم مع إدارة الجلسة
(function() {
    console.log('🚀 بدء الحل المتقدم لمشاكل الجلسة...');
    
    const username = "your_username";
    const password = "your_password";
    const autoSubmit = true;
    
    // حل مشاكل الجلسة
    function clearSessionData() {
        console.log('🧹 تنظيف بيانات الجلسة...');
        
        // حذف الكوكيز
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // حذف localStorage
        try {
            localStorage.clear();
        } catch(e) {
            console.log('⚠ لا يمكن حذف localStorage:', e.message);
        }
        
        // حذف sessionStorage
        try {
            sessionStorage.clear();
        } catch(e) {
            console.log('⚠ لا يمكن حذف sessionStorage:', e.message);
        }
        
        console.log('✅ تم تنظيف بيانات الجلسة');
    }
    
    // إعادة تحميل الجلسة
    function reloadSession() {
        console.log('🔄 إعادة تحميل الجلسة...');
        
        // إرسال طلب GET لإعادة تحميل الجلسة
        fetch(window.location.href, {
            method: 'GET',
            credentials: 'include',
            cache: 'no-cache'
        }).then(() => {
            console.log('✅ تم إعادة تحميل الجلسة');
        }).catch(e => {
            console.log('⚠ خطأ في إعادة تحميل الجلسة:', e.message);
        });
    }
    
    // تنظيف الجلسة أولاً
    clearSessionData();
    
    // إعادة تحميل الجلسة
    reloadSession();
    
    // البحث عن الحقول وملؤها
    function attemptAutoFill() {
        console.log('🔍 البحث عن حقول تسجيل الدخول...');
        
        const usernameField = document.querySelector('input[type="text"], input[name*="user"]');
        const passwordField = document.querySelector('input[type="password"]');
        
        if (!usernameField || !passwordField) {
            console.log('⚠ لم يتم العثور على الحقول، محاولة أخرى...');
            return false;
        }
        
        // ملء الحقول
        usernameField.value = username;
        passwordField.value = password;
        
        // إطلاق الأحداث
        ['focus', 'input', 'change', 'blur'].forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            usernameField.dispatchEvent(event);
            passwordField.dispatchEvent(event);
        });
        
        console.log('✅ تم ملء جميع الحقول بنجاح!');
        
        if (autoSubmit) {
            setTimeout(() => {
                const submitBtn = document.querySelector('button[type="submit"]');
                if (submitBtn) {
                    console.log('📤 إرسال النموذج...');
                    submitBtn.click();
                }
            }, 1000);
        }
        
        return true;
    }
    
    // محاولات متعددة
    let attempts = 0;
    const maxAttempts = 20;
    
    function tryFill() {
        attempts++;
        console.log(`محاولة ${attempts}/${maxAttempts}`);
        
        if (attemptAutoFill()) {
            console.log('🎉 تمت التعبئة بنجاح!');
            return;
        }
        
        if (attempts < maxAttempts) {
            setTimeout(tryFill, attempts * 300);
        } else {
            console.log('⚠ فشلت جميع المحاولات');
        }
    }
    
    // بدء التعبئة
    setTimeout(tryFill, 500);
    
})();
```

### 🔧 الحل الرابع: Bookmarklet محسن
**للتنفيذ السريع**

```javascript
// Bookmarklet محسن مع حل مشاكل الجلسة
javascript:(function(){
    console.log('🔧 Bookmarklet محسن...');
    
    const username='your_username';
    const password='your_password';
    const autoSubmit=true;
    
    // حذف الكوكيز القديمة
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // البحث عن الحقول
    const usernameInput=document.querySelector('input[type="text"],input[name*="user"],input[name*="login"]');
    const passwordInput=document.querySelector('input[type="password"]');
    
    if(usernameInput&&passwordInput){
        // ملء الحقول
        usernameInput.value=username;
        passwordInput.value=password;
        
        // إطلاق الأحداث
        ['focus','input','change','blur'].forEach(eventType=>{
            const event=new Event(eventType,{bubbles:true});
            usernameInput.dispatchEvent(event);
            passwordInput.dispatchEvent(event);
        });
        
        // إرسال النموذج
        if(autoSubmit){
            setTimeout(()=>{
                const submitBtn=document.querySelector('button[type="submit"],input[type="submit"]');
                if(submitBtn)submitBtn.click();
            },1500);
        }
        
        console.log('✅ تم ملء الحقول بنجاح!');
    }else{
        console.log('❌ لم يتم العثور على الحقول');
        // إعادة تحميل الصفحة والمحاولة مرة أخرى
        setTimeout(()=>{
            window.location.reload();
        },2000);
    }
})();
```

## 📋 خطوات الاستخدام:

### الخطوة 1: فتح صفحة الحلول المتقدمة
```
انقر على "فتح مع البيانات" → ستفتح صفحة auto-login-advanced.html
```

### الخطوة 2: اختيار الحل المناسب
```
اختر إحدى الحلول الأربع:
- 🔄 إعادة تحميل الجلسة (للمشاكل البسيطة)
- 🍪 إدارة الكوكيز (للمشاكل المتوسطة)
- ⚡ حقن متقدم (للمشاكل المعقدة - الأفضل)
- 🔧 Bookmarklet محسن (للتنفيذ السريع)
```

### الخطوة 3: تطبيق الحل
```
1. انسخ الكود المعروض
2. افتح الموقع المستهدف
3. اضغط F12 لفتح Developer Tools
4. اذهب إلى Console
5. الصق الكود واضغط Enter
6. ستتم حل مشكلة الجلسة والتعبئة تلقائياً! 🎉
```

## 🔍 استكشاف الأخطاء:

### المشكلة: "Your session cookie is invalid"
**الحل:** استخدم الحل الأول أو الثاني لإعادة تحميل الجلسة

### المشكلة: لا يتم ملء الحقول بعد حل الجلسة
**الحل:** استخدم الحل الثالث (حقن متقدم) مع محاولات متعددة

### المشكلة: لا يتم إرسال النموذج
**الحل:** تأكد من أن `autoSubmit = true` في الكود

### المشكلة: خطأ في CORS
**الحل:** استخدم الحل الرابع (Bookmarklet) أو Tampermonkey

## 🚀 الميزات الجديدة:

### 1. تنظيف شامل للجلسة
- حذف جميع الكوكيز
- حذف localStorage
- حذف sessionStorage
- إعادة تحميل الجلسة

### 2. محاولات متعددة محسنة
- 20 محاولة بدلاً من 15
- تأخير متزايد بين المحاولات
- تشخيص مفصل لكل محاولة

### 3. إدارة الجلسة التلقائية
- إعادة تحميل الجلسة تلقائياً
- إرسال طلبات GET لإعادة تحميل الجلسة
- معالجة أخطاء الجلسة

### 4. مراقبة DOM محسنة
- مراقبة التغييرات في الصفحة
- اكتشاف النماذج الجديدة تلقائياً
- إيقاف المراقبة بعد 60 ثانية

## 📁 الملفات المحدثة:

- ✅ `public/auto-login-advanced.html` - صفحة الحلول المتقدمة الجديدة
- ✅ `src/components/HostingCard.tsx` - مكون البطاقة محدث
- ✅ `SESSION_COOKIE_SOLUTION.md` - دليل شامل لحل مشاكل الجلسة

## 🎉 النتيجة:

الآن لديك **حل شامل وقوي** لمشكلة "Your session cookie is invalid"! 

**جرب الآن:**
1. انقر على "فتح مع البيانات"
2. اختر الحل المناسب
3. انسخ والصق الكود
4. استمتع بالتعبئة التلقائية بدون مشاكل جلسة! ✨

---

**ملاحظة**: هذا النظام مصمم لحل مشاكل الجلسة بطريقة آمنة ومشروعة. استخدمه فقط على المواقع التي تثق بها.
