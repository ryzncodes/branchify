import '../app/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex justify-center items-center min-h-screen bg-gray-900 p-6 shadow-md">
        <div className="w-full max-w-4xl p-6 text-black ">
          {children}
        </div>
      </body>
    </html>
  );
}
