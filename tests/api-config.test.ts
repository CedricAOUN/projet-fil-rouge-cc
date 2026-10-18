import { API_URL } from '../src/api/config';
import { API } from './server';

test('API requests use the mock server address in the test environment', () => {
  expect(API_URL).toBe(API);
});
