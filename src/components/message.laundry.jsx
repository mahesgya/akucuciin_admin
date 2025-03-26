import { TableCell, Button } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const formatLaundryMessage = (ord) => {
  return encodeURIComponent(
    `*Order baru telah diterima*\n\n==Customer==\nNama: ${ord.customer.name}\nEmail: ${ord.customer.email}\nAlamat: ${ord.customer.address}\nPinpoint: ${ord.maps_pinpoint}\n\n==LAUNDRY==\n${ord.laundry_partner.name}, ${
      ord.laundry_partner.area
    }, ${ord.laundry_partner.city}\nNo HP laundry: https://wa.me/${ord.customer.telephone}\n\nPaket Laundry: ${ord.package.name}\nContent: ${ord.content}\nNote: ${ord.note || "-"}\nPickup Date: ${ord.pickup_date || "-"}\n\nKupon: ${
      ord.coupon_code || "-"
    }\n====================\n\n_Pesan ini dibuat otomatis oleh sistem Akucuciin_\n_${ord.id}_\n\nTanggal: ${ord.created_at}`
  );
};

const MessageLaundry = ({ order }) => {
  const handleSendMessage = () => {
    const message = formatLaundryMessage(order);
    const whatsappUrl = `https://wa.me/${order.laundry_partner.telephone}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <TableCell align="center" sx={{padding: 0}}>
      <Button sx={{ fontFamily: "Quicksand", fontSize: { xs: "10px", sm: "12px", md: "16px" } }} variant="contained" color="success" startIcon={<WhatsAppIcon sx={{ fontSize: { xs: "8px", sm: "12px", md: "14px" } }} />}onClick={handleSendMessage}>
      Laundry
      </Button>
    </TableCell>
  );
};

export default MessageLaundry;
