import { useState, useEffect } from 'react';
import { CheckCircleIcon, AlertCircleIcon, Loader2Icon } from 'lucide-react';

interface ValidatedInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onValidation?: (isValid: boolean) => void;
  validator?: (value: string) => Promise<{ valid: boolean; message?: string }>;
  formatter?: (value: string) => string;
  icon?: React.ReactNode;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function ValidatedInput({
  label,
  type = 'text',
  value,
  onChange,
  onValidation,
  validator,
  formatter,
  icon,
  placeholder,
  required = false,
  disabled = false
}: ValidatedInputProps) {
  const [validating, setValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!validator || !value) {
      setIsValid(null);
      setValidationMessage('');
      return;
    }

    const timeoutId = setTimeout(async () => {
      setValidating(true);
      try {
        const result = await validator(value);
        setIsValid(result.valid);
        setValidationMessage(result.message || '');
        onValidation?.(result.valid);
      } catch (error) {
        setIsValid(false);
        setValidationMessage('Erro ao validar');
        onValidation?.(false);
      } finally {
        setValidating(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value, validator]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = formatter ? formatter(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-12 py-3 border-2 rounded-xl transition-all outline-none ${
            isValid === false
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
              : isValid === true
              ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-50'
              : 'border-gray-200 focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-50'
          } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {validating && <Loader2Icon className="w-5 h-5 text-gray-400 animate-spin" />}
          {!validating && isValid === true && (
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          )}
          {!validating && isValid === false && (
            <AlertCircleIcon className="w-5 h-5 text-red-600" />
          )}
        </div>
      </div>
      {validationMessage && (
        <p className={`text-sm mt-1 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          {validationMessage}
        </p>
      )}
    </div>
  );
}
