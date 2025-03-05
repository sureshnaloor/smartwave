export default function WithoutHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-800">
      {children}
    </main>
  );
} 