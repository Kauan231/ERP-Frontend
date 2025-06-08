import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Cookies from "js-cookie";
import Input from "../components/inputs/Input";
import Button from "../components/inputs/Button";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch("https://localhost:7011/User/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include"
    });

    const token = await res.text(); // ← retorna como texto, não JSON

    if (res.ok) {
      Cookies.set("token", token);
      setUser({ token });
      window.location.href = "/"; // Redireciona
    } else {
      alert("Login inválido");
    }
  };

  return (
  <div className="bg-blue-200 h-screen w-screen flex items-center justify-center text-black">
    <div className="w-full max-w-md flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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

      <div>
        <label
          className="font-bold"
        > Senha: </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
        />
      </div>

      <div className="w-full flex flex-col items-end space-y-2">
        <Button
          onClick={login}
          title={"Entrar"}
        />
        <a
          href="/register"
          className="text-sm text-blue-600 hover:underline"
        >
          Cadastrar
        </a>
      </div>


    </div>
  </div>
);

};

export default Login;
