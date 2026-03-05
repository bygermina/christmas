# Code Review: Дизайн-система и качество кода

## 1. Три способа задавать цвет с прозрачностью

### Проблема

В проекте параллельно существуют три паттерна для одной задачи — цвет + прозрачность:

```scss
/* a) SCSS-функция — app.module.scss, code-text.module.scss */
#{color-opacity('blue', 500, 0.06)}

/* b) Пре-генерированные CSS-переменные — footer.module.scss */
var(--color-blue-400-50)

/* c) Сырой relative color syntax — fire-effect.module.scss, particles.module.scss, light-follow.module.scss, glass-text.css */
rgba(from var(--color-white) r g b / 0.85)
```

Новый человек не поймёт, какой использовать. Дизайн-система теряет смысл.

### Решение

Оставить **базовые цвета как CSS-переменные** (`--color-blue-400`, `--color-white`, и т.д.) и использовать **один** способ добавления прозрачности — relative color syntax напрямую:

```scss
/* Было — три варианта: */
#{color-opacity('blue', 400, 0.3)}
var(--color-blue-400-30)
rgba(from var(--color-blue-400) r g b / 0.3)

/* Стало — один: */
rgba(from var(--color-blue-400) r g b / 0.3)
```

Что удалить:
- Из `_css-variables.scss` — все opacity-переменные (~30 строк: `--color-blue-400-5`, `--color-gold-400-20`, и т.д.)
- Из `_functions.scss` — функцию `color-opacity()`
- Из `shared/lib/colors.ts` — функцию `colorWithOpacity()` (используется только в `fire-effect.tsx`, заменить на строку напрямую)

Что оставить в `_css-variables.scss`:

```scss
:root {
  --color-blue-300: #{ds-color('blue', 300)};
  --color-blue-400: #{ds-color('blue', 400)};
  --color-blue-500: #{ds-color('blue', 500)};
  --color-cyan-400: #{ds-color('cyan', 400)};
  --color-gold-300: #{ds-color('gold', 300)};
  --color-gold-400: #{ds-color('gold', 400)};
  --color-gold-500: #{ds-color('gold', 500)};
  --color-gold-600: #{ds-color('gold', 600)};
  --color-slate-300: #{ds-color('slate', 300)};
  --color-slate-400: #{ds-color('slate', 400)};
  --color-slate-500: #{ds-color('slate', 500)};
  --color-slate-600: #{ds-color('slate', 600)};
  --color-slate-700: #{ds-color('slate', 700)};
  --color-slate-800: #{ds-color('slate', 800)};
  --color-slate-900: #{ds-color('slate', 900)};
  --color-dark: #{ds-color('dark')};
  --color-white: #{ds-color('white')};
  --font-family-sans: #{font-family(sans)};
}
```

Результат: один способ, zero абстракций, понятно любому разработчику.

---

## 2. Хардкод `500px` — повторяется в 4 файлах

### Проблема

```scss
/* section.module.scss, content.module.scss, tree-section.module.scss */
@media (min-width: 500px) and (orientation: landscape) { ... }

/* typography.module.scss */
@media (min-width: 500px) and (max-width: 929px) { ... }
```

5 повторений, 500px не фигурирует ни в одном токене. Смена порога = правка в 4 файлах.

### Решение

Добавить в `_tokens.scss`:

```scss
$breakpoints: (
  xs: 500px,   /* ← новый */
  sm: 640px,
  md: 768px,
);
```

Добавить в `_mixins.scss`:

```scss
@mixin landscape-main {
  @media (min-width: breakpoint(xs)) and (orientation: landscape) {
    @content;
  }
}
```

Заменить во всех файлах:

```scss
/* Было */
@media (min-width: 500px) and (orientation: landscape) { ... }

/* Стало */
@include landscape-main { ... }
```

---

## 3. Рассинхрон JS и SCSS брейкпоинтов

### Проблема

SCSS (`_tokens.scss`):
```
sm: 640px, md: 768px
```

JS (`breakpoints.ts`):
```
MOBILE: 768, TABLET: 1024
```

Разные имена, разные наборы значений, нет единого источника.

### Решение

Синхронизировать названия и добавить недостающие:

`_tokens.scss`:
```scss
$breakpoints: (
  xs: 500px,
  sm: 640px,
  md: 768px,
  lg: 1024px,
);
```

`breakpoints.ts`:
```typescript
export const BREAKPOINTS = {
  XS: 500,
  SM: 640,
  MD: 768,
  LG: 1024,
} as const;
```

