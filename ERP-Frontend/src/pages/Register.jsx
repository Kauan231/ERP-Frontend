import { useState } from "react";
import Input from "../components/inputs/Input";
import Button from "../components/inputs/Button";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const errorsDict = {
    "DuplicateUserName": "Nome de usuário já existe",
    "PasswordTooShort": "A senha precisa ter mais do que 8 dígitos",
    "PasswordRequiresNonAlphanumeric": "A senha precisa ter caracteres especiais",
    "PasswordRequiresLower": "Insira pelo menos um caracter minúsculo",
    "PasswordRequiresUpper": "Insira pelo menos um caracter maiúsculo",
    "PasswordRequiresDigit": "Insira pelo menos um número"
  }

  const register = async () => {
    const res = await fetch("https://localhost:7011/User/Register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, rePassword: password }),
      credentials: "include"
    });

    const response = await res.text();

    if (res.ok) {
      window.location.href = "/login";
    } else {
      console.error("Erro ao registrar:", response);

      let splittedErrors = response.split(",");
      splittedErrors[0] = splittedErrors[0].split(":")[1].trim();
      let responseErrors = splittedErrors.map((error) => {
        return errorsDict[error];
      });
      console.log("responseErrors", response.split(","))
      setErrors(responseErrors);
    }
  };

  return (
  <div className="bg-blue-200 h-screen w-screen flex items-center justify-center text-black">
    <div className="w-full max-w-md flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
      <div>
        <label
          className="font-bold"
        > Usuário: </label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuário"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-bold">Senha:</label>

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
        />

        {errors[0] && (
          <span className="text-red-500 text-sm mt-1">

          *{errors[0]}
          </span>
        )}
      </div>

      <div className="w-full flex flex-col items-end space-y-2">
        <Button
          onClick={register}
          title={"Entrar"}
        />
        <a
          href="/login"
          className="text-sm text-blue-600 hover:underline"
        >
          Login
        </a>
      </div>


    </div>
  </div>
);

};

export default Register;
