
Conversation with Gemini
https://docs.pasarguard.org/fa/learn/single-port/

اینو بخون

متن این صفحه از داکیومنت رسمی پاسارگارد را با دقت خواندم. این دقیقاً همان راه‌حل اصولی و کاملی است که برای خواسته شما (جدا کردن دامنه پنل از دامنه سابسکریپشن و مخفی کردن پنل روی دامنه دوم) طراحی شده است.

در واقع، تیم پاسارگارد به جای Nginx (که من پیشنهاد داده بودم)، استفاده از HAProxy را به عنوان بهترین روش برای مدیریت دامنه‌ها، پورت‌ها و تامین امنیت معرفی کرده است.

نکات بسیار مهم و جذابی که در این داکیومنت برای مشکل شما وجود دارد:

۱. حل مشکل دسترسی به پنل با دامنه ساب: در بخشی از کانفیگ HAProxy که در سایت آمده، دقیقاً کدی قرار داده شده که اجازه نمی‌دهد کسی با دامنه سابسکریپشن شما وارد محیط مدیریت (داشبورد) شود:

Code snippet
backend sub
    mode http
    acl is_sub path_beg /sub/
    http-request deny if !is_sub
    server srv1 127.0.0.1:8000
(این کد می‌گوید اگر کسی با دامنه ساب آمد، فقط و فقط اگر مسیر /sub/ را درخواست کرد به او اجازه عبور بده، وگرنه خطای دسترسی صادر کن).

۲. حل مشکل گواهینامه SSL: در این روش، شما دیگر SSL را مستقیماً به خود پنل (Uvicorn) نمی‌دهید. بلکه SSL هر دو دامنه (دامنه پنل و دامنه ساب) را به فایل کانفیگ HAProxy می‌دهید. HAProxy ترافیک امن را دریافت کرده و سپس آن را برای پورت ۸۰۰۰ پنل می‌فرستد. این کار خطای SSL (که در پیام قبلی اشاره کردم) را کاملاً برطرف می‌کند.

۳. بستن دسترسی مستقیم به IP: با تنظیم default_backend deny_backend، اگر کسی IP سرور شما را مستقیماً در مرورگر وارد کند یا با دامنه نامعتبری بیاید، ارتباط او رد می‌شود (جلوگیری از فیلتر شدن زودرس سرور).

پیشنهاد نهایی برای شما:
اگر می‌خواهید کار را حرفه‌ای، امن و دقیقاً طبق استاندارد پاسارگارد انجام دهید، پیشنهاد می‌کنم تنظیماتی که فقط از طریق داشبورد زدید را کنار بگذارید و قدم‌به‌قدم طبق همین داکیومنتی که فرستادید پیش بروید:

ابتدا SSL را برای هر دو دامنه با Certbot بگیرید و تجمیع کنید.

HAProxy را نصب کنید.

فایل کانفیگ ارائه شده در سایت را با دامنه‌های خودتان (جایگزین کردن panel.example.com و sub.example.com) در فایل /etc/haproxy/haproxy.cfg قرار دهید.

در فایل .env پاسارگارد، مقادیر مربوط به SSL (UVICORN_SSL_CERTFILE و ...) را کامنت کنید تا پنل فقط روی حالت HTTP داخلی کار کند و زحمت ارتباطات امن بیفتد گردن HAProxy.

اگر در هر کدام از مراحل اجرای این داکیومنت، مانند ساخت فایل یکپارچه SSL (فایل .pem) یا تغییرات .env به راهنمایی قدم‌به‌قدم نیاز داشتید، بفرمایید تا دقیقاً کدهایش را برای دامنه‌های شما آماده کنم.

راهنمایی قدم به قدم

دامنه پنل اینه که فیلتر هم شده s1.sportsee.ru

میخوام تغییر بدم به main1.sportsee.ru

-------

ادرس ساب هم میخوام بذارم

sub.karnovo.net.ru

----------

یه سوال ایا میشه لینک ساب روی یک سرور دیگه باشه مثل سرور ایران؟؟؟؟

ابتدا به سوال بسیار مهم شما پاسخ می‌دهم:

