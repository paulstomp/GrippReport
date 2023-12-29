// Query

export async function query(query: string) {
  const { data } = await useAsyncData(
      query, // use query as key
      () => $fetch('/api/mysql/query', {
          headers: useRequestHeaders(['cookie']),
          method: 'POST',
          body: JSON.stringify({ query: query })
      }));
  return data.value;
}
