export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-dvh items-center justify-center"
      style={{ background: "var(--gradient-warm)" }}
    >
      <div className="w-full max-w-md px-6">
        {children}
      </div>
    </div>
  );
}
