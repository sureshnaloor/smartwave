import Header from '@/components/Header';

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <Header />
      <main className="container mx-auto px-4">
        {children}
      </main>
    </div>
  );
} 