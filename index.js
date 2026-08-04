export default {
  async fetch(request) {
    const html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>مرجع آموزش‌های شبکه و پنل‌ها</title>
    <style>
        /* استایل‌های پایه شما */
        body {
            font-family: Tahoma, 'Segoe UI', system-ui, sans-serif;
            line-height: 1.8;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #f4f7f6;
            display: flex;
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        /* استایل منوی کناری (جدید) */
        .sidebar {
            width: 280px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
            height: fit-content;
            position: sticky;
            top: 20px;
        }
        .sidebar h3 {
            color: #1a56db;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-top: 0;
            text-align: center;
        }
        .menu-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .menu-list li {
            margin-bottom: 10px;
        }
        .menu-list a {
            display: block;
            padding: 10px 15px;
            text-decoration: none;
            color: #4b5563;
            background-color: #f9fafb;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            transition: all 0.2s;
            font-weight: bold;
        }
        .menu-list a:hover {
            background-color: #eff6ff;
            color: #1d4ed8;
            border-color: #bfdbfe;
        }
        .menu-list a.active {
            background-color: #1d4ed8;
            color: #ffffff;
            border-color: #1e40af;
        }

        /* استایل بخش محتوا (کدهای قبلی شما) */
        .content-area {
            flex: 1;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
            min-width: 0;
        }
        h1 { color: #1a56db; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; text-align: center; font-size: 1.8em; }
        h2 { color: #047857; margin-top: 40px; font-size: 1.5em; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
        .domain-highlight { color: #dc2626; font-weight: bold; }
        .step { margin-bottom: 30px; padding: 25px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #fdfdfd; }
        .step-title { font-size: 1.3em; font-weight: bold; color: #047857; margin-bottom: 15px; display: flex; align-items: center; }
        .code-wrapper { position: relative; margin: 15px 0; }
        .copy-btn { position: absolute; top: 8px; left: 8px; background-color: #374151; color: #d1d5db; border: 1px solid #4b5563; border-radius: 6px; padding: 5px 10px; font-size: 0.85em; cursor: pointer; transition: all 0.2s ease; font-family: Tahoma, sans-serif; display: flex; align-items: center; gap: 6px; z-index: 10; }
        .copy-btn:hover { background-color: #4b5563; color: #ffffff; }
        .copy-btn.copied { background-color: #059669; border-color: #059669; color: #ffffff; }
        .copy-btn svg { width: 14px; height: 14px; fill: currentColor; }
        pre { background-color: #1f2937; color: #f8fafc; padding: 15px; padding-top: 40px; border-radius: 8px; overflow-x: auto; direction: ltr; text-align: left; font-family: Consolas, Monaco, monospace; font-size: 14px; line-height: 1.5; margin: 0; }
        code { font-family: Consolas, Monaco, monospace; background-color: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; color: #b91c1c; }
        pre code { background-color: transparent; color: inherit; padding: 0; }
        pre .domain-highlight { color: #ff6b6b; background-color: rgba(255, 0, 0, 0.1); padding: 0 2px; border-radius: 3px; }
        .note { background-color: #fffbeb; border-right: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px; color: #92400e; }
        ul { margin-top: 10px; padding-right: 20px; }
        li { margin-bottom: 8px; }

        /* ریسپانسیو برای موبایل */
        @media (max-width: 768px) {
            body { flex-direction: column; }
            .sidebar { width: auto; position: static; }
        }
    </style>
</head>
<body>
    
    <!-- منوی کناری داینامیک -->
    <aside class="sidebar">
        <h3>فهرست آموزش‌ها</h3>
        <ul class="menu-list" id="dynamic-menu">
            <!-- آیتم‌های منو توسط جاوااسکریپت در اینجا لود می‌شوند -->
        </ul>
    </aside>

    <!-- بخش اصلی محتوا -->
    <div class="content-area">
        <h1>پنل پاسارگاد</h1>
        <h2>نصب و راه‌اندازی اولیه</h2>
        
        <div class="step">
            <p>نصب پاسارگاد:</p>
            <div class="code-wrapper">
                <button class="copy-btn" onclick="copyCode(this)">
                    <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    <span>کپی</span>
                </button>
                <pre><code>curl -fsSL https://github.com/PasarGuard/scripts/raw/main/pasarguard.sh -o /tmp/pg.sh   && sudo bash /tmp/pg.sh install --database timescaledb</code></pre>
            </div>
            <!-- ادامه محتوای آموزشی شما به همین شکل در اینجا قرار می‌گیرد... -->
            <p>اینجا می‌توانید بقیه محتوای آموزش HAProxy را قرار دهید.</p>
        </div>
    </div>

    <script>
        /* =========================================
           تنظیمات منو - آموزش‌های جدید را اینجا اضافه کنید
           ========================================= */
        const tutorials = [
            { title: "نصب و تک‌پورت پاسارگارد", url: "#", active: true },
            { title: "کانفیگ و مسیریابی پنل X-UI", url: "#xui", active: false },
            { title: "راه‌اندازی و مدیریت Marzban", url: "#marzban", active: false },
            { title: "تنظیمات پیشرفته Reality", url: "#reality", active: false }
        ];

        // اسکریپت ساخت خودکار منو
        const menuContainer = document.getElementById('dynamic-menu');
        tutorials.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.url;
            a.textContent = item.title;
            if (item.active) {
                a.classList.add('active');
            }
            li.appendChild(a);
            menuContainer.appendChild(li);
        });

        // اسکریپت کپی کردن کدها (از کدهای قبلی شما)
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
</html>
    `;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};
