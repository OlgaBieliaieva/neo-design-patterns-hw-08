import { BaseRenderer } from "./BaseRenderer";

/**
 * Concrete Implementor у патерні Bridge.
 *
 * Генерує простий текст без розмітки.
 */
export class PlainTextRenderer extends BaseRenderer {
  renderHeader(
    level: number,
    text: string
  ): string {
    return `${text.toUpperCase()}\n\n`;
  }

  renderParagraph(text: string): string {
    return `${text}\n\n`;
  }

  renderList(items: string[]): string {
    return items
      .map(item => `* ${item}`)
      .join("\n") + "\n\n";
  }
}
