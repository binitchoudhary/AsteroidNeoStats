import axios from 'axios';

const API_KEY = 'AqEKbgEdqSn7gbqLcca0UZhmMrUlWU0TzjAjjRAI';  // Replace with your API key
const BASE_URL = 'https://api.nasa.gov/neo/rest/v1/feed';

export const getAsteroidData = (startDate, endDate) => {
  return axios.get(`${BASE_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`);
};
