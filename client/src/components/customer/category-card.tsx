import { ReactNode } from "react";

interface CategoryCardProps {
  name: string;
  icon: ReactNode;
  onClick: () => void;
}

export function CategoryCard({ name, icon, onClick }: CategoryCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 text-center cursor-pointer"
      onClick={onClick}
    >
      <div className="w-12 h-12 mx-auto mb-3 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-900">{name}</span>
    </div>
  );
}
