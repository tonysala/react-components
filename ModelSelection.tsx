import React, { useEffect, useState } from "react";
import { Button, ButtonVariants } from "./Button";
import { MODELS } from "../collections/constants";
import { Alert, AlertVariants } from "./Alert";
import { Modal } from "@components/Modal";
import client from "@services/graphQL/client";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { Checkbox } from "@components/Checkbox";
import { Input } from "@components/Input";
import { GET_COLLECTION_OPTIONS } from "@services/graphQL/queries/collections";
import { useRoute } from "@context/RouterContext";
import { SortableList } from "./SortableList";
import { SortableListItem } from "./SortableListItem";
import { Tag, TagVariants } from "@components/Tag";
import Toggle from "@components/Toggle";

interface ModelSelectionProps {
  items: any[];
  onChange: (list: any[]) => void;
  models: string[];
}

export const ModelSelection = (props: ModelSelectionProps) => {
  const {
    items,
    onChange,
    models,
  } = props;

  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<string[]>([]);
  const [options, setOptions] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<any>({
    text: "",
    model: models[0],
  });
  const params = useRoute();

  useEffect(() => {
    if (!models.includes(filters.model)) {
      setFilters((previous: any) => ({ ...previous, model: models[0] }));
    }
    if (models.length > 0 && !options?.[filters.model]) {
      client.query({
        query: GET_COLLECTION_OPTIONS,
        variables: { id: params.collection, models: [filters.model] },
        fetchPolicy: "cache-first",
      }).then(({ data }) => {
        setOptions((previous: any) => ({ ...previous, [filters.model]: data.collection.options }));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [models, filters.model]);

  if (models.length === 0) {
    return <Alert variant={AlertVariants.DANGER}>You must select at least one type.</Alert>;
  }

  if (loading) {
    return <LoadingSpinner show={loading} />;
  }

  const actions = {
    add: (ids: string[]) => {
      const additions = ids.map(id => Object.values(options).flat().find((i: any) => i.id === id));
      if (additions) {
        onChange([...items, ...additions]);
      }
    },
    remove: (id: string) => {
      onChange(items.filter(i => i.id !== id));
    },
    reorder: (result: any) => {
      if (!result.destination) {
        return;
      }

      const reorderedItems = [...items];
      const [removed] = reorderedItems.splice(result.source.index, 1);
      reorderedItems.splice(result.destination.index, 0, removed);

      onChange(reorderedItems);
    },
    showOptions: () => {
      setShowModal(true);
    },
  };

  const shownResults = (options[filters.model] ?? [])
    .filter((item: any) => !items.map(i => i.id).includes(item.id))
    .filter((item: any) => filters.text.length ? MODELS[`App\\Models\\${item.__typename}`].searchable(item).toLowerCase().includes(filters.text.toLowerCase()) : true);

  return (
    <div className={"flex flex-col gap-2"}>
      {items.length === 0 && (
        <Alert variant={AlertVariants.WARNING}>No items selected.</Alert>
      )}
      <div className="flex flex-col min-w-full border rounded">
        <SortableList id={"collection-items"} onDragEnd={actions.reorder}>
          {items.map((item: any, i: number) => (
            <SortableListItem index={i} key={i}>
              <div className={`flex items-center bg-gray-50`}>
                <div
                  className={"flex flex-grow px-6 py-4"}>{MODELS[`App\\Models\\${item.__typename}`].display(item)}</div>
                <div className={"flex px-6 py-4"}>
                  <Tag variant={TagVariants.INFO}>{MODELS[`App\\Models\\${item.__typename}`].label}</Tag>
                </div>
                <div className={"flex px-6 py-4"}>
                  <button
                    className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center text-gray-600 text-xl font-bold"
                    onClick={() => actions.remove(item.id)}
                  >
                    &times;
                  </button>
                </div>
              </div>
            </SortableListItem>
          ))}
        </SortableList>
      </div>
      <div className="flex">
        <Button variant={ButtonVariants.INFO} onClick={() => actions.showOptions()}>Add to list</Button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <div className="flex-grow overflow-auto overflow-auto" style={{ width: "80vw" }}>
          <table className="min-w-full border rounded divide-y divide-gray-200 table-auto">
            <thead>
            <tr className={"sticky top-0 z-10"}>
              <th className="bg-gray-100 border items-center z-10 px-6 py-3" colSpan={3}>
                <div className="flex gap-2">
                  <div className="flex gap-2 items-center">
                    <span className={"uppercase text-sm"}>Select</span>
                    <Checkbox
                      value={shownResults.every((item: any) => selections.includes(item.id))}
                      onChange={(value: boolean) => {
                        if (value) {
                          setSelections(previous => [...previous, ...shownResults.map((i: any) => i.id)])
                        } else {
                          setSelections(previous => previous.filter((id: any) => !shownResults.map((i: any) => i.id).includes(id)))
                        }
                      }}
                    />
                  </div>
                  <Input
                    value={filters.text}
                    onChange={(value: string) => setFilters({ ...filters, text: value })}
                    placeholder="Filter selections"
                  />
                  <div className="flex">
                    {models.map((name: string, i: number) => {
                      return (
                        <div className="flex gap-2 p-2 items-center" key={i}>
                          <Toggle
                            value={filters.model === name}
                            onChange={(value: boolean) => {
                              setFilters((previous: any) => ({ ...previous, model: name }));
                            }}
                            size={"xs"}
                          />
                          <strong className="flex uppercase text-gray-600 text-xs w-16">{MODELS[name].label}</strong>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    variant={ButtonVariants.INFO}
                    disabled={selections.length === 0}
                    onClick={() => {
                      actions.add(selections);
                      setShowModal(false);
                      setSelections([]);
                    }}
                  >Add</Button>
                </div>
              </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
            {typeof options[filters.model] === "undefined" && (
              <tr className="items-center bg-gray-50">
                <td className="px-6 py-4 align-top" colSpan={3}>
                  <LoadingSpinner show={true} overlay={false} />
                </td>
              </tr>
            )}
            {shownResults.map((item: any, i: number) => (
              <tr key={i} className="items-center bg-gray-50">
                <td className="px-6 py-4 align-top">
                  <Checkbox
                    value={selections.includes(item.id)}
                    onChange={(value) =>
                      value ? setSelections(p => [...p, item.id]) : setSelections(p => p.filter(id => id !== item.id))
                    }
                  />
                </td>
                <td className="px-6 py-4 align-top">{MODELS[`App\\Models\\${item.__typename}`].display(item)}</td>
                <td className="px-6 py-4 align-top">
                  <Tag variant={TagVariants.INFO}>{MODELS[`App\\Models\\${item.__typename}`].label}</Tag>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};