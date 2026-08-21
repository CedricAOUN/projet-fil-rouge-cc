import { useGetCourseByIdQuery } from '@/api/courseApi';
import React from 'react';
import { useParams } from 'react-router-dom';
import PageErrorHandler from '../PageErrorHandler/PageErrorHandler';

const SingleCoursePage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseByIdQuery(id!, { skip: !id });

  if (error) {
    // @ts-ignore
    return <PageErrorHandler errorStatus={error.status} />;
  }

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
  );
};

export default SingleCoursePage;
