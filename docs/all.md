<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>امکانات و کاراکترهای Markdown</title>
    </head>
<body>

<h1>📝 امکانات و کاراکترهای Markdown</h1>

<p>
مارک‌داون یک زبان نشانه‌گذاری سبک است که با استفاده از کاراکترهای ساده، متن را به HTML تبدیل می‌کند.
این زبان در سال ۲۰۰۴ توسط جان گروبر طراحی شد و به دلیل سادگی و خوانایی بالا، به استانداردی برای نوشتن مستندات،
مقالات وبلاگ و توضیحات پروژه‌ها تبدیل شده است.
</p>

<h2>سینتکس پایه (Basic Syntax)</h2>
<p>این عناصر در تمامی اپلیکیشن‌های مارک‌داون پشتیبانی می‌شوند:</p>

<table>
<tr><th>عنصر</th><th>سینتکس مارک‌داون</th><th>خروجی</th></tr>
<tr><td>تیتر (Heading)</td><td><code># H1</code> <code>## H2</code> <code>### H3</code></td><td>تیترهای سطوح مختلف</td></tr>
<tr><td>بولد (Bold)</td><td><code>**متن بولد**</code></td><td><strong>متن بولد</strong></td></tr>
<tr><td>ایتالیک (Italic)</td><td><code>*متن ایتالیک*</code></td><td><em>متن ایتالیک</em></td></tr>
<tr><td>نقل‌قول (Blockquote)</td><td><code>&gt; نقل‌قول</code></td><td>نقل‌قول بلوکی</td></tr>
<tr><td>لیست شماره‌دار</td><td><code>1. مورد اول</code></td><td>لیست مرتب</td></tr>
<tr><td>لیست نامرتب</td><td><code>- مورد اول</code></td><td>لیست گلوله‌ای</td></tr>
<tr><td>کد (Code)</td><td><code>`کد`</code></td><td><code>کد</code></td></tr>
<tr><td>خط افقی</td><td><code>---</code></td><td>خط جداکننده</td></tr>
<tr><td>لینک (Link)</td><td><code>[متن](https://example.com)</code></td><td>لینک قابل کلیک</td></tr>
<tr><td>تصویر (Image)</td><td><code>![alt](image.jpg)</code></td><td>تصویر نمایش داده شده</td></tr>
</table>

<h2>سینتکس پیشرفته (Extended Syntax)</h2>
<p>این عناصر در اکثر اپلیکیشن‌های مدرن مارک‌داون پشتیبانی می‌شوند:</p>

<table>
<tr><th>عنصر</th><th>سینتکس مارک‌داون</th><th>خروجی</th></tr>
<tr><td>جدول (Table)</td><td><code>| ستون ۱ | ستون ۲ |</code></td><td>جدول با ستون‌های مشخص</td></tr>
<tr><td>بلوک کد (Fenced Code Block)</td><td><code>```python</code><br><code>print("سلام")</code><br><code>```</code></td><td>بلوک کد با هایلایت سینتکس</td></tr>
<tr><td>پانوشت (Footnote)</td><td><code>متن[^1]</code></td><td>متن با پانوشت</td></tr>
<tr><td>خط‌خورده (Strikethrough)</td><td><code>~~متن~~</code></td><td><del>متن</del></td></tr>
<tr><td>لیست وظایف (Task List)</td><td><code>- [x] انجام شد</code></td><td>☑ انجام شد</td></tr>
<tr><td>ایموجی (Emoji)</td><td><code>:joy:</code></td><td>😂</td></tr>
<tr><td>هایلایت (Highlight)</td><td><code>==متن مهم==</code></td><td>متن با هایلایت</td></tr>
<tr><td>زیرنویس (Subscript)</td><td><code>H~2~O</code></td><td>H₂O</td></tr>
<tr><td>بالانویس (Superscript)</td><td><code>X^2^</code></td><td>X²</td></tr>
</table>

<h2>مثال‌های کاربردی</h2>

<div class="example-box">
<div class="example-title">📌 مثال تیترها</div>
<pre><code># تیتر اصلی
## تیتر فرعی
### تیتر سوم</code></pre>
</div>

<div class="example-box">
<div class="example-title">📌 مثال لیست‌ها</div>
<pre><code>- مورد اول
- مورد دوم
  - زیرمجموعه

1. مورد شماره‌دار اول
2. مورد شماره‌دار دوم</code></pre>
</div>

<div class="example-box">
<div class="example-title">📌 مثال جدول</div>
<pre><code>| نام | سن | شهر |
|-----|-----|------|
| علی | ۲۵ | تهران |
| سارا | ۳۰ | شیراز |</code></pre>
</div>

<div class="example-box">
<div class="example-title">📌 مثال بلوک کد</div>
<pre><code>```python
def hello():
    print("سلام دنیا!")
```</code></pre>
</div>

<div class="example-box">
<div class="example-title">📌 مثال نقل‌قول</div>
<pre><code>&gt; این یک نقل‌قول است
&gt; که می‌تواند چند خطی باشد</code></pre>
</div>

<h2>کاراکترهای خاص و Escape کردن</h2>
<p>
برخی کاراکترها در مارک‌داون معنای خاص دارند و برای نمایش آن‌ها به صورت متن ساده،
باید از بک‌اسلش (<code>\</code>) قبل از آن‌ها استفاده کرد:
</p>

<table>
<tr><th>کاراکتر</th><th>سینتکس Escape</th><th>خروجی</th></tr>
<tr><td>ستاره</td><td><code>\*متن\*</code></td><td>*متن* (بدون ایتالیک)</td></tr>
<tr><td>هش</td><td><code>\# تیتر</code></td><td># تیتر (بدون تیتر شدن)</td></tr>
<tr><td>آندرلاین</td><td><code>\_متن\_</code></td><td>_متن_ (بدون ایتالیک)</td></tr>
<tr><td>براکت</td><td><code>\[متن\]</code></td><td>[متن] (بدون لینک شدن)</td></tr>
<tr><td>بک‌تیک</td><td><code>\`کد\`</code></td><td>`کد` (بدون کد شدن)</td></tr>
</table>

<div class="note">
<strong>💡 نکته:</strong>
برای نمایش کاراکترهای خاص بدون escape کردن، می‌توانید آن‌ها را داخل کد درون‌خطی
(<code>`...`</code>) یا بلوک کد قرار دهید. محتوای داخل کد به صورت تحت‌اللفظی نمایش داده می‌شود.
</div>

<div class="tip">
<strong>✅ نکته مهم:</strong>
مارک‌داون از HTML درون‌خطی نیز پشتیبانی می‌کند، بنابراین می‌توانید از تگ‌های HTML
مانند <code>&lt;abbr&gt;</code> یا <code>&lt;mark&gt;</code> در متن خود استفاده کنید.
</div>

<h2>منابع و مراجع</h2>
<p>
برای اطلاعات بیشتر می‌توانید به مستندات رسمی مارک‌داون و راهنمای کامل سینتکس مراجعه کنید.
</p>

</body>
</html>
