import { RenderEventSubscriber } from "./interfaces/RenderEventSubscriber";
import { RenderContext } from "./interfaces/RenderContext";

/**
 * Subject (Publisher) у патерні Observer.
 *
 * Реалізує Push-модель сповіщення.
 *
 * Під час виклику notify() видавець сам
 * передає повний об'єкт RenderContext
 * кожному підписнику.
 *
 * Завдяки цьому підписники не залежать
 * від внутрішнього стану Publisher і не
 * повинні самостійно запитувати дані.
 */
export class RenderEventPublisher {

  private static subscribers =
    new Set<RenderEventSubscriber>();

  /**
   * Реєстрація нового підписника.
   */
  static subscribe(
    subscriber: RenderEventSubscriber
  ): void {

    this.subscribers.add(subscriber);
  }

  /**
   * Видалення підписника.
   */
  static unsubscribe(
    subscriber: RenderEventSubscriber
  ): void {

    this.subscribers.delete(subscriber);
  }

  /**
   * Сповіщення всіх підписників.
   */
  static notify(
    context: RenderContext
  ): void {

    this.subscribers.forEach(
      subscriber => subscriber.update(context)
    );
  }
}


