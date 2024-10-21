import { useState, useEffect } from "react";
import { Plus, Minus, X, Search } from "lucide-react";
import { usePOSContext } from "./POSContext";
import SalesDetails from "./SalesDetails";

const products = [
  "Bedspread",
  "Bedsheet",
  "Baniyan",
  "Blouse bit",
  "Born babies",
  "Bra",
  "Brief",
  "Chudi",
  "Frock",
  "Jerkin",
  "Jeans",
  "Kerchief",
  "Kids set",
  "Leggings",
  "Midi",
  "Nighty",
  "Pant",
  "Panties",
  "Readymade blouse",
  "Rain coat",
  "Salwai",
  "Saree",
  "Shall",
  "Shirt",
  "Shorts",
  "Skirt",
  "Slip",
  "Socks",
  "Sweater",
  "T-shirt",
  "T-shirt pant set",
  "Towel",
  "Track pant",
  "Umbrella",
  "Veshti",
];

export default function POSApp() {
  const { cart, setCart, dailySales, setDailySales, bills, setBills } =
    usePOSContext();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [showSalesDetails, setShowSalesDetails] = useState(false);

  useEffect(() => {
    if (search) {
      const filtered = products.filter((product) =>
        product.toLowerCase().includes(search.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [search]);

  const handleProductSelect = (product: string) => {
    setSearch(product);
    setSuggestions([]);
  };

  const addToCart = () => {
    if (search && quantity > 0 && price > 0) {
      const existingItemIndex = cart.findIndex(
        (item) => item.name.toLowerCase() === search.toLowerCase()
      );
      if (existingItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCart(updatedCart);
      } else {
        setCart([...cart, { name: search, quantity, price }]);
      }
      setSearch("");
      setQuantity(1);
      setPrice(0);
    }
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity > 0) {
      const newCart = [...cart];
      newCart[index].quantity = newQuantity;
      setCart(newCart);
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const generateBillId = () => {
    return `BILL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };
  const formatDateTime = () => {
    const date = new Date();

    // Format date as DD-MM-YYYY
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    // Format time as HH:MM:SS
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };
  const printBill = () => {
    const totalAmount = getTotalAmount();
    const billId = generateBillId();
    const newBill = {
      id: billId,
      items: [...cart],
      total: totalAmount,
      date: new Date().toLocaleString(),
    };

    setBills([...bills, newBill]);
    setDailySales((prev) => prev + totalAmount);

    const billContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bill</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      width: 80mm;
      margin: 0;
      padding: 0;
      font-size: 12px;
      line-height: 1.2;
    }
    .header {
      text-align: center;
      margin-bottom: 10px;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
    }
    .address {
      font-size: 10px;
    }
    .bill-details {
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      text-align: left;
      padding: 3px 0;
    }
    .amount {
      text-align: right;
    }
    .total {
      font-weight: bold;
      border-top: 1px dashed #000;
      padding-top: 5px;
    }
    .footer {
      text-align: center;
      margin-top: 10px;
      font-size: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">THIRUSELVAM TEXTILES</div>
    <div class="address">NO:151,VELACHERY MAIN ROAD,KAMARAJAPURAM<br>(near bus stop) CH-73. Ph - 9994286407</div>
  </div>
  <div class="bill-details">
    Bill ID: ${billId}<br>
    Date: ${formatDateTime()}
  </div>
  <table>
    <tr>
      <th>Item</th>
      <th>Qty</th>
      <th>Price</th>
      <th class="amount">Total</th>
    </tr>
    ${cart
      .map(
        (item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toFixed(2)}</td>
      <td class="amount">${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
    `
      )
      .join("")}
    <tr class="total">
      <td colspan="3">Total Amount:</td>
      <td class="amount">${totalAmount.toFixed(2)}</td>
    </tr>
  </table>
  <div class="footer">
    Thank you for your purchase!
    Returns accepted daily between 12 PM and 5 PM
  </div>
</body>
</html>
  `;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow?.document.write(billContent);
    printWindow?.document.close();
    printWindow?.print();

    setCart([]);
  };

  const downloadSales = () => {
    let csvContent = "Bill ID,Date,Total,Items\n";

    bills.forEach((bill) => {
      const itemsString = bill.items
        .map((item) => `${item.name} (${item.quantity} x ${item.price})`)
        .join("; ");
      csvContent += `${bill.id},${bill.date},${bill.total.toFixed(
        2
      )},"${itemsString}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `sales_data_${new Date().toLocaleDateString()}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (showSalesDetails) {
    return <SalesDetails onBack={() => setShowSalesDetails(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Thiruselvam Textiles POS
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add Product</h2>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search or add product..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {suggestions.length > 0 && (
                <ul className="bg-white border rounded-lg shadow-sm max-h-60 overflow-y-auto">
                  {suggestions.map((product, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleProductSelect(product)}
                    >
                      {product}
                    </li>
                  ))}
                </ul>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    className="w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2 px-3"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    className="w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2 px-3"
                    
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <button
                onClick={addToCart}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                disabled={!search || quantity <= 0 || price <= 0}
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Cart</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex-grow">
                    <span className="font-medium">{item.name}</span>
                    <div className="text-sm text-gray-500">
                      {item.quantity} x ₹{item.price.toFixed(2)} = ₹
                      {(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1 bg-gray-200 rounded-full"
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      className="p-1 bg-gray-200 rounded-full"
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 bg-red-500 text-white rounded-full"
                      onClick={() => removeFromCart(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xl font-bold">
              Total: ₹{getTotalAmount().toFixed(2)}
            </div>
            <button
              onClick={printBill}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
              disabled={cart.length === 0}
            >
              Print Bill
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Sales</h2>
          <p className="text-lg mb-4">Total: ₹{dailySales.toFixed(2)}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={downloadSales}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
            >
              Download Sales Data
            </button>
            <button
              onClick={() => setShowSalesDetails(true)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
            >
              View Sales Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
