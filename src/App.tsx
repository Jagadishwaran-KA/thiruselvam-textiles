import POSApp from "./POSApp";
import { POSProvider } from "./POSContext";

function App() {
  return (
    <POSProvider>
      <POSApp />
    </POSProvider>
  );
}

export default App;
