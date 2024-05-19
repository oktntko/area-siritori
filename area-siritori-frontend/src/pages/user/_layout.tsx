export default function Layout() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-16 bg-gray-100">
      <div className="-mt-2 mb-2">
        <h1 className="text-8xl">
          <span className="font-bold text-blue-800">U</span>se
          <span className="font-bold text-red-800">r</span>
        </h1>
      </div>

      <Outlet />
    </div>
  );
}
