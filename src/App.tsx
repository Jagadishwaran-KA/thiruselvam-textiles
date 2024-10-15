import POSApp from "./POSApp.tsx";
import { POSProvider } from "./POSContext.tsx";

function App() {
  return (
    <POSProvider>
      <POSApp />
    </POSProvider>
  );
}

export default App;
