import {
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Alert,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import InboxIcon from "@mui/icons-material/Inbox";
import SendIcon from "@mui/icons-material/Send"; // Nuevo icono para el botón
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import { toast } from "sonner"; // Importamos toast para las alertas

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({
    totalUsuarios: 0,
    totalClientes: 0,
    contratos7Dias: 0,
    contratos15Dias: 0,
    contratos30Dias: 0,
  });
  const [contratosProximosAVencer, setContratosProximosAVencer] = useState([]);
  const [contratosVencidos, setContratosVencidos] = useState([]);

  const empresaId = user.empresaId; 
  const usuarioId = user.usuarioId; 

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/metricas");

        if (data) {
          setMetricas(
            data.metricas || {
              totalUsuarios: 0,
              totalClientes: 0,
              contratos7Dias: 0,
              contratos15Dias: 0,
              contratos30Dias: 0,
            }
          );
          setContratosProximosAVencer(data.contratosProximosAVencer || []);
          setContratosVencidos(data.contratosVencidos || []);
        }
      } catch (error) {
        console.error("Error al cargar métricas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricas();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // --- FUNCIÓN EP3: CONEXIÓN A RABBITMQ (JAVA) ---
  const enviarNotificacionRabbit = async () => {
    try {
      toast.loading("Enviando mensaje asíncrono a RabbitMQ...", { id: "rabbit-toast" });

      // Llamamos directo a tu microservicio Java en el puerto 8080
      const response = await fetch('http://localhost:8080/api/notifications?message=Notificacion_Atlas_React_Exitosa', {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success("¡Mensaje procesado por RabbitMQ exitosamente!", { id: "rabbit-toast" });
      } else {
        toast.error("Error al enviar el mensaje al Broker.", { id: "rabbit-toast" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión. ¿El backend Java está encendido?", { id: "rabbit-toast" });
    }
  };
  // -----------------------------------------------

  if (loading) {
    return (
      <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ minHeight: "400px" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>Cargando métricas...</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex flex-col pt-1">
          <Typography variant="h4" color="primary">
            Bienvenido, <b>{user?.nombre_usuario}</b>
          </Typography>
        </div>
        
        {/* --- BOTÓN DE PRUEBA EP3 --- */}
        <Button 
          variant="contained" 
          color="warning" 
          endIcon={<SendIcon />}
          onClick={enviarNotificacionRabbit}
          sx={{ fontWeight: 'bold', boxShadow: 3 }}
        >
          Probar Mensajería (EP3)
        </Button>
        {/* --------------------------- */}
      </div>

      {/* Métricas principales con diseño mejorado */}
      <div className="grid grid-cols-4 gap-6">
        <Card
          sx={{
            background: "#1B7576",
            color: "white",
            boxShadow: "0 10px 30px rgba(27, 117, 118, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": { transform: "translateY(-5px)", boxShadow: "0 15px 40px rgba(27, 117, 118, 0.4)" },
          }}
        >
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{metricas.totalUsuarios}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Usuarios de la Empresa</Typography>
              </Box>
              <PeopleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
            </Stack>
          </CardContent>
        </Card>
        <Card
          sx={{
            background: "#4BBC7F",
            color: "white",
            boxShadow: "0 10px 30px rgba(75, 188, 127, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": { transform: "translateY(-5px)", boxShadow: "0 15px 40px rgba(75, 188, 127, 0.4)" },
          }}
        >
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{metricas.totalClientes}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Clientes Creados</Typography>
              </Box>
              <PersonIcon sx={{ fontSize: 48, opacity: 0.8 }} />
            </Stack>
          </CardContent>
        </Card>
        <Card
          sx={{
            background: "#D32F2F",
            color: "white",
            boxShadow: "0 10px 30px rgba(211, 47, 47, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": { transform: "translateY(-5px)", boxShadow: "0 15px 40px rgba(211, 47, 47, 0.4)" },
          }}
        >
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{metricas.contratos15Dias}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Vencen en 15 días</Typography>
              </Box>
              <WarningIcon sx={{ fontSize: 48, opacity: 0.8 }} />
            </Stack>
          </CardContent>
        </Card>
        <Card
          sx={{
            background: "#FF9800",
            color: "white",
            boxShadow: "0 10px 30px rgba(255, 152, 0, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": { transform: "translateY(-5px)", boxShadow: "0 15px 40px rgba(255, 152, 0, 0.4)" },
          }}
        >
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{metricas.contratos30Dias}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Vencen en 30 días</Typography>
              </Box>
              <AssignmentIcon sx={{ fontSize: 48, opacity: 0.8 }} />
            </Stack>
          </CardContent>
        </Card>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <BusinessIcon color="primary" />
                <Typography variant="h6">Editar Empresa</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Actualiza la información de tu empresa: nombre, dirección, teléfono y correo.
              </Typography>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/empresas/${empresaId}/editar`)}
                sx={{ alignSelf: "flex-start" }}
              >
                Editar Empresa
              </Button>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PersonIcon color="primary" />
                <Typography variant="h6">Editar Usuario</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Cambia tu contraseña y actualiza tu información de usuario.
              </Typography>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/usuarios/${usuarioId}/editar`)}
                sx={{ alignSelf: "flex-start" }}
              >
                Editar Usuario
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </div>

      {/* Contratos próximos a vencer y vencidos con pestañas */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Próximos a Vencer" icon={<WarningIcon />} iconPosition="start" className="!min-h-[auto] !h-auto !pt-4" />
            <Tab label="Vencidos" icon={<ErrorIcon />} iconPosition="start" className="!min-h-[auto] !h-auto !pt-4" />
          </Tabs>
        </Box>
        <CardContent>
          <Box sx={{ height: "400px", overflowY: "auto", pr: 1 }}>
            <Stack spacing={1}>
              {tabValue === 0 && contratosProximosAVencer.length === 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", py: 6 }}>
                  <Typography variant="h6" color="text.primary" gutterBottom>No hay contratos próximos a vencer</Typography>
                </Box>
              )}
              {tabValue === 0 && contratosProximosAVencer.map((contrato) => (
                <Alert key={contrato.id} severity="warning" icon={<WarningIcon />}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{contrato.cliente}</Typography>
                  <Typography variant="caption" display="block">
                    Fecha de vencimiento: {contrato.fechaVencimiento} ({contrato.diasRestantes} días restantes)
                  </Typography>
                </Alert>
              ))}
              {tabValue === 1 && contratosVencidos.length === 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", py: 6 }}>
                  <Typography variant="h6" color="text.primary" gutterBottom>No hay contratos vencidos</Typography>
                </Box>
              )}
              {tabValue === 1 && contratosVencidos.map((contrato) => (
                <Alert key={contrato.id} severity="error" icon={<ErrorIcon />}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{contrato.cliente}</Typography>
                  <Typography variant="caption" display="block">
                    Fecha de vencimiento: {contrato.fechaVencimiento} (vencido hace {contrato.diasVencidos} días)
                  </Typography>
                </Alert>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}