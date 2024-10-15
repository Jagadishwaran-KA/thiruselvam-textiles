import { useState, useEffect } from "react";
import { Plus, Minus, X } from "lucide-react";
import { usePOSContext } from "./POScontext";

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
  const { cart, setCart, dailySales, setDailySales } = usePOSContext();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

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
    setSelectedProduct(product);
    setSearch("");
    setSuggestions([]);
  };

  const addToCart = () => {
    if (selectedProduct && quantity > 0 && price > 0) {
      const existingItemIndex = cart.findIndex(
        (item) => item.name === selectedProduct
      );
      if (existingItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCart(updatedCart);
      } else {
        setCart([...cart, { name: selectedProduct, quantity, price }]);
      }
      setSelectedProduct("");
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

  const printBill = () => {
    const totalAmount = getTotalAmount();
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
    Date: ${new Date().toLocaleString()}
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
  </div>
</body>
</html>
  `;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow?.document.write(billContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  const recordSale = () => {
    const total = getTotalAmount();
    setDailySales((prev) => prev + total);
    setCart([]);
  };

  const downloadSales = () => {
    const data = JSON.stringify({
      date: new Date().toLocaleDateString(),
      total: dailySales,
    });
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "daily_sales.txt";
    link.href = url;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Thiruselvam Textiles POS
      </h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
        <div className="space-y-4">
          <div className="mb-6">
            <label
              htmlFor="search"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Search Product
            </label>
            <input
              id="search"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-3 px-4 text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to search..."
            />
          </div>
          {suggestions.length > 0 && (
            <ul className="bg-white border rounded-md shadow-sm max-h-60 overflow-y-auto">
              {suggestions.map((product, index) => (
                <li
                  key={index}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-lg"
                  onClick={() => handleProductSelect(product)}
                >
                  {product}
                </li>
              ))}
            </ul>
          )}
          {selectedProduct && (
            <div className="space-y-4">
              <p className="text-lg font-medium">Selected: {selectedProduct}</p>
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-3 px-4 text-lg"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Price per item
                </label>
                <input
                  id="price"
                  type="number"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-3 px-4 text-lg"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
              <p className="text-lg font-medium">
                Total: {(quantity * price).toFixed(2)}
              </p>
              <button
                onClick={addToCart}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-lg"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Cart</h2>
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="flex flex-col p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium">{item.name}</span>
                <button
                  className="p-1 bg-red-500 text-white rounded"
                  onClick={() => removeFromCart(index)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <button
                    className="p-1 bg-gray-200 rounded"
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="text-lg">{item.quantity}</span>
                  <button
                    className="p-1 bg-gray-200 rounded"
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <span className="text-lg font-medium">
                  {(item.quantity * item.price).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="font-bold mt-4 text-xl">
          Total: {getTotalAmount().toFixed(2)}
        </div>
        <div className="mt-6 space-y-3">
          <button
            onClick={printBill}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded text-lg"
          >
            Print Bill
          </button>
          <button
            onClick={recordSale}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-lg"
          >
            Complete Sale
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Daily Sales</h2>
        <p className="text-lg mb-4">Total: {dailySales.toFixed(2)}</p>
        <button
          onClick={downloadSales}
          className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded text-lg"
        >
          Download Sales Data
        </button>
      </div>
    </div>
  );
}
