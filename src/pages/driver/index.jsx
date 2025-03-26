import { useEffect, useState } from "react";
import driverService from "../../services/driver.service";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Button } from "@mui/material";
import Cookies from "js-cookie";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import FormDriver from "../../components/driver.form";

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);

  const [editDriver, setEditDriver] = useState(null);
  const [formDriver, setFormDriver] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    address: "",
    city: "",
  });
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchDrivers = async () => {
      const response = await driverService.getDrivers(accessToken);
      setDrivers(response.data);
    };

    fetchDrivers();
  }, []);

  const handleEdit = (driver) => {
    setEditDriver(driver);
    setEditFormData({
      name: driver.name,
      email: driver.email,
      telephone: driver.telephone,
      address: driver.address,
      city: driver.city,
    });
  };

  const handleChangePost = () => {
    setFormDriver(!formDriver);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSave = async (idDriver) => {
    const updatedFields = {};

    const oldDriver = drivers.find((driver) => driver.id === idDriver);

    Object.keys(editFormData).forEach((key) => {
      if (editFormData[key] !== oldDriver[key]) {
        updatedFields[key] = editFormData[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      setEditDriver(null);
      return;
    }

    await driverService.putDriver(accessToken, updatedFields, idDriver);
    setDrivers(drivers.map((driver) => (driver.id === idDriver ? { ...driver, ...updatedFields } : driver)));
    setEditDriver(null);
  };

  const handleDelete = async (idDriver) => {
    const confirmed = await Swal.fire({
      icon: "warning",
      title: "Yakin ingin menghapus driver ini?",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (confirmed.isConfirmed) {
      await driverService.deleteDriver(accessToken, idDriver);
      setDrivers(drivers.filter((driver) => driver.id !== idDriver));
    }
  };

  return (
    <div>
      {formDriver ? (
        <FormDriver />
      ) : (
        <div className="p-4">
          <Typography variant="h4" component="h2" fontWeight={600} gutterBottom align="center">
            LIST DRIVER
          </Typography>

          <TableContainer component={Paper} className="w-full shadow-md overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#E5E7EB" }}>
                  <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid #D1D5DB" }}>
                    Nama
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid #D1D5DB" }}>
                    Email
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid #D1D5DB" }}>
                    Telepon
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid #D1D5DB" }}>
                    Alamat
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid #D1D5DB" }}>
                    Kota
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid #D1D5DB" }}>
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id} hover>
                    <TableCell align="center" sx={{ border: "1px solid #D1D5DB" }}>
                      {editDriver?.id === driver.id ? <TextField name="name" value={editFormData.name} onChange={handleInputChange} /> : driver.name}
                    </TableCell>
                    <TableCell align="center" sx={{ border: "1px solid #D1D5DB" }}>
                      {editDriver?.id === driver.id ? <TextField name="email" value={editFormData.email} onChange={handleInputChange} /> : driver.email}
                    </TableCell>
                    <TableCell align="center" sx={{ border: "1px solid #D1D5DB" }}>
                      {editDriver?.id === driver.id ? <TextField name="telephone" value={editFormData.telephone} onChange={handleInputChange} /> : driver.telephone}
                    </TableCell>
                    <TableCell align="center" sx={{ border: "1px solid #D1D5DB" }}>
                      {editDriver?.id === driver.id ? <TextField name="address" value={editFormData.address} onChange={handleInputChange} /> : driver.address}
                    </TableCell>
                    <TableCell align="center" sx={{ border: "1px solid #D1D5DB" }}>
                      {editDriver?.id === driver.id ? <TextField name="city" value={editFormData.city} onChange={handleInputChange} /> : driver.city}
                    </TableCell>
                    <TableCell align="center" sx={{ border: "1px solid #D1D5DB" }}>
                      {editDriver?.id === driver.id ? (
                        <Button color="primary" onClick={() => handleSave(driver.id)}>
                          Simpan
                        </Button>
                      ) : (
                        <IconButton color="primary" onClick={() => handleEdit(driver)}>
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton color="error" onClick={() => handleDelete(driver.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      <button onClick={handleChangePost} className="fixed bottom-5 right-5 font-quick px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
        {formDriver ? "Lihat Daftar Driver" : "Tambahkan Driver Baru"}
      </button>
    </div>
  );
};

export default DriverList;
