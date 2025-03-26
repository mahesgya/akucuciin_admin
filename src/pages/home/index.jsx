import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import orderService from "../../services/order.service";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Button, Box } from "@mui/material";

const HomePage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await orderService.getOrder(accessToken);
      const today = new Date().toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" });
      const filteredSessions = response.data.filter((order) => {
        const orderDate = new Date(order.created_at).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" });
        return orderDate === today;
      });
      await setSessions(filteredSessions);
      setLoading(false);
    };

    fetchSessions();
  }, [accessToken]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sessions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sessions.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <Box p={3} >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Selamat Datang di Dashboard Admin!
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Hari ini:{" "}
        <strong>
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </strong>
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Jumlah pesanan hari ini: <strong>{sessions.length}</strong>
      </Typography>

      <Box mt={4} borderRadius={2} display="flex" 
    justifyContent="center" 
    alignItems="center" flexDirection="column">
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          ORDER AKUCUCIIN HARI INI
        </Typography>

        <TableContainer component={Paper} style={{ maxWidth: 900 }}>
          <Table>
            <TableHead>
              <TableRow>
                {["No", "Tanggal", "Nama", "Email", "Telephone", "Address", "Kode Promo", "Laundry", "Paket", "Status", "Total Harga", "Total Berat"].map((header) => (
                  <TableCell key={header} align="center" style={{ fontWeight: "bold" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((item, index) => (
                <TableRow key={item.id} hover>
                  <TableCell align="center">{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell align="center">
                    {new Intl.DateTimeFormat("id-ID", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(item.created_at))}
                  </TableCell>
                  <TableCell>{item.customer.name}</TableCell>
                  <TableCell align="center">{item.customer.email}</TableCell>
                  <TableCell align="center">{item.customer.telephone}</TableCell>
                  <TableCell align="center">{item.customer.address}</TableCell>
                  <TableCell align="center">{item.coupon_code}</TableCell>
                  <TableCell align="center">{item.laundry_partner.name}</TableCell>
                  <TableCell align="center">{item.package.name}</TableCell>
                  <TableCell align="center">{item.status}</TableCell>
                  <TableCell align="center">{item.price}</TableCell>
                  <TableCell align="center">{item.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Prev
          </Button>
          {pageNumbers.map((number) => (
            <Button key={number} variant={currentPage === number ? "contained" : "outlined"} color="primary" onClick={() => paginate(number)}>
              {number}
            </Button>
          ))}
          <Button variant="contained" color="primary" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pageNumbers.length}>
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
