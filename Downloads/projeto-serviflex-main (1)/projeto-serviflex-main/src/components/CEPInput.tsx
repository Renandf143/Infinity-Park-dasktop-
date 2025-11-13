import { useState } from 'react';
import { MapPinIcon, Loader2Icon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { fetchAddressByCEP, formatCEP } from '../services/validationService';

interface CEPInputProps {
  value: string;
  onChange: (value: string) => void;
  onAddressFound?: (address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  }) => void;
}

export function CEPInput({ value, onChange, onAddressFound }: CEPInputProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCEPChange = async (newValue: string) => {
    const formatted = formatCEP(newValue);
    onChange(formatted);
    setError('');
    setSuccess(false);

    const cleaned = formatted.replace(/[^\d]/g, '');
    if (cleaned.length === 8) {
      setLoading(true);
      try {
        const address = await fetchAddressByCEP(cleaned);
        setSuccess(true);
        onAddressFound?.(address);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        CEP <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => handleCEPChange(e.target.value)}
          maxLength={9}
          className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all outline-none ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
              : success
              ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-50'
              : 'border-gray-200 focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50'
          }`}
          placeholder="00000-000"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {loading && <Loader2Icon className="w-5 h-5 text-gray-400 animate-spin" />}
          {!loading && success && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
          {!loading && error && <AlertCircleIcon className="w-5 h-5 text-red-600" />}
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {success && <p className="text-sm text-green-600 mt-1">✓ Endereço encontrado</p>}
    </div>
  );
}
