import { DocNode } from "../interfaces/DocNode";
import { DocRenderer } from "../interfaces/DocRenderer";
import { RenderEventPublisher } from "../RenderEventPublisher";

/**
 * Composite у патерні Composite.
 *
 * Секція може містити інші вузли документа:
 * Paragraph, List або інші Section.
 */
export class Section implements DocNode {
  constructor(
    private title: string,

    /**
     * Реалізація патерну Bridge.
     * Залежить від абстракції DocRenderer.
     */
    private renderer: DocRenderer,

    /**
     * Агрегація.
     * Section містить колекцію дочірніх вузлів.
     */
    private children: DocNode[] = [],
    private level: number = 1
  ) {}

  /**
   * Додає дочірній вузол до секції.
   */
  add(child: DocNode): void {
    this.children.push(child);
  }

  /**
   * Рекурсивний рендеринг дерева документа.
   *
   * Спочатку виводиться заголовок секції,
   * потім усі вкладені елементи.
   */
  render(): string {

  const start = Date.now();

  const header =
    this.renderer.renderHeader(
      this.level,
      this.title
    );

  const content =
    this.children
      .map(child => child.render())
      .join("");

  const result =
    header + content;

  const renderTime =
    Date.now() - start;

  RenderEventPublisher.notify({
    type: "Section",
    content: this.title,
    level: this.level,
    renderTime
  });

  return result;
}
}
