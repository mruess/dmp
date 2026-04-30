interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, hint, error, children }: FormFieldProps) {
  return (
    <div className={`form-field${error ? ' form-field--error' : ''}`}>
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      {children}
      {error && <span className="form-error-msg">{error}</span>}
      {!error && hint && <span className="form-hint">{hint}</span>}
    </div>
  );
}

interface SelectProps {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
}

export function Select({ value, options, onChange, placeholder = '– bitte wählen –', required, error }: SelectProps) {
  return (
    <select
      className={`form-select${error ? ' form-select--error' : ''}`}
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
  error?: boolean;
}

export function Input({ value, onChange, type = 'text', placeholder, required, readOnly, error }: InputProps) {
  return (
    <input
      className={`form-input${error ? ' form-input--error' : ''}`}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
    />
  );
}

interface CheckboxGroupProps {
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
  error?: boolean;
  // Spezialregel: „Ja" schließt andere aus (Plausi-Regel 6)
  exclusiveOption?: string;
}

export function CheckboxGroup({ options, value, onChange, error, exclusiveOption }: CheckboxGroupProps) {
  function toggle(opt: string) {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      if (exclusiveOption && opt === exclusiveOption) {
        // „Ja" gewählt → alle anderen abwählen
        onChange([opt]);
      } else if (exclusiveOption && value.includes(exclusiveOption)) {
        // Andere gewählt während „Ja" aktiv → „Ja" abwählen
        onChange([...value.filter((v) => v !== exclusiveOption), opt]);
      } else {
        onChange([...value, opt]);
      }
    }
  }

  return (
    <div className={`checkbox-group${error ? ' checkbox-group--error' : ''}`}>
      {options.map((opt) => (
        <label key={opt} className="checkbox-label">
          <input
            type="checkbox"
            checked={value.includes(opt)}
            onChange={() => toggle(opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}
