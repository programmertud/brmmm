export default function Navbar() {
  return (
    <header className="h-16 bg-white shadow-md flex items-center justify-between px-6 fixed left-64 right-0 top-0 z-10">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="flex items-center gap-3">
        <span className="font-medium">Admin</span>
        <img
          src="https://ui-avatars.com/api/?name=Admin"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
}
