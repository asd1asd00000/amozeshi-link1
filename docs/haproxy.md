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
۳. فیلد <strong>دامنه سابسکریپشن (Subscription Domain)</strong> را روی <code>https://<span style="color: #ff4d4d;">sub.karnovo.net.ru</span></code> تنظیم کنید.</p>
