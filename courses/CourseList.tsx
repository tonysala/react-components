import React, { useState } from "react";
import { Configure, InstantSearch, useHits, UseHitsProps } from "react-instantsearch-hooks-web";
import algoliasearch from "algoliasearch/lite";
import { Button, ButtonVariants } from "@components/Button";
import { DateTime } from "luxon";
import {
  ClearRefinements,
  MonthRefinement,
  Pagination,
  RefinementPicker,
  RefinementTriStateToggle,
  SearchBox,
} from "@components/courses/SearchFilters";
import { useCurrentUser } from "@context/UserContext";

const CourseList = () => {

  const PER_PAGE = 25;
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const { hasPermission } = useCurrentUser();

  const algolia = {
    "app_id": window._MIX_ALGOLIA_APP_ID ?? "",
    "secret": window._MIX_ALGOLIA_SECRET ?? "",
    "index": `${window._MIX_ALGOLIA_INDEX_PREFIX}courses`,
  };

  const searchClient = algoliasearch(algolia.app_id, algolia.secret);

  function CourseResults(props: UseHitsProps) {
    const { hits } = useHits<UseHitsProps>(props);

    return (
      <>
        {hits.length ? hits.map((hit: any, index: number) => {
          const id = hit.objectID.substring(19);
          return (
            <tr key={hit.objectID} className={`items-center ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
              <td className={"px-6 py-4 align-top flex flex-col"}>
                <div className="flex gap-6">
                  <div className="text-xs uppercase text-gray-500">{hit.course_code}</div>
                  <div className="text-xs uppercase text-gray-500">{hit.award_type?.code}</div>
                </div>
                <div>
                  <a className={"hover:text-orange hover:underline"} href={`/courses/${id}`}>{hit.title}</a>
                </div>
                <div className={"flex gap-4"}>
                  <a className={"flex text-xs text-blue-600 hover:underline"} href={`/courses/${id}`}>View</a>
                  {hasPermission("course:update") && (
                    <a className={"flex text-xs text-blue-600 hover:underline"} href={`/courses/${id}/edit`}>Edit</a>
                  )}
                  {hasPermission("course:copy:details") && (
                    <a className={"flex text-xs text-blue-600 hover:underline"} href={`/courses/${id}/copy`}>Copy</a>
                  )}
                </div>
              </td>
              <td className={"px-6 py-4 align-top"}>{hit.academic_year}</td>
              <td className={"px-6 py-4 align-top"}>{DateTime.fromISO(hit.start_date).toFormat("dd/LL/yyyy")}</td>
              <td className={"px-6 py-4 align-top"}>{hit.course_type.name}</td>
              <td className={"px-6 py-4 align-top"}>
                <StatusIndicator className={"justify-center"} value={hit.is_sits_fed} />
              </td>
              <td className={"px-6 py-4 align-top"}>
                <StatusIndicator className={"justify-center"} value={hit.published} />
              </td>
            </tr>
          );
        }) : (
          <tr>
            <td colSpan={6} className={"flex m-4 w-full"}>
              <span className={"text-gray-300"}>No Results</span>
            </td>
          </tr>
        )}
      </>
    );
  }


  return (
    <InstantSearch searchClient={searchClient} indexName={algolia.index}>
      <div className="flex flex-col gap-4 border shadow rounded-md p-2 bg-gray-100 mb-4">
        <Configure hitsPerPage={PER_PAGE} />
        <div className="flex flex-row gap-4">
          <SearchBox placeholder="Search course title / code" className="flex-grow" />
          <Button
            variant={ButtonVariants.INFO}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >{showAdvancedFilters ? "Hide" : "Show"} advanced filters</Button>
        </div>
        <div className={`flex flex-col gap-4 ${!showAdvancedFilters && "hidden"}`}>
          <RefinementPicker attribute="level_of_study" />
          <RefinementPicker attribute="academic_year" />
          <MonthRefinement attribute="month" />
          <RefinementPicker attribute="categories" />
          <div className="flex flex-row gap-12">
            <RefinementTriStateToggle key={`toggle-is-sits-fed`} attribute="is_sits_fed" label={"SITS Fed"} />
            <RefinementTriStateToggle key={`toggle-published`} attribute="published" label={"Published"} />
          </div>
          <ClearRefinements title={"Reset filters"} />
        </div>
      </div>
      <div className="flex border shadow rounded-md text-monospace">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Course
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              AYR
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Start Date
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Course Type
            </th>
            <th className="w-4 px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              SITS
            </th>
            <th className="w-4 px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Published
            </th>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-150">
          <CourseResults />
          </tbody>
        </table>
      </div>
      <Pagination perPage={PER_PAGE}/>
    </InstantSearch>
  );
};

const StatusIndicator = ({ value, className }: {
  value: boolean,
  className: string
}) => {
  return (
    <div className={`flex ${className}`}>
      <span className={`inline-block w-2 h-2 m-1 bg-${value ? "green" : "red"}-500 rounded-md`}></span>
    </div>
  );
};

export default CourseList;
