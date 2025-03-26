import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_URL;

const fotoService = {
  getFoto: async (idLaundry) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/laundry_partner/${idLaundry}/images`);

      return response;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Mendapatkan Foto Laundry.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
  postFoto: async (accessToken, idLaundry, formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}/image`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Berhasil Menambah Foto Laundry",
        confirmButtonText: "Ok",
        confirmButtonColor: " #28a745",
        showCloseButton: true,
      });

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Mengirim Foto Laundry.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
  deleteFoto: async (accessToken, idLaundry, idImage) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}/image/${idImage}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Berhasil Menghapus Foto Laundry",
        confirmButtonText: "Ok",
        confirmButtonColor: " #28a745",
        showCloseButton: true,
      });

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Menghapus Foto Laundry.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
};

export default fotoService;
