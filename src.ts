import { act, RefObject, useEffect, useRef } from "react";

export type OnDragHandler = (event: DragEvent) => void;
export type UseDragConfig<RefType extends HTMLElement> = {
  onStart?: OnDragHandler;
  onDragging?: OnDragHandler;
  onDragOver?: OnDragHandler;
  onDragEnter?: OnDragHandler;
  onDragLeave?: OnDragHandler;
  onDrop?: OnDragHandler;
  droppable: boolean;
  draggable: boolean;
  ref?: RefObject<RefType>
};
export const useDnD = <RefType extends HTMLElement>({
  onStart,
  onDragging,
  onDrop,
  onDragOver,
  onDragEnter,
  onDragLeave,
  droppable,
  draggable,
  ref
}: UseDragConfig<RefType>) => {
  const uncontrolledRef = useRef<RefType>(null);
  const actualRef = ref ? ref : uncontrolledRef;
  useEffect(() => {
    let onDragOverHandler: OnDragHandler | undefined = droppable
      ? (e) => {
          e.preventDefault();
        }
      : undefined;
    if (onDragOver) {
      if (droppable) {
        onDragOverHandler = (e) => {
          e.preventDefault();
          return onDragOver(e);
        };
      } else {
        onDragOverHandler = onDragOver;
      }
    }
    if (actualRef.current) {
      actualRef.current.draggable = draggable;

      if (onStart) {
        actualRef.current.addEventListener("dragstart", onStart);
      }
      if (onDragging) {
        actualRef.current.addEventListener("drag", onDragging);
      }
      if (onDragEnter) {
        actualRef.current.addEventListener("dragenter", onDragEnter);
      }
      if (onDragLeave) {
        actualRef.current.addEventListener("dragleave", onDragLeave);
      }

      if (droppable && onDrop) {
        actualRef.current.addEventListener("drop", onDrop);
      }
      if (onDragOverHandler) {
        actualRef.current.addEventListener("dragover", onDragOverHandler);
      }
    }
    return () => {
      if (actualRef.current) {
        if (draggable) {
          actualRef.current.draggable = false;
        }
        if (onStart) {
          actualRef.current.addEventListener("dragstart", onStart);
        }
        if (onDragging) {
          actualRef.current.addEventListener("drag", onDragging);
        }
        if (onDragEnter) {
          actualRef.current.addEventListener("dragenter", onDragEnter);
        }
        if (onDragLeave) {
          actualRef.current.addEventListener("dragleave", onDragLeave);
        }
        if (droppable && onDrop) {
          actualRef.current.addEventListener("drop", onDrop);
        }
        if (onDragOverHandler) {
          actualRef.current.addEventListener("dragover", onDragOverHandler);
        }
      }
    };
  }, [onStart, onDragging, onDrop, actualRef.current]);
  return actualRef;
};
