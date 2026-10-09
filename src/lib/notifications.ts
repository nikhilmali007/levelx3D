import { OrderStatus } from '@/lib/supabase/admin';

export function openWhatsAppOrderStatus(phone: string, orderId: string, status: OrderStatus, customerName: string) {
  if (!phone) return;
  
  // Format the phone number (assuming Indian number for this project if no country code)
  const formattedPhone = phone.replace(/\D/g, '');
  const finalPhone = formattedPhone.length === 10 ? `91${formattedPhone}` : formattedPhone;

  let message = `Hi ${customerName}, this is an update regarding your Level X 3D order #${orderId.slice(0, 8)}. `;

  switch (status) {
    case 'paid':
      message += 'Your payment has been received and confirmed. Your object is now queued for fabrication.';
      break;
    case 'printing':
      message += 'Your object is currently in production. Our Micro-SLA printers are carefully crafting your piece.';
      break;
    case 'shipped':
      message += 'Your order has been dispatched and is on its way to you. You can track your shipment online.';
      break;
    case 'delivered':
      message += 'Your order has been delivered! We hope you enjoy your new architectural 3D printed piece.';
      break;
    case 'cancelled':
      message += 'Your order has been cancelled. If this was a mistake or you need a refund, please contact us.';
      break;
    case 'pending':
      message += 'Your order is currently pending payment. Please let us know if you need assistance.';
      break;
  }

  const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
