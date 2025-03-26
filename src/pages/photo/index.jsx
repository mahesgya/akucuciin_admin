import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import laundryService from "../../services/laundry.service";
import Cookies from "js-cookie";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const FotoPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
        setLoading(true);
        const response = await laundryService.getLaundry(accessToken);
        await setSessions(response.data);
        setLoading(false);
    };

    fetchSessions();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-6 flex flex-col items-center rounded-lg shadow-lg h-screen max-w-screen">
      <Typography variant="h4" component="h2" fontWeight={600} gutterBottom>
        LIST MITRA LAUNDRY
      </Typography>

      <TableContainer component={Paper} className="w-full shadow-md overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#E5E7EB" }}>
              {" "}
              <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid #D1D5DB" }}>
                Nama
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", border: "1px solid #D1D5DB" }}>
                Foto
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sessions.map((laundry) => (
              <TableRow key={laundry.id} hover>
                <TableCell align="center" sx={{ border: "1px solid #D1D5DB" }}>
                  {laundry.name}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: "#3B82F6", 
                    cursor: "pointer",
                    textDecoration: "underline",
                    border: "1px solid #D1D5DB",
                    "&:hover": { color: "#2563EB" },
                  }}
                  onClick={() => navigate(`/dashboard/foto/${laundry.id}`)}
                >
                  Lihat Foto
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FotoPage;
