import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Cookies from "js-cookie";

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
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <input
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuário"
      />

      <input
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        onClick={login}
      >
        Entrar
      </button>
    </div>
  </div>
);

};

export default Login;
