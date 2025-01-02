import React, { useState } from "react";
import { Course } from "../../../interfaces";
import Toggle from "@components/Toggle";
import { Button, ButtonVariants } from "@components/Button";
import DateTimePicker from "@components/DateTimePicker";
import { DateTime } from "luxon";
import { Option, Select } from "@components/Select";
import { Tag, TagVariants } from "@components/Tag";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { CoursePicker } from "@components/courses/CoursePicker";

export interface EntryPoint {
  course?: Course;
  default: boolean;
  start_date: DateTime;
  source?: Course;
}

interface CourseFamilyProps {
  data: EntryPoint[];
}

export const CourseFamily = (props: CourseFamilyProps) => {
  const [family, setFamily] = useState<EntryPoint[]>(props.data);
  const [loading, setLoading] = useState<boolean>(false);

  const addCoursesToFamily = (courses: EntryPoint[]) => {
    const newCourses = courses.filter(course =>
      !!course.course || !family.some(f => f.course?.id === course.course?.id),
    );

    setFamily([...family, ...newCourses]);
  };

  const handleRemove = (id: number) => {
    const removedCourseId = family[id].course?.id;
    const updatedEntryPoints = family.filter((entryPoint: EntryPoint, index) => index !== id);

    // Update the source for any courses that were using the removed course as a source
    const newEntryPoints = updatedEntryPoints.map((entryPoint: EntryPoint) => {
      if (entryPoint.source?.id === removedCourseId) {
        return { ...entryPoint, source: updatedEntryPoints[0]?.course ?? null };
      }
      return entryPoint;
    });

    setFamily(newEntryPoints as EntryPoint[]);
  };

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let date;

    const maxDate = family.reduce((max, current) =>
      max.start_date > current.start_date ? max : current,
    ).start_date;
    date = maxDate.plus({ months: 1 }).startOf("month");
    const validSources = family.filter((instance: EntryPoint) => instance.default && instance.course);
    const source = validSources.length === 0 ? family[0] : validSources[0];

    setFamily([
      ...family,
      {
        start_date: date,
        default: false,
        source: source.course,
      },
    ]);
  };

  const handleLink = (item: any, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Get the link's family
    setLoading(true);
    const id = item.objectID.split("::")[1];
    fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
            {
              course(id: "${id}") {
                family {
                  courses {
                    title
                    start_date
                    id
                    course_code
                    academic_year
                  }
                }
              }
            }
          `,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let courseData = data.data;
        let courses = courseData.course?.family?.courses;
        if (courses) {
          addCoursesToFamily(courses.map((course: Course) => (
            {
              default: false,
              course: course,
              start_date: DateTime.fromSQL(course.start_date),
            }
          )));
        } else {
          addCoursesToFamily([{
            default: false,
            course: { ...item, id: item.objectID.split("::")[1] },
            start_date: DateTime.fromISO(item.start_date),
          }]);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleToggle = (id: number) => {
    setFamily(
      family.map((entryPoint: any, index) => {
        if (index === id) {
          return { ...entryPoint, default: !entryPoint.default };
        } else {
          return { ...entryPoint, default: false };
        }
      }),
    );
  };

  const handleDateChange = (id: number, date: DateTime | null) => {
    setFamily(
      family.map((entryPoint: any, index) => {
        if (index === id) {
          return { ...entryPoint, start_date: date };
        } else {
          return entryPoint;
        }
      }),
    );
  };

  const handleSourceChange = (id: number, sourceId: string) => {
    const sourceCourse = family.find((entry: EntryPoint) => entry.course?.id === sourceId);

    setFamily(
      family.map((entryPoint: any, index) => {
        if (index === id) {
          return { ...entryPoint, source: sourceCourse?.course };
        } else {
          return entryPoint;
        }
      }),
    );
  };

  const canBeDeleted = (item: EntryPoint) => {
    const sources = family.filter((entryPoint: EntryPoint) => entryPoint.course);
    const isLastSource = sources.length === 1 && item.course?.id === sources[0].course?.id;

    return !(isLastSource || item.default);
  };

  const toAcademicYear = (date: DateTime): string => {
    const year = date.year;
    const month = date.month;

    if (month >= 9) {
      return `${year}/${(year + 1).toString().slice(-2)}`;
    } else {
      return `${year - 1}/${year.toString().slice(-2)}`;
    }
  };

  const toOptions = (family: EntryPoint[]): Option[] => (
    family
      .filter((item: EntryPoint) => item.course)
      .map((item: EntryPoint) => (
        {
          value: item.course?.id ?? "",
          label: `${item.course?.title} ${item.start_date.monthShort} ${item.course?.academic_year}`,
        }
      ))
  );

  const selectedCourses = family.filter(entry => entry.course).map((entry: EntryPoint) => entry.course) as Course[];

  const filterResults = (results: any, selected: any) => {
    const ids = new Set(selected.map((item: any) => item.id));
    return results.filter((hit: any) => {
      return !ids.has(hit.objectID.split("::")[1]);
    });
  };

  return (
    <>
      <LoadingSpinner show={loading} overlay={true} />
      <div className="flex flex-col gap-4">
        <h2>Add an existing course to the family</h2>
        <CoursePicker
          onChange={(selected: Option, event: any) => handleLink(selected, event)}
          filter={(hits: any) => filterResults(hits, selectedCourses)} />
        <h2>Course Family</h2>
        <table className="min-w-full divide-y divide-gray-200 table-auto border-b border-gray-200 shadow sm:rounded-lg">
          <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Course Info
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              EntryPoint Date
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Copy From
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Default
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Remove
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {family.map((item, index) => (
            <tr
              key={`entry-point-` + index}
              className="bg-white border-b border-gray-100"
              style={item.course ? {} : { borderLeft: "3px solid #88d088" }}
            >
              <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                <Tag variant={item.course ? TagVariants.INFO : TagVariants.SUCCESS} style={{
                  display: "flex",
                  justifyContent: "space-around",
                }}>
                  <span>{item.course?.course_code ?? item.source?.course_code}</span>
                  <span>{item.start_date.monthShort + " " + toAcademicYear(item.start_date)}</span>
                </Tag>
              </td>
              <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                <div className="flex items-center justify-between">
                  {!!item.course ? (
                    <span className={"text-sm"}>{item.start_date.toFormat("dd/LL/yyyy")}</span>
                  ) : (
                    <DateTimePicker
                      selectedDate={item.start_date}
                      onDateChange={(date: DateTime | null) => handleDateChange(index, date)}
                    />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                {item.course === undefined && (
                  <Select
                    value={toOptions(family).find(option => option.value === item.source?.id)}
                    options={toOptions(family)}
                    onChange={(selection: Option) => handleSourceChange(index, selection.value.toString())}
                    className={"w-64"}
                  />
                )}
              </td>
              <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                <Toggle
                  id={`toggle-${index}`}
                  value={item.default}
                  disabled={family.length === 1 || item.default}
                  onChange={() => handleToggle(index)}
                />
              </td>
              <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                <Button
                  variant={ButtonVariants.DANGER}
                  onClick={() => handleRemove(index)}
                  tip={item.default ? "You cannot delete a default selection." : "This will remove the link."}
                  disabled={!canBeDeleted(item)}
                >Remove</Button>
                <input type="hidden" name={`course_family[${index}][id]`} value={item.course?.id} />
                <input type="hidden" name={`course_family[${index}][source]`} value={item.source?.id} />
                <input type="hidden" name={`course_family[${index}][default]`}
                       value={item.default.toString()} />
                <input type="hidden" name={`course_family[${index}][entry_date]`}
                       value={item.start_date.toFormat("yyyy-MM-dd HH:mm:ss")} />
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        <div className="flex gap-2">
          <Button variant={ButtonVariants.INFO} onClick={(e) => handleAdd(e)}>+ Create entry point</Button>
          <Button variant={ButtonVariants.SUCCESS}
                  onClick={() => (document.querySelector("#family_form") as HTMLFormElement)?.submit()}
          >Save</Button>
        </div>
      </div>
    </>
  );
};
