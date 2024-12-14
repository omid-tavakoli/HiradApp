
const TextArea = ({ name, register, defaultValue , placeholder }) => {
  return (
    <textarea
      type="textarea"
      name={name}
      {...register(name)}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400  sm:leading-6"
    />
  )
}

export default TextArea