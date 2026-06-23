export const getUsersApi = async () => {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
      // force-cache : SSG (Static Side Generation)
      next: {
        revalidate: 60
      }
      // revalidate  : ISR (Incremental Static Regeneration)
    });

    if (!res.ok) throw new Error(`Request failed with response: ${res.status}`);

    const usersData = await res.json();

    return usersData;
  } catch (error) {
    console.log(error);
  }
};
