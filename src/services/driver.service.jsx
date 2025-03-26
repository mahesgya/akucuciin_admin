import axios from "axios";
import Swal from "sweetalert2";
const BASE_URL = import.meta.env.VITE_API_URL;

const driverService = {
  getDrivers: async (accessToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/drivers`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Mendapatkan Data Driver.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
  postDriver: async (formData, accessToken) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/admin/driver`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Berhasil Mengirim Driver Laundry",
        confirmButtonText: "Ok",
        confirmButtonColor: " #28a745",
        showCloseButton: true,
      });

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Mengirim Data Driver Baru.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
  putDriver: async (accessToken, formData , idDriver) => {
    try {
        const response = await axios.put(`${BASE_URL}/api/admin/driver/${idDriver}`, formData, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Berhasil Mengubah Data Driver.",
          confirmButtonText: "Ok",
          confirmButtonColor: " #28a745",
          showCloseButton: true,
        });

  
        return response.data;
      } catch (error) {
        console.log(error)
        await Swal.fire({
          icon: "error",
          title: "Gagal Mengubah Data Driver.",
          text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
          confirmButtonText: "Coba Lagi",
          confirmButtonColor: "#d33",
          showCloseButton: true,
        });
      }
  },
  deleteDriver:  async (accessToken, idDriver) => {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/driver/${idDriver}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Berhasil Menghapus Data Driver.",
          confirmButtonText: "Ok",
          confirmButtonColor: " #28a745",
          showCloseButton: true,
        });
  
        return response.data;
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Gagal Menghapus Data Driver.",
          text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
          confirmButtonText: "Coba Lagi",
          confirmButtonColor: "#d33",
          showCloseButton: true,
        });
      }
  },
  assignDriver : async (accessToken, idOrder, idDriver) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/admin/order/${idOrder}/driver/${idDriver}`,{}, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Berhasil Menempatkan Driver ke Sebuah Order.",
          confirmButtonText: "Ok",
          confirmButtonColor: " #28a745",
          showCloseButton: true,
        });
  
        return response.data;
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Gagal Menempatkan Driver ke Sebuah Order",
          text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
          confirmButtonText: "Coba Lagi",
          confirmButtonColor: "#d33",
          showCloseButton: true,
        });
      }
  },
  removeAssignDriver : async (accessToken, idOrder) => {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/order/${idOrder}/driver`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Berhasil Menghapus Driver dari Sebuah Order.",
          confirmButtonText: "Ok",
          confirmButtonColor: " #28a745",
          showCloseButton: true,
        });
  
        return response.data;
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Gagal Menghapus Driver dari Sebuah Order.",
          text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
          confirmButtonText: "Coba Lagi",
          confirmButtonColor: "#d33",
          showCloseButton: true,
        });
      }
  },

};

export default driverService;
