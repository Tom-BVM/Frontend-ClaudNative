import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import bgRegistro from "../../assets/bg-registro.jpg";
import { toast } from "sonner";
import Logo from "../../assets/logo.svg";
import { Box } from "@mui/material";
import { useEffect } from "react";

export default function Login() {
  const { register, handleSubmit } = useForm({
    defaultValues: { nombre_usuario: "", password: "" },
  });
  
  const { login, loginWithMicrosoft, token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [token, navigate]);

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success("Sesión iniciada");
      navigate("/home", { replace: true });
    } catch {
      toast.error("Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-row items-center justify-start relative overflow-hidden p-0">
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${bgRegistro})` }}
      ></div>

      <div className="w-6/12 min-h-screen relative z-10 bg-white flex items-center justify-center shadow-lg">
        <div className="p-8 w-full max-w-md">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 8,
            }}
          >
            <img src={Logo} alt="Logo" width={200} />
          </Box>
          <h2 className="font-bold text-4xl text-center mb-6 text-primary">
            Iniciar Sesión
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="nombre_usuario"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre de usuario
              </label>
              <input
                id="nombre_usuario"
                type="text"
                data-testid="input-nombre-usuario"
                {...register("nombre_usuario", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-secondary transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                data-testid="input-password"
                {...register("password", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-secondary transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              data-testid="button-login"
              className="w-full text-white mt-4 py-3 text-lg font-semibold bg-secondary rounded-lg hover:bg-primary hover:shadow-lg hover:-translate-y-0.5 disabled:bg-gray-500 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? "Ingresando..." : "Entrar"}
            </button>
            
            {/* BOTÓN DE MICROSOFT ENTRA ID */}
            <button
              type="button"
              onClick={loginWithMicrosoft}
              className="w-full text-white mt-3 py-3 text-lg font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
            >
              Iniciar sesión con Microsoft Entra ID
            </button>

            <p className="text-center mt-4 text-gray-600 text-sm">
              ¿No tienes cuenta?{" "}
              <Link
                to="/registro"
                data-testid="link-registro"
                className="text-primary font-semibold no-underline hover:text-secondary hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}