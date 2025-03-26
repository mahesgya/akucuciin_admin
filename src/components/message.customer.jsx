import { TableCell, Button } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const formatCustomerMessage = (ord) => {
  return encodeURIComponent(
    `*[Pesanan Anda Telah Diterima]*\n\nHalo *${ord.customer.name}*,\n\nTerima kasih telah menggunakan layanan AkuCuciin. Berikut adalah detail pesanan Anda:\n\n== *Detail Pesanan* ==\n📦 *Paket Laundry:* ${
      ord.package.name
    }\n📜 *Jenis Laundry:* ${ord.content}\n📝 *Catatan:* ${ord.note || "-"}\n📅 *Tanggal Penjemputan:* ${ord.pickup_date || "-"}\n⚖️ *Berat Cucian:* ${ord.weight} kg\n💰 *Total Harga:* Rp ${parseInt(ord.price).toLocaleString(
      "id-ID"
    )}\n🎟️ *Kupon:* ${ord.coupon_code || "-"}\n\n== *Informasi Laundry* ==\n🏠 *Nama Laundry:* ${ord.laundry_partner.name}\n📍 *Lokasi:* ${ord.laundry_partner.area}, ${ord.laundry_partner.city}\n📞 *Kontak Laundry:* https://wa.me/${
      ord.laundry_partner.telephone
    }\n🗺️ *Pin Lokasi Anda:* ${
      ord.maps_pinpoint
    }\n\n====================\nSilakan lakukan pembayaran sesuai dengan total harga di atas. Jika ada pertanyaan, hubungi pihak laundry melalui link di atas.\n\nTerima kasih telah menggunakan AkuCuciin! 😊\n\n_Pesan ini dibuat otomatis oleh sistem AkuCuciin._\n_*ID Pesanan:* ${
      ord.id
    }_\n📅 *Tanggal Pemesanan:* ${ord.created_at}`
  );
};

const MessageCustomer = ({ order }) => {
  const handleSendMessage = () => {
    const message = formatCustomerMessage(order);
    const whatsappUrl = `https://wa.me/${order.customer.telephone}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <TableCell align="center" sx={{padding: 0}}>
      <Button sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }} variant="contained" color="success" startIcon={<WhatsAppIcon sx={{ fontSize: { xs: "8px", sm: "12px", md: "14px" } }} />} onClick={handleSendMessage}>
        Customer
      </Button>
    </TableCell>
  );
};

export default MessageCustomer;
