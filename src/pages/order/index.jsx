import { useEffect, useState } from "react";

import Cookies from "js-cookie";
import Swal from "sweetalert2";

import orderService from "../../services/order.service";
import driverService from "../../services/driver.service";

import { Accordion, AccordionSummary, AccordionDetails, Typography, Select, MenuItem, Button, TextField } from "@mui/material";
import { Card, CardContent, CardActions, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MessageLaundry from "../../components/message.laundry";
import MessageCustomer from "../../components/message.customer";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editedData, setEditedData] = useState({ status: "", price: 0, weight: 0, status_payment: "" });
  const [drivers, setDrivers] = useState([]);

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const response = await orderService.getOrder(accessToken);
      const sortedOrders = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setOrders(sortedOrders);
      setLoading(false);
    };

    fetchOrders();
  }, [accessToken]);

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      const response = await driverService.getDrivers(accessToken);
      setDrivers(response.data);
      setLoading(false);
    };

    fetchDrivers();
  }, [accessToken]);

  const handleAssignDriver = async (orderId, driverId) => {
    const confirmed = await Swal.fire({
      icon: "question",
      title: "Assign Driver?",
      text: "Apakah Anda yakin ingin meng-assign driver ini?",
      showCancelButton: true,
      confirmButtonText: "Ya, Assign",
      cancelButtonText: "Batal",
    });

    if (confirmed.isConfirmed) {
      await driverService.assignDriver(accessToken, orderId, driverId);
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, driver_id: driverId } : order)));
    }
  };

  const handleRemoveDriver = async (orderId) => {
    const confirmed = await Swal.fire({
      icon: "warning",
      title: "Hapus Driver?",
      text: "Apakah Anda yakin ingin menghapus driver dari order ini?",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (confirmed.isConfirmed) {
      await driverService.removeAssignDriver(accessToken, orderId);
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, driver_id: null } : order)));
    }
  };

  const statusOptions = ["pending", "penjemputan", "pencucian", "selesai", "batal", "kesalahan"];
  const paymentOptions = ["belum bayar", "sudah bayar"];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning.main";
      case "penjemputan":
        return "info.main";
      case "pencucian":
        return "primary.main";
      case "selesai":
        return "success.main";
      case "batal":
        return "error.main";
      case "kesalahan":
        return "grey.500";
      default:
        return "text.primary";
    }
  };
  const getPaymentColor = (status) => {
    switch (status) {
      case "belum bayar":
        return "error.main";
      case "sudah bayar":
        return "success.main";
      default:
        return "text.primary";
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order.id);
    setEditedData({
      status: order.status,
      price: order.price,
      weight: order.weight,
      status_payment: order.status_payment,
    });
  };

  const handleSave = async (id) => {
    const confirmed = await Swal.fire({
      icon: "warning",
      title: "Yakin ingin mengubah data order ini?",
      showCancelButton: true,
      confirmButtonText: "Ubah",
      cancelButtonText: "Batal",
    });

    if (confirmed.isConfirmed) {
      await orderService.updateOrder(id, editedData, accessToken);
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === id ? { ...order, ...editedData } : order)));
      setEditingOrder(null);
    }
  };

  const handleChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(orders.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <Typography variant="h4" fontWeight={600} gutterBottom sx={{ fontSize: { xs: "1rem", sm: "2rem", md: "2.5rem" } }}>
        DAFTAR ORDER AKUCUCIIN
      </Typography>
      {currentItems.map((item, index) => (
        <Card
          key={item.id}
          sx={{
            width: "100%",
            maxWidth: { xs: 300, sm: 500, md: 900 },
            mb: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "14px", sm: "16px", md: "20px" }, fontWeight: "bold" }}>{item.customer.name}</Typography>
                <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "12px", sm: "14px", md: "18px" } }}>
                  {new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date(item.created_at))} <br />
                  {item.package.name}
                </Typography>
                <Typography sx={{ fontFamily: "Quicksand", color: getStatusColor(item.status), fontSize: { xs: "13px", sm: "15px", md: "19px" }, fontWeight: "bold" }}>{item.status}</Typography>
              </div>
            </AccordionSummary>

            <AccordionDetails sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
              <CardContent sx={{ padding: 0.5 }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
                      <strong>Order Id:</strong> {item.id}
                    </Typography>
                    <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
                      <strong>Tanggal:</strong> {new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date(item.created_at))}
                    </Typography>
                    <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
                      <strong>Email:</strong> {item.customer.email}
                    </Typography>
                    <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
                      <strong>Telephone:</strong> {item.customer.telephone}
                    </Typography>
                    <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
                      <strong>Maps:</strong> {item.maps_pinpoint}
                    </Typography>
                    <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
                      <strong>Kode Promo:</strong> {item.coupon_code || "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
                      <strong>Laundry:</strong> {item.laundry_partner.name}
                    </Typography>
                    <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
                      <strong>Paket:</strong> {item.package.name}
                    </Typography>
                    <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
                      <strong>Note:</strong> {item.note}
                    </Typography>

                    <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
                      <strong>Status: </strong>
                      {editingOrder === item.id ? (
                        <Select
                          value={editedData.status}
                          onChange={(e) => handleChange(e, "status")}
                          size="small"
                          sx={{
                            minWidth: 100,
                            maxWidth: 150,
                            fontSize: { xs: "10px", sm: "12px", md: "16px" },
                            padding: 0,
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                padding: 0,
                              },
                            },
                          }}
                        >
                          {statusOptions.map((status) => (
                            <MenuItem key={status} value={status} sx={{ paddingY: 0.5 }}>
                              <Typography
                                component="span"
                                sx={{
                                  color: getStatusColor(status),
                                  fontFamily: "Quicksand",
                                  fontSize: { xs: "10px", sm: "12px", md: "16px" },
                                }}
                              >
                                {status}
                              </Typography>
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <Typography
                          component="span"
                          sx={{
                            color: getStatusColor(item.status),
                            fontFamily: "Quicksand",
                            fontSize: { xs: "10px", sm: "12px", md: "16px" },
                          }}
                        >
                          {item.status}
                        </Typography>
                      )}
                    </Typography>

                    <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
                      <strong>Payment: </strong>
                      {editingOrder === item.id ? (
                        <Select
                          value={editedData.status_payment}
                          onChange={(e) => handleChange(e, "status_payment")}
                          size="small"
                          sx={{
                            minWidth: 100,
                            maxWidth: 150,
                            fontSize: { xs: "10px", sm: "12px", md: "16px" },
                            padding: 0,
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                padding: 0,
                              },
                            },
                          }}
                        >
                          {paymentOptions.map((status) => (
                            <MenuItem key={status} value={status} sx={{ paddingY: 0.5 }}>
                              <Typography
                                component="span"
                                sx={{
                                  color: getStatusColor(status),
                                  fontFamily: "Quicksand",
                                  fontSize: { xs: "10px", sm: "12px", md: "16px" },
                                }}
                              >
                                {status}
                              </Typography>
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <Typography
                          component="span"
                          sx={{
                            color: getPaymentColor(item.status_payment),
                            fontFamily: "Quicksand",
                            fontSize: { xs: "10px", sm: "12px", md: "16px" },
                          }}
                        >
                          {item.status_payment}
                        </Typography>
                      )}
                    </Typography>

                    <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
                      <strong>Total Harga: </strong>
                      {editingOrder === item.id ? (
                        <TextField
                          type="number"
                          value={editedData.price}
                          onChange={(e) => handleChange(e, "price")}
                          size="small"
                          sx={{
                            minWidth: 100,
                            maxWidth: 150,
                          }}
                          InputProps={{
                            sx: {
                              padding: 0,
                              fontSize: { xs: "10px", sm: "12px", md: "16px" },
                            },
                          }}
                        />
                      ) : (
                        `Rp ${item.price}`
                      )}
                    </Typography>

                    <Typography sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }}>
                      <strong>Total Berat: </strong>
                      {editingOrder === item.id ? (
                        <TextField
                          type="number"
                          value={editedData.weight}
                          onChange={(e) => handleChange(e, "weight")}
                          size="small"
                          sx={{
                            minWidth: 100,
                            maxWidth: 150,
                          }}
                          InputProps={{
                            sx: {
                              padding: 0,
                              fontSize: { xs: "10px", sm: "12px", md: "16px" },
                            },
                          }}
                        />
                      ) : (
                        `${item.weight} kg`
                      )}
                    </Typography>

                    <div className="flex items-center justify-center mt-2">
                      {editingOrder === item.id ? (
                        <Button sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }} variant="contained" color="success" onClick={() => handleSave(item.id)}>
                          Simpan
                        </Button>
                      ) : (
                        <Button sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }} variant="contained" color="primary" onClick={() => handleEdit(item)}>
                          Edit
                        </Button>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start" }}>
                <div className="flex mb-2 space-x-2">
                  <MessageLaundry order={item} />
                  <MessageCustomer order={item} />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Select
                    sx={{
                      fontFamily: "Quicksand",
                      fontSize: ["10px", "12px", "16px"],
                      padding: ["2px", "4px", "6px"],
                      maxWidth: ["100px", "140px", "180px"],
                    }}
                    value={item.driver.id || ""}
                    onChange={(e) => handleAssignDriver(item.id, e.target.value)}
                    displayEmpty
                  >
                    <MenuItem
                      sx={{
                        fontFamily: "Quicksand",
                        fontSize: ["10px", "12px", "16px"],
                      }}
                      value=""
                      disabled
                    >
                      {item.driver.id ? "Ganti Driver" : "Pilih Driver"}
                    </MenuItem>
                    {drivers.map((driver) => (
                      <MenuItem
                        sx={{
                          fontFamily: "Quicksand",
                          fontSize: ["10px", "12px", "16px"],
                        }}
                        key={driver.id}
                        value={driver.id}
                      >
                        {driver.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {item.driver.id && (
                    <Button
                      sx={{
                        fontFamily: "Quicksand",
                        fontSize: ["10px", "12px", "16px"],
                        padding: ["10px", "15px", "20px"],
                      }}
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveDriver(item.id)}
                    >
                      Hapus Driver
                    </Button>
                  )}
                </div>
              </CardActions>
            </AccordionDetails>
          </Accordion>
        </Card>
      ))}

      <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} variant="contained" color="primary" sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" }, margin: "4px" }}>
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

export default OrderTable;
