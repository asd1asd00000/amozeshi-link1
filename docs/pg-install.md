
<h2>نصب و راه‌اندازی اولیه</h2>

<p>نصب پاسارگاد:</p>

<pre><code>curl -fsSL https://github.com/PasarGuard/scripts/raw/main/pasarguard.sh -o /tmp/pg.sh   && sudo bash /tmp/pg.sh install --database timescaledb</code></pre>

<p>ساخت کلید موقت برای ورود به پنل:</p>

<pre><code>pasarguard cli generate-temp-key</code></pre>

<p>نصب نود پاسارگاد:</p>

<pre><code>sudo bash -c "$(curl -sL https://github.com/PasarGuard/scripts/raw/main/pg-node.sh)" @ install</code></pre>

بکاپ و ریستور پنل پاسارگارد


>  1- 🚀 Auto Backup & Transfer to New Server<br>
> 2- 🤖 Auto Backup to Telegram Bot (Scheduled)<br>
> 3- 💾 Manual Backup (Save locally)<br>
> 4- 🔄 Manual Restore (From local zip)<br>
> 5- 🚪 Exit <br>


هنگام ریستور میتوان نام دامنه پنل را هم عوض کرد - ولی قبل از ان باید در پنل جدید جداسازی لینک پنل و ساب رو انجام بدیم (وقتی بکاپ پنل قدیمی لینک ساب و پنل جدا باشد)
``` bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/asd1asd00000/backup-restore-pasargurd/main/install.sh)"
```

