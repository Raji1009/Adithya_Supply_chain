export default function FormField({ label, name, value, onChange, type = 'text', required = false, textarea = false }) {
  return (
    <label className="field">
      <span>{label}</span>
      {textarea ? (
        <textarea name={name} value={value} onChange={onChange} required={required} rows="4" />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} required={required} />
      )}
    </label>
  );
}
