import { fetchCourseById } from '@/api/api';
import { Course } from '@/api/api.types';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const SingleCoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);  

  useEffect(() => {
    if (id) {
      // Fetch course details by ID
      fetchCourseById(id).then((data) => {
        if (data) {
          setCourse(data);
        }
      });
    }
  }, [id]);

  console.log(course);

  return (
    <div>
      {course ? (
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