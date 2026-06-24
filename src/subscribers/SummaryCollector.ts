import { RenderEventSubscriber } from "../interfaces/RenderEventSubscriber";
import { RenderContext } from "../interfaces/RenderContext";

/**
 * Concrete Observer.
 *
 * Збирає статистику рендерингу.
 */
export class SummaryCollector
  implements RenderEventSubscriber {

  private sections = 0;
  private paragraphs = 0;
  private lists = 0;

  update(context: RenderContext): void {

    switch (context.type) {

      case "Section":
        this.sections++;
        break;

      case "Paragraph":
        this.paragraphs++;
        break;

      case "List":
        this.lists++;
        break;
    }
  }

  /**
   * Виведення підсумкової статистики.
   */
  printSummary(): void {

    console.log(
      `[Summary] Rendered ${this.sections} sections, ${this.paragraphs} paragraphs, ${this.lists} lists`
    );
  }
}
