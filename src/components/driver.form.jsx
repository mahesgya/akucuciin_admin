import { useState } from "react";
import driverService from "../services/driver.service"; // Pastikan service ini dibuat
import Cookies from "js-cookie";
import { Container, Grid, TextField, Button, Typography, Paper } from "@mui/material";

const FormDriver = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    telephone: "",
    address: "",
    city: "",
  });

  const accessToken = Cookies.get("accessToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await driverService.postDriver(formData, accessToken);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      telephone: "",
      address: "",
      city: "",
    });
  };

  return (
    <Container component="main" maxWidth="sm" style={{ display: "flex", justifyContent: "center", height: "100vh", alignItems: "center" }}>
      <Paper elevation={3} style={{ padding: 24, width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Masukkan Data Driver
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {Object.keys(formData).map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField fullWidth label={key.replace("_", " ").toUpperCase()} name={key} type={key.includes("password") ? "password" : "text"} value={formData[key]} onChange={handleChange} required />
              </Grid>
            ))}
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: 16 }}>
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default FormDriver;
