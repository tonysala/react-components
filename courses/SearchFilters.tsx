import {
  ClearRefinementsProps,
  PaginationProps,
  RefinementListProps,
  SearchBoxProps,
  ToggleRefinementProps,
  useClearRefinements,
  usePagination,
  useRefinementList,
  useSearchBox,
  useToggleRefinement,
} from "react-instantsearch-hooks-web";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Button, ButtonVariants } from "@components/Button";
import { DateTime } from "luxon";
import { Input } from "@components/Input";
import { Tag, TagVariants } from "@components/Tag";
import { Pagination as Paginator } from "@components/Pagination";
import TriStateToggle, { ToggleState } from "@components/TriStateToggle";
import Toggle from "@components/Toggle";

interface OptionType {
  value: string;
  label: string;
}

export const RefinementPicker = (props: RefinementListProps) => {
  const { refine, items } = useRefinementList({
    ...props,
    sortBy: ["name:asc"],
    limit: 100000,
  });

  const options: OptionType[] = items.map(item => ({
    value: item.value,
    label: item.label,
  }));

  const selected: OptionType[] = items
    .filter(item => item.isRefined)
    .map(item => ({
      value: item.value,
      label: item.label,
    }));

  const handleChange = (options: OptionType[]) => {
    const added = options.find((item: OptionType) => !selected.some(option => option.value === item.value));
    const removed = selected.find((item: OptionType) => !options.some(option => option.value === item.value));
    const changed = added || removed;
    if (changed) {
      refine(changed.value);
    }
  };

  const OptionComponent = ({ option, meta }: { option: OptionType, meta: any }) => {
    return (
      <div className="flex justify-between items-center">
        <div>{option.label}</div>
        {meta.context === "menu" && (
          <Tag variant={TagVariants.INFO}>{items.find((item: any) => item.value === option.value)?.count}</Tag>
        )}
      </div>
    );
  };

  return (
    <div>
      <label className={"uppercase text-xs"}>{props.attribute.replace(/_/g, " ")}</label>
      <Select
        isMulti={true}
        options={options}
        value={selected}
        onChange={(options: any) => handleChange(options)}
        isSearchable={true}
        className={"text-sm"}
        formatOptionLabel={(option: OptionType, meta: any) => <OptionComponent option={option} meta={meta} />}
      />
    </div>
  );
};

export const RefinementToggle = (props: ToggleRefinementProps) => {
  const { refine } = useToggleRefinement(props);

  const [checked, setChecked] = useState(false);

  const handleToggle = (checked: boolean) => {
    setChecked(previous => !previous);
    refine({ isRefined: !checked });
  };

  return (
    <div className={"flex items-center gap-4"}>
      <label className={"uppercase text-xs"}>{props.label}</label>
      <Toggle
        id={`refinement-toggle-${props.attribute}`}
        value={checked}
        disabled={false}
        onChange={handleToggle}
      />
    </div>
  );
};

export const RefinementTriStateToggle = (props: ToggleRefinementProps) => {
  const { items, refine } = useRefinementList(props);
  const [ state, setState ] = useState<ToggleState>(ToggleState.EITHER)

  useEffect(() => {
    setState(toState(items))
  }, [items]);

  const toState = (items: any[]): ToggleState => {
    const value = items.find((item) => item.isRefined)?.value?.toUpperCase();
    if (value in ToggleState) {
      return ToggleState[value as keyof typeof ToggleState];
    }
    return ToggleState.EITHER;
  };

  const handleToggle = (state: ToggleState) => {
    [ToggleState.TRUE, ToggleState.FALSE].forEach((stateOption: ToggleState) => {
      const selected = ToggleState[stateOption] === ToggleState[state];
      const option = items.find((item) => item.value === ToggleState[stateOption].toLowerCase())
      if ((selected && !option?.isRefined) || (!selected && option?.isRefined)) {
        option && refine(option.value);
      }
    });
  };

  return (
    <div className={"flex items-center gap-4"}>
      <label className={"uppercase text-xs"}>{props.label}</label>
      <TriStateToggle
        disabled={items.length < 2}
        onChange={(state) => handleToggle(state)}
        initialState={state}
      />
    </div>
  );
};

export const Pagination = (props: PaginationProps & {perPage: number}) => {
  const { nbHits, nbPages, refine, currentRefinement } = usePagination(props);

  const onPageChange = (page: number) => {
    if (page <= 0 || page >= nbPages) {
      return
    }
    refine(page - 1)
  }

  return (
    <Paginator
      currentPage={currentRefinement + 1}
      onPageChange={(page: number) => onPageChange(page)}
      total={nbHits}
      perPage={props.perPage}
      totalPages={nbPages}/>
  );
};

export const SearchBox = (props: SearchBoxProps) => {
  const { refine, query } = useSearchBox(props);

  return (
    <div className="flex flex-grow">
      <Input
        placeholder="Course title or course code"
        className={`${props.className} flex flex-grow`}
        onChange={(value: string) => refine(value)}
        value={query}
      />
    </div>
  );
};

export const ClearRefinements = (props: ClearRefinementsProps) => {
  const { refine, canRefine } = useClearRefinements(props);

  return (
    <Button variant={ButtonVariants.INFO} onClick={refine} disabled={!canRefine}>
      Clear dropdown filters
    </Button>
  );
};

export const MonthRefinement = (props: RefinementListProps) => {
  const transformItems = (items: any[]) =>
    items.map((item) => ({
      ...item,
      label: DateTime.fromObject({ month: item.label }).monthLong,
    }));

  return (
    <RefinementPicker
      attribute={props.attribute}
      transformItems={transformItems}
      // @ts-ignore
      sortBy={["value:asc"]}
    />
  );
};
