
Conversation with Gemini
<h1>آموزش جامع تک‌پورت کردن پنل پاسارگارد با HAProxy</h1>



<p>این آموزش به شما کمک می‌کند تا پنل مدیریتی خود را روی یک دامنه (مثلاً <code><span style="color: #ff4d4d;">main1.sportsee.ru</span></code>) و لینک‌های سابسکریپشن کاربران را روی دامنه‌ای کاملاً متفاوت (مثلاً <code><span style="color: #ff4d4d;">sub.karnovo.net.ru</span></code>) قرار دهید. با این روش، دسترسی به پنل مدیریت از طریق لینک کاربران غیرممکن می‌شود.</p>



<blockquote>

  <strong>توجه:</strong> در تمامی کدهای زیر، عبارات مربوط به نام دامنه‌ها را با دامنه‌های واقعی خود جایگزین کنید.

</blockquote>



<p><strong>پیش‌نیازها:</strong></p>

<ul>

  <li>دو ساب‌دامنه در پنل DNS خود (مانند کلودفلر) ایجاد کنید و رکورد A آن‌ها را روی IP سرور خود تنظیم کنید.</li>

  <li>تیک پروکسی (ابر نارنجی کلودفلر) را <strong>خاموش</strong> نگه دارید تا بتوانیم گواهینامه SSL دریافت کنیم (پس از پایان کار می‌توانید روشن کنید).</li>

</ul>



<hr>



<h2>قدم اول: آزادسازی پورت‌ها و تغییرات در پاسارگارد</h2>



<p>ابتدا باید SSL داخلی پاسارگارد را غیرفعال کنیم تا پورت‌ها برای HAProxy آزاد شوند. فایل تنظیمات را باز کنید:</p>



<pre><code>nano /opt/pasarguard/.env</code></pre>



