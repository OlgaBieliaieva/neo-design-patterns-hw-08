/**
 * DTO (Data Transfer Object).
 *
 * Містить інформацію про подію рендерингу,
 * яка буде передаватися всім підписникам.
 */
export interface RenderContext {
  type: "Section" | "Paragraph" | "List";

  /**
   * Основний вміст елемента.
   *
   * Для Section — заголовок.
   * Для Paragraph — текст.
   * Для List — назва не використовується.
   */
  content: string;

  /**
   * Рівень секції.
   */
  level?: number;

  /**
   * Елементи списку.
   */
  items?: string[];

  /**
   * Час рендерингу елемента.
   */
  renderTime?: number;
}