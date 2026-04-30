interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, hint, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      {children}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
}

interface SelectProps {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function Select({ value, options, onChange, placeholder = '– bitte wählen –', required }: SelectProps) {
  return (
    <select
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

interface InputProps {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
}

export function Input({ value, onChange, type = 'text', placeholder, required, readOnly }: InputProps) {
  return (
    <input
      className="form-input"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
    />
  );
}
