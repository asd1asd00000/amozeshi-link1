آموزش جامع تک‌پورت کردن پنل پاسارگارد با HAProxy
این آموزش به شما کمک می‌کند تا پنل مدیریتی خود را روی یک دامنه (مثلاً main1.sportsee.ru) و لینک‌های سابسکریپشن کاربران را روی دامنه‌ای کاملاً متفاوت (مثلاً sub.karnovo.net.ru) قرار دهید. با این روش، دسترسی به پنل مدیریت از طریق لینک کاربران غیرممکن می‌شود.

توجه: در تمامی کدهای زیر، عبارات قرمز رنگ را با نام دامنه‌های واقعی خود جایگزین کنید.
پیش‌نیازها:
دو ساب‌دامنه در پنل DNS خود (مانند کلودفلر) ایجاد کنید و رکورد A آن‌ها را روی IP سرور خود تنظیم کنید.
تیک پروکسی (ابر نارنجی کلودفلر) را خاموش نگه دارید تا بتوانیم گواهینامه SSL دریافت کنیم (پس از پایان کار می‌توانید روشن کنید).
قدم اول: آزادسازی پورت‌ها و تغییرات در پاسارگارد
ابتدا باید SSL داخلی پاسارگارد را غیرفعال کنیم تا پورت‌ها برای HAProxy آزاد شوند. فایل تنظیمات را باز کنید:


کپی
nano /opt/pasarguard/.env
تغییرات زیر را اعمال کنید (خطوط SSL را با گذاشتن # کامنت کرده و دریافت پروکسی را فعال کنید):


کپی
# UVICORN_SSL_CERTFILE = "/var..."
# UVICORN_SSL_KEYFILE = "/var..."

UVICORN_PROXY_HEADERS = True
UVICORN_FORWARDED_ALLOW_IPS = "127.0.0.1"
پس از ذخیره (Ctrl+X و Y)، سرویس را ری‌استارت کنید:


کپی
pasarguard restart
قدم دوم: نصب پیش‌نیازها و دریافت گواهینامه SSL
نصب HAProxy و Certbot:


کپی
apt update && apt install -y haproxy certbot
دریافت گواهینامه مشترک (دامنه‌های خود را در دستور زیر جایگزین کنید):


کپی
certbot certonly --standalone -d main1.sportsee.ru -d sub.karnovo.net.ru
قدم سوم: تجمیع کلیدهای SSL برای HAProxy
ابتدا پوشه مربوط به گواهینامه‌های HAProxy را بسازید:


کپی
mkdir -p /etc/haproxy/certs
کلیدها را ادغام کنید (توجه کنید مسیر فایل‌ها همیشه به نام دامنه اول ایجاد می‌شود):


کپی
cat /etc/letsencrypt/live/main1.sportsee.ru/fullchain.pem     /etc/letsencrypt/live/main1.sportsee.ru/privkey.pem     > /etc/haproxy/certs/all_domains.pem
قدم چهارم: پیکربندی HAProxy
فایل تنظیمات HAProxy را باز کنید:


کپی
nano /etc/haproxy/haproxy.cfg
محتویات قبلی را پاک کرده و کدهای کامل زیر را قرار دهید (دامنه‌های خود را در بخش acl جایگزین کنید):


کپی
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


کپی
haproxy -c -f /etc/haproxy/haproxy.cfg
اگر خروجی Configuration file is valid بود، سرویس را ری‌استارت کنید:


کپی
systemctl restart haproxy
systemctl status haproxy
قدم ششم: تنظیمات نهایی در داشبورد پاسارگارد
۱. با آدرس جدید https://main1.sportsee.ru وارد پنل شوید.
۲. به بخش تنظیمات نودها (Nodes) بروید.
۳. فیلد دامنه سابسکریپشن (Subscription Domain) را روی https://sub.karnovo.net.ru تنظیم کنید.
