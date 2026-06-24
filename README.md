# Design Patterns: Composite, Bridge та Observer

## Опис проєкту

Даний проєкт реалізує три патерни проєктування мовою TypeScript:

* Composite (Компонувальник);
* Bridge (Міст);
* Observer (Спостерігач).

Метою роботи є побудова системи генерації документів, яка дозволяє створювати складну ієрархічну структуру документа з вкладених елементів, генерувати її у різних форматах та відслідковувати процес рендерингу через систему подій.

У межах проєкту реалізовано:

* формування документа у вигляді дерева елементів;
* підтримку секцій, параграфів та списків;
* генерацію документів у форматах HTML, Markdown та Plain Text;
* вибір формату через фабрику рендерерів;
* реактивну систему відстеження рендерингу;
* логування подій рендерингу;
* збір статистики по елементах документа;
* вимірювання продуктивності рендерингу;
* демонстрацію принципів SOLID та ООП.

---

# Структура проєкту

```text
src
│
├── interfaces
│   ├── DocNode.ts
│   ├── DocRenderer.ts
│   ├── RenderContext.ts
│   └── RenderEventSubscriber.ts
│
├── renderers
│   ├── BaseRenderer.ts
│   ├── HTMLRenderer.ts
│   ├── MarkdownRenderer.ts
│   └── PlainTextRenderer.ts
│
├── nodes
│   ├── Paragraph.ts
│   ├── List.ts
│   └── Section.ts
│
├── subscribers
│   ├── RenderLoggerSubscriber.ts
│   ├── SummaryCollector.ts
│   └── PerformanceSubscriber.ts
│
├── factories
│   └── RendererFactory.ts
│
├── RenderEventPublisher.ts
│
└── main.ts
```

---

# Постановка задачі

Необхідно реалізувати систему генерації документів, яка дозволяє:

* створювати документи з вкладених секцій;
* додавати параграфи та списки;
* формувати ієрархію довільної глибини;
* генерувати документ у різних форматах;
* відслідковувати процес рендерингу;
* збирати статистику по документах;
* аналізувати продуктивність генерації.

Структура документа повинна залишатися незалежною від формату виводу та системи моніторингу.

---

# Реалізація патерну Composite

## Призначення

Патерн Composite дозволяє працювати з окремими елементами документа та їх групами однаковим способом.

У проєкті дерево документа складається з вузлів типу:

```typescript
DocNode
```

---

## Component

```typescript
DocNode
```

---

## Leaf

```typescript
Paragraph
List
```

---

## Composite

```typescript
Section
```

Секція може містити інші секції, параграфи та списки, утворюючи деревоподібну структуру документа.

---

## Бізнес-логіка

Документ формується як ієрархія елементів:

```text
Структурні патерни
│
└── Основні патерни
    │
    ├── Composite
    └── Bridge
```

Під час виклику:

```typescript
document.render()
```

кожна секція рекурсивно викликає рендеринг своїх дочірніх елементів.

---

# Реалізація патерну Bridge

## Призначення

Патерн Bridge відокремлює структуру документа від способу його відображення.

---

## Abstraction

```typescript
DocNode
```

---

## Refined Abstractions

```typescript
Paragraph
List
Section
```

---

## Implementor

```typescript
DocRenderer
```

---

## Concrete Implementors

```typescript
MarkdownRenderer
HTMLRenderer
PlainTextRenderer
```

---

## Бізнес-логіка

Один і той самий документ може бути відображений у різних форматах:

```typescript
RendererFactory.create("markdown")
RendererFactory.create("html")
RendererFactory.create("plain")
```

без зміни структури документа.

---

# Реалізація патерну Observer

## Призначення

Патерн Observer забезпечує реактивну модель взаємодії між компонентами системи.

Після завершення рендерингу кожен елемент документа генерує подію, на яку можуть реагувати незалежні сервіси.

---

## Subject

Центральним об'єктом виступає:

```typescript
RenderEventPublisher
```

Він зберігає список підписників та повідомляє їх про події.

У проєкті реалізована Push-модель Observer.

Publisher сам передає готовий об'єкт:

```typescript
RenderContext
```

усім підписникам через метод:

```typescript
notify(context)
```

---

## Observer

```typescript
RenderEventSubscriber
```

Визначає контракт для всіх підписників:

```typescript
update(context: RenderContext): void
```

---

## Event Object

```typescript
RenderContext
```

Містить:

* тип елемента;
* текстовий вміст;
* рівень секції;
* елементи списку;
* час рендерингу.

---

## Concrete Observers

### RenderLoggerSubscriber

Виводить повідомлення про завершення рендерингу.

Приклад:

```text
[Log] Rendered Paragraph (44 chars)
```

---

### SummaryCollector

Збирає статистику щодо кількості:

* секцій;
* параграфів;
* списків.