<p>تغییرات زیر را اعمال کنید (خطوط SSL را با گذاشتن <code>#</code> کامنت کرده و دریافت پروکسی را فعال کنید):</p>



<pre><code># UVICORN_SSL_CERTFILE = "/var..."

# UVICORN_SSL_KEYFILE = "/var..."



UVICORN_PROXY_HEADERS = True

UVICORN_FORWARDED_ALLOW_IPS = "127.0.0.1"</code></pre>



<p>پس از ذخیره (<code>Ctrl+X</code> و <code>Y</code>)، سرویس را ری‌استارت کنید:</p>



<pre><code>pasarguard restart</code></pre>



<hr>



<h2>قدم دوم: نصب پیش‌نیازها و دریافت گواهینامه SSL</h2>



<p>نصب HAProxy و Certbot:</p>



<pre><code>apt update && apt install -y haproxy certbot</code></pre>



<p>دریافت گواهینامه مشترک (دامنه‌های خود را در دستور زیر جایگزین کنید):</p>



<pre><code>certbot certonly --standalone -d <span style="color: #ff4d4d;">main1.sportsee.ru</span> -d <span style="color: #ff4d4d;">sub.karnovo.net.ru</span></code></pre>



<hr>



<h2>قدم سوم: تجمیع کلیدهای SSL برای HAProxy</h2>



<p>ابتدا پوشه مربوط به گواهینامه‌های HAProxy را بسازید:</p>



<pre><code>mkdir -p /etc/haproxy/certs</code></pre>



<p>کلیدها را ادغام کنید (توجه کنید مسیر فایل‌ها همیشه به نام <strong>دامنه اول</strong> ایجاد می‌شود):</p>



<pre><code>cat /etc/letsencrypt/live/<span style="color: #ff4d4d;">main1.sportsee.ru</span>/fullchain.pem /etc/letsencrypt/live/<span style="color: #ff4d4d;">main1.sportsee.ru</span>/privkey.pem > /etc/haproxy/certs/all_domains.pem</code></pre>



<hr>



<h2>قدم چهارم: پیکربندی HAProxy</h2>



<p>فایل تنظیمات HAProxy را باز کنید:</p>



<pre><code>nano /etc/haproxy/haproxy.cfg</code></pre>



<p>محتویات قبلی را پاک کرده و کدهای کامل زیر را قرار دهید (دامنه‌های خود را در بخش <code>acl</code> جایگزین کنید):</p>



<pre><code>global

    log /dev/log local0

    log /dev/log local1 notice

    user haproxy

    group haproxy

    daemon



defaults

    log     global

    mode    http

    option  httplog

    option  dontlognull

    timeout connect 5000

    timeout client  50000

    timeout server  50000



frontend front

    mode http

    option httplog

    log global

    

    # Listen روی پورت‌های وب

    bind *:443 ssl crt /etc/haproxy/certs/

    bind *:80

    

    # لاگ کردن IP واقعی کاربران

    capture request header X-Forwarded-For len 15

    capture request header Host len 50

    log-format "%ci:%cp [%tr] %ft %b/%s %TR/%Tw/%Tc/%Tr/%Ta %ST %B %CC %CS %tsc %ac/%fc/%bc/%sc/%rc %sq/%bq %hr %hs %{+Q}r %U"

    

    # شناسایی دامنه‌ها

    acl host_panel hdr(host) -i <span style="color: #ff4d4d;">main1.sportsee.ru</span>

    acl host_sub   hdr(host) -i <span style="color: #ff4d4d;">sub.karnovo.net.ru</span>

    

    # هدایت ترافیک

    use_backend panel if host_panel

    use_backend sub   if host_sub

    default_backend deny_backend



backend panel

    mode http

    server srv1 127.0.0.1:8000



backend sub

    mode http

    # امنیت: فقط در صورتی اجازه عبور بده که کاربر دقیقا مسیر ساب را باز کرده باشد

    acl is_sub path_beg /sub/

    http-request deny if !is_sub

    server srv1 127.0.0.1:8000



backend deny_backend

    mode http

    http-request deny deny_status 403</code></pre>



<hr>



<h2>قدم پنجم: تست کانفیگ و استارت سرویس</h2>



<p>تست عدم وجود خطا در فایل کانفیگ:</p>



<pre><code>haproxy -c -f /etc/haproxy/haproxy.cfg</code></pre>



<p>اگر خروجی <code>Configuration file is valid</code> بود، سرویس را ری‌استارت کنید:</p>



<pre><code>systemctl restart haproxy

systemctl status haproxy</code></pre>



<hr>



<h2>قدم ششم: تنظیمات نهایی در داشبورد پاسارگارد</h2>



<p>۱. با آدرس جدید <code>https://<span style="color: #ff4d4d;">main1.sportsee.ru</span></code> وارد پنل شوید.<br>

۲. به بخش <strong>settings/subscriptions </strong> بروید.<br>

۳. فیلد <strong>دامنه سابسکریپشن (URL Prefix)</strong> را روی <code>https://<span style="color: #ff4d4d;">sub.karnovo.net.ru</span></code> تنظیم کنید.</p>





میخوام زیر تیتر

آموزش جامع تک‌پورت کردن پنل پاسارگارد با HAProxy

عبارت زیر اضافه بشه:

اسکریپت نصب خودکار

bash <(curl -Ls https://raw.githubusercontent.com/asd1asd00000/pasargaurd-Separation-panel-sub/main/separate.sh)

لینک با دکمه کپی ایجاد کن رنگ لینک هم سبز باشه 

کد HTML شما آماده است.

HTML icon
tutorial
 HTML 
Open
برای افزودن این بخش، یک تکه کد شامل دکمه‌ی کپی با طراحی زیبا و رنگ سبز (به همراه اسکریپت کپی در کلیپ‌بورد) تنظیم شده است که به خوبی در قالب سایت‌های راست‌چین (RTL) نمایش داده می‌شود.

می‌توانید کدهای زیر را به صورت کامل کپی کرده و جایگزین کدهای قبلی خود کنید (بخش مورد نظر شما دقیقا زیر تیتر اول قرار گرفته است):

HTML
<h1>آموزش جامع تک‌پورت کردن پنل پاسارگارد با HAProxy</h1>

<!-- بخش اضافه شده: اسکریپت نصب خودکار -->
<div style="margin: 20px 0; padding: 15px; background-color: #f7f9f8; border-right: 4px solid #4CAF50; border-radius: 5px; font-family: Tahoma, Arial, sans-serif;">
    <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">اسکریپت نصب خودکار:</p>
    <div style="display: flex; align-items: center; justify-content: space-between; background-color: #2b2b2b; padding: 12px; border-radius: 5px; direction: ltr;">
        <code id="installScript" style="color: #4CAF50; font-family: Consolas, monospace; font-size: 14px; word-break: break-all; margin-right: 15px;">bash &lt;(curl -Ls https://raw.githubusercontent.com/asd1asd00000/pasargaurd-Separation-panel-sub/main/separate.sh)</code>
        <button onclick="copyScript()" id="copyBtn" style="background-color: #4CAF50; color: #fff; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-family: Tahoma, Arial, sans-serif; white-space: nowrap; transition: 0.3s;">کپی</button>
    </div>
</div>

<script>
function copyScript() {
    const text = document.getElementById("installScript").innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById("copyBtn");
        btn.innerText = "کپی شد!";
        btn.style.backgroundColor = "#3e8e41";
        setTimeout(() => {
            btn.innerText = "کپی";
            btn.style.backgroundColor = "#4CAF50";
        }, 2000);
    }).catch(err => {
        console.error("خطا در کپی: ", err);
    });
}
</script>
<!-- پایان بخش اضافه شده -->

<p>این آموزش به شما کمک می‌کند تا پنل مدیریتی خود را روی یک دامنه (مثلاً <code><span style="color: #ff4d4d;">main1.sportsee.ru</span></code>) و لینک‌های سابسکریپشن کاربران را روی دامنه‌ای کاملاً متفاوت (مثلاً <code><span style="color: #ff4d4d;">sub.karnovo.net.ru</span></code>) قرار دهید. با این روش، دسترسی به پنل مدیریت از طریق لینک کاربران غیرممکن می‌شود.</p>

<blockquote>
  <strong>توجه:</strong> در تمامی کدهای زیر، عبارات مربوط به نام دامنه‌ها را با دامنه‌های واقعی خود جایگزین کنید.
</blockquote>

<p><strong>پیش‌نیازها:</strong></p>
<ul>
  <li>دو ساب‌دامنه در پنل DNS خود (مانند کلودفلر) ایجاد کنید و رکورد A آن‌ها را روی IP سرور خود تنظیم کنید.</li>
  <li>تیک پروکسی (ابر نارنجی کلودفلر) را <strong>خاموش</strong> نگه دارید تا بتوانیم گواهینامه SSL دریافت کنیم (پس از پایان کار می‌توانید روشن کنید).</li>
</ul>

<hr>

<h2>قدم اول: آزادسازی پورت‌ها و تغییرات در پاسارگارد</h2>

<p>ابتدا باید SSL داخلی پاسارگارد را غیرفعال کنیم تا پورت‌ها برای HAProxy آزاد شوند. فایل تنظیمات را باز کنید:</p>

<pre><code>nano /opt/pasarguard/.env</code></pre>

<p>تغییرات زیر را اعمال کنید (خطوط SSL را با گذاشتن <code>#</code> کامنت کرده و دریافت پروکسی را فعال کنید):</p>

<pre><code># UVICORN_SSL_CERTFILE = "/var..."
# UVICORN_SSL_KEYFILE = "/var..."

UVICORN_PROXY_HEADERS = True
UVICORN_FORWARDED_ALLOW_IPS = "127.0.0.1"</code></pre>

<p>پس از ذخیره (<code>Ctrl+X</code> و <code>Y</code>)، سرویس را ری‌استارت کنید:</p>

<pre><code>pasarguard restart</code></pre>

<hr>

<h2>قدم دوم: نصب پیش‌نیازها و دریافت گواهینامه SSL</h2>

<p>نصب HAProxy و Certbot:</p>

<pre><code>apt update && apt install -y haproxy certbot</code></pre>

<p>دریافت گواهینامه مشترک (دامنه‌های خود را در دستور زیر جایگزین کنید):</p>

<pre><code>certbot certonly --standalone -d <span style="color: #ff4d4d;">main1.sportsee.ru</span> -d <span style="color: #ff4d4d;">sub.karnovo.net.ru</span></code></pre>

<hr>

<h2>قدم سوم: تجمیع کلیدهای SSL برای HAProxy</h2>

<p>ابتدا پوشه مربوط به گواهینامه‌های HAProxy را بسازید:</p>

<pre><code>mkdir -p /etc/haproxy/certs</code></pre>

<p>کلیدها را ادغام کنید (توجه کنید مسیر فایل‌ها همیشه به نام <strong>دامنه اول</strong> ایجاد می‌شود):</p>

<pre><code>cat /etc/letsencrypt/live/<span style="color: #ff4d4d;">main1.sportsee.ru</span>/fullchain.pem /etc/letsencrypt/live/<span style="color: #ff4d4d;">main1.sportsee.ru</span>/privkey.pem > /etc/haproxy/certs/all_domains.pem</code></pre>

<hr>

<h2>قدم چهارم: پیکربندی HAProxy</h2>

<p>فایل تنظیمات HAProxy را باز کنید:</p>

<pre><code>nano /etc/haproxy/haproxy.cfg</code></pre>

<p>محتویات قبلی را پاک کرده و کدهای کامل زیر را قرار دهید (دامنه‌های خود را در بخش <code>acl</code> جایگزین کنید):</p>

<pre><code>global
    log /dev/log local0
    log /dev/log local1 notice
    user haproxy
    group haproxy
    daemon

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5000
    timeout client  50000
    timeout server  50000

frontend front
    mode http
    option httplog
    log global
    
    # Listen روی پورت‌های وب
    bind *:443 ssl crt /etc/haproxy/certs/
    bind *:80
    
    # لاگ کردن IP واقعی کاربران
    capture request header X-Forwarded-For len 15
    capture request header Host len 50
    log-format "%ci:%cp [%tr] %ft %b/%s %TR/%Tw/%Tc/%Tr/%Ta %ST %B %CC %CS %tsc %ac/%fc/%bc/%sc/%rc %sq/%bq %hr %hs %{+Q}r %U"
    
    # شناسایی دامنه‌ها
    acl host_panel hdr(host) -i <span style="color: #ff4d4d;">main1.sportsee.ru</span>
    acl host_sub   hdr(host) -i <span style="color: #ff4d4d;">sub.karnovo.net.ru</span>
    
    # هدایت ترافیک
    use_backend panel if host_panel
    use_backend sub   if host_sub
    default_backend deny_backend

backend panel
    mode http
    server srv1 127.0.0.1:8000

backend sub
    mode http
    # امنیت: فقط در صورتی اجازه عبور بده که کاربر دقیقا مسیر ساب را باز کرده باشد
    acl is_sub path_beg /sub/
    http-request deny if !is_sub
    server srv1 127.0.0.1:8000

backend deny_backend
    mode http
    http-request deny deny_status 403</code></pre>

<hr>

<h2>قدم پنجم: تست کانفیگ و استارت سرویس</h2>

<p>تست عدم وجود خطا در فایل کانفیگ:</p>

<pre><code>haproxy -c -f /etc/haproxy/haproxy.cfg</code></pre>

<p>اگر خروجی <code>Configuration file is valid</code> بود، سرویس را ری‌استارت کنید:</p>

<pre><code>systemctl restart haproxy
systemctl status haproxy</code></pre>

<hr>

<h2>قدم ششم: تنظیمات نهایی در داشبورد پاسارگارد</h2>

<p>۱. با آدرس جدید <code>https://<span style="color: #ff4d4d;">main1.sportsee.ru</span></code> وارد پنل شوید.<br>
۲. به بخش <strong>settings/subscriptions </strong> بروید.<br>
۳. فیلد <strong>دامنه سابسکریپشن (URL Prefix)</strong> را روی <code>https://<span style="color: #ff4d4d;">sub.karnovo.net.ru</span></code> تنظیم کنید.</p>
یعنی متوجه نشدی html نیست

فرمت فایل .md هستش

درستش کن؟؟؟

تغییرات زیر را اعمال کنید (خطوط SSL را با گذاشتن # کامنت کرده و دریافت پروکسی را فعال کنید):

Bash
# UVICORN_SSL_CERTFILE = "/var..."
# UVICORN_SSL_KEYFILE = "/var..."

UVICORN_PROXY_HEADERS = True
UVICORN_FORWARDED_ALLOW_IPS = "127.0.0.1"
پس از ذخیره (Ctrl+X و Y)، سرویس را ری‌استارت کنید:

Bash
pasarguard restart
قدم دوم: نصب پیش‌نیازها و دریافت گواهینامه SSL
نصب HAProxy و Certbot:

Bash
apt update && apt install -y haproxy certbot
دریافت گواهینامه مشترک (دامنه‌های خود را در دستور زیر جایگزین کنید):

Bash
certbot certonly --standalone -d main1.sportsee.ru -d sub.karnovo.net.ru
قدم سوم: تجمیع کلیدهای SSL برای HAProxy
ابتدا پوشه مربوط به گواهینامه‌های HAProxy را بسازید:

Bash
mkdir -p /etc/haproxy/certs
کلیدها را ادغام کنید (توجه کنید مسیر فایل‌ها همیشه به نام دامنه اول ایجاد می‌شود):

Bash
cat /etc/letsencrypt/live/main1.sportsee.ru/fullchain.pem /etc/letsencrypt/live/main1.sportsee.ru/privkey.pem > /etc/haproxy/certs/all_domains.pem
قدم چهارم: پیکربندی HAProxy
فایل تنظیمات HAProxy را باز کنید:

Bash
nano /etc/haproxy/haproxy.cfg
محتویات قبلی را پاک کرده و کدهای کامل زیر را قرار دهید (دامنه‌های خود را در بخش acl جایگزین کنید):

Code snippet
global
    log /dev/log local0
    log /dev/log local1 notice
    user haproxy
    group haproxy
    daemon

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5000
    timeout client  50000
    timeout server  50000

frontend front
    mode http
    option httplog
    log global
    
    # Listen روی پورت‌های وب
    bind *:443 ssl crt /etc/haproxy/certs/
    bind *:80
    
    # لاگ کردن IP واقعی کاربران
    capture request header X-Forwarded-For len 15
    capture request header Host len 50
    log-format "%ci:%cp [%tr] %ft %b/%s %TR/%Tw/%Tc/%Tr/%Ta %ST %B %CC %CS %tsc %ac/%fc/%bc/%sc/%rc %sq/%bq %hr %hs %{+Q}r %U"
    
    # شناسایی دامنه‌ها
    acl host_panel hdr(host) -i main1.sportsee.ru
    acl host_sub   hdr(host) -i sub.karnovo.net.ru
    
    # هدایت ترافیک
    use_backend panel if host_panel
    use_backend sub   if host_sub
    default_backend deny_backend

backend panel
    mode http
    server srv1 127.0.0.1:8000

backend sub
    mode http
    # امنیت: فقط در صورتی اجازه عبور بده که کاربر دقیقا مسیر ساب را باز کرده باشد
    acl is_sub path_beg /sub/
    http-request deny if !is_sub
    server srv1 127.0.0.1:8000

backend deny_backend
    mode http
    http-request deny deny_status 403
قدم پنجم: تست کانفیگ و استارت سرویس
تست عدم وجود خطا در فایل کانفیگ:

Bash
haproxy -c -f /etc/haproxy/haproxy.cfg
اگر خروجی Configuration file is valid بود، سرویس را ری‌استارت کنید:

Bash
systemctl restart haproxy
systemctl status haproxy
قدم ششم: تنظیمات نهایی در داشبورد پاسارگارد
۱. با آدرس جدید https://main1.sportsee.ru وارد پنل شوید.


۲. به بخش settings/subscriptions بروید.


۳. فیلد دامنه سابسکریپشن (URL Prefix) را روی https://sub.karnovo.net.ru تنظیم کنید.
"""

with open("tutorial.md", "w", encoding="utf-8") as f:
f.write(markdown_content)

print("Markdown file generated")


```text?code_stdout&code_event_index=1
Markdown file generated

متوجه شدم. بابت اشتباه عذرخواهی می‌کنم. فایل شما را با فرمت Markdown (.md) آماده کردم.
در مارک‌داون دکمه‌های کپی و اسکریپت‌های جاوااسکریپت به درستی کار نمی‌کنند (مگر اینکه پلتفرم میزبان آن را پشتیبانی کند)، بنابراین کد را به صورت ترکیبی از HTML و Markdown قرار دادم تا بهینه‌ترین حالت برای نمایش در GitHub یا سایر پلتفرم‌ها باشد.

فایل مارک‌داون شما آماده است:

MD icon
tutorial
 MD 
Open
همچنین می‌توانید کد زیر را مستقیماً کپی و استفاده کنید:

Markdown
# آموزش جامع تک‌پورت کردن پنل پاسارگارد با HAProxy

<div align="right" dir="rtl">
    <p><b>اسکریپت نصب خودکار:</b></p>
    <code>bash <(curl -Ls https://raw.githubusercontent.com/asd1asd00000/pasargaurd-Separation-panel-sub/main/separate.sh)</code>
</div>
<br>

این آموزش به شما کمک می‌کند تا پنل مدیریتی خود را روی یک دامنه (مثلاً `<span style="color: #ff4d4d;">main1.sportsee.ru</span>`) و لینک‌های سابسکریپشن کاربران را روی دامنه‌ای کاملاً متفاوت (مثلاً `<span style="color: #ff4d4d;">sub.karnovo.net.ru</span>`) قرار دهید. با این روش، دسترسی به پنل مدیریت از طریق لینک کاربران غیرممکن می‌شود.

> **توجه:** در تمامی کدهای زیر، عبارات مربوط به نام دامنه‌ها را با دامنه‌های واقعی خود جایگزین کنید.

**پیش‌نیازها:**
*   دو ساب‌دامنه در پنل DNS خود (مانند کلودفلر) ایجاد کنید و رکورد A آن‌ها را روی IP سرور خود تنظیم کنید.
*   تیک پروکسی (ابر نارنجی کلودفلر) را **خاموش** نگه دارید تا بتوانیم گواهینامه SSL دریافت کنیم (پس از پایان کار می‌توانید روشن کنید).

---

## قدم اول: آزادسازی پورت‌ها و تغییرات در پاسارگارد

ابتدا باید SSL داخلی پاسارگارد را غیرفعال کنیم تا پورت‌ها برای HAProxy آزاد شوند. فایل تنظیمات را باز کنید:

```bash
nano /opt/pasarguard/.env
تغییرات زیر را اعمال کنید (خطوط SSL را با گذاشتن # کامنت کرده و دریافت پروکسی را فعال کنید):

Bash
# UVICORN_SSL_CERTFILE = "/var..."
# UVICORN_SSL_KEYFILE = "/var..."

UVICORN_PROXY_HEADERS = True
UVICORN_FORWARDED_ALLOW_IPS = "127.0.0.1"
پس از ذخیره (Ctrl+X و Y)، سرویس را ری‌استارت کنید:

Bash
pasarguard restart
قدم دوم: نصب پیش‌نیازها و دریافت گواهینامه SSL
نصب HAProxy و Certbot:

Bash
apt update && apt install -y haproxy certbot
دریافت گواهینامه مشترک (دامنه‌های خود را در دستور زیر جایگزین کنید):

Bash
certbot certonly --standalone -d main1.sportsee.ru -d sub.karnovo.net.ru
قدم سوم: تجمیع کلیدهای SSL برای HAProxy
ابتدا پوشه مربوط به گواهینامه‌های HAProxy را بسازید:

Bash
mkdir -p /etc/haproxy/certs
کلیدها را ادغام کنید (توجه کنید مسیر فایل‌ها همیشه به نام دامنه اول ایجاد می‌شود):

Bash
cat /etc/letsencrypt/live/main1.sportsee.ru/fullchain.pem /etc/letsencrypt/live/main1.sportsee.ru/privkey.pem > /etc/haproxy/certs/all_domains.pem
قدم چهارم: پیکربندی HAProxy
فایل تنظیمات HAProxy را باز کنید:

Bash
nano /etc/haproxy/haproxy.cfg
محتویات قبلی را پاک کرده و کدهای کامل زیر را قرار دهید (دامنه‌های خود را در بخش acl جایگزین کنید):

Code snippet
global
    log /dev/log local0
    log /dev/log local1 notice
    user haproxy
    group haproxy
    daemon

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5000
    timeout client  50000
    timeout server  50000

frontend front
    mode http
    option httplog
    log global
    
    # Listen روی پورت‌های وب
    bind *:443 ssl crt /etc/haproxy/certs/
    bind *:80
    
    # لاگ کردن IP واقعی کاربران
    capture request header X-Forwarded-For len 15
    capture request header Host len 50
    log-format "%ci:%cp [%tr] %ft %b/%s %TR/%Tw/%Tc/%Tr/%Ta %ST %B %CC %CS %tsc %ac/%fc/%bc/%sc/%rc %sq/%bq %hr %hs %{+Q}r %U"
    
    # شناسایی دامنه‌ها
    acl host_panel hdr(host) -i main1.sportsee.ru
    acl host_sub   hdr(host) -i sub.karnovo.net.ru
    
    # هدایت ترافیک
    use_backend panel if host_panel
    use_backend sub   if host_sub
    default_backend deny_backend

backend panel
    mode http
    server srv1 127.0.0.1:8000

backend sub
    mode http
    # امنیت: فقط در صورتی اجازه عبور بده که کاربر دقیقا مسیر ساب را باز کرده باشد
    acl is_sub path_beg /sub/
    http-request deny if !is_sub
    server srv1 127.0.0.1:8000

backend deny_backend
    mode http
    http-request deny deny_status 403
قدم پنجم: تست کانفیگ و استارت سرویس
تست عدم وجود خطا در فایل کانفیگ:

Bash
haproxy -c -f /etc/haproxy/haproxy.cfg
اگر خروجی Configuration file is valid بود، سرویس را ری‌استارت کنید:

Bash
systemctl restart haproxy
systemctl status haproxy
قدم ششم: تنظیمات نهایی در داشبورد پاسارگارد
۱. با آدرس جدید https://main1.sportsee.ru وارد پنل شوید.


۲. به بخش settings/subscriptions بروید.


۳. فیلد دامنه سابسکریپشن (URL Prefix) را روی https://sub.karnovo.net.ru تنظیم کنید.




Gemini is AI and can make mistakes.

# آموزش جامع تک‌پورت کردن پنل پاسارگارد با HAProxy

<div align="right" dir="rtl">
    <p><b>اسکریپت نصب خودکار:</b></p>
    <code>bash <(curl -Ls https://raw.githubusercontent.com/asd1asd00000/pasargaurd-Separation-panel-sub/main/separate.sh)</code>
</div>
<br>

این آموزش به شما کمک می‌کند تا پنل مدیریتی خود را روی یک دامنه (مثلاً `<span style="color: #ff4d4d;">main1.sportsee.ru</span>`) و لینک‌های سابسکریپشن کاربران را روی دامنه‌ای کاملاً متفاوت (مثلاً `<span style="color: #ff4d4d;">sub.karnovo.net.ru</span>`) قرار دهید. با این روش، دسترسی به پنل مدیریت از طریق لینک کاربران غیرممکن می‌شود.

> **توجه:** در تمامی کدهای زیر، عبارات مربوط به نام دامنه‌ها را با دامنه‌های واقعی خود جایگزین کنید.

**پیش‌نیازها:**
*   دو ساب‌دامنه در پنل DNS خود (مانند کلودفلر) ایجاد کنید و رکورد A آن‌ها را روی IP سرور خود تنظیم کنید.
*   تیک پروکسی (ابر نارنجی کلودفلر) را **خاموش** نگه دارید تا بتوانیم گواهینامه SSL دریافت کنیم (پس از پایان کار می‌توانید روشن کنید).

---

## قدم اول: آزادسازی پورت‌ها و تغییرات در پاسارگارد

ابتدا باید SSL داخلی پاسارگارد را غیرفعال کنیم تا پورت‌ها برای HAProxy آزاد شوند. فایل تنظیمات را باز کنید:

```bash
nano /opt/pasarguard/.env
```

تغییرات زیر را اعمال کنید (خطوط SSL را با گذاشتن `#` کامنت کرده و دریافت پروکسی را فعال کنید):

```bash
# UVICORN_SSL_CERTFILE = "/var..."
# UVICORN_SSL_KEYFILE = "/var..."

UVICORN_PROXY_HEADERS = True
UVICORN_FORWARDED_ALLOW_IPS = "127.0.0.1"
```

پس از ذخیره (`Ctrl+X` و `Y`)، سرویس را ری‌استارت کنید:

```bash
pasarguard restart
```

---

## قدم دوم: نصب پیش‌نیازها و دریافت گواهینامه SSL

نصب HAProxy و Certbot:

```bash
apt update && apt install -y haproxy certbot
```

دریافت گواهینامه مشترک (دامنه‌های خود را در دستور زیر جایگزین کنید):

```bash
certbot certonly --standalone -d main1.sportsee.ru -d sub.karnovo.net.ru
```

---

## قدم سوم: تجمیع کلیدهای SSL برای HAProxy

ابتدا پوشه مربوط به گواهینامه‌های HAProxy را بسازید:

```bash
mkdir -p /etc/haproxy/certs
```

کلیدها را ادغام کنید (توجه کنید مسیر فایل‌ها همیشه به نام **دامنه اول** ایجاد می‌شود):

```bash
cat /etc/letsencrypt/live/main1.sportsee.ru/fullchain.pem /etc/letsencrypt/live/main1.sportsee.ru/privkey.pem > /etc/haproxy/certs/all_domains.pem
```

---

## قدم چهارم: پیکربندی HAProxy

فایل تنظیمات HAProxy را باز کنید:

```bash
nano /etc/haproxy/haproxy.cfg
```

محتویات قبلی را پاک کرده و کدهای کامل زیر را قرار دهید (دامنه‌های خود را در بخش `acl` جایگزین کنید):

```haproxy
global
    log /dev/log local0
    log /dev/log local1 notice
    user haproxy
    group haproxy
    daemon

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5000
    timeout client  50000
    timeout server  50000

frontend front
    mode http
    option httplog
    log global
    
    # Listen روی پورت‌های وب
    bind *:443 ssl crt /etc/haproxy/certs/
    bind *:80
    
    # لاگ کردن IP واقعی کاربران
    capture request header X-Forwarded-For len 15
    capture request header Host len 50
    log-format "%ci:%cp [%tr] %ft %b/%s %TR/%Tw/%Tc/%Tr/%Ta %ST %B %CC %CS %tsc %ac/%fc/%bc/%sc/%rc %sq/%bq %hr %hs %{+Q}r %U"
    
    # شناسایی دامنه‌ها
    acl host_panel hdr(host) -i main1.sportsee.ru
    acl host_sub   hdr(host) -i sub.karnovo.net.ru
    
    # هدایت ترافیک
    use_backend panel if host_panel
    use_backend sub   if host_sub
    default_backend deny_backend

backend panel
    mode http
    server srv1 127.0.0.1:8000

backend sub
    mode http
    # امنیت: فقط در صورتی اجازه عبور بده که کاربر دقیقا مسیر ساب را باز کرده باشد
    acl is_sub path_beg /sub/
    http-request deny if !is_sub
    server srv1 127.0.0.1:8000

backend deny_backend
    mode http
    http-request deny deny_status 403
```

---

## قدم پنجم: تست کانفیگ و استارت سرویس

تست عدم وجود خطا در فایل کانفیگ:

```bash
haproxy -c -f /etc/haproxy/haproxy.cfg
```

اگر خروجی `Configuration file is valid` بود، سرویس را ری‌استارت کنید:

```bash
systemctl restart haproxy
systemctl status haproxy
```

---

## قدم ششم: تنظیمات نهایی در داشبورد پاسارگارد

۱. با آدرس جدید `https://main1.sportsee.ru` وارد پنل شوید.<br>
۲. به بخش **settings/subscriptions** بروید.<br>
۳. فیلد **دامنه سابسکریپشن (URL Prefix)** را روی `https://sub.karnovo.net.ru` تنظیم کنید.
tutorial.md
Displaying tutorial.md.
