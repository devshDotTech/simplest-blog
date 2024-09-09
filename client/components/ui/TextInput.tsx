const InputField = ({
  title,
  name,
  placeholder,
  type,
  onChange = () => {},
}: {
  title?: string;
  name: string;
  placeholder?: string;
  type?: string;
  onChange?: (value: string) => void;
}) => {
  return (
    <label htmlFor="">
      {title}:{" "}
      <input
        onChange={(e) => (
          onChange(e.target.value), console.log(e.target.value)
        )}
        type={type ? type : "text"}
        name={name}
        placeholder={placeholder}
        className="border border-gray-500 rounded-sm outline-none w-48 bg-transparent px-2 py-1"
      />
    </label>
  );
};

export default InputField;
