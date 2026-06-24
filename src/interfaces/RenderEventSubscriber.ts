import { RenderContext } from "./RenderContext";

/**
 * Observer у патерні Observer.
 *
 * Усі підписники повинні реалізовувати
 * метод update().
 */
export interface RenderEventSubscriber {
  update(context: RenderContext): void;
}