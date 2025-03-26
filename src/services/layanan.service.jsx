import axios from "axios";
import Swal from "sweetalert2";
const BASE_URL = import.meta.env.VITE_API_URL;

const layananService = {
  getLayananById: async (accessToken, idLaundry, idPackage) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/laundry_partners/${idLaundry}/package/${idPackage}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Mendapatkan Data Layanan Laundry.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
  getLayananByLaundry: async (accessToken, idLaundry) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/laundry_partner/${idLaundry}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Mendapatkan Data Layanan Laundry.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
  
  postLayanan: async (formData, accessToken, idLaundry) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}/package`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Berhasil Mengirim Data Layanan Baru",
        confirmButtonText: "Ok",
        confirmButtonColor: " #28a745",
        showCloseButton: true,
      });
      return response.data;
    } catch (error) {

      await Swal.fire({
        icon: "error",
        title: "Gagal Mengirim Data Layanan Laundry.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });

    }
  },
  putLayanan: async (formData, accessToken, idLaundry, idPackage) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}/package/${idPackage}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Berhasil Mengubah Data Layanan",
        confirmButtonText: "Ok",
        confirmButtonColor: " #28a745",
        showCloseButton: true,
      });

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Mengubah Data Layanan Laundry.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
  deleteLayanan: async (accessToken, idLaundry, idPackage) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}/package/${idPackage}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Berhasil Menghapus Layanan.",
        confirmButtonText: "Ok",
        confirmButtonColor: " #28a745",
        showCloseButton: true,
      });

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Menghapus Data Layanan Laundry.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
};

export default layananService;
