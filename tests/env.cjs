// Keep test requests on the mocked API, even when deployment variables are set.
process.env.VITE_API_URL = 'http://localhost:8000/api/v1';
