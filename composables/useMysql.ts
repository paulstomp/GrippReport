// Query

export async function query(query: string) {
  const { data } = await useFetch('/api/mysql/query', {
    headers: { "Content-type": "multipart/form-data" },
    method: 'POST',
    body: { query: query }
  });
  // console.log(JSON.stringify(data.value[0][0]));
  return data.value[0];
}
