import { DocRenderer } from "../interfaces/DocRenderer";
import { HTMLRenderer } from "../renderers/HTMLRenderer";
import { MarkdownRenderer } from "../renderers/MarkdownRenderer";
import { PlainTextRenderer } from "../renderers/PlainTextRenderer";

/**
 * Підтримувані формати документа.
 */
export type RendererType = "html" | "markdown" | "plain";

/**
 * Фабрика створення рендерерів.
 *
 * Інкапсулює логіку створення конкретних
 * реалізацій рендерера.
 */
export class RendererFactory {
  static create(
    type: RendererType
  ): DocRenderer {

    switch (type) {

      case "html":
        return new HTMLRenderer();

      case "plain":
        return new PlainTextRenderer();

      case "markdown":
      default:
        return new MarkdownRenderer();
    }
  }

  static getSupportedFormats(): RendererType[] {
    return ["html", "markdown", "plain"];
  }
}