Приклад:

```text
[Summary] Rendered 4 sections, 3 paragraphs, 2 lists
```

---

### PerformanceSubscriber

Підраховує сумарний час рендерингу всіх елементів документа.

Приклад:

```text
[Performance] Total render time: 5ms
```

---

# Бізнес-логіка роботи системи

Під час виклику:

```typescript
document.render()
```

відбувається наступна послідовність:

1. Елемент документа генерує свій вміст.
2. Створюється об'єкт RenderContext.
3. Викликається:

```typescript
RenderEventPublisher.notify(context)
```

4. Усі зареєстровані підписники отримують повідомлення.
5. Logger виводить інформацію у консоль.
6. SummaryCollector оновлює статистику.
7. PerformanceSubscriber накопичує час рендерингу.

Таким чином нові сервіси можуть бути додані без зміни існуючого коду документа.

---

# Використані принципи SOLID

## S — Single Responsibility Principle

Кожен клас має лише одну відповідальність:

* `Paragraph` — текстовий блок;
* `List` — список;
* `Section` — структура документа;
* `Renderer` — форматування;
* `RenderLoggerSubscriber` — логування;
* `SummaryCollector` — статистика;
* `PerformanceSubscriber` — вимірювання продуктивності.

---

## O — Open/Closed Principle

Система відкрита для розширення.

Можна додати:

```typescript
AnalyticsSubscriber
NotificationSubscriber
PDFRenderer
```

без зміни існуючого коду.

---

## L — Liskov Substitution Principle

Будь-який вузол документа може використовуватись як:

```typescript
DocNode
```

а будь-який підписник як:

```typescript
RenderEventSubscriber
```

---

## I — Interface Segregation Principle

Інтерфейси залишаються вузькоспеціалізованими:

```typescript
DocNode
DocRenderer
RenderEventSubscriber
```

---

## D — Dependency Inversion Principle

Усі компоненти працюють через абстракції:

```typescript
DocRenderer
RenderEventSubscriber
```

а не через конкретні реалізації.

---

# Використані зв'язки ООП

## Реалізація інтерфейсу (Realization)

```text
Paragraph
List
Section
    implements DocNode
```

```text
HTMLRenderer
MarkdownRenderer
PlainTextRenderer
    implements DocRenderer
```

```text
RenderLoggerSubscriber
SummaryCollector
PerformanceSubscriber
    implements RenderEventSubscriber
```

---

## Наслідування (Inheritance)

```text
BaseRenderer
    ↑
HTMLRenderer

BaseRenderer
    ↑
MarkdownRenderer

BaseRenderer
    ↑
PlainTextRenderer
```

---

## Агрегація (Aggregation)

```text
Section
    └── DocNode[]
```

---

## Композиція (Composition)

```text
Paragraph
List
Section
    └── DocRenderer
```

```text
RenderEventPublisher
    └── RenderEventSubscriber[]
```

---

## Залежність (Dependency)

```text
main.ts
    ↓
RendererFactory

main.ts
    ↓
RenderEventPublisher
```

---

# Використані патерни проєктування

| Патерн         | Призначення                                          |
| -------------- | ---------------------------------------------------- |
| Composite      | Побудова дерева документа                            |
| Bridge         | Відокремлення структури документа від формату виводу |
| Observer       | Реакція на події рендерингу                          |
| Factory Method | Централізація створення рендерерів                   |

---

# Інструкція із запуску

## Встановлення залежностей

```bash
npm install
```

---

## Генерація Markdown

```bash
npx ts-node src/main.ts markdown output.md
```

---

## Генерація HTML

```bash
npx ts-node src/main.ts html output.html
```

---

## Генерація Plain Text

```bash
npx ts-node src/main.ts plain output.txt
```

---

# Очікуваний результат

```text
[Log] Rendered Paragraph (44 chars)
[Log] Rendered Paragraph (53 chars)
[Log] Rendered List (3 items)
[Log] Rendered Section ("Composite", level 2)
[Log] Rendered Paragraph (34 chars)
[Log] Rendered List (2 items)
[Log] Rendered Section ("Bridge", level 2)
[Log] Rendered Section ("Основні патерни", level 2)
[Log] Rendered Section ("Структурні патерни", level 1)

[Summary] Rendered 4 sections, 3 paragraphs, 2 lists

[Performance] Total render time: 5ms
```

---

# Висновок

У межах проєкту було реалізовано три патерни проєктування: Composite, Bridge та Observer. Composite забезпечив побудову деревоподібної структури документа, Bridge дозволив відокремити структуру документа від способу його відображення, а Observer реалізував реактивну систему моніторингу процесу рендерингу. Реалізація демонструє практичне застосування принципів SOLID, абстракцій та зв'язків ООП під час побудови розширюваних TypeScript-застосунків.
