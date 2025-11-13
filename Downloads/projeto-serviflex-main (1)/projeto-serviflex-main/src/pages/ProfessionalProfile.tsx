import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { professionalService } from '../services/professionalService';
import { ServiceProviderProfile } from '../types/firestore';
import { 
  StarIcon, 
  MapPinIcon, 
  PhoneIcon, 
  MailIcon,
  BriefcaseIcon,
  DollarSignIcon,
  CheckCircleIcon,
  ClockIcon,
  Loader2Icon
} from 'lucide-react';

export function ProfessionalProfile() {
  const navigate = useNavigate();
  const { user, userData, isProfessional } = useAuthContext();
  const [profile, setProfile] = useState<ServiceProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isProfessional) {
      navigate('/');
      return;
    }

    loadProfile();
  }, [user, isProfessional]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const data = await professionalService.getProfessionalById(user.uid);
      setProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="w-8 h-8 animate-spin text-[#1E3A8A]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Perfil não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header do Perfil */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Foto */}
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
              {profile.user.photoUrl ? (
                <img 
                  src={profile.user.photoUrl} 
                  alt={profile.user.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                profile.user.displayName.charAt(0).toUpperCase()
              )}
            </div>

            {/* Informações */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.user.displayName}
                </h1>
                {profile.verified && (
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                )}
              </div>

              <p className="text-lg text-gray-600 mb-3">{profile.profession}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{profile.rating.toFixed(1)}</span>
                  <span>({profile.reviewCount} avaliações)</span>
                </div>

                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{profile.location.city}, {profile.location.state}</span>
                </div>

                <div className="flex items-center gap-1">
                  <BriefcaseIcon className="w-4 h-4" />
                  <span>{profile.yearsOfExperience} anos de experiência</span>
                </div>
              </div>
            </div>

            {/* Preço */}
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Faixa de Preço</p>
              <p className="text-2xl font-bold text-[#1E3A8A]">
                R$ {profile.priceRange.min} - {profile.priceRange.max}
              </p>
              <p className="text-xs text-gray-500">por serviço</p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600 mb-1">Trabalhos Totais</p>
            <p className="text-2xl font-bold text-gray-900">{profile.stats?.totalJobs || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600 mb-1">Concluídos</p>
            <p className="text-2xl font-bold text-green-600">{profile.stats?.completedJobs || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600 mb-1">Ganhos Totais</p>
            <p className="text-2xl font-bold text-[#1E3A8A]">
              R$ {(profile.stats?.totalEarnings || 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600 mb-1">Tempo de Resposta</p>
            <p className="text-2xl font-bold text-gray-900">
              {profile.stats?.responseTime || 0}h
            </p>
          </div>
        </div>

        {/* Sobre */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre</h2>
          <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
        </div>

        {/* Habilidades */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Habilidades</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Contato */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contato</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <MailIcon className="w-5 h-5 text-gray-400" />
              <span>{profile.user.email}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <PhoneIcon className="w-5 h-5 text-gray-400" />
              <span>{profile.user.phoneNumber || 'Não informado'}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <MapPinIcon className="w-5 h-5 text-gray-400" />
              <span>
                {profile.location.address || `${profile.location.city}, ${profile.location.state}`}
              </span>
            </div>
          </div>
        </div>

        {/* Status de Verificação */}
        {!profile.verified && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ClockIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  Verificação Pendente
                </h3>
                <p className="text-sm text-yellow-800">
                  Seus documentos estão sendo analisados. Você receberá um email quando a verificação for concluída (até 48h).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
