import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import customerService from "../../services/customer.service";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TextField } from "@mui/material";

const CustomerTable = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const response = await customerService.getCustomer(accessToken);
      setSessions(response.data);
      setLoading(false);
    };

    fetchSessions();
  }, [accessToken]);

  const filteredSessions = sessions.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.telephone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSessions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredSessions.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", maxWidth: "100%", padding: "16px" }}>
      <Typography variant="h4" component="h2" fontWeight={600} gutterBottom>
        DAFTAR CUSTOMER AKUCUCIIN
      </Typography>
      <TextField
        label="Cari Customer"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TableContainer component={Paper} elevation={3} style={{ width: "100%", overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#f3f4f6" }}>
              {["No", "Nama", "Email", "Telephone", "Address", "Referral", "Referral Used"].map((header) => (
                <TableCell key={header} align="center" style={{ fontWeight: "bold", fontSize: "14px" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((item, index) => (
              <TableRow key={item.id} style={{ backgroundColor: index % 2 === 0 ? "white" : "#f9fafb", transition: "background 0.3s" }}>
                <TableCell align="center">{indexOfFirstItem + index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell align="center">{item.email}</TableCell>
                <TableCell align="center">{item.telephone}</TableCell>
                <TableCell align="center">{item.address}</TableCell>
                <TableCell align="center">{item.referral_code}</TableCell>
                <TableCell align="center">{item.referral_code_used}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} variant="contained" color="primary" style={{ margin: "4px" }}>
          Prev
        </Button>
        {pageNumbers.map((number) => (
          <Button key={number} onClick={() => paginate(number)} variant={currentPage === number ? "contained" : "outlined"} color="primary" style={{ margin: "4px" }}>
            {number}
          </Button>
        ))}
        <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pageNumbers.length} variant="contained" color="primary" style={{ margin: "4px" }}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default CustomerTable;
