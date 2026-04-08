import React, { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
  textColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  bgColor = 'bg-white',
  textColor = 'text-gray-800',
}) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-card p-6 transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <h3 className={`text-2xl font-bold ${textColor}`}>{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={trend.isPositive ? 'text-success-600' : 'text-error-600'}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <svg
                className={`w-4 h-4 ml-1 ${trend.isPositive ? 'text-success-600' : 'text-error-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={trend.isPositive ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'}
                />
              </svg>
              <span className="text-gray-500 text-xs ml-1">depuis le mois dernier</span>
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-full bg-gray-100">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;