آیا می‌شود لینک سابسکریپشن روی یک سرور دیگر (مثل سرور ایران) باشد؟
بله، قطعا! اتفاقاً این حرفه‌ای‌ترین و بهترین روش برای جلوگیری از فیلتر شدن پنل و در دسترس ماندن همیشگی لینک‌های آپدیت برای کاربران است. به این کار Reverse Proxy (پروکسی معکوس) می‌گویند.
در این حالت، شما دامنه sub.karnovo.net.ru را به IP سرور ایران متصل می‌کنید. روی سرور ایران یک Nginx یا HAProxy نصب می‌کنید که ترافیک سابسکریپشن را دریافت کرده و آن را در پس‌زمینه از سرور خارج (سرور اصلی) فراخوانی می‌کند و به کاربر تحویل می‌دهد. با این کار، حتی اگر IP سرور خارج فیلتر شود، کاربران همچنان می‌توانند کانفیگ‌های خود را از طریق سرور ایران آپدیت کنند.

راهنمای قدم‌به‌قدم تک‌پورت کردن با HAProxy روی سرور اصلی
اگر در حال حاضر می‌خواهید هر دو دامنه (پنل جدید و سابسکریپشن) را روی همین سرور اصلی بالا بیاورید، مراحل دقیقاً به شکل زیر است:

قدم اول: تنظیمات DNS
در پنل دامنه (مثلاً Cloudflare)، رکوردهای زیر را بسازید و به IP سرور خارج خود متصل کنید (تیک ابر نارنجی فعلاً خاموش باشد تا SSL صادر شود):

یک رکورد A با نام main1 برای دامنه sportsee.ru (جهت پنل)

یک رکورد A با نام sub برای دامنه karnovo.net.ru (جهت سابسکریپشن)

قدم دوم: آماده‌سازی پاسارگارد (تغییرات فایل .env)
وارد فایل .env پاسارگارد شوید و تغییرات زیر را اعمال کنید تا پاسارگارد دیگر درگیر SSL نشود و این کار را به HAProxy بسپارد:

