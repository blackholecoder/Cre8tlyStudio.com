import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import colors from "../config/colors";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/header_logo.svg";

const VideoLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const normalizedEmail = email.trim().toLowerCase();
      // Replace with your actual login API endpoint
      const response = await axios.post(
        "https://phlokk-website-api.phlokk.com/api/auth/login",
        {
          email: normalizedEmail,
          password,
        }
      );

      const userData = response.data.user[0];

      // Store tokens (if desired, adjust based on your security requirements)
      localStorage.setItem("phlokkUser", JSON.stringify(userData));
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      // onLogin callback to update global user state
      onLogin(userData);
      localStorage.setItem("phlokkUser", JSON.stringify(userData));
      navigate("/features");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh", // Full viewport height
        display: "flex", // Flex container
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        backgroundColor: colors.bioModal, // Optional: dark background
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#111",
          }}
        >
          <img
            src={logo}
            alt="Phlokk Logo"
            style={{
              width: 80,
              height: 80,
              marginBottom: 16,
              borderRadius: 12,
            }}
          />
          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: 2, color: colors.white }}
          >
            Sign In
          </Typography>
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiInputBase-input": { color: "#000" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: colors.white,
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent", // or your desired color
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: colors.secondary, // Change label color
                  transform: "translate(14px, -20px) scale(0.75)", // Move the label up and scale it down
                  // You can adjust the values above to position it exactly how you want
                  "&.Mui-focused": { color: colors.white },
                },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiInputBase-input": { color: "#000" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: colors.white,
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent", // or your desired color
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: colors.white, // Change label color
                  transform: "translate(14px, -20px) scale(0.75)", // Move the label up and scale it down
                  // You can adjust the values above to position it exactly how you want
                  "&.Mui-focused": { color: colors.white },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                p: 2,
                borderRadius: 3,
                backgroundColor: colors.bioModal,
                "&:hover": {
                  backgroundColor: colors.green,
                  color: colors.black,
                },
                color: colors.green,
              }}
            >
              Sign In
            </Button>
            {/* <Typography align="center" sx={{ color: colors.white }}>
              Don't have an account?{" "}
              <a
                href="/register"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                Register
              </a>
            </Typography> */}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default VideoLogin;
