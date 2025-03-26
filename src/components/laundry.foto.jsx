import { useEffect, useState } from "react";
import fotoService from "../services/foto.service";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { Typography } from "@mui/material";

const FotoDetailPage = ({ idLaundry }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const accessToken = Cookies.get("accessToken");

  const fetchPhotos = async () => {
    setLoading(true);
    const response = await fotoService.getFoto(idLaundry, accessToken);
    await setPhotos(response.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPhotos();
  }, [idLaundry]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setSelectedFile(file);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hanya file PNG dan JPG yang diperbolehkan.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Tidak Ada File yang Tersedia.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    const confirmed = await Swal.fire({
      icon: "warning",
      title: "Yakin ingin upload foto ini?",
      showCancelButton: true,
      confirmButtonText: "Upload",
      cancelButtonText: "Batal",
    });

    if (confirmed.isConfirmed) {
      await fotoService.postFoto(accessToken, idLaundry, formData);
      fetchPhotos();
      setSelectedFile(null);
    }
  };

  const handleDelete = async (photoId) => {
    const confirmed = await Swal.fire({
      icon: "warning",
      title: "Yakin ingin menghapus foto ini?",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (confirmed.isConfirmed) {
      await fotoService.deleteFoto(accessToken, idLaundry, photoId);
      setPhotos(photos.filter((photo) => photo.id !== photoId));
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-6 flex flex-col items-center rounded-lg shadow-lg min-h-screen max-w-screen">
      <Typography variant="h4" component="h2" fontWeight={600} gutterBottom>
        DETAIL FOTO LAUNDRY
      </Typography>

      <form onSubmit={handleUpload} className="mb-6">
        <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="border p-2 rounded-md" />
        <button type="submit" className="ml-2 bg-indigo-500 text-white px-4 py-2 rounded-md">
          Upload
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <div key={index} className="relative">
              <img src={`${import.meta.env.VITE_API_URL}/static/${photo.filepath}`} alt="Laundry" className="w-full h-40 object-cover rounded-md shadow cursor-pointer" onClick={() => setSelectedPhoto(photo.filepath)} />
              <button onClick={() => handleDelete(photo.id)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full">
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Belum ada foto yang diunggah.</p>
        )}

        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={() => setSelectedPhoto(null)}>
            <img src={`${import.meta.env.VITE_API_URL}/static/${selectedPhoto}`} alt="Zoomed Laundry" className="max-w-full max-h-full rounded-lg shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FotoDetailPage;
