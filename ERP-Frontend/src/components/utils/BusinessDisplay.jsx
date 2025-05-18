function BusinessDisplay({title}) {
  return (
    <a
      className="w-60 p-5 bg-black rounded flex flex-col justify-center"
    >
      <h1>Empresa: {title} </h1>
      <h1>Localidade: {title} </h1>
    </a>
  )
}

export default BusinessDisplay
