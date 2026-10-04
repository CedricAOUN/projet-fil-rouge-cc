import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { http, HttpResponse, delay } from 'msw';
import CourseCreateForm from '@/pages/CourseCreateForm/CourseCreateForm';
import SingleCoursePage from '@/pages/SingleCoursePage/SingleCoursePage';
import CoursesPage from '@/pages/CoursesPage/CoursesPage';
import { renderApp } from './render';
import { API, server, course, user } from './server';

jest.mock('@uiw/react-md-editor', () => {
  const command = {};
  return { __esModule: true, default: ({ value, onChange }) => <textarea aria-label='Course content' value={value} onChange={event => onChange(event.target.value)} />, commands: { group: jest.fn(() => command), heading1: command, heading2: command, heading3: command, heading4: command, heading5: command, heading6: command } };
});
jest.mock('react-player', () => ({ __esModule: true, default: ({ src }) => <video data-testid='video-player' src={src} /> }));

test('course detail shows a loading indicator then content and the video integration', async () => {
  server.use(http.get(`${API}/courses/1`, async () => { await delay(80); return HttpResponse.json({ data: { ...course, video_url: '/storage/lesson.mp4' } }); }));
  renderApp(<Routes><Route path='/course/:id' element={<SingleCoursePage />} /></Routes>, { route: '/course/1' });
  expect(screen.getByRole('progressbar')).toBeVisible();
  expect(await screen.findByRole('heading', { name: 'Knife skills' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Chop safely' })).toBeVisible();
  expect(screen.getByTestId('video-player')).toHaveAttribute('src', '/storage/lesson.mp4');
});

test('course detail maps authorization errors to the error page', async () => {
  server.use(http.get(`${API}/courses/1`, () => HttpResponse.json({}, { status: 403 })));
  renderApp(<Routes><Route path='/course/:id' element={<SingleCoursePage />} /></Routes>, { route: '/course/1' });
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  expect(screen.queryByText('Knife skills')).not.toBeInTheDocument();
});

test('course form validates content and video size, previews markdown and creates multipart data', async () => {
  let fields: FormData;
  server.use(http.post(`${API}/courses/create`, async ({ request }) => { fields = await request.formData(); return HttpResponse.json({ data: course }); }));
  const interaction = userEvent.setup();
  renderApp(<CourseCreateForm />);
  const title = await screen.findByPlaceholderText('Title');
  await interaction.type(title, 'Knife');
  await interaction.click(screen.getByRole('button', { name: 'Submit' }));
  expect(await screen.findByText('Content is required')).toBeVisible();
  await interaction.type(screen.getByLabelText('Course content'), '# Chop safely');
  expect(screen.getByRole('heading', { name: 'Chop safely' })).toBeVisible();
  const input = document.querySelector('input[type=file]');
  const tooLarge = new File(['video'], 'big.mp4', { type: 'video/mp4' });
  Object.defineProperty(tooLarge, 'size', { value: 200 * 1024 * 1024 + 1 });
  fireEvent.change(input, { target: { files: [tooLarge] } });
  expect(await screen.findByText('The video must not be larger than 200 MB.')).toBeVisible();
  await interaction.click(screen.getByRole('button', { name: 'Submit' }));
  expect(fields).toBeUndefined();
  fireEvent.change(input, { target: { files: [new File(['video'], 'lesson.mp4', { type: 'video/mp4' })] } });
  await waitFor(() => expect(screen.queryByText('The video must not be larger than 200 MB.')).not.toBeInTheDocument());
  await interaction.click(screen.getByRole('button', { name: 'Submit' }));
  await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/course/1'));
  expect(fields.get('title')).toBe('Knife');
  expect(fields.get('content')).toBe('# Chop safely');
  expect((fields.get('video') as File).name).toBe('lesson.mp4');
});

test('course edit pre-fills existing content and saves an update', async () => {
  let fields: FormData;
  server.use(http.put(`${API}/courses/edit/1`, async ({ request }) => { fields = await request.formData(); return HttpResponse.json({ data: course }); }));
  const interaction = userEvent.setup();
  renderApp(<Routes><Route path='/course/edit/:id' element={<CourseCreateForm />} /></Routes>, { route: '/course/edit/1' });
  const title = await screen.findByDisplayValue('Knife skills');
  await interaction.clear(title); await interaction.type(title, 'Advanced knife skills');
  await interaction.click(screen.getByRole('button', { name: 'Confirm' }));
  await waitFor(() => expect(fields?.get('title')).toBe('Advanced knife skills'));
  expect(fields.has('video')).toBe(false);
});

test.each([{ ...user, is_chef: false }, { ...user, id: 2 }])('course edit rejects non-chefs and non-owners', async currentUser => {
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({ data: currentUser })));
  renderApp(<Routes><Route path='/course/edit/:id' element={<CourseCreateForm />} /></Routes>, { route: '/course/edit/1' });
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  expect(screen.queryByPlaceholderText('Title')).not.toBeInTheDocument();
});

test('course list searches and navigates to a selected lesson', async () => {
  const searches: string[] = [];
  server.use(http.get(`${API}/courses/list`, ({ request }) => { searches.push(new URL(request.url).searchParams.get('search')); return HttpResponse.json({ data: [course] }); }));
  const interaction = userEvent.setup();
  renderApp(<CoursesPage />);
  await screen.findByText('Knife skills');
  const input = screen.getByRole('textbox');
  await interaction.type(input, 'Knife');
  await waitFor(() => expect(searches).toContain('Knife'));
  await interaction.click(await screen.findByRole('button', { name: 'View Course' }));
  expect(screen.getByTestId('location')).toHaveTextContent('/course/1');
});
