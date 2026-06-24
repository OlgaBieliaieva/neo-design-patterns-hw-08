/**
 * Implementor у патерні Bridge.
 *
 * Визначає контракт для всіх рендерерів.
 * Документ не знає конкретний формат виводу.
 */
export interface DocRenderer {
  renderHeader(level: number, text: string): string;
  renderParagraph(text: string): string;
  renderList(items: string[]): string;
  wrapDocument(content: string): string;
} 