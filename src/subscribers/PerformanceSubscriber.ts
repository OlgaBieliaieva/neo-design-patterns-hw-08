import { RenderEventSubscriber } from "../interfaces/RenderEventSubscriber";
import { RenderContext } from "../interfaces/RenderContext";

/**
 * Concrete Observer.
 *
 * Збирає інформацію про час
 * рендерингу елементів.
 */
export class PerformanceSubscriber
  implements RenderEventSubscriber {

  private totalTime = 0;

  update(context: RenderContext): void {

    this.totalTime += context.renderTime ?? 0;
  }

  /**
   * Виводить сумарний час рендерингу.
   */
  printReport(): void {

    console.log(
      `[Performance] Total render time: ${this.totalTime}ms`
    );
  }
}
