import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderComfirmationPage from "./pages/OrderComfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrderPage from "./pages/MyOrderPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";
import ChatPage from "./pages/ChatPage";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import AddProductPage from "./components/Admin/AddProductPage";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            {/*User Layout*/}
            <Route index element={<Home />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="register" element={<Register />}></Route>
            <Route path="profile" element={<Profile />}></Route>
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            ></Route>
            <Route path="/product/:id" element={<ProductDetails />}></Route>
            <Route path="checkout" element={<Checkout />}></Route>
            <Route
              path="order-confirmation"
              element={<OrderComfirmationPage />}
            ></Route>
            <Route path="order/:id" element={<OrderDetailsPage />}></Route>
            <Route path="my-orders" element={<MyOrderPage />}></Route>
            <Route>
              <Route path="chat" element={<ChatPage />}></Route>
            </Route>
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/*Admin Layout*/}
            <Route index element={<AdminHomePage />}></Route>
            <Route path="users" element={<UserManagement />}></Route>
            <Route path="products" element={<ProductManagement />}></Route>
            <Route
              path="products/:id/edit"
              element={<EditProductPage />}
            ></Route>
            <Route path="products/add_new" element={<AddProductPage />} />
            <Route path="orders" element={<OrderManagement />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
