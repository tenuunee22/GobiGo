import React, { useState, useEffect } from 'react';
interface Ingredient {
  id: string;
  name: string;
  count: number;
  icon: string;
  color: string;
}
interface IngredientVisualizationProps {
  data: Ingredient[];
  title?: string;
}
export function IngredientVisualization({ data, title = "Түгээмэл орц" }: IngredientVisualizationProps) {
  const [sortedData, setSortedData] = useState<Ingredient[]>([]);
  const [activeIngredient, setActiveIngredient] = useState<string | null>(null);
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  useEffect(() => {
    const sorted = [...data].sort((a, b) => b.count - a.count);
    setSortedData(sorted);
  }, [data]);
  const maxCount = Math.max(...data.map(item => item.count));
  const handleIngredientClick = (id: string) => {
    setActiveIngredient(activeIngredient === id ? null : id);
  };
  return (
    <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
      <h3 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        {title}
      </h3>
      <div className="flex justify-center mb-6">
        <div className="relative h-[300px] w-full max-w-3xl">
          {sortedData.map((ingredient, index) => {
            const size = 40 + (ingredient.count / maxCount) * 60;
            const position = index / (sortedData.length - 1 || 1);
            const left = 10 + position * 80 + '%';
            const isEven = index % 2 === 0;
            const top = isEven ? '30%' : '60%';
            const animationDelay = `${index * 0.2}s`;
            const isActive = activeIngredient === ingredient.id;
            const isHovered = hoveredIngredient === ingredient.id;
            return (
              <div
                key={ingredient.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 bounce-ingredient cursor-pointer transition-all duration-300 ${
                  isActive ? 'scale-125 z-10' : ''
                } ${isHovered ? 'scale-110' : ''}`}
                style={{
                  left,
                  top,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay,
                  animationDuration: '1.5s',
                }}
                onClick={() => handleIngredientClick(ingredient.id)}
                onMouseEnter={() => setHoveredIngredient(ingredient.id)}
                onMouseLeave={() => setHoveredIngredient(null)}
              >
                <div
                  className={`rounded-full flex items-center justify-center w-full h-full relative ${
                    isActive || isHovered ? 'shadow-lg' : 'shadow-sm'
                  }`}
                  style={{ backgroundColor: `${ingredient.color}25`, borderColor: ingredient.color }}
                >
                  <span className="text-2xl">{ingredient.icon}</span>
                  <div
                    className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-sm whitespace-nowrap transition-opacity duration-200 ${
                      isActive || isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <p className="font-medium">{ingredient.name}</p>
                    <p className="text-xs text-center text-gray-600">{ingredient.count} захиалга</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
        {sortedData.map((ingredient) => (
          <div
            key={`legend-${ingredient.id}`}
            className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${
              activeIngredient === ingredient.id ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleIngredientClick(ingredient.id)}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
              style={{ backgroundColor: `${ingredient.color}25` }}
            >
              <span>{ingredient.icon}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{ingredient.name}</p>
              <p className="text-xs text-gray-600">{ingredient.count} захиалга</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export function getRandomColor(): string {
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#F97316', '#14B8A6', '#6366F1', '#D946EF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
export function getIngredientIcon(name: string): string {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('мах') || nameLower.includes('meat')) return '🥩';
  if (nameLower.includes('төмс') || nameLower.includes('potato')) return '🥔';
  if (nameLower.includes('хулуу') || nameLower.includes('pumpkin')) return '🎃';
  if (nameLower.includes('лууван') || nameLower.includes('carrot')) return '🥕';
  if (nameLower.includes('сонгино') || nameLower.includes('onion')) return '🧅';
  if (nameLower.includes('сармис') || nameLower.includes('garlic')) return '🧄';
  if (nameLower.includes('өндөг') || nameLower.includes('egg')) return '🥚';
  if (nameLower.includes('сүү') || nameLower.includes('milk')) return '🥛';
  if (nameLower.includes('бяслаг') || nameLower.includes('cheese')) return '🧀';
  if (nameLower.includes('талх') || nameLower.includes('bread')) return '🍞';
  if (nameLower.includes('будаа') || nameLower.includes('rice')) return '🍚';
  if (nameLower.includes('гурил') || nameLower.includes('flour')) return '🌾';
  if (nameLower.includes('салат') || nameLower.includes('salad')) return '🥗';
  if (nameLower.includes('алим') || nameLower.includes('apple')) return '🍎';
  if (nameLower.includes('улаан лооль') || nameLower.includes('tomato')) return '🍅';
  if (nameLower.includes('чинжүү') || nameLower.includes('pepper')) return '🌶️';
  if (nameLower.includes('загас') || nameLower.includes('fish')) return '🐟';
  if (nameLower.includes('далайн') || nameLower.includes('sea')) return '🦐';
  if (nameLower.includes('самар') || nameLower.includes('nuts')) return '🥜';
  if (nameLower.includes('шоколад') || nameLower.includes('chocolate')) return '🍫';
  if (nameLower.includes('амттан') || nameLower.includes('dessert')) return '🍮';
  if (nameLower.includes('жимс') || nameLower.includes('fruit')) return '🍓';
  if (nameLower.includes('ногоо') || nameLower.includes('vegetable')) return '🥦';
  return '🍴';
}
