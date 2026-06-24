import { BaseRenderer } from "./BaseRenderer";

/**
 * Concrete Implementor у патерні Bridge.
 *
 * Відповідає за генерацію Markdown.
 */
export class MarkdownRenderer extends BaseRenderer {
renderHeader(
    level: number,
    text: string
  ): string {
    return `${"#".repeat(level)} ${text}\n\n`;
  }

  renderParagraph(text: string): string {
    return `${text}\n\n`;
  }

  renderList(items: string[]): string {
    return items
      .map(item => `- ${item}`)
      .join("\n") + "\n\n";
  }
}
