# Flashy — лендинг с вейтлистом

Лендинг для Flashy: ИИ-сервис, который читает загруженный текст/статью/фото,
находит сложные слова и спрашивает пользователя, знает ли он их.

Стек: Next.js (App Router) + Supabase (база email'ов) + Resend (письмо-уведомление о новой регистрации).
Деплой — Vercel, бесплатно.

---

## 1. Что нужно подготовить (бесплатно)

### Supabase — база данных с почтами
1. Зайди на [supabase.com](https://supabase.com), создай бесплатный проект.
2. В разделе **SQL Editor** выполни содержимое файла `supabase.sql` —
   создастся таблица `waitlist` с колонками `id`, `email`, `created_at`.
3. В **Project Settings → API** возьми:
   - `Project URL` → это `SUPABASE_URL`
   - `service_role` секретный ключ → это `SUPABASE_SERVICE_ROLE_KEY`
     (НЕ anon key — этот ключ должен оставаться только на сервере, в Vercel env, никогда в коде/гите).

Все email'ы, которые соберёт лендинг, будут лежать в таблице `waitlist` —
их можно смотреть прямо в Supabase Table Editor или экспортировать в CSV.

### Resend — уведомление тебе на почту о новой регистрации
1. Зайди на [resend.com](https://resend.com), зарегистрируйся (бесплатный план — 100 писем/день).
2. В разделе **API Keys** создай ключ → это `RESEND_API_KEY`.
3. Без подключения своего домена можно отправлять с `onboarding@resend.dev`
   (это и стоит по умолчанию в `.env.example` как `RESEND_FROM_EMAIL`).
4. `NOTIFY_EMAIL` — твой email, на который будут приходить уведомления
   "новый человек зарегистрировался".

Если хочешь подключить свой домен (например, чтобы письма шли с `@flashy.app`) —
это делается в Resend → Domains, добавляешь DNS-записи у регистратора домена.

---

## 2. Локальный запуск (опционально, для проверки)

```bash
npm install
cp .env.example .env.local   # и заполни своими ключами
npm run dev
```

Открой http://localhost:3000

---

## 3. Деплой на Vercel

1. Создай репозиторий на GitHub и запушь туда этот проект:

```bash
git init
git add .
git commit -m "Flashy waitlist landing page"
git branch -M main
git remote add origin https://github.com/ТВОЙ_АККАУНТ/flashy-waitlist.git
git push -u origin main
```

2. Зайди на [vercel.com](https://vercel.com), залогинься через GitHub.
3. **Add New Project** → выбери только что запушенный репозиторий → Vercel
   сам распознает Next.js, ничего менять не нужно.
4. Перед первым деплоем (или в Project Settings → Environment Variables)
   добавь переменные из `.env.example`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `NOTIFY_EMAIL`
5. Нажми **Deploy**. Через минуту получишь рабочую ссылку вида
   `https://flashy-waitlist.vercel.app`.

Готово — форма на сайте теперь:
- сохраняет email в таблицу `waitlist` в Supabase;
- присылает тебе письмо на `NOTIFY_EMAIL` о каждой новой регистрации;
- показывает понятное сообщение, если email уже был в списке.

---

## 4. Как добавить пользователя вручную

Открой Supabase → Table Editor → таблица `waitlist` → Insert row → впиши email.
Это удобно, если кто-то регистрируется через Gmail-форму отдельно
или ты собираешь почты офлайн.

---

## 5. Структура проекта

```
app/
  layout.tsx          — шрифты, метаданные
  page.tsx            — сама страница
  page.module.css     — стили страницы
  globals.css         — глобальные переменные (цвета, шрифты)
  api/waitlist/route.ts — API-эндпоинт формы (Supabase + Resend)
components/
  WordDemo.tsx        — интерактивная 3D-демка "угадай слово"
  WaitlistForm.tsx    — форма подписки
supabase.sql          — SQL для создания таблицы waitlist
```
