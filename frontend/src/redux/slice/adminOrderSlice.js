import {
  createSlice,
  createAsyncThunk,
  __DO_NOT_USE__ActionTypes,
} from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

export const fetchAllOrder = createAsyncThunk(
  "adminOrders/fetchAllOrder",
  async (__DO_NOT_USE__ActionTypes, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/orders`, {
        headers: {
          Authorization: USER_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Update order delivery status

export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: USER_TOKEN,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Delete an order

export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/orders/${id}`, {
        headers: {
          Authorization: USER_TOKEN,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminOrderSlice = createSlice({
  name: "admin",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch
      .addCase(fetchAllOrder.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(fetchAllOrder.fulfilled, (state, action) => {
        state.pending = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        //Calculate total sales
        const totalSales = action.payload.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );
        state.totalSales = parseFloat(totalSales);
      })
      .addCase(fetchAllOrder.rejected, (state, action) => {
        state.pending = true;
        state.error = action.payload.message;
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.peding = false;
        const updateOrder = action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order._id === updateOrder._id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updateOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.pending = true;
        state.error = action.payload.message;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.pending = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.pending = true;
        state.error = action.payload.message;
      });
  },
});
export default adminOrderSlice.reducer;
