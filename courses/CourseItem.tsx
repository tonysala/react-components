import { Button, ButtonVariants } from "@components/Button";
import { Tag, TagVariants } from "@components/Tag";
import { Course } from "../../../interfaces";
import { DateTime } from "luxon";
import React from "react";

interface CourseItemProps {
  course: Course;
  deletable?: boolean;
  onDelete?: (id: string) => void;
}

export const CourseItem = (props: CourseItemProps) => {
  const {
    course,
    deletable = false,
    onDelete,
  } = props;
  return <div className="course-item">
    <div>
      <div>
        <div className="course-title">{course.awardType?.code} {course.title}</div>
        <div style={{
          display: "flex",
          flexDirection: "row",
        }}>
          <Tag variant={TagVariants.INFO}>{course.course_code}</Tag>
          <Tag variant={TagVariants.INFO}>{DateTime.fromSQL(course.start_date).monthShort} {course.academic_year}</Tag>
          { course.published && <Tag variant={TagVariants.SUCCESS}>published</Tag> }
        </div>
      </div>
      <div className="actions">
        {deletable && (
          <Button variant={ButtonVariants.DANGER} onClick={() => onDelete && onDelete(course.id)}>Remove</Button>
        )}
      </div>
    </div>
  </div>;
};