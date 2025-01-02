import React, { ReactNode, useEffect, useRef, useState } from "react";
import { connectStateResults, InstantSearch, SearchBox } from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import { Tag, TagVariants } from "@components/Tag";
import { DateTime } from "luxon";

interface CoursePickerProps {
  children?: ReactNode;
  onChange: (hit: any, event: any) => any;
  filter?: (hits: any) => any;
}

export const CoursePicker = (props: CoursePickerProps) => {
  const [showHits, setShowHits] = useState<boolean>(false);
  const hitsRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setTimeout(() => setShowHits((event.target as HTMLInputElement).value.length > 0), 25);
  };

  const handleClick = (event: MouseEvent) => {
    if (hitsRef.current && !hitsRef.current.contains(event.target as Node)) {
      setShowHits(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const client = algoliasearch(
    window._MIX_ALGOLIA_APP_ID ?? "",
    window._MIX_ALGOLIA_SECRET ?? "",
  );

  const Results = connectStateResults(({ searchState, searchResults }): any => {
    let results = searchResults.hits
    if (props.filter) {
      results = props.filter(results)
    }

    if (results.length) {
      return (
        <div className="hits-container" ref={hitsRef}>
          {results.map((hit: any) => (
              <div className="hit-item p-2" key={hit.objectID} onClick={(e) => props.onChange(hit, e)}>
                <div className="course-title">{hit.award_type?.code} {hit.title}</div>
                <div style={{
                  display: "flex",
                  flexDirection: "row",
                }}>
                  <Tag variant={TagVariants.INFO}>{hit.course_code}</Tag>
                  <Tag variant={TagVariants.INFO}>{DateTime.fromISO(hit.start_date).monthShort} {hit.academic_year}</Tag>
                  { hit.published && <Tag variant={TagVariants.SUCCESS}>published</Tag> }
                </div>
              </div>
            ),
          )}
        </div>
      );
    } else {
      return (
        <div className="hits-container" ref={hitsRef}>
          <div className="hit-item px-2 py-1">
            <div className="course-title text-gray-500">
              <em>No results found for "{searchState.query}"</em>
            </div>
          </div>
        </div>
      );
    }
  });

  return (
    <>
      <div className="grid grid-cols-4 py-5">
        <div className="grid col-span-4">
          <InstantSearch
            searchClient={client}
            indexName={window._MIX_ALGOLIA_INDEX_PREFIX + "courses"}
          >
            <SearchBox
              onKeyDown={handleKeyDown}
            />
            { props.children }
            {showHits && (
              <Results />
            )}
          </InstantSearch>
        </div>
      </div>
    </>
  );
};