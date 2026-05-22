import { useGetCourseByIdQuery } from '@/api/courseApi';
import React from 'react'
import { useParams } from 'react-router-dom';

const SingleCoursePage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: course, isLoading } = useGetCourseByIdQuery(id!, { skip: !id });

  console.log(course);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : course ? (
        <div>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default SingleCoursePage