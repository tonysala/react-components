import React, { useEffect, useState } from "react";
import Select from "react-select";
import { SEARCH_PEOPLE } from "@services/graphQL/queries/people";
import { Person } from "../../interfaces/Person";
import client from "@services/graphQL/client";
import { BackedOption } from "@components/Select";

interface PeoplePickerProps {
  disabled?: boolean;
  value?: Person;
  onSelect: (selected: Person) => void;
  exclude?: (string|number)[];
}

export const PeoplePicker = (props: PeoplePickerProps) => {
  const {
    disabled = false,
    value = null,
    exclude = [],
    onSelect,
  } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [results, setResults] = useState<BackedOption[]>([]);

  const loadPeople = async (value: string) => {
    setLoading(true);
    const { data } = await client.query({ query: SEARCH_PEOPLE, variables: { search: value } });
    if (data) {
      setLoading(false);
      let people = data.people;
      if (exclude.length) {
        people = people.filter((person: Person) => !exclude.includes(person.id));
      }
      setResults(people.map((person: Person) => {
        return {
          label: `${person.title ?? ""} ${person.forename} ${person.surname}`.trim(),
          value: person.id,
          model: person,
        } as BackedOption;
      }));
    }
  };

  const toOption = (person: Person): BackedOption => {
    return {
      label: `${person.title ?? ""} ${person.forename} ${person.surname}`.trim(),
      value: person.id,
      model: person,
    };
  }

  useEffect(() => {
    if (!input.length) {
      return;
    }

    setLoading(true)
    const debounceTimeout = setTimeout(() => {
      loadPeople(input);
    }, 500);

    return () => {
      setLoading(false)
      clearTimeout(debounceTimeout);
    };
  }, [input]);

  return (
    <>
      <Select
        isDisabled={disabled}
        className="relative block w-full text-sm"
        inputValue={input}
        value={value ? toOption(value) : value}
        options={results}
        closeMenuOnSelect={true}
        isClearable={true}
        onInputChange={(value: string) => setInput(value)}
        onChange={(option: BackedOption|null) => {
          onSelect(option?.model ?? null);
        }}
        noOptionsMessage={() => {
          if (loading) {
            return "Loading..."
          }
          if (input.length > 0) {
            return "No results found"
          }
          return "Start Typing to search..."
        }}
      />
    </>
  );
};