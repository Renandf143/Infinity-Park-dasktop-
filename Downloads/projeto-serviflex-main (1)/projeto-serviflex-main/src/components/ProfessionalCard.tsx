import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon, BadgeCheckIcon, MapPinIcon, CalendarIcon } from 'lucide-react';
import { GamificationBadge } from './GamificationBadge';
interface Professional {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  price: number;
  verified: boolean;
  serviceType: string;
  description: string;
  availability: string;
  skills: string[];
}
interface ProfessionalCardProps {
  professional: Professional;
}
export function ProfessionalCard({
  professional
}: ProfessionalCardProps) {
  const navigate = useNavigate();
  const getLevel = (rating: number) => {
    if (rating >= 4.8) return 5;
    if (rating >= 4.6) return 4;
    if (rating >= 4.3) return 3;
    if (rating >= 4.0) return 2;
    return 1;
  };
  const level = getLevel(professional.rating);
  return <div onClick={() => navigate(`/profissional/${professional.id.toString()}`)} className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-600 transition-all duration-300 cursor-pointer group hover:shadow-xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <img src={professional.image} alt={professional.name} className="w-20 h-20 rounded-xl object-cover" />
            {professional.verified && <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                <BadgeCheckIcon className="w-4 h-4 text-white" />
              </div>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {professional.name}
              </h3>
              <GamificationBadge level={level} compact />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {professional.serviceType}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-semibold text-gray-900">
                  {professional.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({professional.reviews})
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              {professional.location}
            </div>
          </div>
        </div>
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
          {professional.description}
        </p>
        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {professional.skills.slice(0, 3).map((skill, index) => <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {skill}
            </span>)}
        </div>
        {/* Availability */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
          <CalendarIcon className="w-4 h-4" />
          <span>{professional.availability}</span>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">A partir de</p>
            <p className="text-xl font-semibold text-gray-900">
              R$ {professional.price}
              <span className="text-sm text-gray-500 font-normal">/hora</span>
            </p>
          </div>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all">
            Ver Perfil
          </button>
        </div>
      </div>
    </div>;
}