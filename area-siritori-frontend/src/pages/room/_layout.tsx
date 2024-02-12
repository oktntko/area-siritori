import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50 text-gray-800 ">
      room-layout
      <main>
        <Outlet />
      </main>
    </div>
  );
}
