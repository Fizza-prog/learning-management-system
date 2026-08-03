import "./AuthInput.css"

function AuthInput({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  icon
}) {
  return (
    <div className="input-group">
      {icon && <span className="input-icon">{icon}</span>}

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? "input-error" : ""}
      />

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default AuthInput;