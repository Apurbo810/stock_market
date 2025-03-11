import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Paper,
  Stack,
  Typography,
  TextField,
  Box,
  TablePagination,
  InputAdornment,
} from "@mui/material";
import IconifyIcon from "components/base/IconifyIcon";
import axios from "axios";
import DataTable from "./DataTable";

interface OrderData {
  id: number;
  date: string;
  trade_code: string;
  high: string;
  low: string;
  open: string;
  close: string;
  volume: string;
}

const RecentOrders: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [ordersData, setOrdersData] = useState<OrderData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/data");
      setOrdersData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdate = async (updatedOrder: OrderData) => {
    try {
      await axios.put(`http://127.0.0.1:5000/data/${updatedOrder.id}`, updatedOrder);
      alert("Trade updated successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Error updating trade:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    
    try {
      await axios.delete(`http://127.0.0.1:5000/data/${id}`);
      alert("Trade deleted successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  const filteredData = ordersData.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <Paper sx={{ height: "auto", overflow: "hidden", p: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6" color="text.secondary">
          Recent Orders
        </Typography>
        <TextField
          variant="filled"
          size="small"
          placeholder="Search here"
          value={searchText}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchText(e.target.value)
          }
          sx={{ width: 1, maxWidth: { xs: 260, sm: 240 } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconifyIcon icon="prime:search" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Box mt={2} height="auto">
        <DataTable
          searchText={searchText}
          data={filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onAdd={fetchOrders}
        />
      </Box>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement>) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
};

export default RecentOrders;