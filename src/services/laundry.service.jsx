import axios from "axios";
import Swal from "sweetalert2";
const BASE_URL = import.meta.env.VITE_API_URL;

const laundryService = {
  getLaundry: async (accessToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/laundry_partners`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Mendapatkan Data Laundry.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
  postLaundry: async (formData, accessToken) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/admin/laundry_partner`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Berhasil Mengirim Data Laundry Baru",
        confirmButtonText: "Ok",
        confirmButtonColor: " #28a745",
        showCloseButton: true,
      });

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Mengirim Data Laundry.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
  putLaundry: async (accessToken, formData , idLaundry) => {
    try {
        const response = await axios.put(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}`, formData, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Berhasil Mengubah Data Laundry",
          confirmButtonText: "Ok",
          confirmButtonColor: " #28a745",
          showCloseButton: true,
        });

  
        return response.data;
      } catch (error) {
        console.log(error)
        await Swal.fire({
          icon: "error",
          title: "Gagal Mengubah Data Laundry.",
          text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
          confirmButtonText: "Coba Lagi",
          confirmButtonColor: "#d33",
          showCloseButton: true,
        });
      }
  },
  deleteLaundry:  async (accessToken, idLaundry) => {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Berhasil Menghapus Data Laundry",
          confirmButtonText: "Ok",
          confirmButtonColor: " #28a745",
          showCloseButton: true,
        });
  
        return response.data;
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Gagal Menghapus Data Laundry.",
          text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
          confirmButtonText: "Coba Lagi",
          confirmButtonColor: "#d33",
          showCloseButton: true,
        });
      }
  },
};

export default laundryService;
