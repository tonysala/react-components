import React from "react";
import { useQuery } from "@apollo/client";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { Alert, AlertVariants } from "@components/Alert";
import { GET_COURSE_STORYBLOK_COMPONENTS } from "@services/graphQL/queries/courses";
import {faEye} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Component {
  component_type: string;
  component_id: string;
  component: {
    name: string;
    full_slug: string;
  };
}
interface ComponentTitle {
  slot: string;
  value: string;
}

interface StoryBlokComponentsProps {
  course_id: string;
}

export const StoryBlokComponents = ({ course_id }: StoryBlokComponentsProps) => {
  const { loading, error, data } = useQuery(GET_COURSE_STORYBLOK_COMPONENTS, {
    variables: { course_id },
  });
  if (loading) return <LoadingSpinner show={true} />;
  if (error) return <Alert variant={AlertVariants.DANGER}>Error: {error.message}</Alert>;
  const components: Component[] = data.course.components;
  const titles: ComponentTitle[] = data.course.componentTitles;
  const displayType: { desc: string } = data.course.displayType;

  const chooseUsUEAComponents = components.filter(
    (component) => component.component_type === "ChooseUsUEA"
  );
  // const relatedArticlesComponents = components.filter(
  //   (component) => component.component_type === "RelatedArticles"
  // );
  const otherComponents = components.filter(
    (component) =>
      component.component_type !== "ChooseUsUEA" && component.component_type !== "RelatedArticles" && !component.component_type.startsWith('slotUnder_')
  );
  let slots = [
    'Overview', 'Structure & Teaching', 'Accreditation', 'Entry Requirements',
    'Staff Profiles', 'Fees & Funding', 'How to Apply', 'Employability'
  ];

  const camelify = (string: string) => {
    return string
      .replace(/^\w|[A-Z]|\b\w/g, (letter, index) =>
        index === 0
          ? letter.toLowerCase()
          : letter.toUpperCase()
      ).replace(/[^A-z]+/g, '');
  }

  const useNames = displayType.desc == "Full";
  let slotItems: { [name: string]: [ComponentTitle, Component[]] } = {};
  slots.forEach((slotName: string) => {
    let camelcase = 'slotUnder_' + camelify(slotName);
    let title = titles.find(
      (title) => title.slot == camelcase
    ) || {slot: slotName, value: slotName}

    let slot = slotItems[slotName] || [title, []];
    slot[1].push(...components.filter(
      (component) => component.component_type === camelcase
    ));
    slotItems[slotName] = slot;
  });

  const renderComponents = (headline: string, components: Component[]) => (
    <div className="mb-2" key={`component__${headline}`}>
      <div className="text-sm font-bold text-gray-500 capitalize">{headline}</div>
      <ul>
        {components.length === 0 ? (
          <div className="text-sm text-gray-900">None</div>
        ) : (components.map((component, index) => (
          <li key={`component__${headline}_${index}`}>
            <div className="grid grid-cols-1 mb-2 gap-x-4">
              <div className="text-sm text-gray-900">
                <a target="_blank" className="hover:underline hover:text-orange mr-2"
                   href={'https://app.storyblok.com/#/me/spaces/185167/stories/0/0/' + component.component_id}>{component.component?.name ?? `Unknown ${component.component_id}`}</a>
                <a target="_blank" className="hover:underline hover:text-orange"
                   href={'https://testwww.uea.ac.uk/' + component.component.full_slug}>
                  <FontAwesomeIcon icon={faEye} size="lg"/>
                </a>
                {/*<iframe className="w-full"  src={'https://testwww.uea.ac.uk/' + component.component.full_slug} />*/}
              </div>
            </div>
          </li>
          )))}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col">
      {renderComponents("Dashboard", otherComponents)}
      {renderComponents("USPs", chooseUsUEAComponents)}

      {Object.entries(slotItems).map(([slotName, [title, components]], index: number) => (
        renderComponents((useNames) ? `${title.value} (under ${slotName})` : `${title.value} (Slot #${index + 1})`, components)
      ))}
    </div>
  );
};
