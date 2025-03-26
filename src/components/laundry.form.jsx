import { useState } from "react";
import laundryService from "../services/laundry.service";
import Cookies from "js-cookie";
import { Container, Grid, TextField, Button, Typography, Paper } from "@mui/material";

const FormLaundry = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    password: "",
    confirm_password: "",
    telephone: "",
    address: "",
    city: "",
    area: "",
    latitude: "",
    longitude: "",
    maps_pinpoint: "",
  });

  const accessToken = Cookies.get("accessToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await laundryService.postLaundry(formData, accessToken);
    setFormData({
      name: "",
      email: "",
      description: "",
      password: "",
      confirm_password: "",
      telephone: "",
      address: "",
      city: "",
      area: "",
      latitude: "",
      longitude: "",
      maps_pinpoint: "",
    });
  };

  return (
    <Container component="main" maxWidth="md" style={{ display: "flex", justifyContent: "center", height: "100vh", alignItems: "center" }}>
      <Paper elevation={3} style={{ padding: 24, width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Masukkan Data Laundry
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {Object.keys(formData).map((key) => (
              <Grid item xs={12} sm={key === "description" ? 12 : 6} key={key}>
                <TextField
                  fullWidth
                  label={key.replace("_", " ").toUpperCase()}
                  name={key}
                  type={key.includes("password") ? "password" : key.includes("latitude") || key.includes("longitude") ? "number" : "text"}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  multiline={key === "description"}
                  minRows={key === "description" ? 3 : 1}
                />
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

export default FormLaundry;
