import { CalendarIcon, DollarSignIcon, ImageIcon, SettingsIcon } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  bgColor: string;
  hoverColor: string;
  iconBg: string;
  onClick: () => void;
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      id: 'block-time',
      label: 'Bloquear Horário',
      icon: CalendarIcon,
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      iconBg: 'bg-blue-600',
      onClick: () => alert('Funcionalidade em desenvolvimento')
    },
    {
      id: 'withdraw',
      label: 'Solicitar Saque',
      icon: DollarSignIcon,
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      iconBg: 'bg-green-600',
      onClick: () => alert('Funcionalidade em desenvolvimento')
    },
    {
      id: 'add-photo',
      label: 'Adicionar Foto',
      icon: ImageIcon,
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      iconBg: 'bg-purple-600',
      onClick: () => alert('Funcionalidade em desenvolvimento')
    },
    {
      id: 'edit-profile',
      label: 'Editar Perfil',
      icon: SettingsIcon,
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      iconBg: 'bg-orange-600',
      onClick: () => alert('Funcionalidade em desenvolvimento')
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`flex flex-col items-center gap-2 p-4 ${action.bgColor} ${action.hoverColor} rounded-lg transition-colors`}
          >
            <div className={`w-12 h-12 ${action.iconBg} rounded-full flex items-center justify-center`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900 text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
