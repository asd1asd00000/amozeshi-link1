
<h2>نصب و راه‌اندازی اولیه</h2>

<p>نصب پاسارگاد:</p>

<pre><code>curl -fsSL https://github.com/PasarGuard/scripts/raw/main/pasarguard.sh -o /tmp/pg.sh   && sudo bash /tmp/pg.sh install --database timescaledb</code></pre>

<p>ساخت کلید موقت برای ورود به پنل:</p>

<pre><code>pasarguard cli generate-temp-key</code></pre>

<p>نصب نود پاسارگاد:</p>

<pre><code>sudo bash -c "$(curl -sL https://github.com/PasarGuard/scripts/raw/main/pg-node.sh)" @ install</code></pre>
