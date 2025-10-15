// ==UserScript==
// @name         Auto Login Helper - تسجيل دخول تلقائي
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  يملأ حقول تسجيل الدخول تلقائياً من معاملات URL ويقوم بإرسال النموذج - يدعم جميع أنواع لوحات التحكم
// @author       Host Vault
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // الحصول على المعاملات من URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const password = urlParams.get('password');
    const autoSubmit = urlParams.get('auto_submit');
    
    // إضافة معاملات إضافية للدعم الشامل
    const formId = urlParams.get('form_id') || 'login_form';
    const usernameField = urlParams.get('username_field') || 'user';
    const passwordField = urlParams.get('password_field') || 'pass';
    const submitButton = urlParams.get('submit_button') || 'login_submit';

    // إذا لم تكن هناك بيانات، لا تفعل شيئاً
    if (!username || !password) {
        return;
    }

    console.log('🔐 Auto Login Helper v3.0: تم اكتشاف بيانات تسجيل الدخول');

    // دعم postMessage للتواصل مع النافذة الأصلية
    window.addEventListener('message', function(event) {
        if (event.data.type === 'AUTO_FILL_DATA') {
            console.log('📨 تم استلام بيانات التعبئة عبر postMessage');
            
            // تحديث البيانات من postMessage
            const data = event.data;
            username = data.username || username;
            password = data.password || password;
            autoSubmit = data.autoSubmit || autoSubmit;
            formId = data.formId || formId;
            usernameField = data.usernameField || usernameField;
            passwordField = data.passwordField || passwordField;
            submitButton = data.submitButton || submitButton;
            
            // تشغيل التعبئة التلقائية
            setTimeout(() => {
                tryAutoFill();
            }, 500);
        }
    });

    // ===== مصفوفة شاملة لجميع أنواع حقول اسم المستخدم =====
    const USERNAME_PATTERNS = {
        // أسماء الحقول (name attribute)
        names: [
            'user', 'username', 'userName', 'user_name', 'user-name',
            'login', 'loginname', 'login_name', 'login-name',
            'email', 'e-mail', 'mail', 'emailaddress', 'email_address',
            'account', 'accountname', 'account_name',
            'userid', 'user_id', 'id',
            'loginid', 'login_id',
            'handle', 'alias',
            // cPanel specific
            'user', 'cpanel_user',
            // Plesk specific
            'login_name', 'loginName',
            // DirectAdmin specific
            'username', 'referer',
            // WordPress specific
            'log', 'user_login',
            // Common variations
            'identification', 'credential',
            // Custom field names from URL
            usernameField
        ],
        
        // معرفات الحقول (id attribute)
        ids: [
            'user', 'username', 'userName', 'user_name', 'user-name',
            'login', 'loginname', 'login_name', 'login-name',
            'email', 'e-mail', 'mail', 'emailaddress',
            'account', 'accountname',
            'userid', 'user_id', 'id',
            'input-user', 'input-username', 'input-login',
            'txt-user', 'txt-username', 'txt-login',
            'field-user', 'field-username',
            // cPanel
            'user', 'login_user',
            // WordPress
            'user_login', 'log',
            // Generic
            'signin-username', 'signin-email',
            // Custom field names from URL
            usernameField
        ],
        
        // أنواع الحقول (type attribute)
        types: ['text', 'email', 'tel'],
        
        // نصوص placeholder
        placeholders: [
            'username', 'user name', 'enter username', 'your username',
            'email', 'e-mail', 'enter email', 'your email',
            'login', 'enter login', 'account',
            'usuario', 'utilisateur', // Spanish, French
            'اسم المستخدم', 'البريد الإلكتروني' // Arabic
        ],
        
        // نصوص autocomplete
        autocomplete: ['username', 'email', 'login']
    };

    // ===== مصفوفة شاملة لجميع أنواع حقول كلمة المرور =====
    const PASSWORD_PATTERNS = {
        // أسماء الحقول
        names: [
            'pass', 'password', 'passwd', 'pwd',
            'pass_word', 'pass-word', 'password1',
            'user_pass', 'user-pass', 'userpass', 'userpassword',
            'login_pass', 'login-pass', 'loginpass', 'loginpassword',
            'account_pass', 'account-pass',
            'secret', 'pin', 'code',
            // cPanel
            'pass', 'cpanel_pass',
            // Plesk
            'passwd', 'password',
            // WordPress
            'pwd', 'user_pass',
            // Common
            'credential_password', 'auth_password',
            // Custom field names from URL
            passwordField
        ],
        
        // معرفات الحقول
        ids: [
            'pass', 'password', 'passwd', 'pwd',
            'pass_word', 'pass-word', 'password1',
            'user_pass', 'user-pass', 'userpass',
            'login_pass', 'login-pass', 'loginpass',
            'input-pass', 'input-password', 'input-passwd',
            'txt-pass', 'txt-password',
            'field-pass', 'field-password',
            // WordPress
            'user_pass', 'pwd',
            // Generic
            'signin-password', 'login-password',
            // Custom field names from URL
            passwordField
        ],
        
        // أنواع الحقول
        types: ['password'],
        
        // نصوص placeholder
        placeholders: [
            'password', 'pass word', 'enter password', 'your password',
            'passwd', 'pwd', 'secret', 'pin',
            'contraseña', 'mot de passe', // Spanish, French
            'كلمة المرور', 'كلمة السر' // Arabic
        ],
        
        // نصوص autocomplete
        autocomplete: ['current-password', 'password']
    };

    // ===== مصفوفة شاملة لأزرار الإرسال =====
    const SUBMIT_PATTERNS = {
        // By type
        types: ['submit', 'button'],
        
        // By name
        names: [
            'login', 'signin', 'submit', 'send', 'enter',
            'log_in', 'sign_in', 'log-in', 'sign-in',
            'btn_login', 'btn_signin', 'btn_submit',
            // Custom button names from URL
            submitButton
        ],
        
        // By id
        ids: [
            'login', 'signin', 'submit', 'send', 'enter',
            'login_submit', 'submit_btn', 'btn_login',
            'loginButton', 'signinButton', 'submitButton',
            'wp-submit', // WordPress
            // Custom button names from URL
            submitButton
        ],
        
        // By class
        classes: [
            'login-btn', 'submit-btn', 'btn-login', 'btn-submit',
            'btn-primary', 'btn-success', 'btn-submit',
            'login-button', 'submit-button'
        ],
        
        // Generic selectors
        generic: [
            'button[type="submit"]',
            'input[type="submit"]',
            'form button:not([type="button"]):not([type="reset"])',
            '.login-btn button',
            '.submit-btn button'
        ]
    };

    // دالة متقدمة للعثور على حقول الإدخال
    function findInputField(patterns, fieldType) {
        console.log(`🔍 البحث عن حقل ${fieldType}...`);
        
        // 1. البحث حسب النوع (type) - الأكثر دقة
        for (let type of patterns.types) {
            const inputs = document.querySelectorAll(`input[type="${type}"]`);
            if (inputs.length > 0) {
                console.log(`✓ تم العثور على الحقل باستخدام type="${type}"`);
                return inputs[0];
            }
        }

        // 2. البحث حسب الاسم (name) - دقيق جداً
        for (let name of patterns.names) {
            // بحث دقيق
            let input = document.querySelector(`input[name="${name}"]`);
            if (input) {
                console.log(`✓ تم العثور على الحقل باستخدام name="${name}"`);
                return input;
            }
            // بحث جزئي
            input = document.querySelector(`input[name*="${name}" i]`);
            if (input) {
                console.log(`✓ تم العثور على الحقل باستخدام name يحتوي على "${name}"`);
                return input;
            }
        }

        // 3. البحث حسب المعرف (id)
        for (let id of patterns.ids) {
            // بحث دقيق
            let input = document.querySelector(`input[id="${id}"]`);
            if (input) {
                console.log(`✓ تم العثور على الحقل باستخدام id="${id}"`);
                return input;
            }
            // بحث جزئي
            input = document.querySelector(`input[id*="${id}" i]`);
            if (input) {
                console.log(`✓ تم العثور على الحقل باستخدام id يحتوي على "${id}"`);
                return input;
            }
        }

        // 4. البحث حسب placeholder
        for (let placeholder of patterns.placeholders) {
            const input = document.querySelector(`input[placeholder*="${placeholder}" i]`);
            if (input) {
                console.log(`✓ تم العثور على الحقل باستخدام placeholder يحتوي على "${placeholder}"`);
                return input;
            }
        }

        // 5. البحث حسب autocomplete
        for (let autocomplete of patterns.autocomplete) {
            const input = document.querySelector(`input[autocomplete="${autocomplete}"]`);
            if (input) {
                console.log(`✓ تم العثور على الحقل باستخدام autocomplete="${autocomplete}"`);
                return input;
            }
        }

        // 6. البحث حسب data attributes
        const dataAttrs = ['data-testid', 'data-test', 'data-qa', 'data-cy'];
        for (let attr of dataAttrs) {
            for (let name of patterns.names.slice(0, 10)) { // أول 10 أسماء فقط
                const input = document.querySelector(`input[${attr}*="${name}" i]`);
                if (input) {
                    console.log(`✓ تم العثور على الحقل باستخدام ${attr} يحتوي على "${name}"`);
                    return input;
                }
            }
        }

        console.log(`✗ لم يتم العثور على حقل ${fieldType}`);
        return null;
    }

    // دالة متقدمة لملء حقل الإدخال
    function fillInput(input, value, fieldName) {
        if (!input) return false;

        console.log(`⌨️  ملء حقل ${fieldName}...`);
        
        // إزالة القيمة القديمة أولاً
        input.value = '';
        
        // Focus على الحقل
        input.focus();
        
        // ملء الحقل بطرق متعددة
        input.value = value;
        input.setAttribute('value', value);
        
        // محاكاة الكتابة الحقيقية (مهم جداً لبعض المواقع)
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
        ).set;
        nativeInputValueSetter.call(input, value);

        // إطلاق جميع الأحداث الممكنة
        const events = [
            'focus',
            'keydown',
            'keypress', 
            'keyup',
            'input',
            'change',
            'blur'
        ];
        
        events.forEach(eventType => {
            let event;
            if (eventType.startsWith('key')) {
                event = new KeyboardEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    key: 'Unidentified',
                    code: 'Unidentified'
                });
            } else {
                event = new Event(eventType, { bubbles: true, cancelable: true });
            }
            input.dispatchEvent(event);
        });

        // إطلاق حدث InputEvent لـ React وVue
        const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: value
        });
        input.dispatchEvent(inputEvent);

        console.log(`✓ تم ملء ${fieldName}: ${input.name || input.id || input.type}`);
        return true;
    }

    // دالة محسّنة لإرسال النموذج
    function submitForm() {
        console.log('📤 محاولة إرسال النموذج...');
        
        // محاولة إيجاد وتنشيط زر الإرسال
        for (let type of SUBMIT_PATTERNS.types) {
            for (let name of SUBMIT_PATTERNS.names) {
                const button = document.querySelector(`button[type="${type}"][name*="${name}" i]`);
                if (button && !button.disabled) {
                    console.log(`✓ تم العثور على زر الإرسال: button[type="${type}"][name*="${name}"]`);
                    
                    // محاكاة النقر الحقيقي
                    button.focus();
                    
                    // Click event
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    button.dispatchEvent(clickEvent);
                    
                    // Native click
                    button.click();
                    
                    console.log('✅ تم إرسال النموذج بنجاح');
                    return true;
                }
            }
        }

        for (let id of SUBMIT_PATTERNS.ids) {
            const button = document.querySelector(`button[id*="${id}" i]`);
            if (button && !button.disabled) {
                console.log(`✓ تم العثور على زر الإرسال: button[id*="${id}"]`);
                
                // محاكاة النقر الحقيقي
                button.focus();
                
                // Click event
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                button.dispatchEvent(clickEvent);
                
                // Native click
                button.click();
                
                console.log('✅ تم إرسال النموذج بنجاح');
                return true;
            }
        }

        for (let className of SUBMIT_PATTERNS.classes) {
            const button = document.querySelector(`button.${className}`);
            if (button && !button.disabled) {
                console.log(`✓ تم العثور على زر الإرسال: button.${className}`);
                
                // محاكاة النقر الحقيقي
                button.focus();
                
                // Click event
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                button.dispatchEvent(clickEvent);
                
                // Native click
                button.click();
                
                console.log('✅ تم إرسال النموذج بنجاح');
                return true;
            }
        }

        for (let selector of SUBMIT_PATTERNS.generic) {
            const button = document.querySelector(selector);
            if (button && !button.disabled) {
                console.log(`✓ تم العثور على زر الإرسال: ${selector}`);
                
                // محاكاة النقر الحقيقي
                button.focus();
                
                // Click event
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                button.dispatchEvent(clickEvent);
                
                // Native click
                button.click();
                
                console.log('✅ تم إرسال النموذج بنجاح');
                return true;
            }
        }

        // إذا لم يُعثر على زر، حاول إرسال النموذج مباشرة
        const forms = document.querySelectorAll('form');
        for (let form of forms) {
            // تأكد أن النموذج يحتوي على حقول تسجيل الدخول
            const hasPassword = form.querySelector('input[type="password"]');
            if (hasPassword) {
                console.log('✓ تم العثور على نموذج تسجيل الدخول');
                
                // إطلاق حدث submit
                const submitEvent = new Event('submit', {
                    bubbles: true,
                    cancelable: true
                });
                
                if (!form.dispatchEvent(submitEvent)) {
                    console.log('⚠ تم إلغاء حدث submit');
                    return false;
                }
                
                // محاولة الإرسال المباشر
                try {
                    form.submit();
                    console.log('✅ تم إرسال النموذج مباشرة');
                    return true;
                } catch (e) {
                    console.log('⚠ خطأ في إرسال النموذج:', e.message);
                }
            }
        }

        // محاولة الضغط على Enter في حقل كلمة المرور
        const passwordField = document.querySelector('input[type="password"]');
        if (passwordField) {
            console.log('⏎ محاولة الضغط على Enter...');
            const enterEvent = new KeyboardEvent('keypress', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13
            });
            passwordField.dispatchEvent(enterEvent);
            
            const enterDownEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13
            });
            passwordField.dispatchEvent(enterDownEvent);
        }

        console.log('⚠ لم يتم العثور على طريقة لإرسال النموذج');
        return false;
    }

    // الدالة الرئيسية للتعبئة والإرسال التلقائي
    function autoFillAndSubmit() {
        console.log('🚀 بدء عملية التعبئة التلقائية...');
        
        // العثور على حقل اسم المستخدم
        const usernameField = findInputField(USERNAME_PATTERNS, 'اسم المستخدم');

        // العثور على حقل كلمة المرور
        const passwordField = findInputField(PASSWORD_PATTERNS, 'كلمة المرور');

        // ملء الحقول
        let usernameFilled = fillInput(usernameField, username, 'اسم المستخدم');
        let passwordFilled = fillInput(passwordField, password, 'كلمة المرور');

        if (usernameFilled && passwordFilled) {
            console.log('✅ تم ملء جميع الحقول بنجاح');

            // إرسال تأكيد النجاح إلى النافذة الأصلية
            try {
                window.parent.postMessage({
                    type: 'AUTO_FILL_SUCCESS',
                    message: 'تم ملء الحقول بنجاح'
                }, '*');
            } catch(e) {
                console.log('لم يتم إرسال تأكيد النجاح:', e.message);
            }

            // إرسال النموذج تلقائياً إذا كان مطلوباً
            if (autoSubmit === 'true') {
                console.log('⏳ الانتظار قبل الإرسال...');
                setTimeout(() => {
                    submitForm();
                }, 800); // زيادة الوقت قليلاً لضمان تحميل JS
            } else {
                console.log('ℹ️  تم ملء الحقول. اضغط Enter أو زر تسجيل الدخول للمتابعة');
            }
        } else {
            console.log('⚠ لم يتم العثور على جميع الحقول المطلوبة');
            if (!usernameFilled) console.log('  ✗ حقل اسم المستخدم غير موجود');
            if (!passwordFilled) console.log('  ✗ حقل كلمة المرور غير موجود');
            
            // إرسال رسالة خطأ إلى النافذة الأصلية
            try {
                window.parent.postMessage({
                    type: 'AUTO_FILL_ERROR',
                    error: 'لم يتم العثور على جميع الحقول المطلوبة'
                }, '*');
            } catch(e) {
                console.log('لم يتم إرسال رسالة الخطأ:', e.message);
            }
            
            // طباعة معلومات تشخيصية
            console.log('📋 الحقول الموجودة في الصفحة:');
            document.querySelectorAll('input').forEach(input => {
                console.log(`  - type="${input.type}" name="${input.name}" id="${input.id}" placeholder="${input.placeholder}"`);
            });
        }
    }

    // استراتيجية محاولات متعددة
    let attemptCount = 0;
    const maxAttempts = 5;
    
    function tryAutoFill() {
        attemptCount++;
        console.log(`🔄 محاولة ${attemptCount} من ${maxAttempts}`);
        
        const form = document.querySelector('form');
        const passwordInput = document.querySelector('input[type="password"]');
        
        if (form && passwordInput) {
            autoFillAndSubmit();
            return true;
        }
        
        if (attemptCount < maxAttempts) {
            setTimeout(tryAutoFill, 500);
        } else {
            console.log('⏹️  تم إيقاف المحاولات - لم يتم العثور على نموذج تسجيل دخول');
        }
        
        return false;
    }

    // بدء المحاولات بعد تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(tryAutoFill, 100);
        });
    } else {
        setTimeout(tryAutoFill, 100);
    }

    // محاولة إضافية بعد تحميل كامل
    window.addEventListener('load', () => {
        setTimeout(() => {
            const passwordField = document.querySelector('input[type="password"]');
            if (passwordField && !passwordField.value) {
                console.log('🔄 محاولة إضافية بعد تحميل الصفحة...');
                autoFillAndSubmit();
            }
        }, 300);
    });

    // مراقبة التغييرات الديناميكية في DOM
    const observer = new MutationObserver((mutations) => {
        const form = document.querySelector('form');
        const passwordInput = document.querySelector('input[type="password"]');
        
        if (form && passwordInput && !passwordInput.value) {
            console.log('🔍 تم اكتشاف نموذج جديد في الصفحة');
            observer.disconnect();
            setTimeout(autoFillAndSubmit, 150);
        }
    });

    // بدء المراقبة
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // إيقاف المراقبة بعد 10 ثوانٍ
        setTimeout(() => {
            observer.disconnect();
            console.log('⏹️  تم إيقاف مراقبة DOM');
        }, 10000);
    }

    console.log('✨ Auto Login Helper جاهز!');

})();
