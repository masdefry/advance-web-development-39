import { getUsersApi } from '@/features/fetching/ssr/api/get-users-api';

export default async function SSRPage() {
  const usersData = await getUsersApi();

  return (
    <>
      {usersData?.map((user: any) => (
        <div key={user?.id}>{user?.username}</div>
      ))}
    </>
  );
}
