export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <><h1>Dashboard</h1>{children}</>;
}
