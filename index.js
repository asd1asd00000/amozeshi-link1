export default {
  async fetch(request) {
    const html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>مرجع آموزش‌های شبکه و پنل‌ها</title>
    <!-- اضافه کردن کتابخانه Marked.js برای تبدیل متن به HTML -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
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
        .menu-list { list-style: none; padding: 0; margin: 0; }
        .menu-list li { margin-bottom: 10px; }
        .menu-list a {
            display: block; padding: 10px 15px; text-decoration: none;
            color: #4b5563; background-color: #f9fafb;
            border-radius: 8px; border: 1px solid #e5e7eb;
            transition: all 0.2s; font-weight: bold; cursor: pointer;
        }
        .menu-list a:hover { background-color: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
        .menu-list a.active { background-color: #1d4ed8; color: #ffffff; border-color: #1e40af; }

        .content-area {
            flex: 1;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
            min-width: 0;
        }
        
        /* استایل‌های مربوط به خروجی Markdown */
        .content-area h1 { color: #1a56db; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; text-align: center; }
        .content-area h2 { color: #047857; margin-top: 40px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
        .content-area h3 { color: #374151; margin-top: 30px; }
        .content-area img { max-width: 100%; border-radius: 8px; }
        .content-area blockquote { background: #fffbeb; border-right: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; color: #92400e; }
        
        /* استایل کدهای کپی‌دار */
        .code-wrapper { position: relative; margin: 20px 0; }
        .copy-btn {
            position: absolute; top: 8px; left: 8px;
            background-color: #374151; color: #d1d5db;
            border: 1px solid #4b5563; border-radius: 6px;
            padding: 5px 10px; font-size: 0.85em; cursor: pointer;
            transition: all 0.2s; display: flex; align-items: center; gap: 6px; z-index: 10; font-family: Tahoma;
        }
        .copy-btn:hover { background-color: #4b5563; color: #ffffff; }
        .copy-btn.copied { background-color: #059669; border-color: #059669; color: #ffffff; }
        .copy-btn svg { width: 14px; height: 14px; fill: currentColor; }
        
        pre {
            background-color: #1f2937; color: #f8fafc; padding: 20px; padding-top: 45px;
            border-radius: 8px; overflow-x: auto; direction: ltr; text-align: left;
            font-family: Consolas, Monaco, monospace; font-size: 14px; line-height: 1.5; margin: 0;
        }
        code { font-family: Consolas, Monaco, monospace; background-color: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; color: #b91c1c; }
        pre code { background-color: transparent; color: inherit; padding: 0; }

        .loading { text-align: center; color: #6b7280; font-size: 1.2em; margin-top: 50px; }

        @media (max-width: 768px) {
            body { flex-direction: column; }
            .sidebar { width: auto; position: static; }
        }
    </style>
</head>
<body>
    
    <aside class="sidebar">
        <h3>فهرست آموزش‌ها</h3>
        <ul class="menu-list" id="dynamic-menu">
            <!-- منو توسط جاوااسکریپت ساخته می‌شود -->
        </ul>
    </aside>

    <div class="content-area" id="content-body">
        <div class="loading">در حال بارگذاری اطلاعات...</div>
    </div>

    <script>
        /* =========================================================
           ۱. آدرس گیت‌هاب خود را اینجا وارد کنید:
           عبارت YOUR_USERNAME را با یوزرنیم گیت‌هاب
           و YOUR_REPO را با نام ریپازیتوری خود جایگزین کنید.
           ========================================================= */
        const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/asd1asd00000/amozeshi-link1/tree/main/docs/";

        /* =========================================================
           ۲. لیست آموزش‌ها و فایل‌های متنی آن‌ها را اینجا مشخص کنید
           ========================================================= */
        const tutorials = [
            { id: "haproxy", title: "تک‌پورت کردن پاسارگارد", file: "haproxy.md" },
            { id: "marzban", title: "راه‌اندازی و دیتابیس Marzban", file: "marzban.md" },
            { id: "xui", title: "کانفیگ و مدیریت X-UI", file: "xui.md" },
            { id: "reality", title: "اسکنر و تنظیمات Reality", file: "reality.md" },
            { id: "svmpanel", title: "توسعه وب‌پنل svm-panel", file: "svmpanel.md" }
        ];

        const menuContainer = document.getElementById('dynamic-menu');
        const contentBody = document.getElementById('content-body');

        // ساخت منو
        tutorials.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = "#" + item.id;
            a.id = "menu-" + item.id;
            a.textContent = item.title;
            a.onclick = () => loadContent(item.id);
            li.appendChild(a);
            menuContainer.appendChild(li);
        });

        // بارگذاری محتوا بر اساس هَش URL (یا لود پیش‌فرض اولین آیتم)
        async function loadContent(id) {
            if (!id) {
                id = window.location.hash.substring(1) || tutorials[0].id;
            }
            const currentItem = tutorials.find(t => t.id === id) || tutorials[0];

            // آپدیت وضعیت فعال منو
            document.querySelectorAll('.menu-list a').forEach(a => a.classList.remove('active'));
            document.getElementById("menu-" + currentItem.id).classList.add('active');

            contentBody.innerHTML = '<div class="loading">در حال دریافت فایل ' + currentItem.file + ' از گیت‌هاب...</div>';

            try {
                // درخواست خواندن فایل از گیت‌هاب
                const response = await fetch(GITHUB_RAW_BASE + currentItem.file);
                if (!response.ok) throw new Error("File not found");
                
                const text = await response.text();
                
                // تبدیل Markdown به HTML
                contentBody.innerHTML = marked.parse(text);
                
                // اضافه کردن دکمه کپی به تمام باکس‌های کد
                enhanceCodeBlocks();
                
            } catch (error) {
                contentBody.innerHTML = \`
                    <h2 style="color:#dc2626;">خطا در بارگذاری!</h2>
                    <p>فایل <b>\${currentItem.file}</b> پیدا نشد.</p>
                    <p>لطفاً مطمئن شوید که پوشه‌ای به نام <code>docs</code> در ریپازیتوری خود ساخته‌اید و این فایل را درون آن آپلود کرده‌اید.</p>
                \`;
            }
        }

        // تابعی برای اضافه کردن استایل‌ها و دکمه کپی به بلوک‌های کد
        function enhanceCodeBlocks() {
            const preTags = contentBody.querySelectorAll('pre');
            preTags.forEach(pre => {
                const wrapper = document.createElement('div');
                wrapper.className = 'code-wrapper';
                
                const btn = document.createElement('button');
                btn.className = 'copy-btn';
                btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg><span>کپی</span>';
                
                btn.onclick = function() {
                    const code = pre.innerText;
                    navigator.clipboard.writeText(code).then(() => {
                        const span = btn.querySelector('span');
                        span.innerText = 'کپی شد!';
                        btn.classList.add('copied');
                        setTimeout(() => {
                            span.innerText = 'کپی';
                            btn.classList.remove('copied');
                        }, 2000);
                    });
                };

                pre.parentNode.insertBefore(wrapper, pre);
                wrapper.appendChild(btn);
                wrapper.appendChild(pre);
            });
        }

        // اجرای تابع هنگام لود صفحه
        window.addEventListener('load', () => loadContent());
        // مدیریت کلیک‌های Back و Forward در مرورگر
        window.addEventListener('hashchange', () => loadContent());
    </script>
</body>
</html>
    `;

    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  },
};
