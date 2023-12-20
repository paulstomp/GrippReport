// Query

export async function query(query: string) {
  const { data } = await useFetch('/api/mysql/query', {
    headers: { "Content-type": "multipart/form-data" },
    method: 'POST',
    body: { query: query }
  });
  return data.value;
}
