const formatCurrency = (price) => {
  // If price is 999.00, we want it to be 999.000
  // Since the user said $999 -> 999.000 ₫, it means 1 unit in backend = 1000 VND?
  // Or maybe the backend values are already in thousands?
  // Let's assume the user wants to multiply by 1000 if it's a small number, 
  // or just format it as is if it's already large.
  // Actually, usually in e-commerce apps, the DB stores the value in the smallest unit or as a decimal.
  // If $999.00 -> 999.000 ₫, then it's a 1:1000 mapping.
  
  const value = price < 100000 ? price * 1000 : price;

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value).replace('₫', '₫'); // Ensure consistent spacing if needed
};

export default formatCurrency;
