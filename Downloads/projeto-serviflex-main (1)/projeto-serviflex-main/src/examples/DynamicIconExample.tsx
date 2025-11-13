/**
 * Exemplos de uso do componente DynamicIcon
 * 
 * Este arquivo demonstra diferentes formas de usar o DynamicIcon
 */

import { DynamicIcon } from '../components/DynamicIcon';

export function DynamicIconExamples() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Exemplos de Uso do DynamicIcon</h1>

      {/* Exemplo 1: Ícones básicos */}
      <section>
        <h2 className="text-xl font-semibold mb-4">1. Ícones Básicos</h2>
        <div className="flex gap-4 items-center">
          <DynamicIcon name="Sparkles" className="w-6 h-6 text-blue-500" />
          <DynamicIcon name="Heart" className="w-6 h-6 text-red-500" />
          <DynamicIcon name="Wrench" className="w-6 h-6 text-gray-700" />
          <DynamicIcon name="Scissors" className="w-6 h-6 text-purple-500" />
        </div>
      </section>

      {/* Exemplo 2: Tamanhos diferentes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">2. Tamanhos Diferentes</h2>
        <div className="flex gap-4 items-center">
          <DynamicIcon name="Star" size={16} className="text-yellow-500" />
          <DynamicIcon name="Star" size={24} className="text-yellow-500" />
          <DynamicIcon name="Star" size={32} className="text-yellow-500" />
          <DynamicIcon name="Star" size={48} className="text-yellow-500" />
        </div>
      </section>

      {/* Exemplo 3: Com fallback (emoji) */}
      <section>
        <h2 className="text-xl font-semibold mb-4">3. Com Fallback (Emoji)</h2>
        <div className="flex gap-4 items-center">
          <DynamicIcon name="IconeInexistente" fallback="🎉" className="w-6 h-6" />
          <DynamicIcon name="OutroIconeInexistente" fallback="🚀" className="w-6 h-6" />
        </div>
      </section>

      {/* Exemplo 4: Renderizando emoji diretamente */}
      <section>
        <h2 className="text-xl font-semibold mb-4">4. Renderizando Emoji Diretamente</h2>
        <div className="flex gap-4 items-center">
          <DynamicIcon name="🧹" className="w-6 h-6" />
          <DynamicIcon name="💻" className="w-6 h-6" />
          <DynamicIcon name="🎨" className="w-6 h-6" />
        </div>
      </section>

      {/* Exemplo 5: Em cards */}
      <section>
        <h2 className="text-xl font-semibold mb-4">5. Em Cards</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <DynamicIcon name="Sparkles" className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold">Limpeza</h3>
            <p className="text-sm text-gray-600">Serviços de limpeza</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <DynamicIcon name="Heart" className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold">Saúde</h3>
            <p className="text-sm text-gray-600">Bem-estar</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <DynamicIcon name="Scissors" className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold">Beleza</h3>
            <p className="text-sm text-gray-600">Estética</p>
          </div>
        </div>
      </section>

      {/* Exemplo 6: Em listas */}
      <section>
        <h2 className="text-xl font-semibold mb-4">6. Em Listas</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <DynamicIcon name="Home" className="w-5 h-5 text-gray-600" />
            <span>Limpeza Residencial</span>
          </li>
          <li className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <DynamicIcon name="Building2" className="w-5 h-5 text-gray-600" />
            <span>Limpeza Comercial</span>
          </li>
          <li className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <DynamicIcon name="HardHat" className="w-5 h-5 text-gray-600" />
            <span>Limpeza Pós-Obra</span>
          </li>
        </ul>
      </section>

      {/* Exemplo 7: Em botões */}
      <section>
        <h2 className="text-xl font-semibold mb-4">7. Em Botões</h2>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <DynamicIcon name="Plus" className="w-5 h-5" />
            Adicionar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <DynamicIcon name="Trash2" className="w-5 h-5" />
            Excluir
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <DynamicIcon name="Check" className="w-5 h-5" />
            Confirmar
          </button>
        </div>
      </section>

      {/* Exemplo 8: Categorias completas */}
      <section>
        <h2 className="text-xl font-semibold mb-4">8. Todas as Categorias</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { name: 'Sparkles', label: 'Limpeza', color: 'blue' },
            { name: 'Wrench', label: 'Reparos', color: 'gray' },
            { name: 'Scissors', label: 'Beleza', color: 'purple' },
            { name: 'Heart', label: 'Saúde', color: 'red' },
            { name: 'BookOpen', label: 'Aulas', color: 'green' },
            { name: 'PartyPopper', label: 'Eventos', color: 'pink' },
            { name: 'Truck', label: 'Transporte', color: 'orange' },
            { name: 'Laptop', label: 'Tecnologia', color: 'indigo' },
            { name: 'Leaf', label: 'Jardinagem', color: 'green' },
            { name: 'Baby', label: 'Cuidados', color: 'pink' },
            { name: 'PawPrint', label: 'Pet Care', color: 'amber' },
            { name: 'ChefHat', label: 'Alimentação', color: 'red' },
          ].map((item) => (
            <div key={item.name} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
              <DynamicIcon 
                name={item.name} 
                className={`w-8 h-8 text-${item.color}-600 mb-2`} 
              />
              <span className="text-sm font-medium text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
