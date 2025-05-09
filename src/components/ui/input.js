const Input = ({ id, name, type, placeholder, value, onChange, className }) => (
  <input
    id={id}
    name={name}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={className}
  />
);

export default Input;