Имена 1:1, значения 1:1. Один человек меняет — видит что менять в другом файле.

Альтернатива (если захочется единый источник): генерировать CSS-переменные с брейкпоинтами и читать их из JS. Но для проекта этого размера — overkill, достаточно синхронных констант.

---

## 4. Мёртвый код

### Что удалить

**`_mixins.scss`** — неиспользуемые миксины:
- `button-base` (проект не имеет кнопок)
- `focus-ring` (нигде не вызывается)
- `flex-between` (нигде не вызывается)

**`fire-effect.constants.ts`** — неиспользуемые экспорты:
- `GRADIENT_OPACITY` (24 строки, 0 импортов)
- `GRADIENT_POSITIONS` (12 строк, 0 импортов)

**`typography.module.scss`** — генерируемые, но неиспользуемые классы (~60 строк):
- `.typography-size-*` (8 классов)
- `.typography-weight-*` (3 класса)
- `.typography-align-*` (4 класса)
- `.typographyTruncate`
- `.typographyLineClamp-*` (4 класса)

**`_css-variables.scss`** — переменные, используемые только через SCSS-функции:
- `--spacing-*`, `--radius-sm`, `--shadow-xl`, `--transition-base`

**`content.module.scss`**:
- пустой класс `.subtitleWrapper {}` — не несёт стилей

### Решение

Удалить перечисленное. Если миксины/утилиты понадобятся в будущем — добавить по необходимости. Генерировать заранее «на всякий случай» не стоит: это мёртвый CSS в бандле и шум при ревью.

---

## 5. Баг: `spacing(1.5)` → `null`

### Проблема

`code-under-text.module.scss`:
```scss
gap: spacing(1.5);
```

Токен `$spacing` определяет ключи `1, 2, 3, 4, 6, 8` — ключа `1.5` нет. `spacing(1.5)` возвращает `null` → `gap: ;` → невалидный CSS.

### Решение

Вариант A — добавить токен:
```scss
$spacing: (
  1: 0.25rem,
  1.5: 0.375rem,  /* ← */
  2: 0.5rem,
  ...
);
```

Вариант B — использовать существующий:
```scss
gap: spacing(2);  /* 0.5rem — ближайший */
```

Рекомендация: вариант A, если 0.375rem — осознанное значение. Вариант B, если было неточное обращение.

---

## 6. Дублирование keyframes

### Проблема

**`code-shimmer`** — идентичен в `code-text.module.scss` и `code-background.module.scss`.

**`pulse`** — определён в `_animations.scss`, `fire-effect.module.scss`, `light-follow.module.scss`.

CSS Modules скоупят keyframes, поэтому конфликта нет, но это 3 копии одного и того же.

### Решение

Вынести `code-shimmer` в `_animations.scss`:

```scss
/* _animations.scss */
@keyframes fadeIn { ... }
@keyframes pulse { ... }
@keyframes code-shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

Для `pulse` в CSS Modules: оставить локальные определения — это допустимый trade-off, т.к. keyframes внутри `.module.scss` скоупятся и ссылаться на глобальный `pulse` неудобно. Но если анимация одинаковая — можно вынести в `glass-text.css` как `:global`.

---

## 7. Мелочи

### `shadow()` — бессмысленная ветка

```scss
@function shadow($size) {
  $shadow: map.get(tokens.$shadows, $size);
  @if meta.type-of($shadow) == list {
    @return $shadow;  /* ← */
  }
  @return $shadow;    /* ← одно и то же */
}
```

Заменить на:

```scss
@function shadow($size) {
  @return map.get(tokens.$shadows, $size);
}
```

---

## Порядок выполнения

| Шаг | Действие | Файлы |
|-----|----------|-------|
| 1 | Починить `spacing(1.5)` баг | `_tokens.scss` или `code-under-text.module.scss` |
| 2 | Вынести `500px landscape` в миксин | `_tokens.scss`, `_mixins.scss`, 4 module.scss |
| 3 | Синхронизировать брейкпоинты JS ↔ SCSS | `breakpoints.ts`, `_tokens.scss` |
| 4 | Унифицировать цвета: один паттерн | `_css-variables.scss`, `_functions.scss`, `colors.ts`, все .scss с `color-opacity` |
| 5 | Удалить мёртвый код | `_mixins.scss`, `fire-effect.constants.ts`, `typography.module.scss`, `content.module.scss` |
| 6 | Упростить `shadow()`, вынести общие keyframes | `_functions.scss`, `_animations.scss` |
