# راهنمای کامل آپلود پروژه به GitHub

از پوشه دانلودشده (`asd-panel`) به ریپازیتوری جدید (`asd-panel2`)

---

## ۱. جواب سوالت: اسم متفاوت مشکلی ایجاد می‌کنه؟

> **خیر، هیچ مشکلی ایجاد نمی‌کنه.**  
> اسم پوشه محلی (`asd-panel`) و اسم ریپازیتوری روی گیت‌هاب (`asd-panel2`) کاملاً می‌تونن متفاوت باشن.  
> گیت فقط به **محتویات داخل پوشه** نگاه می‌کنه، نه اسم پوشه.

---

## ۲. چطور Git Bash رو باز کنی؟

1. روی دسکتاپ یا Start Menu سرچ کن: **Git Bash**
2. برنامه‌ای به اسم **Git Bash** رو باز کن (مشکی با متن سفید)

### بهترین روش (پیشنهادی):

پوشه پروژه (مثلاً `asd-panel` یا `asd-panel-main`) رو با موس پیدا کن →  
روی اون **راست‌کلیک** کن → گزینه **"Git Bash Here"** رو بزن.

این راحت‌ترین و بهترین راهه.

---

## ۳. بعد از باز کردن Git Bash چیکار کن؟

اگر ریپازیتوری `asd-panel2` رو تازه ساختی و **خالیه**، این دستورات رو یکی‌یکی بزن:

```bash
# حذف .git قدیمی
rm -rf .git

# ساخت ریپو جدید
git init
git add .
git commit -m "Initial commit"

# remote اضافه کن (USERNAME رو عوض کن)
git remote add origin https://github.com/USERNAME/asd-panel2.git
git branch -M main
git push -u origin main
----------------------------------------------------------------------------------------------------------------
۴. اگر ریپازیتوری از قبل فایل داشت و می‌خوای اوررایت کنی
اگر ریپازیتوری از قبل چیزی داخلش بوده و می‌خوای کامل جایگزین کنی، از این دستورات استفاده کن:
#!/bin/bash
rm -rf .git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/asd-panel2.git

# مهم: اول برنچ رو main کن، بعد fetch
git branch -M main
git fetch origin
git push -u origin main --force
