import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_API!;

interface User {
  username: string;
  [key: string]: any;
}

function App() {
  const [registerData, setRegisterData] = useState({ username: "", password: "" });
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  const updateField =
    (setter: React.Dispatch<React.SetStateAction<{ username: string; password: string }>>) =>
      (field: string, value: string) => {
        setter((prev) => ({ ...prev, [field]: value }));
      };

  const updateRegisterField = updateField(setRegisterData);
  const updateLoginField = updateField(setLoginData);

  const handleRegister = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const { username, password } = registerData;
        const res = await axios.post("/user/register", { username, password });
        setMessage(res.data.message);
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || "Registration failed";
        setMessage(errorMsg);
      }
    },
    [registerData]
  );

  const handleLogin = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const { username, password } = loginData;
        const res = await axios.post("/user/login", { username, password });
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        setUser(user);
        setMessage(`Welcome back, ${user.username}`);
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || "Login failed";
        setMessage(errorMsg);
      }
    },
    [loginData]
  );

  const handleLogout = useCallback(async (reason = "Logged out") => {
    await axios.post("/user/logout");
    localStorage.removeItem("token");
    setUser(null);
    setLoginData({ username: "", password: "" });
    setMessage(reason);
  }, []);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setMessage(`Welcome back, ${res.data.user.username}`);
    } catch (err) {
      console.error("Token may be expired or invalid", err);
      localStorage.removeItem("token");
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!user) return;

    const logoutTimer = setTimeout(() => {
      handleLogout("Session expired (2 min)");
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearTimeout(logoutTimer);
  }, [user, handleLogout]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      {/* Forms Row */}
      <Box display="flex" gap={4} justifyContent="center">
        {/* Register Form */}
        <Paper elevation={3} sx={{ padding: 2, width: "300px" }} component="form" onSubmit={handleRegister}>
          <Typography variant="h6" textAlign="center">Register</Typography>
          <Stack spacing={2} mt={2}>
            <TextField
              label="Username"
              value={registerData.username}
              onChange={(e) => updateRegisterField("username", e.target.value)}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={registerData.password}
              onChange={(e) => updateRegisterField("password", e.target.value)}
              fullWidth
            />
            <Button variant="contained" type="submit" fullWidth>Register</Button>
          </Stack>
        </Paper>

        {/* Login Form */}
        <Paper elevation={3} sx={{ padding: 2, width: "300px" }} component="form" onSubmit={handleLogin}>
          <Typography variant="h6" textAlign="center">Login</Typography>
          <Stack spacing={2} mt={2}>
            <TextField
              label="Username"
              value={loginData.username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateLoginField("username", e.target.value)} fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={loginData.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateLoginField("password", e.target.value)} fullWidth
            />
            <Button variant="contained" type="submit" fullWidth>Login</Button>
          </Stack>
        </Paper>
      </Box>

      {/* Status Section */}
      <Paper elevation={2} sx={{ marginTop: 4, padding: 3, width: "640px", textAlign: "center" }}>
        <Typography variant="h6">Status</Typography>
        {user ? (
          <Typography>Logged in as: <strong>{user.username}</strong></Typography>
        ) : (
          <Typography>Not logged in</Typography>
        )}
        {message && <Typography sx={{ mt: 1 }}>{message}</Typography>}
        {user && (
          <Button sx={{ mt: 2 }} variant="outlined" onClick={() => handleLogout("Logged out")}>
            Logout
          </Button>
        )}
      </Paper>
    </Box>
  );
}

export default App;
