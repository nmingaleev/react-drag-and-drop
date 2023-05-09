import { FC, cloneElement, DragEventHandler, Children, ReactElement, useEffect, useState } from 'react';

export interface IDndContainerElement {
  onDrop?: DragEventHandler;
  onDragOver?: DragEventHandler;
  onDragStart?: DragEventHandler;
  isValidDropTarget?: boolean;
}

export interface IMoveEvent {
  from?: string;
  to?: string;
  elementId: string;
  groupId: string;
}

interface Props {
  id: string;
  children: ReactElement<IDndContainerElement>;
  allowedGroups: string[];
  groupId: string;
  onMove?: (event: IMoveEvent) => void;
}

export const DndContainer: FC<Props> = ({ id, children, groupId, allowedGroups, onMove }) => {
  const [isValidDropTarget, setIsValidDropTarget] = useState(false);

  const child = Children.only(children);

  useEffect(() => {
    const handleCustomDragStart = (event: CustomEventInit<IMoveEvent>) => {
      setIsValidDropTarget(allowedGroups.some(group => group === event.detail?.groupId));
    }

    const handleCustomDragEnd = () => {
      setIsValidDropTarget(false);
    }

    window.addEventListener('custom-drag-start', handleCustomDragStart);
    window.addEventListener('custom-drag-end', handleCustomDragEnd);

    return () => {
      window.removeEventListener('custom-drag-start', handleCustomDragStart);
      window.removeEventListener('custom-drag-end', handleCustomDragEnd);
    }
  }, [groupId, allowedGroups]);

  const handleDrop: DragEventHandler = (event) => {
    const customDragEndEvent = new CustomEvent('custom-drag-end');
    window.dispatchEvent(customDragEndEvent);

    const plainData = event.dataTransfer.getData("text/plain");
    const data = JSON.parse(plainData) as IMoveEvent;

    const canDrop = allowedGroups.some(allowedGroup => allowedGroup === data.groupId);
    if (!canDrop) return;

    event.preventDefault();

    if (onMove) {
      onMove({
        ...data,
        to: id,
      });
    }
  };

  const handleDragOver: DragEventHandler = (event) => {
    event.preventDefault();
  };

  const handleDragStart: DragEventHandler<HTMLElement> = (event) => {
    const target = event.target as HTMLElement;
    const targetId = target.getAttribute('id');
    if (!targetId) return;

    const data: IMoveEvent = {
      from: id,
      elementId: targetId,
      groupId,
    }

    event.dataTransfer.setData('text/plain', JSON.stringify(data));

    const customDtragStartEvent = new CustomEvent('custom-drag-start', { detail: data });

    window.dispatchEvent(customDtragStartEvent);
  };

  return cloneElement(
    child,
    {
      onDrop: handleDrop,
      onDragOver: handleDragOver,
      onDragStart: handleDragStart,
      isValidDropTarget,
    }
  );
}