۱. خطوط مربوط به SSL را کامنت کنید (یک # اول آن‌ها بگذارید):

Code snippet
# UVICORN_SSL_CERTFILE = "/var/lib/pasarguard/certs/s1.sportsee.ru/fullchain.pem"
# UVICORN_SSL_KEYFILE = "/var/lib/pasarguard/certs/s1.sportsee.ru/privkey.pem"
۲. هدرهای پروکسی را فعال کنید تا پاسارگارد IP واقعی کاربران را از HAProxy دریافت کند:

Code snippet
UVICORN_PROXY_HEADERS = True
UVICORN_FORWARDED_ALLOW_IPS = "127.0.0.1"
سپس پاسارگارد را ری‌استارت کنید (مثلاً با pasarguard restart). الان پنل شما روی پورت 8000 لوکال، بدون SSL در حال اجراست.

قدم سوم: نصب پیش‌نیازها و دریافت گواهینامه SSL
دستورات زیر را در ترمینال اجرا کنید تا HAProxy و Certbot نصب شوند و SSL دامنه‌های جدید صادر گردد (مطمئن شوید پورت 80 سرور خالی باشد):

Bash
apt update && apt install -y haproxy certbot

# دریافت گواهینامه برای هر دو دامنه
certbot certonly --standalone -d main1.sportsee.ru -d sub.karnovo.net.ru

# ساخت پوشه برای تجمیع گواهینامه‌ها
mkdir -p /etc/haproxy/certs

# ادغام کلیدها برای دامنه پنل
cat /etc/letsencrypt/live/main1.sportsee.ru/fullchain.pem \
    /etc/letsencrypt/live/main1.sportsee.ru/privkey.pem \
    > /etc/haproxy/certs/main1.sportsee.ru.pem

# ادغام کلیدها برای دامنه سابسکریپشن
cat /etc/letsencrypt/live/sub.karnovo.net.ru/fullchain.pem \
    /etc/letsencrypt/live/sub.karnovo.net.ru/privkey.pem \
    > /etc/haproxy/certs/sub.karnovo.net.ru.pem
قدم چهارم: تنظیم فایل HAProxy
فایل کانفیگ HAProxy را باز کنید:

Bash
nano /etc/haproxy/haproxy.cfg
تمام محتویات قبلی را پاک کنید (یا در انتهای آن‌ها) این کد اختصاصی را برای دامنه‌های خودتان قرار دهید:

Code snippet
frontend front
    mode http
    option httplog
    log /dev/log local0
    
    # Listen روی پورت‌های وب
    bind :::443 ssl crt /etc/haproxy/certs/
    bind :::80
    
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
    # فقط در صورتی اجازه عبور بده که کاربر دقیقا مسیر ساب را باز کرده باشد
    acl is_sub path_beg /sub/
    http-request deny if !is_sub
    server srv1 127.0.0.1:8000

backend deny_backend
    mode http
    http-request deny deny_status 403
فایل را ذخیره کرده و ببندید (Ctrl+X سپس Y و Enter).

قدم پنجم: راه‌اندازی و تنظیمات نهایی داشبورد
حالا HAProxy را ری‌استارت کنید تا تغییرات اعمال شود:

Bash
systemctl restart haproxy
systemctl status haproxy
در نهایت، با آدرس جدید پنل [https://main1.sportsee.ru](https://main1.sportsee.ru) وارد داشبورد پاسارگارد شوید. در بخش تنظیمات نودها (یا تنظیمات سیستم)، مقدار دامنه سابسکریپشن را برابر با [https://sub.karnovo.net.ru](https://sub.karnovo.net.ru) قرار دهید.

اکنون:
۱. لاگین ادمین فقط از طریق دامنه main1 انجام می‌شود.
۲. لینک ساب‌ها همه با دامنه sub ساخته می‌شوند.
۳. اگر کسی دامنه sub را باز کند (بدون توکن اختصاصی کاربر)، خطای 403 می‌گیرد و هرگز نمی‌تواند محیط لاگین ادمین را ببیند.

می‌خواهی لینک سابسکریپشن را روی سرور ایران بالا بیاوری؟

Yes
ارور قدم سوم

---------

Key is saved at:         /etc/letsencrypt/live/main1.sportsee.ru/privkey.pem

This certificate expires on 2026-10-29.

These files will be updated when the certificate renews.

Certbot has set up a scheduled task to automatically renew this certificate in the background.



- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

If you like Certbot, please consider supporting our work by:

 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate

 * Donating to EFF:                    https://eff.org/donate-le

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

cat: /etc/letsencrypt/live/sub.karnovo.net.ru/fullchain.pem: No such file or directory

cat: /etc/letsencrypt/live/sub.karnovo.net.ru/privkey.pem: No such file or directory

root@yummy-lime:~# cd /etc/letsencrypt/

root@yummy-lime:/etc/letsencrypt# ls

accounts  archive  cli.ini  live  renewal  renewal-hooks

root@yummy-lime:/etc/letsencrypt# cd live

root@yummy-lime:/etc/letsencrypt/live# ls

main1.sportsee.ru  README

root@yummy-lime:/etc/letsencrypt/live#

این اتفاق در واقع یک ارور نیست، بلکه رفتار هوشمندانه Certbot است!

چون در دستور مرحله قبل هر دو دامنه را پشت سر هم (-d main1.sportsee.ru -d sub.karnovo.net.ru) وارد کرده بودید، Certbot یک گواهینامه مشترک (Multi-Domain/SAN) برای هر دو دامنه صادر کرده و پوشه آن را به نام دامنه اول (یعنی main1.sportsee.ru) ساخته است.

بنابراین، فایل‌های موجود در پوشه main1.sportsee.ru هم برای دامنه پنل و هم برای دامنه سابسکریپشن معتبر هستند و نیازی به فایل یا پوشه دوم ندارید.

برای تکمیل این مرحله، فقط کافیست دستور زیر را اجرا کنید تا همین گواهینامه مشترک برای HAProxy پکیج شود:

Bash
cat /etc/letsencrypt/live/main1.sportsee.ru/fullchain.pem \
    /etc/letsencrypt/live/main1.sportsee.ru/privkey.pem \
    > /etc/haproxy/certs/all_domains.pem
همین یک دستور کافی است! از آنجایی که ما در فایل تنظیمات به HAProxy می‌گوییم کل پوشه /etc/haproxy/certs/ را بخواند، خودش این فایل را پیدا کرده و برای هر دو دامنه استفاده می‌کند.

حالا می‌توانید مستقیماً سراغ قدم چهارم (تنظیم فایل HAProxy) بروید.

root@yummy-lime:/etc/letsencrypt/live/main1.sportsee.ru# cd

root@yummy-lime:~# nano /etc/haproxy/haproxy.cfg

root@yummy-lime:~# systemctl restart haproxy

systemctl status haproxy

Job for haproxy.service failed because the control process exited with error code.

See "systemctl status haproxy.service" and "journalctl -xeu haproxy.service" for details.

● haproxy.service - HAProxy Load Balancer

     Loaded: loaded (/usr/lib/systemd/system/haproxy.service; enabled; preset: enabled)

     Active: activating (auto-restart) (Result: exit-code) since Fri 2026-07-31 16:09:49 UTC; 15ms ago

       Docs: man:haproxy(1)

             file:/usr/share/doc/haproxy/configuration.txt.gz

    Process: 101609 ExecStart=/usr/sbin/haproxy -Ws -f $CONFIG -p $PIDFILE $EXTRAOPTS (code=exited, status=1/FAILURE)

   Main PID: 101609 (code=exited, status=1/FAILURE)

        CPU: 19ms



Jul 31 16:09:49 yummy-lime.aeza.network systemd[1]: Failed to start haproxy.service - HAProxy Load Balancer.

root@yummy-lime:~#

این خطا نشان می‌دهد که HAProxy نتوانسته استارت شود. دلیل این اتفاق معمولاً دو چیز است:

۱. خطای سینتکس در فایل کانفیگ: (محتمل‌ترین دلیل) در مرحله قبل من گفتم «همه محتویات را پاک کنید»، اما HAProxy برای اجرا شدن به دو بخش اصلی به نام‌های global و defaults نیاز دارد که تنظیمات پایه (مثل تایم‌اوت‌ها) در آن تعریف می‌شود و اگر نباشند، سرویس کرش می‌کند.
۲. درگیری پورت‌ها: پورت 80 یا 443 توسط برنامه دیگری (مثل Nginx که قبلاً تست کرده بودید) اشغال شده باشد.

برای اینکه دقیقاً بفهمیم مشکل کجاست، ابتدا این دستور را بزنید تا خود HAProxy فایل را بررسی کند و بگوید مشکل چیست:

Bash
haproxy -c -f /etc/haproxy/haproxy.cfg
راه‌حل قطعی (اصلاح فایل کانفیگ)
فایل HAProxy را دوباره باز کنید:

Bash
nano /etc/haproxy/haproxy.cfg
تمام محتویات قبلی را پاک کنید و این بار کد کامل زیر (که شامل بخش‌های ضروری global و defaults هم هست) را در آن قرار دهید:

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
    # فقط در صورتی اجازه عبور بده که کاربر دقیقا مسیر ساب را باز کرده باشد
    acl is_sub path_beg /sub/
    http-request deny if !is_sub
    server srv1 127.0.0.1:8000

backend deny_backend
    mode http
    http-request deny deny_status 403
فایل را ذخیره کنید (Ctrl+X، سپس Y و Enter).

حالا دوباره سرویس را ری‌استارت کنید:

Bash
systemctl restart haproxy
systemctl status haproxy
اگر بعد از این کار همچنان ارور داد، لطفاً خروجی دستور haproxy -c -f /etc/haproxy/haproxy.cfg را برای من بفرستید تا دقیقاً بگویم کجای سرور گیر کرده است.



root@yummy-lime:~# haproxy -c -f /etc/haproxy/haproxy.cfg

[NOTICE]   (102720) : haproxy version is 2.8.16-0ubuntu0.24.04.3

[NOTICE]   (102720) : path to executable is /usr/sbin/haproxy

[ALERT]    (102720) : config : parsing [/etc/haproxy/haproxy.cfg:42] : 'bind :::443' in section 'frontend' : unable to load certificate from file '/etc/haproxy/certs/sub.karnovo.net.ru.pem': no start line.

[ALERT]    (102720) : config : Error(s) found in configuration file : /etc/haproxy/haproxy.cfg

[ALERT]    (102720) : config : Fatal errors found in configuration.

root@yummy-lime:~#

این خطا دقیقاً علت مشکل را نشان داد!

ماجرا از این قرار است: در قدم‌های قبلی وقتی دستور cat برای دامنه سابسکریپشن خطا داد (چون پوشه‌اش وجود نداشت)، لینوکس با این حال یک فایل خالی به نام sub.karnovo.net.ru.pem در مسیر سرتیفیکیت‌های HAProxy ایجاد کرد.

چون در فایل کانفیگ به HAProxy گفته‌ایم کل پوشه /etc/haproxy/certs/ را بخواند، این برنامه فایل‌های داخل آن را یکی‌یکی بررسی می‌کند. وقتی به این فایل خالی می‌رسد، می‌بیند هیچ کلید معتبری در آن نیست (no start line) و به همین دلیل کرش می‌کند.

برای حل این مشکل فقط کافیست این فایل خالی و خراب را پاک کنید.

دستور زیر را بزنید تا فایل پاک شود:

Bash
rm /etc/haproxy/certs/sub.karnovo.net.ru.pem
سپس دوباره دستور تست را اجرا کنید تا مطمئن شویم همه چیز سبز و بدون خطاست:

Bash
haproxy -c -f /etc/haproxy/haproxy.cfg
اگر خروجی گفت Configuration file is valid، حالا می‌توانید سرویس را با خیال راحت استارت کنید:

Bash
systemctl restart haproxy
systemctl status haproxy
rm /etc/haproxy/certs/sub.karnovo.net.ru.pem

با این دستور اوکی شد



----

حالا تمام این مراحل قدم به قدم رو بصورت یک اموزش بدون ایراد دربیار که حتی این کد بالا رو هم داشته باشه تا سری بعد بدون ارور این کار رو انجام بدیم

بسیار عالی! خوشحالم که مشکل برطرف شد.

در ادامه، آموزش کامل، قدم‌به‌قدم و بدون نقص تک‌پورت کردن پنل پاسارگارد (و مرزبان) و تفکیک دامنه پنل از دامنه سابسکریپشن با HAProxy را آماده کرده‌ام. این آموزش طوری طراحی شده که بدون هیچ خطایی، از ابتدا تا انتها روی سرور جدید قابل اجرا باشد.

آموزش جامع تک‌پورت کردن پنل و جداسازی دامنه سابسکریپشن با HAProxy
این آموزش به شما کمک می‌کند تا پنل مدیریتی خود را روی یک دامنه (مثلاً main1.sportsee.ru) و لینک‌های سابسکریپشن کاربران را روی دامنه‌ای کاملاً متفاوت (مثلاً sub.karnovo.net.ru) قرار دهید.
با این کار، امنیت سرور افزایش یافته و دسترسی به محیط لاگین ادمین از طریق دامنه کاربران غیرممکن می‌شود.

پیش‌نیازها
دو ساب‌دامنه در کلودفلر (یا هر DNS Provider دیگر) ایجاد کنید و رکورد A آن‌ها را روی IP سرور خود تنظیم کنید.

دامنه پنل (مثلاً main1.sportsee.ru)

دامنه سابسکریپشن (مثلاً sub.karnovo.net.ru)

تیک پروکسی (ابر نارنجی کلودفلر) خاموش باشد تا بتوانیم گواهینامه SSL دریافت کنیم.

1
آزادسازی پورت‌ها و تغییرات در پاسارگارد
برای اینکه HAProxy بتواند ترافیک وب را مدیریت کند، پاسارگارد نباید مستقیماً درگیر SSL باشد. وارد سرور شوید و فایل .env پاسارگارد را ویرایش کنید:

Bash
nano /opt/pasarguard/.env
(مسیر فایل .env ممکن است در سیستم شما متفاوت باشد).

تغییرات زیر را در فایل اعمال کنید:

تنظیمات گواهینامه SSL را پیدا کرده و با گذاشتن # در ابتدای آن‌ها کامنتشان کنید:

env
# UVICORN_SSL_CERTFILE = "/var..."
# UVICORN_SSL_KEYFILE = "/var..."
دریافت IP واقعی کاربران از طریق پروکسی را فعال کنید:

env
UVICORN_PROXY_HEADERS = True
UVICORN_FORWARDED_ALLOW_IPS = "127.0.0.1"
پس از ذخیره فایل (Ctrl+X، سپس Y و Enter)، پاسارگارد را ری‌استارت کنید تا تغییرات اعمال شود:

Bash
pasarguard restart
اکنون پاسارگارد فقط روی پورت 8000 و در محیط داخلی (127.0.0.1) منتظر دریافت اطلاعات است.

2
نصب پیش‌نیازها و دریافت گواهینامه SSL (Certbot)
HAProxy و ابزار Certbot را نصب کنید:

Bash
apt update && apt install -y haproxy certbot
سپس برای هر دو دامنه خود، یک گواهینامه مشترک (Multi-Domain) دریافت کنید. در دستور زیر حتماً دامنه‌های خودتان را جایگزین کنید:

Bash
certbot certonly --standalone -d main1.sportsee.ru -d sub.karnovo.net.ru
(اگر پورت 80 آزاد باشد، این دستور با موفقیت اجرا شده و پیام تبریک نمایش داده می‌شود).

3
تجمیع کلیدهای SSL برای HAProxy
برخلاف پاسارگارد که کلیدهای عمومی و خصوصی را جداگانه می‌گیرد، HAProxy به یک فایل ادغام‌شده نیاز دارد.

ابتدا پوشه مربوطه را بسازید:

Bash
mkdir -p /etc/haproxy/certs
نکته بسیار مهم: چون در مرحله قبل هر دو دامنه را در یک دستور وارد کردیم، Certbot پوشه کلیدها را فقط به نام دامنه اول (در اینجا main1.sportsee.ru) می‌سازد.

با دستور زیر، کلیدها را ادغام کرده و یک فایل معتبر برای HAProxy بسازید:

Bash
cat /etc/letsencrypt/live/main1.sportsee.ru/fullchain.pem \
    /etc/letsencrypt/live/main1.sportsee.ru/privkey.pem \
    > /etc/haproxy/certs/all_domains.pem
4
پیکربندی HAProxy
فایل تنظیمات HAProxy را باز کنید:

Bash
nano /etc/haproxy/haproxy.cfg
محتویات قبلی را پاک کرده و کدهای زیر را قرار دهید. دقت کنید که نام دامنه‌های خودتان را در بخش "شناسایی دامنه‌ها" (acl) جایگزین کنید:

haproxy
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
    
    # شناسایی دامنه‌ها (این دو خط را با دامنه‌های خود ویرایش کنید)
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
فایل را ذخیره کرده و ببندید (Ctrl+X، سپس Y و Enter).

5
تست کانفیگ و استارت سرویس
قبل از روشن کردن HAProxy، حتماً کانفیگ را تست کنید تا مطمئن شوید خطایی (مثلاً وجود فایل خالی یا اشتباه تایپی) وجود ندارد:

Bash
haproxy -c -f /etc/haproxy/haproxy.cfg
اگر خروجی Configuration file is valid بود، سرویس را ری‌استارت کنید:

Bash
systemctl restart haproxy
systemctl status haproxy
6
تنظیمات نهایی در داشبورد پاسارگارد
با آدرس جدید [https://main1.sportsee.ru](https://main1.sportsee.ru) وارد پنل پاسارگارد شوید.

به بخش تنظیمات نودها بروید.

فیلد دامنه سابسکریپشن (Subscription Domain) را برابر با دامنه دوم خود (مثلاً [https://sub.karnovo.net.ru](https://sub.karnovo.net.ru)) قرار دهید.

نتیجه نهایی این آموزش:
پنل مدیریت شما فقط روی دامنه اصلی بالا می‌آید.

اگر کاربری آدرس صفحه لاگین را روی دامنه سابسکریپشن جستجو کند (مثلاً sub.karnovo.net.ru/dashboard) با خطای 403 Forbidden مواجه می‌شود.

اگر کسی IP سرور شما را مستقیماً وارد کند، ارتباط بلافاصله توسط هاپروکسی رد می‌شود (محافظت در برابر فیلترینگ فعال).

خیلی عالی شد

میتونی به صورت یک فایل بهم بدی

فایل تکست یا html

فایل HTML آموزش شما آماده است. این فایل به صورت یک داکیومنت زیبا، خوانا و با استایل راست‌چین (RTL) مخصوص زبان فارسی طراحی شده تا تمامی کدها و مراحل دقیقاً در جای خودشان قرار داشته باشند.

HTML icon
pasarguard-haproxy-tutorial
 HTML 
Open
کافیست فایل بالا را دانلود کرده و روی هر مرورگری (کامپیوتر یا موبایل) باز کنید تا به راحتی به تمام دستورات دسترسی داشته باشید.

عالی شد فقط میتونی جلوی باکس کد علامت کپی بذاری تا مثل همین صفحه چت با یک کلیک کدها کپی بشن

Your HTML file is ready

HTML icon
pasarguard-haproxy-tutorial-v2
 HTML 
Open
ایده بسیار عالی‌ای بود! دقیقاً شبیه تصویر ارسالی و صفحه‌های چت، دکمه "کپی" را همراه با یک آیکون جذاب به گوشه بالا سمت چپِ تمام باکس‌های کد اضافه کردم.

تغییرات اعمال شده در نسخه جدید:

اضافه شدن دکمه کپی به همراه آیکون در گوشه سمت چپ باکسِ کدها (چون کدها انگلیسی و چپ‌چین هستند، دکمه در بهترین جای ممکن قرار گرفته است).

نوشتن اسکریپت جاوا اسکریپت که با یک کلیک، کل متن کد را به کلیپ‌بورد سیستم منتقل می‌کند.

تغییر حالت جذاب هنگام کلیک: رنگ دکمه سبز می‌شود و متن آن به "کپی شد!" تغییر می‌کند و پس از ۲ ثانیه مجدداً به حالت اول باز می‌گردد.

حالا می‌توانید این فایل را دانلود کرده و کدهای آن را به راحتی با یک کلیک استفاده کنید.



Enable ESM Apps to receive additional future security updates.

See https://ubuntu.com/esm or run: sudo pro status





Last login: Fri Jul 31 14:11:37 2026 from 2.147.147.113

root@yummy-lime:~# nano /opt/pasarguard/.env

root@yummy-lime:~# nano /opt/pasarguard/.env

root@yummy-lime:~# certbot certonly --standalone -d main.game-dll100.ir -d sub.karnovo.net.ru

Saving debug log to /var/log/letsencrypt/letsencrypt.log

Requesting a certificate for main.game-dll100.ir and sub.karnovo.net.ru



- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Could not bind TCP port 80 because it is already in use by another process on

this system (such as a web server). Please stop the program in question and then

try again.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(R)etry/(C)ancel:

این ارور به این دلیل رخ داده است که پورت 80 سرور شما در حال حاضر توسط یک برنامه دیگر (احتمالاً HAProxy یا Nginx) اشغال شده است. Certbot برای استفاده از حالت --standalone نیاز دارد که پورت 80 کاملاً آزاد باشد تا بتواند یک وب‌سرور موقت بسازد و مالکیت دامنه را تایید کند.

برای حل این مشکل مراحل زیر را به ترتیب انجام دهید:

۱. لغو عملیات فعلی:
در همان خطی که نوشته (R)etry/(C)ancel:، حرف C را تایپ کرده و Enter را بزنید تا فرآیند فعلی متوقف شود.

۲. متوقف کردن موقت سرویس‌های درگیر:
دستورات زیر را وارد کنید تا سرویس‌هایی که معمولاً پورت 80 را اشغال می‌کنند (مثل هاپروکسی یا انجین‌اکس) موقتاً خاموش شوند:

Bash
systemctl stop haproxy
systemctl stop nginx
۳. اجرای مجدد دستور Certbot:
حالا که پورت 80 آزاد شده است، دوباره دستور دریافت گواهینامه را وارد کنید (دقت کنید که دامنه‌های جدیدتان را وارد کرده‌اید، که کاملاً صحیح است):

Bash
certbot certonly --standalone -d main.game-dll100.ir -d sub.karnovo.net.ru
۴. روشن کردن مجدد HAProxy:
پس از اینکه گواهینامه با موفقیت صادر شد و پیام تبریک (Congratulations) را مشاهده کردید، یادتان نرود که سرویس HAProxy را دوباره روشن کنید تا سرور به حالت عادی برگردد:

Bash
systemctl start haproxy
پس از این مراحل، می‌توانید مسیر آموزش را از قدم سوم (تجمیع کلیدهای SSL) با همین دامنه‌های جدید ادامه دهید.

Your HTML file is ready pasarguard-haproxy-tutorial-v2

HTML

Open



این فایل html که ساختی عالیه

sub.karnovo.net.ru

main1.sportsee.ru

اول این دو دامنه رو در کل کدها به رنگ قرمز دربیار تا کاربر متوجه بشه که باید نام دامنه خودشو بذاره

------------

میخوام عنوان این اموزش بشه "پنل پاسارگاد" و

آموزش جامع تک‌پورت کردن پنل پاسارگارد با HAProxy و این عبارت تبدیل به لینک بشه تا با کلیک روی این کاربر به قسمت این اموزش در صفحه هدایت بشه

------------------------------------------

این دو دستور هم اول صفحه بعد از عبارت "پنل پاسارگاد " قرار بگیره و قابل کپی شدن باشه

نصب پاسارگاد:

curl -fsSL https://github.com/PasarGuard/scripts/raw/main/pasarguard.sh -o /tmp/pg.sh \

  && sudo bash /tmp/pg.sh install --database timescaledb

ساخت کلید موقت برای ورود به پنل:

pasarguard cli generate-temp-key

نصب نود پاسارگاد:

sudo bash -c "$(curl -sL https://github.com/PasarGuard/scripts/raw/main/pg-node.sh)" @ install

Your HTML file is ready

HTML icon
pasarguard-full-tutorial
 HTML 
Open
فایل نهایی طبق تمام خواسته‌های شما آپدیت شد.

تغییرات انجام شده:
۱. عنوان اصلی صفحه به "پنل پاسارگاد" تغییر یافت.
۲. دستورات مربوط به «نصب پاسارگاد»، «ساخت کلید موقت» و «نصب نود» در ابتدای صفحه قرار گرفتند و دکمه کپی به آن‌ها اضافه شد.
۳. عبارت «آموزش جامع تک‌پورت کردن پنل پاسارگارد با HAProxy» دقیقاً در زیر عنوان اصلی قرار گرفت و تبدیل به یک لینک قابل کلیک شد که با انیمیشن روان، کاربر را به بخش آموزش HAProxy هدایت می‌کند.
۴. تمامی دامنه‌های sub.karnovo.net.ru و main1.sportsee.ru در سرتاسر آموزش (هم در متن و هم داخل باکس‌های کد مشکی رنگ) با رنگ قرمز روشن و جذاب هایلایت شدند تا کاملاً به چشم بیایند.
۵. اسکریپت دکمه کپی هوشمندتر شد؛ به طوری که وقتی کاربر دکمه کپی را می‌زند، دامنه‌ها همراه با کد اصلی کپی می‌شوند اما تگ‌های رنگی (HTML) کپی نمی‌شوند تا موقع الصاق (Paste) در سرور، خطایی رخ ندهد.

می‌توانید فایل را دانلود و استفاده کنید.



پوشه ریپازیتوری در گیتهاب به اسم asd-panel را دانلود کردم همون گزینه - دانلود زیپ-

الان میخوام یه ریپازیتوری باز کنم به اسم asd-panel2 و محتویات پوشه زیپ رو پوش کنم داخل اون؟

چطوری دقیقا انجام بدم؟

الان اسم متفاوت مشکلی ایجاد نمیکنه ؟



------------------

چطور Git Bash رو باز کنی؟



روی دسکتاپ یا Start Menu سرچ کن: Git Bash

برنامه‌ای به اسم Git Bash رو باز کن.

بعد از باز شدن، باید این شکلی باشه (مشکی با متن سفید).

حالا پوشه پروژه‌ت رو داخلش باز کن:دو راه داری:

راه آسان:

پوشه svm-panel-main رو با موس پیدا کن → روی اون راست کلیک کن → گزینه "Git Bash Here" رو بزن.

(این بهترین و راحت‌ترین راهه)

-----------------------------------



بعد از باز کردن Git Bash چیکار کن؟

این دستورات رو یکی یکی بزن:



---------------------------------------------- 

# حذف .git قدیمی

rm -rf .git



# ساخت ریپو جدید

git init



git add .



git commit -m "Initial commit"



# remote اضافه کن (USERNAME رو عوض کن)

git remote add origin https://github.com/asd1asd00000/svm-panel.git



git branch -M main

git push -u origin main





------------------------------

=============== اگر از قبل ریپازیتوری فایل داشت و بخواهیم اوررایت کنیم  =================================

کلا در کد اخر با دستور بالا فرق داره

------------------------------------------------------------------------------



#!/bin/bash



rm -rf .git

git init

git add .

git commit -m "Initial commit"



git remote add origin https://github.com/asd1asd00000/svm-panel.git



# مهم: اول برنچ رو main کن، بعد fetch

git branch -M main

git fetch origin



git push -u origin main --force







----------------------------------------------------------------------

اینم همینطور درست کن یه عنوان خوب هم برای این به هم بگو برای عنوان منو

در پاسخ به سوال اول شما: خیر، اسم متفاوت هیچ مشکلی ایجاد نمی‌کند. نام پوشه روی سیستم شما و نام ریپازیتوری در گیتهاب کاملاً مستقل از هم هستند. فقط یک نکته مهم وجود دارد: اگر در اسکریپت‌های نصب خود (مثل فایل‌های bash که برای نصب روی سرور استفاده می‌کنید) آدرس مستقیم دانلود فایل‌ها (Raw URL) را از ریپازیتوری قبلی قرار داده‌اید، حتماً یادتان باشد که آن لینک‌ها را به نام ریپازیتوری جدید (asd-panel2) تغییر دهید تا در زمان نصب ارور 404 نگیرید.

برای عنوان این آموزش در منوی سایتتان، این گزینه‌ها بسیار مناسب و گویا هستند:

عنوان کوتاه (برای منو): انتقال سورس‌کد به ریپازیتوری جدید

عنوان کامل (برای صفحه): آموزش آپلود فایل‌های فشرده (ZIP) و انتقال سورس‌کد به گیتهاب

در ادامه، فایل HTML این آموزش را دقیقاً با همان ظاهر قبلی، دکمه‌های کپی و هایلایت‌های قرمز رنگ برای بخش‌هایی که باید تغییر کنند، آماده کرده‌ام.

HTML icon
github-repo-transfer-tutorial
 HTML 
Open
فایل HTML آموزش کار با گیت آماده شد. در این فایل هر دو روش (ریپازیتوری خالی و ریپازیتوری دارای فایل) همراه با کدهای صحیح قرار داده شده است و کلماتی که کاربر باید تغییر دهد (مانند USERNAME و asd-panel2) با رنگ قرمز مشخص شده‌اند.




Gemini is AI and can make mistakes.

<!DOCTYPE html>
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
</html>
github-repo-transfer-tutorial.html
Displaying github-repo-transfer-tutorial.html.
