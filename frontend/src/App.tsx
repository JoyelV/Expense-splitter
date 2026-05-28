import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Spinner from "./components/Spinner";

const App = () => (
  <Suspense fallback={<Spinner message="Loading app..." />}>
    <Routes>
      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  </Suspense>
);

export default App;
