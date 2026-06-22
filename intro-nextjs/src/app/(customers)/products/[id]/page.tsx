import Link from 'next/link';

export default async function ProductDetailPage({ params }: any) {
  const paramsData = await params;
  return (
    <>
      <h1>Product Detail Page {paramsData?.id}</h1>
      <Link href='/profile'>Go to Profile Page</Link>
    </>
  );
}
