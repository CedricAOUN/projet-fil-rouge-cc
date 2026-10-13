import React from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { Route, Routes } from 'react-router-dom';
import CoursesPage from '@/pages/CoursesPage/CoursesPage';
import SingleUserPage from '@/pages/SingleUserPage/SingleUserPage';
import CourseCreateForm from '@/pages/CourseCreateForm/CourseCreateForm';
import i18n from '@/i18n';
import { renderApp } from './render';
import { API, server, course } from './server';

jest.mock('@uiw/react-md-editor', () => {
  const command = {};
  return { __esModule: true, default: ({ value, onChange }) => <textarea aria-label='Course content' value={value} onChange={event => onChange(event.target.value)} />,
    commands: { group: jest.fn(() => command), heading1: command, heading2: command, heading3: command, heading4: command, heading5: command, heading6: command } };
});
afterEach(async () => { await act(async () => { await i18n.changeLanguage('en'); }); });

test.each(['browse', 'profile'])('course %s follows the selected app language', async page => {
  const queries: URLSearchParams[] = [];
  const handler = ({ request }) => {
    const params = new URL(request.url).searchParams;
    queries.push(params);
    return HttpResponse.json({ data: [{ ...course, language: params.get('language'),
      title: params.get('language') === 'fr' ? 'Cours français' : 'English lesson' }] });
  };
  server.use(http.get(`${API}/courses`, handler), http.get(`${API}/courses/list`, handler));
  renderApp(page === 'browse' ? <CoursesPage /> : <Routes><Route path='/user/:id' element={<SingleUserPage />} /></Routes>, { route: '/user/1' });
  expect(await screen.findByRole('heading', { name: 'English lesson' })).toBeVisible();
  await act(async () => { await i18n.changeLanguage('fr'); });
  expect(await screen.findByRole('heading', { name: 'Cours français' })).toBeVisible();
  expect(screen.queryByText('English lesson')).not.toBeInTheDocument();
  expect(queries.map(params => params.get('language'))).toEqual(expect.arrayContaining(['en', 'fr']));
  if (page === 'profile') expect(queries.every(params => params.get('creator_id') === '1')).toBe(true);
});

test('switching interface language preserves an unfinished course form', async () => {
  renderApp(<CourseCreateForm />);
  await userEvent.type(await screen.findByPlaceholderText('Title'), 'Unfinished lesson');
  await act(async () => { await i18n.changeLanguage('fr'); });
  expect(screen.getByDisplayValue('Unfinished lesson')).toBeVisible();
  expect(screen.getByRole('combobox', { name: /^Langue du cours/ })).toHaveTextContent(i18n.t('English'));
});
