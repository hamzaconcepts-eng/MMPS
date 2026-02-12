export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-6">
        {children}
      </div>
    </div>
  );
}
