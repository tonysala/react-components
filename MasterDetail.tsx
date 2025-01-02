import React, { ComponentType, useEffect, useState } from "react";
import { SortableList } from "./SortableList";
import { SortableListItem } from "./SortableListItem";
import { Button, ButtonVariants } from "@components/Button";
import { useCurrentUser } from "@context/UserContext";

export interface KeyValue {
  key: string;
  value: string;
  original: {
    key: string;
    value: string;
  };
}

interface MasterDetailProps<T> {
  KeyComponent: ComponentType<KeyComponentProps>,
  ValueComponent: ComponentType<ValueComponentProps>,
  items: T[],
  setItems: (items: T[]) => void,
  template: any,
}

export const MasterDetail = <T extends KeyValue,>(props: MasterDetailProps<T>) => {
  const { items = [], setItems, KeyComponent, ValueComponent, template } = props;
  const [ selected, setSelected ] = useState<number>(items.length ? 0 : -1);
  const { hasPermission } = useCurrentUser();

  useEffect(() => {
    if (selected > (items.length - 1)) {
      setSelected(items.length)
    }
  }, [items, selected]);

  const actions = {
    drag: (result: any) => {
      if (!result.destination || result.origin === result.destination) return;
      const updated = [...items];
      const [removed] = updated.splice(result.source.index, 1);
      updated.splice(result.destination.index, 0, removed);
      setItems(updated);
      setSelected(result.destination.index);
    },
    add: () => {
      setItems([...items, template])
      setSelected(items.length)
    },
    remove: (index: number) => {
      setItems(items.filter((_, i) => i !== index))
    },
    reset: (index: number) => {
      const updated = [...items];
      updated[index].value = updated[index].original?.value;
      setItems(updated);
    },
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-1 border rounded gap-2 justify-between">
        <SortableList id="master_detail" onDragEnd={actions.drag} className="sortable-list">
          { items.map((_, i) => (
            <SortableListItem
              key={i}
              index={i}
              onClick={() => setSelected(i)}
              selected={selected === i}
            >
              <KeyComponent index={i} selected={selected} items={items} setItems={setItems} actions={actions}/>
            </SortableListItem>
          )) }
          { items.length === 0 && (
            <span className="flex text-sm text-center text-gray-500 m-4">No items</span>
          ) }
        </SortableList>
        <Button
          variant={ButtonVariants.INFO}
          onClick={actions.add}
          disabled={!hasPermission("course:update:entry_requirement")}
          className="m-2"
        >Add section</Button>
      </div>
      <div className="col-span-2 flex flex-col gap-2">
        <ValueComponent selected={selected} items={items} setItems={setItems} actions={actions}/>
      </div>
    </div>
  )
}

export interface KeyComponentProps extends ValueComponentProps {
  index: number,
}

export interface ValueComponentProps {
  items: any[];
  setItems: any;
  selected: number;
  actions: {
    drag: (result: any) => void;
    add: () => void;
    remove: (index: number) => void;
    reset: (index: number) => void;
  };
}
