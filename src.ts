import { useEffect, useRef } from "react";

export type OnDragHandler = (event: DragEvent) => void;
export type UseDragConfig = {
  onStart?: OnDragHandler;
  onDragging?: OnDragHandler;
  onDragOver?: OnDragHandler;
  onDragEnter?: OnDragHandler;
  onDragLeave?: OnDragHandler;
  onDrop?: OnDragHandler;
  droppable: boolean;
  draggable: boolean;
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
}: UseDragConfig) => {
  const ref = useRef<RefType>(null);
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
    if (ref.current) {
      ref.current.draggable = draggable;

      if (onStart) {
        ref.current.addEventListener("dragstart", onStart);
      }
      if (onDragging) {
        ref.current.addEventListener("drag", onDragging);
      }
      if (onDragEnter) {
        ref.current.addEventListener("dragenter", onDragEnter);
      }
      if (onDragLeave) {
        ref.current.addEventListener("dragleave", onDragLeave);
      }

      if (droppable && onDrop) {
        ref.current.addEventListener("drop", onDrop);
      }
      if (onDragOverHandler) {
        ref.current.addEventListener("dragover", onDragOverHandler);
      }
    }
    return () => {
      if (ref.current) {
        if (draggable) {
          ref.current.draggable = false;
        }
        if (onStart) {
          ref.current.addEventListener("dragstart", onStart);
        }
        if (onDragging) {
          ref.current.addEventListener("drag", onDragging);
        }
        if (onDragEnter) {
          ref.current.addEventListener("dragenter", onDragEnter);
        }
        if (onDragLeave) {
          ref.current.addEventListener("dragleave", onDragLeave);
        }
        if (droppable && onDrop) {
          ref.current.addEventListener("drop", onDrop);
        }
        if (onDragOverHandler) {
          ref.current.addEventListener("dragover", onDragOverHandler);
        }
      }
    };
  }, [onStart, onDragging, onDrop, ref.current]);
  return ref;
};
