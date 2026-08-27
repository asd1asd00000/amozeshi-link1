// index.js--- این فایل رو در ورکر کلودفلر باید قرار بدیم ------
var index_default = {
  async fetch(request) {
    const html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>مرجع آموزش‌های شبکه و پنل‌ها</title>
    <link rel="icon" type="image/png" href="https://raw.githubusercontent.com/asd1asd00000/amozeshi-link1/main/docs/favicon.png">
    <link rel="apple-touch-icon" href="https://raw.githubusercontent.com/asd1asd00000/amozeshi-link1/main/docs/favicon.png">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            --accent: oklch(0.66 0.2 275);
            --w-min: 75px;
            --w-max: 240px;
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

        /* \u062D\u0630\u0641 position: relative \u0628\u0631\u0627\u06CC \u0631\u0641\u0639 \u0628\u0627\u06AF \u0645\u062D\u0627\u0633\u0628\u0647 \u0627\u0641\u0633\u062A */
        .sm-17__wrapper { display: flex; flex-direction: column; }
        
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
            user-select: none;
        }

        .sm-17__item[aria-current="page"] { color: #fff; }
        .sm-17__ic { font-size: 20px; width: 22px; text-align: center; flex: none; }
        
        .sm-17__lb {
            max-width: 0; opacity: 0; overflow: hidden;
            transition: max-width .5s cubic-bezier(.34,1.35,.5,1), opacity .35s;
            display: flex; align-items: center; width: 100%;
        }

        .sm-17__dock:hover .sm-17__lb, .sm-17__dock:focus-within .sm-17__lb {
            max-width: 170px; opacity: 1;
        }

        .sm-17__chevron {
            margin-right: auto; font-size: 10px; transition: transform 0.3s;
        }
        .sm-17__item.expanded .sm-17__chevron { transform: rotate(180deg); }

        .sm-17__sub-menu {
            max-height: 0; overflow: hidden; transition: max-height 0.4s ease;
            display: flex; flex-direction: column; gap: 4px; padding-right: 44px;
        }

        .sm-17__sub-menu.open { max-height: 350px; margin-top: 5px; margin-bottom: 5px; }

        .sm-17__sub-item {
            color: rgba(255,255,255,.5); text-decoration: none; font-size: 13.5px;
            padding: 8px 12px; border-radius: 8px; transition: all 0.2s; display: flex;
        }

        .sm-17__sub-item:hover, .sm-17__sub-item.active { background: rgba(255,255,255,.1); color: #fff; }

        /* \u0627\u0633\u062A\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC \u0628\u062E\u0634 \u0645\u062D\u062A\u0648\u0627 */
        .content-wrapper { flex: 1; min-width: 0; }
        .content-area {
            background: color-mix(in oklab, white 3%, rgba(10,10,20,.35));
            border: 1px solid rgba(255,255,255,.08);
            box-shadow: inset 0 1px 0 rgba(255,255,255,.1), 0 30px 60px -28px rgba(0,0,0,.5);
            backdrop-filter: blur(22px) saturate(160%);
            -webkit-backdrop-filter: blur(22px) saturate(160%);
            padding: 40px; border-radius: 22px; min-height: 80vh;
        }
        
        .content-area h1 { color: #a78bfa; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 15px; text-align: center; }
        .content-area h2 { color: #34d399; margin-top: 40px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }
        .content-area h3 { color: #9ca3af; margin-top: 30px; }
        .content-area img { max-width: 100%; border-radius: 8px; }
        .content-area blockquote { background: rgba(245, 158, 11, 0.1); border-right: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 8px; color: #fcd34d; }
        
        /* \u0627\u0633\u062A\u0627\u06CC\u0644 \u06A9\u0627\u0634\u06CC\u200C\u0647\u0627 (\u0648\u06CC\u0646\u062F\u0648\u0632 \u06F8) \u062F\u0631 \u0635\u0641\u062D\u0647 \u062E\u0627\u0646\u0647 */
        .tile-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .tile {
            position: relative;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 30px 20px;
            text-align: center;
            text-decoration: none;
            color: #fff;
            transition: all 0.3s cubic-bezier(.34,1.35,.5,1);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            backdrop-filter: blur(10px);
            cursor: pointer;
        }
        .tile:hover {
            background: rgba(255, 255, 255, 0.12);
            transform: translateY(-8px);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 15px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        
        /* \u0627\u0633\u062A\u0627\u06CC\u0644 \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u06A9\u0627\u0634\u06CC\u200C\u0647\u0627\u06CC \u067E\u06CC\u0646 \u0634\u062F\u0647 */
        .tile.pinned-tile {
            background: rgba(245, 158, 11, 0.08);
            border-color: rgba(245, 158, 11, 0.3);
        }
        .tile.pinned-tile:hover {
            background: rgba(245, 158, 11, 0.15);
            border-color: rgba(245, 158, 11, 0.5);
        }
        .tile-pinned-badge {
            position: absolute;
            top: 12px;
            right: 12px;
            font-size: 16px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
        }

        .tile-icon { font-size: 45px; color: #a78bfa; text-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        .pinned-tile .tile-icon { color: #fbbf24; }
        .tile-title { font-size: 15px; font-weight: 600; }

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
            .sm-17__dock { width: 100% !important; flex-direction: column; position: static; }
            .sm-17__lb { max-width: 100%; opacity: 1; }
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
            <div class="loading">\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0633\u0627\u06CC\u062A...</div>
        </div>
    </div>

    <script>
        const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/asd1asd00000/amozeshi-link1/main/docs/";
        
        let tutorials = [];
        const dock = document.getElementById('sm-17-dock');
        const contentBody = document.getElementById('content-body');
        const hl = dock.querySelector('.sm-17__hl');

        async function initApp() {
            try {
                const menuResponse = await fetch(GITHUB_RAW_BASE + "menu.json");
                if (!menuResponse.ok) throw new Error("\u0641\u0627\u06CC\u0644 menu.json \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
                tutorials = await menuResponse.json();

                tutorials.forEach((item) => {
                    if (item.subItems && item.subItems.length > 0) {
                        const wrapper = document.createElement('div');
                        wrapper.className = 'sm-17__wrapper';
                        
                        const parent = document.createElement('div');
                        parent.className = 'sm-17__item parent-btn';
                        parent.innerHTML = \`<span class="sm-17__ic" aria-hidden="true">\${item.icon || '\u{1F4C4}'}</span><span class="sm-17__lb">\${item.title} <span class="sm-17__chevron">\u25BC</span></span>\`;
                        
                        const subMenu = document.createElement('div');
                        subMenu.className = 'sm-17__sub-menu';
                        
                        item.subItems.forEach(sub => {
                            const subA = document.createElement('a');
                            subA.className = 'sm-17__sub-item';
                            subA.href = "#" + sub.id;
                            subA.id = "menu-" + sub.id;
                            subA.onclick = (e) => {
                                e.stopPropagation();
                                loadContent(sub.id);
                            };
                            subA.innerHTML = \`<span class="sm-17__lb">\${sub.title}</span>\`;
                            subMenu.appendChild(subA);
                        });
                        
                        parent.onclick = () => {
                            subMenu.classList.toggle('open');
                            parent.classList.toggle('expanded');
                        };
                        
                        wrapper.appendChild(parent);
                        wrapper.appendChild(subMenu);
                        dock.appendChild(wrapper);
                    } else {
                        const a = document.createElement('a');
                        a.className = 'sm-17__item main-link';
                        a.href = "#" + item.id;
                        a.id = "menu-" + item.id;
                        a.onclick = () => loadContent(item.id);
                        a.innerHTML = \`<span class="sm-17__ic" aria-hidden="true">\${item.icon || '\u{1F4C4}'}</span><span class="sm-17__lb">\${item.title}</span>\`;
                        dock.appendChild(a);
                    }
                });

                initDockAnimation();
                loadContent();

            } catch (error) {
                contentBody.innerHTML = \`<h2 style="color:#ef4444;">\u062E\u0637\u0627\u06CC \u0633\u06CC\u0633\u062A\u0645\u06CC</h2><p>\${error.message}</p>\`;
            }
        }

        // \u0633\u06CC\u0633\u062A\u0645 \u0627\u0646\u06CC\u0645\u06CC\u0634\u0646 \u0628\u0627 \u0641\u0631\u0645\u0648\u0644 \u062F\u0642\u06CC\u0642 \u0648 \u0628\u062F\u0648\u0646 \u0628\u0627\u06AF
        function initDockAnimation() {
            const items = [...dock.querySelectorAll('.sm-17__item')];
            const move = (el) => { 
                if(el && hl) {
                    // \u0645\u062D\u0627\u0633\u0628\u0647 \u0641\u0627\u0635\u0644\u0647 \u0628\u0627 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 \u0645\u062A\u062F \u0642\u062F\u0631\u062A\u0645\u0646\u062F GetBoundingClientRect \u0628\u0631\u0627\u06CC \u0646\u0627\u062F\u06CC\u062F\u0647 \u06AF\u0631\u0641\u062A\u0646 \u0627\u062E\u062A\u0644\u0627\u0644\u0627\u062A \u0627\u0633\u062A\u0627\u06CC\u0644
                    const dockRect = dock.getBoundingClientRect();
                    const elRect = el.getBoundingClientRect();
                    const offset = elRect.top - dockRect.top + dock.scrollTop;
                    hl.style.setProperty('--y', (offset - 12) + 'px'); 
                }
            };
            
            items.forEach((it) => {
                it.addEventListener('pointerenter', () => move(it));
                it.addEventListener('focus', () => move(it));
            });
            
            dock.addEventListener('pointerleave', () => {
                const activeMain = dock.querySelector('.sm-17__item[aria-current="page"]');
                const activeWrapper = dock.querySelector('.sm-17__wrapper.has-active .sm-17__item');
                move(activeMain || activeWrapper || items[0]);
            });
        }

        function renderHomeTiles() {
            let pinnedTutorials = [];
            let allTutorials = [];
            
            // \u062C\u062F\u0627 \u06A9\u0631\u062F\u0646 \u0622\u0645\u0648\u0632\u0634\u200C\u0647\u0627\u06CC \u067E\u06CC\u0646 \u0634\u062F\u0647 \u0627\u0632 \u0628\u0642\u06CC\u0647
            tutorials.forEach(item => {
                if (item.isHome) return;
                
                if (item.subItems) {
                    item.subItems.forEach(sub => {
                        const tutData = { id: sub.id, title: sub.title, icon: item.icon || "\u{1F4C4}", pinned: sub.pinned };
                        allTutorials.push(tutData);
                        if (sub.pinned) pinnedTutorials.push(tutData);
                    });
                } else if (item.file) {
                    const tutData = { id: item.id, title: item.title, icon: item.icon || "\u{1F4C4}", pinned: item.pinned };
                    allTutorials.push(tutData);
                    if (item.pinned) pinnedTutorials.push(tutData);
                }
            });

            // \u062D\u0630\u0641 \u0622\u0645\u0648\u0632\u0634\u200C\u0647\u0627\u06CC \u067E\u06CC\u0646 \u0634\u062F\u0647 \u0627\u0632 \u0644\u06CC\u0633\u062A \xAB\u0627\u062E\u06CC\u0631\u0627\u064B \u0627\u0636\u0627\u0641\u0647 \u0634\u062F\u0647\xBB \u0628\u0631\u0627\u06CC \u062C\u0644\u0648\u06AF\u06CC\u0631\u06CC \u0627\u0632 \u062A\u06A9\u0631\u0627\u0631
            const recentTutorials = allTutorials.filter(t => !t.pinned).reverse().slice(0, 15);

            let pageHtml = '';

            // \u0631\u0646\u062F\u0631 \u0628\u062E\u0634 \u067E\u06CC\u0646 \u0634\u062F\u0647\u200C\u0647\u0627
            if (pinnedTutorials.length > 0) {
                let pinnedHtml = '<div class="tile-grid">';
                pinnedTutorials.forEach(tut => {
                    pinnedHtml += \`
                        <a href="#\${tut.id}" class="tile pinned-tile" onclick="loadContent('\${tut.id}')">
                            <div class="tile-pinned-badge">\u{1F4CC}</div>
                            <div class="tile-icon">\${tut.icon}</div>
                            <div class="tile-title">\${tut.title}</div>
                        </a>
                    \`;
                });
                pinnedHtml += '</div><hr style="border:0; border-top:1px solid rgba(255,255,255,0.08); margin: 40px 0;">';
                
                pageHtml += \`
                    <h2 style="color: #fbbf24; margin-top:0; border:none; text-align:center;">\u0622\u0645\u0648\u0632\u0634\u200C\u0647\u0627\u06CC \u067E\u06CC\u0646\u200C\u0634\u062F\u0647</h2>
                    \${pinnedHtml}
                \`;
            }

            // \u0631\u0646\u062F\u0631 \u0628\u062E\u0634 \u0627\u062E\u06CC\u0631
            if (recentTutorials.length > 0) {
                let recentHtml = '<div class="tile-grid">';
                recentTutorials.forEach(tut => {
                    recentHtml += \`
                        <a href="#\${tut.id}" class="tile" onclick="loadContent('\${tut.id}')">
                            <div class="tile-icon">\${tut.icon}</div>
                            <div class="tile-title">\${tut.title}</div>
                        </a>
                    \`;
                });
                recentHtml += '</div>';
                
                pageHtml += \`
                    <h2 style="color: #a78bfa; margin-top:0; border:none; text-align:center;">\${pinnedTutorials.length > 0 ? '\u0633\u0627\u06CC\u0631 \u0622\u0645\u0648\u0632\u0634\u200C\u0647\u0627\u06CC \u0627\u062E\u06CC\u0631' : '\u0622\u0645\u0648\u0632\u0634\u200C\u0647\u0627\u06CC \u0627\u062E\u06CC\u0631'}</h2>
                    <p style="text-align:center; color: rgba(255,255,255,0.6); margin-bottom: 30px;">\u062F\u0633\u062A\u0631\u0633\u06CC \u0633\u0631\u06CC\u0639 \u0628\u0647 \u062C\u062F\u06CC\u062F\u062A\u0631\u06CC\u0646 \u06A9\u0627\u0646\u0641\u06CC\u06AF\u200C\u0647\u0627 \u0648 \u067E\u0646\u0644\u200C\u0647\u0627</p>
                    \${recentHtml}
                \`;
            }

            contentBody.innerHTML = pageHtml;
        }

        async function loadContent(id) {
            if (tutorials.length === 0) return;
            if (!id) id = window.location.hash.substring(1);
            
            let currentItem = null;

            for (const t of tutorials) {
                if (t.id === id && !t.subItems) { currentItem = t; break; } 
                else if (t.subItems) {
                    const subMatch = t.subItems.find(sub => sub.id === id);
                    if (subMatch) { currentItem = subMatch; break; }
                }
            }
            
            if (!currentItem) currentItem = tutorials[0];

            document.querySelectorAll('.sm-17__item').forEach(a => a.removeAttribute('aria-current'));
            document.querySelectorAll('.sm-17__sub-item').forEach(a => a.classList.remove('active'));
            document.querySelectorAll('.sm-17__wrapper').forEach(w => w.classList.remove('has-active'));

            const activeLink = document.getElementById("menu-" + currentItem.id);
            if(activeLink) {
                if(activeLink.classList.contains('sm-17__sub-item')) {
                    activeLink.classList.add('active');
                    const wrapper = activeLink.closest('.sm-17__wrapper');
                    if(wrapper) {
                        wrapper.classList.add('has-active');
                        wrapper.querySelector('.sm-17__sub-menu').classList.add('open');
                        wrapper.querySelector('.sm-17__item').classList.add('expanded');
                        
                        // \u062D\u0631\u06A9\u062A \u0647\u0627\u0644\u0647 \u0622\u0628\u06CC \u0628\u0631\u0627\u06CC \u0632\u06CC\u0631\u0645\u0646\u0648\u0647\u0627 \u0628\u0647 \u0635\u0648\u0631\u062A \u062F\u0642\u06CC\u0642
                        const dockRect = dock.getBoundingClientRect();
                        const elRect = wrapper.querySelector('.sm-17__item').getBoundingClientRect();
                        if(hl) hl.style.setProperty('--y', (elRect.top - dockRect.top + dock.scrollTop - 12) + 'px');
                    }
                } else {
                    activeLink.setAttribute('aria-current', 'page');
                    const dockRect = dock.getBoundingClientRect();
                    const elRect = activeLink.getBoundingClientRect();
                    if(hl) hl.style.setProperty('--y', (elRect.top - dockRect.top + dock.scrollTop - 12) + 'px');
                }
            }

            if (currentItem.isHome) {
                renderHomeTiles();
                return;
            }

            contentBody.innerHTML = '<div class="loading">\u062F\u0631 \u062D\u0627\u0644 \u062F\u0631\u06CC\u0627\u0641\u062A \u0641\u0627\u06CC\u0644 ' + currentItem.file + '...</div>';

            try {
                const response = await fetch(GITHUB_RAW_BASE + currentItem.file);
                if (!response.ok) throw new Error("\u0641\u0627\u06CC\u0644 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F");
                
                const text = await response.text();
                contentBody.innerHTML = marked.parse(text);
                enhanceCodeBlocks();
            } catch (error) {
                contentBody.innerHTML = \`<h2 style="color:#ef4444;">\u062E\u0637\u0627 \u062F\u0631 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC!</h2><p>\u0641\u0627\u06CC\u0644 <b>\${currentItem.file}</b> \u062F\u0631 \u06AF\u06CC\u062A\u200C\u0647\u0627\u0628 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F.</p>\`;
            }
        }

        function enhanceCodeBlocks() {
            const preTags = contentBody.querySelectorAll('pre');
            preTags.forEach(pre => {
                const wrapper = document.createElement('div');
                wrapper.className = 'code-wrapper';
                const btn = document.createElement('button');
                btn.className = 'copy-btn';
                btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg><span>\u06A9\u067E\u06CC</span>';
                
                btn.onclick = function() {
                    const code = pre.innerText;
                    navigator.clipboard.writeText(code).then(() => {
                        const span = btn.querySelector('span');
                        span.innerText = '\u06A9\u067E\u06CC \u0634\u062F!';
                        btn.classList.add('copied');
                        setTimeout(() => { span.innerText = '\u06A9\u067E\u06CC'; btn.classList.remove('copied'); }, 2000);
                    });
                };
                pre.parentNode.insertBefore(wrapper, pre);
                wrapper.appendChild(btn);
                wrapper.appendChild(pre);
            });
        }

        window.addEventListener('load', initApp);
        window.addEventListener('hashchange', () => loadContent());
    <\/script>
</body>
</html>
    `;
    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" }
    });
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
