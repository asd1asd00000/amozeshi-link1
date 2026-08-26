# سینتکس مارک‌داون

| عنصر | سینتکس مارک‌داون |
|---|---|
| تیتر (Heading) | `# تیتر 1` ، `## تیتر 2` ، `### تیتر 3` |
| بولد (Bold) | `**متن بولد**` |
| ایتالیک (Italic) | `*متن ایتالیک*` |
| نقل‌قول (Blockquote) | `> نقل قول` |
| لیست شماره‌دار | `1. مورد اول` ، `2. مورد دوم` |
| لیست نامرتب | `- مورد اول` ، `- مورد دوم` |
| کد درون‌خطی (Code) | `` `کد` `` |
| خط افقی (Horizontal Rule) | `---` |
| لینک (Link) | `[متن لینک](https://example.com)` |


=========================================================================================================================================
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>امکانات و کاراکترهای Markdown</title>
    <style>
        body {
            font-family: 'Vazirmatn', 'Segoe UI', Tahoma, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.8;
            background-color: #f9f9f9;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #2c3e50;
            border-bottom: 2px solid #bdc3c7;
            padding-bottom: 5px;
            margin-top: 40px;
        }
        h3 {
            color: #34495e;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px 15px;
            text-align: right;
        }
        th {
            background-color: #3498db;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            direction: ltr;
            display: inline-block;
        }
        pre {
            background-color: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            direction: ltr;
            text-align: left;
        }
        pre code {
            background-color: transparent;
            color: inherit;
            padding: 0;
        }
        .example-box {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        .example-title {
            font-weight: bold;
            color: #3498db;
            margin-bottom: 10px;
        }
        blockquote {
            border-right: 4px solid #3498db;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #f0f7ff;
        }
        .note {
            background-color: #fff3cd;
            border-right: 4px solid #ffc107;
            padding: 10px 15px;
            border-radius: 4px;
            margin: 15px 0;
        }
        .tip {
            background-color: #d4edda;
            border-right: 4px solid #28a745;
            padding: 10px 15px;
            border-radius: 4px;
            margin: 15px 0;
        }
    </style>
</head>
<body>

    <h1>📝 امکانات و کاراکترهای Markdown</h1>

    <p>
        مارک‌داون یک زبان نشانه‌گذاری سبک است که با استفاده از کاراکترهای ساده، متن را به HTML تبدیل می‌کند[1][2]. 
        این زبان در سال ۲۰۰۴ توسط جان گروبر طراحی شد و به دلیل سادگی و خوانایی بالا، به استانداردی برای نوشتن مستندات، 
        مقالات وبلاگ و توضیحات پروژه‌ها تبدیل شده است[2].
    </p>

    <h2>سینتکس پایه (Basic Syntax)</h2>
    <p>این عناصر در تمامی اپلیکیشن‌های مارک‌داون پشتیبانی می‌شوند[4][10]:</p>

    <table>
        <tr>
            <th>عنصر</th>
            <th>سینتکس مارک‌داون</th>
            <th>خروجی</th>
        </tr>
        <tr>
            <td>تیتر (Heading)</td>
            <td><code># H1</code> <code>## H2</code> <code>### H3</code></td>
            <td>تیترهای سطوح مختلف</td>
        </tr>
        <tr>
            <td>بولد (Bold)</td>
            <td><code>**متن بولد**</code></td>
            <td><strong>متن بولد</strong></td>
        </tr>
        <tr>
            <td>ایتالیک (Italic)</td>
            <td><code>*متن ایتالیک*</code></td>
            <td><em>متن ایتالیک</em></td>
        </tr>
        <tr>
            <td>نقل‌قول (Blockquote)</td>
            <td><code>&gt; نقل‌قول</code></td>
            <td>نقل‌قول بلوکی</td>
        </tr>
        <tr>
            <td>لیست شماره‌دار</td>
            <td><code>1. مورد اول</code></td>
            <td>لیست مرتب</td>
        </tr>
        <tr>
            <td>لیست نامرتب</td>
            <td><code>- مورد اول</code></td>
            <td>لیست گلوله‌ای</td>
        </tr>
        <tr>
            <td>کد (Code)</td>
            <td><code>`کد`</code></td>
            <td><code>کد</code></td>
        </tr>
        <tr>
            <td>خط افقی</td>
            <td><code>---</code></td>
            <td>خط جداکننده</td>
        </tr>
        <tr>
            <td>لینک (Link)</td>
            <td><code>[متن](https://example.com)</code></td>
            <td>لینک قابل کلیک</td>
        </tr>
        <tr>
            <td>تصویر (Image)</td>
            <td><code>![alt](image.jpg)</code></td>
            <td>تصویر نمایش داده شده</td>
        </tr>
    </table>

    <h2>سینتکس پیشرفته (Extended Syntax)</h2>
    <p>این عناصر در اکثر اپلیکیشن‌های مدرن مارک‌داون پشتیبانی می‌شوند[4]:</p>

    <table>
        <tr>
            <th>عنصر</th>
            <th>سینتکس مارک‌داون</th>
            <th>خروجی</th>
        </tr>
        <tr>
            <td>جدول (Table)</td>
            <td><code>| ستون ۱ | ستون ۲ |</code></td>
            <td>جدول با ستون‌های مشخص</td>
        </tr>
        <tr>
            <td>بلوک کد (Fenced Code Block)</td>
            <td><code>```python</code><br><code>print("سلام")</code><br><code>```</code></td>
            <td>بلوک کد با هایلایت سینتکس</td>
        </tr>
        <tr>
            <td>پانوشت (Footnote)</td>
            <td><code>متن[^1]</code></td>
            <td>متن با پانوشت</td>
        </tr>
        <tr>
            <td>خط‌خورده (Strikethrough)</td>
            <td><code>~~متن~~</code></td>
            <td><del>متن</del></td>
        </tr>
        <tr>
            <td>لیست وظایف (Task List)</td>
            <td><code>- [x] انجام شد</code></td>
            <td>☑ انجام شد</td>
        </tr>
        <tr>
            <td>ایموجی (Emoji)</td>
            <td><code>:joy:</code></td>
            <td>😂</td>
        </tr>
        <tr>
            <td>هایلایت (Highlight)</td>
            <td><code>==متن مهم==</code></td>
            <td>متن با هایلایت</td>
        </tr>
        <tr>
            <td>زیرنویس (Subscript)</td>
            <td><code>H~2~O</code></td>
            <td>H₂O</td>
        </tr>
        <tr>
            <td>بالانویس (Superscript)</td>
            <td><code>X^2^</code></td>
            <td>X²</td>
        </tr>
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
        باید از بک‌اسلش (<code>\</code>) قبل از آن‌ها استفاده کرد[26][27]:
    </p>

    <table>
        <tr>
            <th>کاراکتر</th>
            <th>سینتکس Escape</th>
            <th>خروجی</th>
        </tr>
        <tr>
            <td>ستاره</td>
            <td><code>\*متن\*</code></td>
            <td>*متن* (بدون ایتالیک)</td>
        </tr>
        <tr>
            <td>هش</td>
            <td><code>\# تیتر</code></td>
            <td># تیتر (بدون تیتر شدن)</td>
        </tr>
        <tr>
            <td>آندرلاین</td>
            <td><code>\_متن\_</code></td>
            <td>_متن_ (بدون ایتالیک)</td>
        </tr>
        <tr>
            <td>براکت</td>
            <td><code>\[متن\]</code></td>
            <td>[متن] (بدون لینک شدن)</td>
        </tr>
        <tr>
            <td>بک‌تیک</td>
            <td><code>\`کد\`</code></td>
            <td>`کد` (بدون کد شدن)</td>
        </tr>
    </table>

    <div class="note">
        <strong>💡 نکته:</strong> برای نمایش کاراکترهای خاص بدون escape کردن، می‌توانید آن‌ها را داخل کد درون‌خطی 
        (<code>`...`</code>) یا بلوک کد قرار دهید. محتوای داخل کد به صورت تحت‌اللفظی نمایش داده می‌شود.
    </div>

    <div class="tip">
        <strong>✅ نکته مهم:</strong> مارک‌داون از HTML درون‌خطی نیز پشتیبانی می‌کند، بنابراین می‌توانید از تگ‌های HTML 
        مانند <code>&lt;abbr&gt;</code> یا <code>&lt;mark&gt;</code> در متن خود استفاده کنید[2].
    </div>

    <h2>منابع و مراجع</h2>
    <p>
        برای اطلاعات بیشتر می‌توانید به مستندات رسمی مارک‌داون و راهنمای کامل سینتکس مراجعه کنید[4][10].
    </p>

</body>
</html>
