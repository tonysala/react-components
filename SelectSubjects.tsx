import React, { useEffect, useState } from "react";
import Select from "react-select";

export interface Option {
  value: string;
  label: string | Element | Function;
  selected?: boolean;
}

interface SelectProps {
  disabled?: boolean;
}

export const SelectSubjects = (props: SelectProps) => {
  const [options, setOptions] = useState<any>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<any>([]);

  const hiddenInput = (option: FormattedTagObject, i: number) => {
    return (
      <input
        type="hidden"
        name="course_subject[]"
        value={JSON.stringify({ label: option.label, value: option.value })}
        key={i}
      />
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.storyblok.com/v2/cdn/datasource_entries?datasource=global-subjects&per_page=200&token=${window._STORYBLOK_API_KEY_GLOBAL}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        const subjectOptions = jsonData.datasource_entries.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));

        setOptions(subjectOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // fetch initial value if exists
    const initialValue = window.__old.subjects;
    if (initialValue) {
      const setSubjectArray = initialValue.map((subject: any) => ({
        value: subject.entry_id,
        label: subject.name,
      }));
      // Parse each item in the array
      // const setSubjectArray = parsedInitialValue.map((item: string) => JSON.parse(item));
      setSelectedSubjects(setSubjectArray);
    }
  }, []);

  const commonStyles: string =
    "block w-full shadow-md focus:ring-orange focus:border-orange sm:col-span-2 sm:text-sm border-solid border border-gray-300 rounded-md p-1 readonly:bg-gray-600";
  let variantStyles;
  if (props.disabled) {
    variantStyles = " opacity-50";
  }

  const classes = `${commonStyles} ${variantStyles}`;
  console.log(selectedSubjects);
  return (
    <>
      <label className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-b sm:border-gray-200 sm:py-5">
        <span>Subject(s)</span>
        <Select
          label="Select subjects"
          isDisabled={props.disabled}
          className={classes}
          isMulti
          classNamePrefix="select"
          options={options}
          closeMenuOnSelect={true}
          onChange={(subjects: any) => setSelectedSubjects(subjects)}
          value={selectedSubjects}
        />
        {selectedSubjects &&
          Array.isArray(selectedSubjects) &&
          selectedSubjects.map((tag, i) => {
            return hiddenInput(tag, i);
          })}
      </label>
    </>
  );
};
