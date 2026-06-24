import { writeFileSync } from 'fs';
import { RendererFactory, RendererType } from './factories/RendererFactory';
import { Section } from './nodes/Section';
import { Paragraph } from './nodes/Paragraph';
import { List } from './nodes/List';
import { RenderEventPublisher } from "./RenderEventPublisher";
import { RenderLoggerSubscriber } from "./subscribers/RenderLoggerSubscriber";
import { SummaryCollector } from "./subscribers/SummaryCollector";
import { PerformanceSubscriber } from "./subscribers/PerformanceSubscriber";

/**
 * Формування дерева документа.
 *
 * Структура документа реалізована
 * за допомогою патерну Composite.
 *
 * Формат виводу визначається
 * окремим рендерером завдяки Bridge.
 */
function createDocument(format: RendererType): string {
  const renderer = RendererFactory.create(format);
  const doc = new Section("Структурні патерни", renderer, [], 1);

  const patterns = new Section("Основні патерни", renderer, [
    new Paragraph("Розглянемо два важливих структурних патерни.", renderer),
    new Section("Composite", renderer, [
      new Paragraph("Дозволяє створювати деревоподібні структури об'єктів.", renderer),
      new List(["Спрощує структуру", "Гнучкий код", "Легка підтримка"], renderer)
    ], 2),
    new Section("Bridge", renderer, [
      new Paragraph("Розділяє абстракцію та реалізацію.", renderer),
      new List(["Незалежні зміни", "Краща масштабованість"], renderer)
    ], 2)
  ], 2);

  doc.add(patterns);

  /**
   * Під час рендерингу кожен вузол
   * надсилає подію через Observer.
   */
  return doc.render();
}

/**
 * Отримання параметрів командного рядка.
 */
const { format, output } = {
  format: (process.argv[2] || 'markdown') as RendererType,
  output: process.argv[3]
};

/**
 * Concrete Observer.
 *
 * Виводить інформацію про кожен
 * відрендерений елемент документа.
 */
const logger = new RenderLoggerSubscriber();

/**
 * Concrete Observer.
 *
 * Збирає статистику щодо кількості
 * секцій, параграфів та списків.
 */
const summary = new SummaryCollector();

/**
 * Concrete Observer.
 *
 * Накопичує інформацію про час
 * рендерингу елементів документа.
 */
const perf = new PerformanceSubscriber();

/**
 * Реєстрація підписників.
 *
 * RenderEventPublisher виступає Subject
 * у патерні Observer.
 *
 * Реалізована Push-модель:
 * Publisher сам передає RenderContext
 * усім зареєстрованим Observer.
 */
RenderEventPublisher.subscribe(logger);
RenderEventPublisher.subscribe(summary);
RenderEventPublisher.subscribe(perf);

/**
 * Генерація документа.
 */
const content = createDocument(format);

/**
 * Отримання відповідного рендерера
 * через фабрику.
 */
const renderer = RendererFactory.create(format);

/**
 * Для HTML документа виконується
 * додаткова обгортка у повний HTML.
 */
const result = renderer.wrapDocument(content);

/**
 * Виведення статистики,
 * зібраної підписниками.
 */
summary.printSummary();
perf.printReport();

/**
 * Якщо шлях до файлу передано -
 * результат зберігається у файл.
 *
 * Інакше документ виводиться
 * безпосередньо в консоль.
 */
output
  ? writeFileSync(output, result)
  : console.log(result); 