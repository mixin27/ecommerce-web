// PDF Invoice Generation using jsPDF
// This will be used client-side to generate invoices

export interface InvoiceData {
  order: {
    id: string;
    orderNumber: string;
    createdAt: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
    items: Array<{
      product: {
        name: string;
      };
      quantity: number;
      price: number;
    }>;
    shippingAddress: {
      fullName: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone: string;
    };
    user: {
      name: string;
      email: string;
    };
  };
}

export const generateInvoicePDF = async (data: InvoiceData) => {
  // Dynamically import jsPDF to avoid SSR issues
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  const { order } = data;
  let yPosition = 20;

  // Company Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ShopNow', 20, yPosition);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Commerce Street', 20, yPosition + 7);
  doc.text('New York, NY 10001', 20, yPosition + 12);
  doc.text('Email: support@shopnow.com', 20, yPosition + 17);
  doc.text('Phone: (555) 123-4567', 20, yPosition + 22);

  // Invoice Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 150, yPosition);

  // Invoice Details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${order.orderNumber}`, 150, yPosition + 10);
  doc.text(
    `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
    150,
    yPosition + 15,
  );
  doc.text(`Status: ${order.status}`, 150, yPosition + 20);

  yPosition = 60;

  // Bill To Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, yPosition);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(order.shippingAddress.fullName, 20, yPosition + 6);
  doc.text(order.shippingAddress.addressLine1, 20, yPosition + 11);
  if (order.shippingAddress.addressLine2) {
    doc.text(order.shippingAddress.addressLine2, 20, yPosition + 16);
    yPosition += 5;
  }
  doc.text(
    `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`,
    20,
    yPosition + 16,
  );
  doc.text(order.shippingAddress.country, 20, yPosition + 21);
  doc.text(order.shippingAddress.phone, 20, yPosition + 26);
  doc.text(order.user.email, 20, yPosition + 31);

  yPosition = yPosition + 50;

  // Table Header
  doc.setFillColor(59, 130, 246); // Blue background
  doc.rect(20, yPosition, 170, 8, 'F');

  doc.setTextColor(255, 255, 255); // White text
  doc.setFont('helvetica', 'bold');
  doc.text('Product', 22, yPosition + 5);
  doc.text('Qty', 120, yPosition + 5);
  doc.text('Price', 145, yPosition + 5);
  doc.text('Total', 170, yPosition + 5);

  yPosition += 8;
  doc.setTextColor(0, 0, 0); // Black text
  doc.setFont('helvetica', 'normal');

  // Table Items
  order.items.forEach((item, index) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    const itemTotal = item.quantity * parseFloat(item.price.toString());

    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, yPosition, 170, 7, 'F');
    }

    doc.text(item.product.name.substring(0, 40), 22, yPosition + 5);
    doc.text(item.quantity.toString(), 120, yPosition + 5);
    doc.text(
      `$${parseFloat(item.price.toString()).toFixed(2)}`,
      145,
      yPosition + 5,
    );
    doc.text(`$${itemTotal.toFixed(2)}`, 170, yPosition + 5);

    yPosition += 7;
  });

  yPosition += 5;

  // Summary Section
  const summaryX = 120;

  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', summaryX, yPosition);
  doc.text(`$${order.subtotal.toFixed(2)}`, 170, yPosition);

  yPosition += 6;
  doc.text('Shipping:', summaryX, yPosition);
  doc.text(`$${order.shippingCost.toFixed(2)}`, 170, yPosition);

  yPosition += 6;
  doc.text('Tax:', summaryX, yPosition);
  doc.text(`$${order.tax.toFixed(2)}`, 170, yPosition);

  if (order.discount > 0) {
    yPosition += 6;
    doc.setTextColor(0, 150, 0);
    doc.text('Discount:', summaryX, yPosition);
    doc.text(`-$${order.discount.toFixed(2)}`, 170, yPosition);
    doc.setTextColor(0, 0, 0);
  }

  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', summaryX, yPosition);
  doc.text(`$${order.total.toFixed(2)}`, 170, yPosition);

  // Payment Information
  yPosition += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Information', 20, yPosition);

  doc.setFont('helvetica', 'normal');
  yPosition += 6;
  doc.text(`Payment Method: ${order.paymentMethod}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Payment Status: ${order.paymentStatus}`, 20, yPosition);

  // Footer
  yPosition = 280;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Thank you for your business!', 105, yPosition, { align: 'center' });
  doc.text(
    'For questions about this invoice, please contact support@shopnow.com',
    105,
    yPosition + 4,
    {
      align: 'center',
    },
  );

  // Save the PDF
  doc.save(`invoice-${order.orderNumber}.pdf`);
};
