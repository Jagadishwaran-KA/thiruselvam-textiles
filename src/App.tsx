import POSApp from "./POSApp";
import { POSProvider } from "./POScontext";

function App() {
  return (
    <POSProvider>
      <POSApp />
    </POSProvider>
  );
}

export default App;
