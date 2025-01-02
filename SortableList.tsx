import React, { createContext } from "react";
import { DragDropContext, Droppable, DroppableProvided } from "react-beautiful-dnd";

interface ListProps {
  id: string,
  className?: string,
  onDragEnd: (...args: any) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

interface SortableListContextValues {
  id: string;
  disabled?: boolean;
}

export const SortableListContext = createContext<SortableListContextValues | null>(null);

const DroppableContent = ({ droppableId, className, children }: {
  droppableId: string;
  className: string;
  children: React.ReactNode;
}) => (
  <Droppable droppableId={droppableId}>
    {(provided: DroppableProvided) => (
      <div ref={provided.innerRef} {...provided.droppableProps} className={className}>
        {children}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export const SortableList = ({
                               id,
                               className = "",
                               onDragEnd,
                               children,
                               disabled = false,
                             }: ListProps) => (
  <SortableListContext.Provider value={{ id, disabled }}>
    <DragDropContext onDragEnd={onDragEnd}>
      <DroppableContent droppableId={id} className={className}>
        {children}
      </DroppableContent>
    </DragDropContext>
  </SortableListContext.Provider>
);