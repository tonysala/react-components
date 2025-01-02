import React, { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import { SortableListContext } from "@components/SortableList";

interface SortableListItemProps {
  index: number,
  onClick?: (props: any) => any,
  className?: string,
  selected?: boolean,
  children: any;
}

export const SortableListItem = (props: SortableListItemProps) => {
  const { index, children, className = "", selected = false } = props;
  const context = useContext(SortableListContext);

  if (!context) {
    throw new Error("SortableListItem must be used within a SortableList");
  }

  const { id, disabled } = context;

  return (
    <Draggable
      key={`${index}`}
      draggableId={`${id}-${index}`}
      index={index}
      isDragDisabled={disabled}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          className={`item ${selected ? "selected" : ""} ${disabled ? "" : "draggable"} ${className}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={props?.onClick}
        >
          {children}
        </div>
      )}
    </Draggable>
  );
};
