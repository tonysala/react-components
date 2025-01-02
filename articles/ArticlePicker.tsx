import React from "react";
import AsyncSelect from "react-select/async";
import { gql } from "@apollo/client";
import { SEARCH_ARTICLES } from "@services/graphQL/queries/articles";
import client from "@services/graphQL/client";

interface ArticlePickerProps {
  value: any;
  disabled?: boolean;
  onChange: (selected: any) => void;
  multiple?: boolean;
  maximum?: number;
  exclude?: string[];
}

export const ArticlePicker = (props: ArticlePickerProps) => {
  const {
    value = null,
    disabled = false,
    onChange,
    multiple = false,
    maximum,
    exclude = [],
  } = props;

  const loadOptions = (input: string, callback: (options: any[]) => void) => {
    client
      .query({
        query: gql`
          ${SEARCH_ARTICLES}
        `,
        variables: { term: input },
      })
      .then((response) => {
        const data = response.data.newsArticleFilter.data.filter(
          (item: any) => !exclude.includes(item.id)
        );
        console.log(data);

        const options = data.map((item: any) => ({
          value: item.id,
          label: `${item.title} (${item.slug})`,
        }));

        callback(options);
      });
  };

  const Result = (props: any) => {
    const { data, selectOption } = props;

    return (
      <>
        <div
          className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-200 text-sm"
          onClick={() => {
            if (multiple) {
              if (maximum && value.length >= maximum) {
                return;
              }
              selectOption(data);
              const newList = [...value, data];
              onChange(newList);
            } else {
              selectOption(data.value);
              onChange(data);
            }
          }}
        >
          <div>{data.label}</div>
        </div>
      </>
    );
  };

  const commonStyles: string = "relative block w-full text-sm";

  return (
    <>
      <AsyncSelect
        components={{ Option: Result }}
        isDisabled={disabled}
        className={commonStyles}
        classNamePrefix="select"
        value={value}
        loadOptions={loadOptions}
        closeMenuOnSelect={true}
        cacheOptions={true}
        isClearable={true}
        onChange={(option) => onChange(option)}
        isMulti={multiple}
        placeholder="Start typing to fetch articles..."
      />
    </>
  );
};
