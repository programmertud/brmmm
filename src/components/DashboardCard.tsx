const stats = [
  { title: "Total Residents", value: "1,245", color: "bg-blue-500" },
  { title: "Pending Certificates", value: "32", color: "bg-green-500" },
  { title: "Blotter Reports", value: "14", color: "bg-red-500" },
  { title: "Businesses Registered", value: "86", color: "bg-yellow-500" },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-20">
      {stats.map((s) => (
        <div
          key={s.title}
          className={`p-6 rounded-xl text-white shadow-md ${s.color}`}
        >
          <h3 className="text-lg">{s.title}</h3>
          <p className="text-3xl font-bold mt-3">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
