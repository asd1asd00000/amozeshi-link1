export default {
  async fetch(request) {
    const html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>مرجع آموزش‌های شبکه و پنل‌ها</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            --accent: oklch(0.66 0.2 275);
            --w-min: 75px;
            --w-max: 230px;
            display: flex;
            align-items: flex-start;
            gap: 24px;
            width: 100%;
            min-height: 100vh;
            padding: 26px;
            font-family: 'Segoe UI', Tahoma, system-ui, sans-serif;
            background: radial-gradient(120% 120% at 10% 10%, #1e1b3a, #0b0a17 70%);
            color: rgba(255,255,255,.85);
            line-height: 1.8;
        }

        .sm-17__dock {
            position: sticky;
            top: 26px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            width: var(--w-min);
            padding: 12px;
            border-radius: 22px;
            overflow: hidden;
            isolation: isolate;
            background: color-mix(in oklab, white 8%, rgba(10,10,20,.35));
            border: 1px solid rgba(255,255,255,.16);
            box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 30px 60px -28px rgba(0,0,0,.8);
            backdrop-filter: blur(22px) saturate(160%);
            -webkit-backdrop-filter: blur(22px) saturate(160%);
            transition: width .5s cubic-bezier(.34,1.35,.5,1);
            flex-shrink: 0;
        }

        .sm-17__dock:hover, .sm-17__dock:focus-within { width: var(--w-max); }

        .sm-17__hl {
            position: absolute;
            left: 12px;
            right: 12px;
            height: 44px;
            border-radius: 12px;
            background: color-mix(in oklab, var(--accent) 70%, transparent);
            box-shadow: 0 6px 18px -6px var(--accent);
            transform: translateY(var(--y,0));
            transition: transform .4s cubic-bezier(.34,1.35,.5,1);
            pointer-events: none;
        }

        .sm-17__item {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            gap: 14px;
            min-height: 44px;
            padding: 0 12px;
            border-radius: 12px;
            text-decoration: none;
            color: rgba(255,255,255,.6);
            font-size: 14.5px;
            font-weight: 600;
            white-space: nowrap;
            cursor: pointer;
        }

        .sm-17__item[aria-current="page"] { color: #fff; }
        .sm-17__ic { font-size: 20px; width: 22px; text-align: center; flex: none; }
        
        .sm-17__lb {
            max-width: 0; opacity: 0; overflow: hidden;
            transition: max-width .5s cubic-bezier(.34,1.35,.5,1), opacity .35s;
        }

        .sm-17__dock:hover .sm-17__lb, .sm-17__dock:focus-within .sm-17__lb {
            max-width: 150px; opacity: 1;
        }

        .content-wrapper { flex: 1; min-width: 0; }
        
        .content-area {
            background: color-mix(in oklab, white 3%, rgba(10,10,20,.35));
            border: 1px solid rgba(255,255,255,.08);
            box-shadow: inset 0 1px 0 rgba(255,255,255,.1), 0 30px 60px -28px rgba(0,0,0,.5);
            backdrop-filter: blur(22px) saturate(160%);
            -webkit-backdrop-filter: blur(22px) saturate(160%);
            padding: 40px;
            border-radius: 22px;
            min-height: 80vh;
        }
        
        .content-area h1 { color: #a78bfa; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 15px; text-align: center; }
        .content-area h2 { color: #34d399; margin-top: 40px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }
        .content-area h3 { color: #9ca3af; margin-top: 30px; }
        .content-area img { max-width: 100%; border-radius: 8px; }
        .content-area blockquote { background: rgba(245, 158, 11, 0.1); border-right: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 8px; color: #fcd34d; }
        
        .code-wrapper { position: relative; margin: 20px 0; }
        .copy-btn {
            position: absolute; top: 8px; left: 8px;
            background-color: rgba(255,255,255,0.1); color: #d1d5db;
            border: 1px solid rgba(255,255,255,0.2); border-radius: 8px;
            padding: 5px 10px; font-size: 0.85em; cursor: pointer;
            transition: all 0.2s; display: flex; align-items: center; gap: 6px; z-index: 10; font-family: Tahoma;
            backdrop-filter: blur(4px);
        }
        .copy-btn:hover { background-color: rgba(255,255,255,0.2); color: #ffffff; }
        .copy-btn.copied { background-color: #059669; border-color: #059669; color: #ffffff; }
        .copy-btn svg { width: 14px; height: 14px; fill: currentColor; }
        
        pre {
            background-color: rgba(0,0,0,0.3); color: #f8fafc; padding: 20px; padding-top: 45px;
            border-radius: 12px; overflow-x: auto; direction: ltr; text-align: left;
            font-family: Consolas, Monaco, monospace; font-size: 14px; line-height: 1.5; margin: 0;
            border: 1px solid rgba(255,255,255,0.05);
        }
        code { font-family: Consolas, Monaco, monospace; background-color: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; color: #fca5a5; }
        pre code { background-color: transparent; color: inherit; padding: 0; }

        .loading { text-align: center; color: rgba(255,255,255,0.5); font-size: 1.2em; margin-top: 50px; }

        @media (max-width: 768px) {
            body { flex-direction: column; padding: 15px; }
            .sm-17__dock { width: 100% !important; flex-direction: row; flex-wrap: wrap; justify-content: center; position: static; }
            .sm-17__lb { max-width: 150px; opacity: 1; }
            .sm-17__hl { display: none; }
        }
    </style>
</head>
<body>
    
    <nav class="sm-17__dock" id="sm-17-dock" aria-label="Primary">
        <span class="sm-17__hl" aria-hidden="true"></span>
    </nav>

    <div class="content-wrapper">
        <div class="content-area" id="content-body">
            <div class="loading">در حال بارگذاری اطلاعات سایت...</div>
        </div>
    </div>

    <script>
        // آدرس پایه گیت‌هاب
        const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/asd1asd00000/amozeshi-link1/main/docs/";
        
        let tutorials = [];
        const dock = document.getElementById('sm-17-dock');
        const contentBody = document.getElementById('content-body');
        const hl = dock.querySelector('.sm-17__hl');

        // تابع اصلی برای راه‌اندازی سایت
        async function initApp() {
            try {
                // ۱. خواندن فایل منوها (JSON) از گیت‌هاب
                const menuResponse = await fetch(GITHUB_RAW_BASE + "menu.json");
                if (!menuResponse.ok) throw new Error("فایل menu.json پیدا نشد");
                tutorials = await menuResponse.json();

                // ۲. ساخت دکمه‌های منو
                tutorials.forEach((item) => {
                    const a = document.createElement('a');
                    a.className = 'sm-17__item';
                    a.href = "#" + item.id;
                    a.id = "menu-" + item.id;
                    a.onclick = () => loadContent(item.id);
                    a.innerHTML = \`<span class="sm-17__ic" aria-hidden="true">\${item.icon}</span><span class="sm-17__lb">\${item.title}</span>\`;
                    dock.appendChild(a);
                });

                // ۳. راه‌اندازی انیمیشن‌ها و لود اولین محتوا
                initDockAnimation();
                loadContent();

            } catch (error) {
                contentBody.innerHTML = \`<h2 style="color:#ef4444;">خطای سیستمی</h2><p>\${error.message}</p>\`;
            }
        }

        // سیستم انیمیشن هاور داک
        function initDockAnimation() {
            const items = [...dock.querySelectorAll('.sm-17__item')];
            const move = (el) => { 
                if(el && hl) hl.style.setProperty('--y', (el.offsetTop - 12) + 'px'); 
            };
            
            items.forEach((it) => {
                it.addEventListener('pointerenter', () => move(it));
                it.addEventListener('focus', () => move(it));
            });
            
            dock.addEventListener('pointerleave', () => {
                const active = dock.querySelector('[aria-current="page"]') || items[0];
                move(active);
            });
        }

        // بارگذاری محتوای آموزشی
        async function loadContent(id) {
            if (tutorials.length === 0) return;
            if (!id) id = window.location.hash.substring(1) || tutorials[0].id;
            const currentItem = tutorials.find(t => t.id === id) || tutorials[0];

            document.querySelectorAll('.sm-17__item').forEach(a => a.removeAttribute('aria-current'));
            const activeLink = document.getElementById("menu-" + currentItem.id);
            if(activeLink) {
                activeLink.setAttribute('aria-current', 'page');
                if(hl) hl.style.setProperty('--y', (activeLink.offsetTop - 12) + 'px');
            }

            contentBody.innerHTML = '<div class="loading">در حال دریافت فایل ' + currentItem.file + '...</div>';

            try {
                const response = await fetch(GITHUB_RAW_BASE + currentItem.file);
                if (!response.ok) throw new Error("فایل پیدا نشد");
                
                const text = await response.text();
                contentBody.innerHTML = marked.parse(text);
                enhanceCodeBlocks();
            } catch (error) {
                contentBody.innerHTML = \`
                    <h2 style="color:#ef4444;">خطا در بارگذاری!</h2>
                    <p>فایل <b>\${currentItem.file}</b> در گیت‌هاب پیدا نشد.</p>
                \`;
            }
        }

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
                        setTimeout(() => { span.innerText = 'کپی'; btn.classList.remove('copied'); }, 2000);
                    });
                };

                pre.parentNode.insertBefore(wrapper, pre);
                wrapper.appendChild(btn);
                wrapper.appendChild(pre);
            });
        }

        window.addEventListener('load', initApp);
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
