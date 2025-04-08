import { ReactNode } from "react";
interface CategoryCardProps {
  name: string;
  icon: ReactNode;
  onClick: () => void;
  isActive?: boolean;
  emoji?: string;
}
export function CategoryCard({ name, icon, onClick, isActive = false, emoji }: CategoryCardProps) {
  return (
    <div 
      className={`${
        isActive 
          ? "bg-primary text-white shadow-md" 
          : "bg-white text-gray-900 shadow hover:shadow-md"
      } rounded-lg transition-all duration-200 p-4 text-center cursor-pointer relative`}
      onClick={onClick}
    >
      {emoji && (
        <span className="absolute top-1 right-1 text-lg">{emoji}</span>
      )}
      <div className={`w-12 h-12 mx-auto mb-3 ${
        isActive 
          ? "bg-white bg-opacity-20" 
          : "bg-primary bg-opacity-10"
      } rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-900"}`}>
        {name}
      </span>
    </div>
  );
}
