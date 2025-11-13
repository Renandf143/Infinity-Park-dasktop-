import { useState } from 'react';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2Icon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { categoriesData } from '../data/categoriesWithSubcategories';

export function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [categoriesCount, setCategoriesCount] = useState<number | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const checkCategories = async () => {
    try {
      addLog('🔍 Verificando categorias...');
      const snapshot = await getDocs(collection(db, 'serviceCategories'));
      setCategoriesCount(snapshot.size);
      addLog(`📊 ${snapshot.size} categorias encontradas`);
      
      if (snapshot.size > 0) {
        snapshot.forEach(doc => {
          const data = doc.data();
          addLog(`  ${data.icon} ${data.name}`);
        });
      }
    } catch (err: any) {
      addLog(`❌ Erro: ${err.message}`);
    }
  };

  const createCategories = async () => {
    setLoading(true);
    setSuccess(false);
    setError('');
    setLogs([]);

    try {
      addLog('🌱 Iniciando criação de categorias e subcategorias...');
      addLog(`📊 Total: ${categoriesData.length} categorias`);
      addLog('');

      let categoriesCreated = 0;
      let subcategoriesCreated = 0;
      let errors = 0;

      for (const category of categoriesData) {
        try {
          addLog(`📝 Criando categoria: ${category.name}...`);
          
          // Criar categoria principal
          await setDoc(doc(db, 'serviceCategories', category.id), {
            name: category.name,
            description: category.description,
            icon: category.icon,
            slug: category.slug,
            subcategoriesCount: category.subcategories.length
          });
          
          addLog(`✅ ${category.name} criada!`);
          categoriesCreated++;

          // Criar subcategorias
          addLog(`  📋 Criando ${category.subcategories.length} subcategorias...`);
          
          for (const subcategory of category.subcategories) {
            try {
              await setDoc(
                doc(db, 'serviceCategories', category.id, 'subcategories', subcategory.id),
                {
                  name: subcategory.name,
                  description: subcategory.description,
                  icon: subcategory.icon,
                  categoryId: category.id,
                  categorySlug: category.slug
                }
              );
              subcategoriesCreated++;
            } catch (subErr: any) {
              addLog(`  ❌ Erro em ${subcategory.name}: ${subErr.message}`);
              errors++;
            }
          }
          
          addLog(`  ✅ ${category.subcategories.length} subcategorias criadas!`);
          addLog('');
          
        } catch (err: any) {
          addLog(`❌ Erro em ${category.name}: ${err.message}`);
          errors++;
        }
      }

      addLog('🎉 Processo concluído!');
      addLog(`✅ Categorias criadas: ${categoriesCreated}/${categoriesData.length}`);
      addLog(`✅ Subcategorias criadas: ${subcategoriesCreated}`);
      
      if (errors > 0) {
        addLog(`❌ Erros: ${errors}`);
        setError(`${errors} itens falharam`);
      } else {
        setSuccess(true);
      }

      await checkCategories();

    } catch (err: unknown) {
      setError(err.message);
      addLog(`❌ Erro geral: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🔧 Configuração do Sistema
            </h1>
            <p className="text-gray-600">
              Configure o banco de dados com as categorias de serviços
            </p>
          </div>

          {categoriesCount !== null && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                📊 Categorias no banco: <strong>{categoriesCount}</strong>
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={checkCategories}
              disabled={loading}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
            >
              🔍 Verificar Categorias
            </button>

            <button
              onClick={createCategories}
              disabled={loading}
              className="px-6 py-3 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1e40af] transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2Icon className="w-5 h-5 animate-spin" />
                  Criando...
                </>
              ) : (
                '🚀 Criar Categorias'
              )}
            </button>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Sucesso!</h3>
                <p className="text-sm text-green-800">
                  Todas as categorias foram criadas no Firestore!
                </p>
                <a href="/categorias" className="text-sm text-green-700 underline mt-2 inline-block">
                  Ver categorias →
                </a>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Erro</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {logs.length > 0 && (
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Informações</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Este processo cria 12 categorias principais no Firestore</li>
              <li>• Cada categoria tem várias subcategorias (total: 70+ subcategorias)</li>
              <li>• Você só precisa fazer isso UMA VEZ</li>
              <li>• Se já existirem, elas serão sobrescritas</li>
              <li>• Após criar, acesse /categorias para ver o resultado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
