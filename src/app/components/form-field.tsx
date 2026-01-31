import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function FormField({ 
  id, 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  required = false 
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && '*'}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
