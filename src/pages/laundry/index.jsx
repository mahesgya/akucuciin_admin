import { useEffect, useState } from "react";

import laundryService from "../../services/laundry.service";
import layananService from "../../services/layanan.service";
import FormLaundry from "../../components/laundry.form";

import Swal from "sweetalert2";
import Cookies from "js-cookie";

import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Box, Grid, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const LaundryTable = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [postLaundry, setPostLaundry] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [editLaundry, setEditLaundry] = useState({});
  const [selectedLaundry, setSelectedLaundry] = useState(null);
  const [idLaundry, setIdLaundry] = useState(null);
  const [formDetail, setFormDetail] = useState(false);

  const [idLaundryActive, setIdLaundryActive] = useState(null);
  const [editModePackage, setEditModePackage] = useState(null);
  const [editedPackage, setEditedPackage] = useState({});
  const [originalPackage, setOriginalPackage] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    features: "",
    price_text: "",
  });

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const response = await laundryService.getLaundry(accessToken);
      setSessions(response.data);
      setLoading(false);
    };

    fetchSessions();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sessions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(sessions.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleBack = () => {
    setSelectedLaundry(null);
    setIdLaundry(null);
  };

  const handleEdit = async () => {
    await laundryService.putLaundry(accessToken, editLaundry, isEditing);
    setSessions(sessions.map((session) => (session.id === isEditing ? { ...session, ...editLaundry } : session)));
    setIsEditing(null);
  };

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      icon: "warning",
      title: "Yakin ingin menghapus laundry ini?",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (confirmed.isConfirmed) {
      await laundryService.deleteLaundry(accessToken, id);
      setSessions(sessions.filter((session) => session.id !== id));
    }
  };

  const handleInputChange = (e) => {
    setEditLaundry({
      ...editLaundry,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePost = () => {
    setPostLaundry(!postLaundry);
  };

  const handleDetail = async (idLaundry) => {
    setIdLaundry(idLaundry);
    const response = await layananService.getLayananByLaundry(accessToken, idLaundry);
    setIdLaundryActive(response.data.id);
    setSelectedLaundry(response.data.packages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await layananService.postLayanan(formData, accessToken, idLaundry);
    setFormData({
      name: "",
      description: "",
      features: "",
      price_text: "",
    });
  };

  const handleDeletePaket = async (idPackage) => {
    const confirmed = await Swal.fire({
      icon: "warning",
      title: "Yakin ingin menghapus paket ini?",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (confirmed.isConfirmed) {
      await layananService.deleteLayanan(accessToken, idLaundry, idPackage);
      setSelectedLaundry((prev) => prev.filter((laundry) => laundry.idPackage !== idPackage));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleShowForm = () => {
    setFormDetail(!formDetail);
  };

  const handleEditPaket = (id, laundry) => {
    setEditModePackage(id);
    setEditedPackage({ ...laundry });
    setOriginalPackage({ ...laundry });
  };

  const handleChangePackage = (e) => {
    const { name, value } = e.target;
    setEditedPackage({ ...editedPackage, [name]: value });
  };

  const handleSavePackage = async (idLaundry, idPackage) => {
    const updatedFields = {};

    Object.keys(editedPackage).forEach((key) => {
      if (editedPackage[key] !== originalPackage[key]) {
        updatedFields[key] = editedPackage[key];
      }
    });

    if (Object.keys(updatedFields).length > 0) {
      await layananService.putLayanan(updatedFields, accessToken, idLaundry, idPackage);
      setEditModePackage(null);
    } else {
      setEditModePackage(null);
      return;
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="relative">
      {postLaundry ? (
        <div>
          <FormLaundry />
        </div>
      ) : selectedLaundry ? (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography variant="h4" component="h2" fontWeight={600} gutterBottom>
            DETAIL MITRA LAUNDRY
          </Typography>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    Nama
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    Deskripsi
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    Fitur
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    Harga
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: "bold" }}>
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedLaundry.map((laundry) => (
                  <TableRow key={laundry.id}>
                    <TableCell>{editModePackage === laundry.id ? <TextField name="name" value={editedPackage.name || ""} onChange={handleChangePackage} /> : laundry.name}</TableCell>
                    <TableCell>{editModePackage === laundry.id ? <TextField name="description" value={editedPackage.description || ""} onChange={handleChangePackage} /> : laundry.description}</TableCell>
                    <TableCell>
                      {editModePackage === laundry.id ? (
                        <TextField name="features" value={editedPackage.features} onChange={handleChangePackage} />
                      ) : (
                        laundry.features.map((feature, index) => <Chip key={index} label={feature} color="primary" sx={{ m: 0.5 }} />)
                      )}
                    </TableCell>
                    <TableCell>{editModePackage === laundry.id ? <TextField name="price_text" value={editedPackage.price_text || ""} onChange={handleChangePackage} /> : `Rp ${parseInt(laundry.price_text).toLocaleString()}`}</TableCell>
                    <TableCell>
                      {editModePackage === laundry.id ? (
                        <Button variant="contained" color="success" onClick={() => handleSavePackage(idLaundryActive, editedPackage.id)}>
                          Save
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="contained" color="primary" onClick={() => handleEditPaket(laundry.id, laundry)}>
                            Edit
                          </Button>
                          <Button variant="contained" color="error" onClick={() => handleDeletePaket(laundry.id)}>
                            Hapus
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {formDetail && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 600 }}>
                <Typography variant="h5" align="center" gutterBottom>
                  Masukkan Data Laundry
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Nama Paket" name="name" value={formData.name} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Deskripsi" name="description" value={formData.description} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Fitur" name="features" value={formData.features} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Harga" name="price_text" value={formData.price_text} onChange={handleChange} required />
                    </Grid>
                  </Grid>
                  <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                    Submit
                  </Button>
                </form>
              </Paper>
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button variant="contained" color="primary" onClick={handleBack}>
              Kembali
            </Button>
            <Button variant="contained" color="secondary" onClick={handleShowForm}>
              {formDetail ? "Lihat List Detail" : "Tambahkan Detail Baru"}
            </Button>
          </Box>
        </Container>
      ) : (
        <div className="p-6 flex flex-col items-center w-full h-screen">
          <Typography variant="h4" component="h2" fontWeight={600} gutterBottom>
            LIST MITRA LAUNDRY
          </Typography>
          <TableContainer component={Paper} sx={{ maxWidth: { lg: 900 } }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  {["No", "Nama", "Email", "Maps", "Telephone","Description", "Address", "City", "Area", "Detail Paket", "Actions"].map((header) => (
                    <TableCell key={header} align="center" sx={{ fontWeight: "bold" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((item, index) => (
                  <TableRow key={item.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{isEditing === item.id ? <TextField variant="outlined" sx={{ minWidth: 100, maxWidth: 150 }} name="name" value={editLaundry.name || item.name} onChange={handleInputChange} fullWidth /> : item.name}</TableCell>
                    <TableCell>
                      {isEditing === item.id ? <TextField variant="outlined" sx={{ minWidth: 100, maxWidth: 150 }} name="email" value={editLaundry.email || item.email} onChange={handleInputChange} fullWidth /> : item.email}
                    </TableCell>
                    <TableCell>
                      {isEditing === item.id ? (
                        <TextField variant="outlined" sx={{ minWidth: 10 }} name="maps_pinpoint" value={editLaundry.maps_pinpoint || item.maps_pinpoint} onChange={handleInputChange} fullWidth />
                      ) : (
                        <a href={item.maps_pinpoint} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                          {item.maps_pinpoint}
                        </a>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {isEditing === item.id ? <TextField variant="outlined" sx={{ minWidth: 100, maxWidth: 150 }} name="telephone" value={editLaundry.telephone || item.telephone} onChange={handleInputChange} fullWidth /> : item.telephone}
                    </TableCell>
                    <TableCell align="center">
                      {isEditing === item.id ? <TextField variant="outlined" sx={{ minWidth: 100, maxWidth: 150 }} name="description" value={editLaundry.description || item.description} onChange={handleInputChange} fullWidth /> : item.description}
                    </TableCell>
                    <TableCell align="center">
                      {isEditing === item.id ? <TextField variant="outlined" sx={{ minWidth: 100, maxWidth: 150 }} name="address" value={editLaundry.address || item.address} onChange={handleInputChange} fullWidth /> : item.address}
                    </TableCell>
                    <TableCell align="center">
                      {isEditing === item.id ? <TextField variant="outlined" sx={{ minWidth: 100, maxWidth: 150 }} name="city" value={editLaundry.city || item.city} onChange={handleInputChange} fullWidth /> : item.city}
                    </TableCell>
                    <TableCell align="center">
                      {isEditing === item.id ? <TextField variant="outlined" sx={{ minWidth: 100, maxWidth: 150 }} name="area" value={editLaundry.area || item.area} onChange={handleInputChange} fullWidth /> : item.area}
                    </TableCell>
                    <TableCell align="center" sx={{ minWidth: 100, maxWidth: 150 }}>
                      <Button color="success" onClick={() => handleDetail(item.id)}>
                        Detail
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      {isEditing === item.id ? (
                        <Button color="primary" onClick={handleEdit}>
                          Save
                        </Button>
                      ) : (
                        <Button color="primary" onClick={() => setIsEditing(item.id)}>
                          <EditIcon />
                        </Button>
                      )}
                      <Button color="error" onClick={() => handleDelete(item.id)}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button variant="contained" color="primary" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </Button>
            {pageNumbers.map((number) => (
              <Button key={number} variant={currentPage === number ? "contained" : "outlined"} color="primary" onClick={() => paginate(number)} style={{ margin: "0 4px" }}>
                {number}
              </Button>
            ))}
            <Button variant="contained" color="primary" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pageNumbers.length}>
              Next
            </Button>
          </div>
        </div>
      )}
      {!selectedLaundry && (
        <button onClick={handleChangePost} className="fixed bottom-5 right-5 font-quick px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
          {postLaundry ? "Lihat Daftar Laundry" : "Tambahkan Laundry Baru"}
        </button>
      )}
    </div>
  );
};

export default LaundryTable;
