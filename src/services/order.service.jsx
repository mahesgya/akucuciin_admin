import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_URL;

const orderService = {
  getOrder: async (accessToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Mendapatkan Data order.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
  updateOrder: async (idOrder, editedData, accessToken) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/admin/order/${idOrder}/status`, editedData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      await Swal.fire({
              icon: "success",
              title: "Success",
              text: "Berhasil Update Data Order",
              confirmButtonText: "Ok",
              confirmButtonColor: " #28a745",
              showCloseButton: true,
            });
      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Merubah Data order.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
};

export default orderService;
