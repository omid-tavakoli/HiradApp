const ColorInput = ({ name, register, defaultValue }) => {
  return (
    <input
      type="color"
      name={name}
      {...register(name)}
      defaultValue={defaultValue}
      className="form-input block w-full rounded-md border-0 !p-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
    />
  );
};

export default ColorInput;
