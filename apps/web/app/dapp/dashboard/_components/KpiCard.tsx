'use client';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: string;
}

export default function KpiCard({ title, value, icon }: KpiCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-4">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}