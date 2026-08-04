<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>راهنمای آپلود asd-panel به GitHub</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            line-height: 1.8;
            padding: 30px 15px;
            max-width: 900px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: #38bdf8;
            margin-bottom: 10px;
            font-size: 1.8rem;
        }
        .subtitle {
            text-align: center;
            color: #94a3b8;
            margin-bottom: 40px;
            font-size: 0.95rem;
        }
        .section {
            background: #1e293b;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 28px;
            border: 1px solid #334155;
        }
        .section h2 {
            color: #38bdf8;
            font-size: 1.25rem;
            margin-bottom: 16px;
            border-bottom: 1px solid #334155;
            padding-bottom: 10px;
        }
        .section h3 {
            color: #7dd3fc;
            font-size: 1.05rem;
            margin: 18px 0 10px;
        }
        p, li {
            margin-bottom: 10px;
            color: #cbd5e1;
        }
        ul, ol {
            padding-right: 22px;
            margin-bottom: 12px;
        }
        .note {
            background: #0f172a;
            border-right: 4px solid #38bdf8;
            padding: 12px 16px;
            border-radius: 8px;
            margin: 16px 0;
            font-size: 0.95rem;
        }
        .warning {
            background: #1c1917;
            border-right: 4px solid #f59e0b;
            padding: 12px 16px;
            border-radius: 8px;
            margin: 16px 0;
            color: #fcd34d;
        }
        .success {
            background: #052e16;
            border-right: 4px solid #22c55e;
            padding: 12px 16px;
            border-radius: 8px;
            margin: 16px 0;
            color: #86efac;
        }
        .code-box {
            position: relative;
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 10px;
            margin: 14px 0;
            overflow: hidden;
        }
        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #1e293b;
            padding: 8px 14px;
            border-bottom: 1px solid #334155;
            font-size: 0.85rem;
            color: #94a3b8;
        }
        .copy-btn {
            background: #334155;
            color: #e2e8f0;
            border: none;
            padding: 5px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.2s;
            font-family: inherit;
        }
        .copy-btn:hover {
            background: #38bdf8;
            color: #0f172a;
        }
        .copy-btn.copied {
            background: #22c55e;
            color: #fff;
        }
        pre {
            margin: 0;
            padding: 16px;
            overflow-x: auto;
            direction: ltr;
            text-align: left;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 0.9rem;
            line-height: 1.6;
            color: #a5f3fc;
            white-space: pre;
        }
        code {
            font-family: 'Consolas', 'Courier New', monospace;
        }
        .step {
            background: #0f172a;
            border-radius: 8px;
            padding: 14px 18px;
            margin: 12px 0;
            border: 1px solid #334155;
        }
        .step-number {
            display: inline-block;
            background: #38bdf8;
            color: #0f172a;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            text-align: center;
            line-height: 26px;
            font-weight: bold;
            margin-left: 8px;
            font-size: 0.9rem;
        }
        footer {
            text-align: center;
            color: #64748b;
            margin-top: 40px;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>

    <h1>🚀 راهنمای کامل آپلود پروژه به GitHub</h1>
    <p class="subtitle">از پوشه دانلودشده (asd-panel) به ریپازیتوری جدید (asd-panel2)</p>

    <!-- بخش ۱ -->
    <div class="section">
        <h2>۱. جواب سوالت: اسم متفاوت مشکلی ایجاد می‌کنه؟</h2>
        <div class="success">
            <strong>خیر، هیچ مشکلی ایجاد نمی‌کنه.</strong><br>
            اسم پوشه محلی (asd-panel) و اسم ریپازیتوری روی گیت‌هاب (asd-panel2) کاملاً می‌تونن متفاوت باشن. گیت فقط به محتویات داخل پوشه نگاه می‌کنه، نه اسم پوشه.
        </div>
    </div>

    <!-- بخش ۲ -->
    <div class="section">
        <h2>۲. چطور Git Bash رو باز کنی؟</h2>
        <div class="step">
            <span class="step-number">1</span>
            روی دسکتاپ یا Start Menu سرچ کن: <strong>Git Bash</strong>
        </div>
        <div class="step">
            <span class="step-number">2</span>
            برنامه‌ای به اسم <strong>Git Bash</strong> رو باز کن. (مشکی با متن سفید)
        </div>
        <h3>باز کردن پوشه پروژه داخل Git Bash (بهترین روش):</h3>
        <div class="note">
            پوشه <strong>asd-panel</strong> (یا هر اسمی که بعد از استخراج زیپ داره) رو با موس پیدا کن → روی اون <strong>راست‌کلیک</strong> کن → گزینه <strong>"Git Bash Here"</strong> رو بزن.
        </div>
        <p>این بهترین و راحت‌ترین راهه.</p>
    </div>

    <!-- بخش ۳ -->
    <div class="section">
        <h2>۳. دستورات اصلی (ریپازیتوری خالی)</h2>
        <p>اگر ریپازیتوری <code>asd-panel2</code> رو تازه ساختی و خالیه، این دستورات رو یکی‌یکی بزن:</p>

        <div class="code-box">
            <div class="code-header">
                <span>دستورات Git (ریپو خالی)</span>
                <button class="copy-btn" onclick="copyCode(this)">کپی</button>
            </div>
            <pre># حذف .git قدیمی
rm -rf .git

# ساخت ریپو جدید
git init
git add .
git commit -m "Initial commit"

# remote اضافه کن (USERNAME و اسم ریپو رو عوض کن)
git remote add origin https://github.com/USERNAME/asd-panel2.git
git branch -M main
git push -u origin main</pre>
        </div>

        <div class="warning">
            <strong>مهم:</strong> به‌جای <code>USERNAME</code> نام کاربری گیت‌هاب خودت رو بنویس.<br>
            مثال: اگر یوزرنیم‌ت <code>asd1asd00000</code> باشه →<br>
            <code>https://github.com/asd1asd00000/asd-panel2.git</code>
        </div>
    </div>

    <!-- بخش ۴ -->
    <div class="section">
        <h2>۴. اگر ریپازیتوری از قبل فایل داشت و می‌خوای اوررایت کنی</h2>
        <p>اگر ریپازیتوری از قبل چیزی داخلش بوده و می‌خوای کامل جایگزین کنی، از این نسخه استفاده کن:</p>

        <div class="code-box">
            <div class="code-header">
                <span>دستورات Git (با Force Push)</span>
                <button class="copy-btn" onclick="copyCode(this)">کپی</button>
            </div>
            <pre>#!/bin/bash
rm -rf .git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/asd-panel2.git
# مهم: اول برنچ رو main کن، بعد fetch
git branch -M main
git fetch origin
git push -u origin main --force</pre>
        </div>

        <div class="warning">
            <strong>هشدار:</strong> دستور <code>--force</code> تمام تاریخچه قبلی ریپازیتوری رو پاک می‌کنه و جایگزین می‌کنه. فقط وقتی استفاده کن که مطمئنی.
        </div>
    </div>

    <!-- بخش ۵ -->
    <div class="section">
        <h2>۵. خلاصه مراحل کامل (گام‌به‌گام)</h2>
        <ol>
            <li>روی گیت‌هاب یک ریپازیتوری جدید به اسم <strong>asd-panel2</strong> بساز (خالی، بدون README).</li>
            <li>فایل زیپ رو استخراج کن و پوشه‌اش رو پیدا کن.</li>
            <li>روی پوشه راست‌کلیک → <strong>Git Bash Here</strong>.</li>
            <li>یکی از دو بلوک دستور بالا رو کپی و پیست کن (با تغییر USERNAME).</li>
            <li>اگر ازت یوزرنیم و پسورد خواست، از <strong>Personal Access Token</strong> استفاده کن (پسورد معمولی دیگه کار نمی‌کنه).</li>
        </ol>
    </div>

    <!-- بخش ۶ -->
    <div class="section">
        <h2>۶. نکات مهم</h2>
        <ul>
            <li>اسم پوشه محلی و اسم ریپو روی گیت‌هاب می‌تونه متفاوت باشه → مشکلی نیست.</li>
            <li>اگر خطای authentication گرفتی، باید Personal Access Token بسازی (از Settings → Developer settings → Personal access tokens).</li>
            <li>بعد از <code>git push</code> موفق، صفحه ریپازیتوری رو رفرش کن تا فایل‌ها رو ببینی.</li>
        </ul>
    </div>

    <footer>
        این فایل رو ذخیره کن و هر وقت لازم شد باز کن • کدها با یک کلیک کپی می‌شن
    </footer>

    <script>
        function copyCode(btn) {
            const pre = btn.closest('.code-box').querySelector('pre');
            const text = pre.innerText;

            navigator.clipboard.writeText(text).then(() => {
                const original = btn.innerText;
                btn.innerText = 'کپی شد ✓';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerText = original;
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                // fallback برای مرورگرهای قدیمی
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                btn.innerText = 'کپی شد ✓';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerText = 'کپی';
                    btn.classList.remove('copied');
                }, 2000);
            });
        }
    </script>

</body>
</html>
