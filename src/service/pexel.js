const searchUrl = 'https://api.pexels.com/v1/search';

export const getPage = async ({ searchTerm, pageSize = 9, pageNumber = 1 }) => {
  const url = `${searchUrl}?query=${searchTerm}&per_page=${pageSize}&page=${pageNumber}`;
  const headers = { 'Authorization': process.env.API_KEY };

  let response;
  try {
    response = await fetch(url, { headers, mode: 'cors' });
  } catch (error) {
    console.error(error);
    throw new Error('Network error');
  }

  if (!response.ok) {
    console.error(`Unexpected response: ${response.statusText} - ${await response.text()}`);
    throw new Error(`Unexpected response: ${response.statusText}`);
  }

  const {
    total_results,
    per_page,
    page,
    photos: pexelPhotos
  } = await response.json();

  const pageCount = Math.ceil(total_results / per_page);
  const photos = pexelPhotos.map(({ id, width, height, src: { original, medium }, ['photographer_url']: authorUrl }) => ({
    id,
    width,
    height,
    url: { original, small: medium, author: authorUrl }
  }));

  return {
    pageNumber: page,
    pageSize: per_page,
    pageCount,
    photos
  }
};
