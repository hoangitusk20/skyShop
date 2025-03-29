import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Async thunk to fetch user
export const fetchUsers = createAsyncThunk(
  "admin/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Async thunk create user action

export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update user info

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        { name, email, role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// delete user

export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
  await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
  return id;
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.pending = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.pending = true;
        state.error = action.payload.message;
      })
      .addCase(addUser.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.pending = false;
        state.users.push(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.pending = true;
        state.error = action.payload.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.pending = false;
        const updateUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user._id === updateUser._id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updateUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.pending = true;
        state.error = action.payload.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.pending = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.pending = true;
        state.error = action.payload.message;
      });
  },
});
export default adminSlice.reducer;
