import React from "react";
import { SortableList } from "./SortableList";
import { SortableListItem } from "./SortableListItem";
import { Button, ButtonVariants } from "@components/Button";
import { AssociatedPerson } from "../../interfaces/Person";
import { Input } from "@components/Input";

interface AssociatedPeopleProps {
  people: AssociatedPerson[],
  onUpdate: (people: AssociatedPerson[]) => void,
}

export const AssociatedPeople = (props: AssociatedPeopleProps) => {
  const {
    people,
    onUpdate
  } = props;

  const actions = {
    drag: (result: any) => {
      if (!result.destination || result.origin === result.destination) return;
      const updated = [...people];
      const [removed] = updated.splice(result.source.index, 1);
      updated.splice(result.destination.index, 0, removed);
      onUpdate(updated.map((person, i) => ({...person, display_order: i})));
    },
    remove: (id: string) => {
      const updated = people.filter((p) => p.id !== id);
      onUpdate(updated);
    },
  };

  return (
    <div className="flex flex-col border rounded-md p-2">
      <SortableList id={Math.random().toString(36)} onDragEnd={actions.drag} className="gap-2">
        {people.map((person, i) => (
          <SortableListItem
            key={i}
            index={i}
          >
            <div key={i} className="grid grid-cols-5 items-center gap-2 p-2 border-b last:border-0">
              <div className="flex items-center gap-2 col-span-2">
                <img
                  src={person.profile_photo}
                  alt={`${person.forename} ${person.surname}`}
                  className="w-12 h-12 rounded-full"
                />
                <span>{`${person.title ?? ""} ${person.forename} ${person.surname}`.trim()}</span>
              </div>
              <div className="flex items-center gap-2 col-span-3">
                <Input
                  value={person.association ?? ""}
                  placeholder={"Association..."}
                  className="w-full"
                  onChange={(value: string) => {
                    console.log(people)
                    console.log(people.map(p => p.id === person.id ? { ...p, association: value } : p))
                    onUpdate(people.map(p => p.id === person.id ? { ...p, association: value } : p));
                  }}
                />
                <Button
                  variant={ButtonVariants.DANGER}
                  onClick={() => actions.remove(person.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </SortableListItem>
        ))}
        {people.length === 0 && (
          <span className="flex text-sm text-center text-gray-500 m-4">No people</span>
        )}
      </SortableList>
    </div>
  );
};

export interface KeyComponentProps extends ValueComponentProps {
  index: number,
}

export interface ValueComponentProps {
  people: any[];
  setItems: any;
  selected: number;
  actions: {
    drag: (result: any) => void;
    add: () => void;
    remove: (index: number) => void;
    reset: (index: number) => void;
  };
}