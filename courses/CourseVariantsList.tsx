import React, { useState } from "react";
import { Course } from "../../../interfaces";
import { CourseItem } from "./CourseItem";
import { userCan } from "@helpers/userCan";
import { Button, ButtonVariants } from "../Button";
import { useToast } from "../Toast";
import { AlgoliaCourseResult } from "../../../interfaces/AlgoliaCourseResult";
import { SortableList } from "../SortableList";
import { SortableListItem } from "../SortableListItem";
import { useCurrentUser } from "@context/UserContext";
import { useCurrentCourse } from "@context/CourseContext";
import { Configure } from "react-instantsearch-dom";
import { transformCourse } from "@helpers/algoliaSearch";
import { CoursePicker } from "@components/courses/CoursePicker";

interface FormState {
  submitting: boolean,
  saved: boolean,
}

interface CourseVariantsListProps {
  courses: Course[],
  setCourses: any,
  filter: (hits: any, selected: any) => any
}

export const CourseVariantsList = (props: CourseVariantsListProps) => {
  const {
    courses,
    setCourses,
    filter,
  } = props;

  const [formState, setFormState] = useState<FormState>({ submitting: false, saved: true });
  const { user, hasPermission } = useCurrentUser();
  const { course } = useCurrentCourse();
  const toast = useToast();
  const canManage = hasPermission("course:update:course_link");

  const addToList = (item: AlgoliaCourseResult) => {
    if (courses.length >= 10) {
      return;
    }
    setFormState({ ...formState, saved: false });
    const course = transformCourse(item);
    setCourses((current: Course[]) => [...current, course]);
  };

  const removeFromList = (id: string) => {
    setFormState({ ...formState, saved: false });
    setCourses((current: Course[]) => current.filter(variant => variant.id !== id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || result.origin === result.destination) {
      return;
    }
    setFormState({ ...formState, saved: false });
    const newCourseList = [...courses];
    const [removedCourse] = newCourseList.splice(result.source.index, 1);
    newCourseList.splice(result.destination.index, 0, removedCourse);
    setCourses(newCourseList);
  };

  const handleSubmit = () => {
    setFormState({ ...formState, submitting: true });
    const csrfToken = document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") ?? "";

    fetch(`/courses/${course.id}/links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRF-TOKEN": csrfToken,
      },
      body: JSON.stringify({
        course_links: courses.map((course: Course, index: number) => ({ "id": course.id, "sequence": index })),
        course_link_type: "1",
      }),
    }).then(response => {
      if (response.ok) {
        setFormState({ submitting: false, saved: true });
        toast.notify(
          <div className="success">
            Changes made to the Course Variants are saved successfully.
          </div>,
          10000,
        );
      } else {
        setFormState({ submitting: false, saved: false });
        toast.notify(
          <div className="danger">
            Error occurred when saving Course Variants
          </div>,
          10000,
        );
      }
    });
  };

  return (
    <>
      {canManage && (
        <CoursePicker onChange={(hit) => addToList(hit)} filter={(hits: any) => filter(hits, courses)}>
          <Configure filters={`academic_year:'${course.academic_year}'`} />
        </CoursePicker>
      )}
      <SortableList id="course_variants_list" onDragEnd={handleDragEnd} disabled={!canManage}>
        {courses && courses.length ? courses
          .map((variant: Course, index: number) => (
            <SortableListItem
              index={index}
              key={index}
            >
              <CourseItem
                course={variant}
                deletable={userCan("course:update:links", user)}
                onDelete={(id) => removeFromList(id)}
              />
            </SortableListItem>
          )) : <em className="text-gray-500">No course variants</em>}
      </SortableList>
      {canManage && (
        <Button
          className="self-start mt-6"
          variant={ButtonVariants.SUCCESS}
          onClick={() => handleSubmit()}
          disabled={formState.submitting || formState.saved || courses.length > 10}
        >Submit</Button>
      )}
    </>
  );
};
