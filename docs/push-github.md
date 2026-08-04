html_content = """<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>آموزش آپلود و انتقال سورس‌کد به ریپازیتوری جدید گیتهاب</title>
    <style>
        body {
            font-family: Tahoma, 'Segoe UI', system-ui, sans-serif;
            line-height: 1.8;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f7f6;
        }
        .container {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1a56db;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 15px;
            text-align: center;
            font-size: 1.8em;
        }
        h2 {
            color: #047857;
            margin-top: 40px;
            font-size: 1.5em;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 10px;
        }
        .domain-highlight {
            color: #dc2626; /* قرمز */
            font-weight: bold;
        }
        .step {
            margin-bottom: 30px;
            padding: 25px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background-color: #fdfdfd;
        }
        .step-title {
            font-size: 1.3em;
            font-weight: bold;
            color: #047857;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        
        .code-wrapper {
            position: relative;
            margin: 15px 0;
        }
        .copy-btn {
            position: absolute;
            top: 8px;
            left: 8px;
            background-color: #374151;
            color: #d1d5db;
            border: 1px solid #4b5563;
            border-radius: 6px;
            padding: 5px 10px;
            font-size: 0.85em;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: Tahoma, sans-serif;
            display: flex;
            align-items: center;
            gap: 6px;
            z-index: 10;
        }
        .copy-btn:hover {
            background-color: #4b5563;
            color: #ffffff;
        }
        .copy-btn.copied {
            background-color: #059669;
            border-color: #059669;
            color: #ffffff;
        }
        .copy-btn svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }
        
        pre {
            background-color: #1f2937;
            color: #f8fafc;
            padding: 15px;
            padding-top: 40px;
            border-radius: 8px;
            overflow-x: auto;
            direction: ltr;
            text-align: left;
            font-family: Consolas, Monaco, monospace;
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
        }
        code {
            font-family: Consolas, Monaco, monospace;
            background-color: #e5e7eb;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.9em;
            color: #b91c1c;
        }
        pre code {
            background-color: transparent;
            color: inherit;
            padding: 0;
        }
        pre .domain-highlight {
            color: #ff6b6b;
            background-color: rgba(255, 0, 0, 0.1);
            padding: 0 2px;
            border-radius: 3px;
        }
        .note {
            background-color: #fffbeb;
            border-right: 4px solid #f59e0b;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
            color: #92400e;
        }
        ul {
            margin-top: 10px;
            padding-right: 20px;
        }
        li {
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>آموزش انتقال سورس‌کد به ریپازیتوری جدید گیتهاب</h1>
        
        <p>اگر فایل‌های یک پروژه را به صورت ZIP دانلود کرده‌اید و می‌خواهید آن‌ها را در یک ریپازیتوری کاملاً جدید (با نام متفاوت) در گیتهاب آپلود کنید، مراحل زیر را به دقت دنبال کنید.</p>
        
        <div class="note">
            <strong>نکته مهم:</strong> تغییر نام ریپازیتوری (مثلاً از asd-panel به asd-panel2) مشکلی در کدهای اصلی ایجاد نمی‌کند. فقط بخش‌های <span class="domain-highlight">قرمز رنگ</span> در کدهای زیر را با نام کاربری و نام ریپازیتوری خودتان جایگزین کنید.
        </div>

        <div class="step">
            <div class="step-title">قدم اول: باز کردن Git Bash در پوشه پروژه</div>
            <p>۱. ابتدا فایل ZIP دانلود شده را از حالت فشرده خارج کنید (Extract کنید).</p>
            <p>۲. وارد پوشه اصلی پروژه شوید.</p>
            <p>۳. <strong>ساده‌ترین راه:</strong> روی فضای خالی داخل پوشه راست‌کلیک کرده و گزینه <strong>"Git Bash Here"</strong> را انتخاب کنید. یک پنجره مشکی رنگ (خط فرمان) باز می‌شود.</p>
        </div>

        <h2>روش اول: آپلود در یک ریپازیتوری کاملاً خالی</h2>
        <p>اگر ریپازیتوری جدیدی که در گیتهاب ساخته‌اید کاملاً خالی است (هیچ فایلی حتی README ندارد)، دستورات زیر را خط به خط در Git Bash کپی و اجرا کنید:</p>
        
        <div class="step">
            <div class="code-wrapper">
                <button class="copy-btn" onclick="copyCode(this)">
                    <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    <span>کپی</span>
                </button>
                <pre><code># حذف تاریخچه گیت قدیمی (در صورت وجود)
rm -rf .git

# ساخت ریپازیتوری جدید در پوشه فعلی
git init

# اضافه کردن تمام فایل‌ها
git add .

# ثبت تغییرات با یک پیام
git commit -m "Initial commit"

# اتصال به ریپازیتوری گیتهاب (لینک خود را جایگزین کنید)
git remote add origin https://github.com/<span class="domain-highlight">USERNAME</span>/<span class="domain-highlight">asd-panel2</span>.git

# تغییر نام شاخه اصلی به main
git branch -M main

# آپلود نهایی فایل‌ها در گیتهاب
git push -u origin main</code></pre>
            </div>
        </div>

        <h2>روش دوم: جایگزینی (Overwrite) روی ریپازیتوری دارای فایل</h2>
        <p>اگر ریپازیتوری شما در گیتهاب خالی نیست و از قبل فایل‌هایی دارد (مثلاً تیک افزودن README را موقع ساخت زده‌اید) و می‌خواهید فایل‌های جدید کاملاً جایگزین قبلی‌ها شوند، از دستورات زیر استفاده کنید:</p>

        <div class="step">
            <div class="code-wrapper">
                <button class="copy-btn" onclick="copyCode(this)">
                    <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    <span>کپی</span>
                </button>
                <pre><code># حذف تاریخچه گیت قدیمی
rm -rf .git

# راه‌اندازی مجدد
git init
git add .
git commit -m "Initial commit"

# اتصال به ریپازیتوری گیتهاب
git remote add origin https://github.com/<span class="domain-highlight">USERNAME</span>/<span class="domain-highlight">asd-panel2</span>.git

# تنظیم شاخه روی main
git branch -M main

# دریافت اطلاعات اولیه از گیتهاب
git fetch origin

# آپلود و جایگزینی اجباری (Force Push)
git push -u origin main --force</code></pre>
            </div>
        </div>
        
        <p style="text-align:center; color:#6b7280; font-size: 0.9em; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            پایان آموزش
        </p>
    </div>

    <script>
        function copyCode(btn) {
            const pre = btn.nextElementSibling;
            const code = pre.innerText;
            
            navigator.clipboard.writeText(code).then(() => {
                const span = btn.querySelector('span');
                const originalText = span.innerText;
                
                span.innerText = 'کپی شد!';
                btn.classList.add('copied');
                
                setTimeout(() => {
                    span.innerText = originalText;
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('خطا در کپی کردن کد!');
            });
        }
    </script>
</body>
</html>"""

with open('/mnt/data/github-repo-transfer-tutorial.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print('File generated: /mnt/data/github-repo-transfer-tutorial.html')
