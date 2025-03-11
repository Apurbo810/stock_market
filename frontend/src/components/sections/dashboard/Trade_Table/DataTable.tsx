import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import AddTradeForm from "./AddTradeForm";
import UpdateForm from "./UpdateForm";

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

interface DataTableProps {
  data: OrderData[];
  onUpdate: (updatedOrder: OrderData) => void;
  onDelete: (id: number) => void;
  onAdd: (newOrder: OrderData) => void;
  searchText: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  onUpdate,
  onDelete,
  onAdd,
}) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [newOrder, setNewOrder] = useState<OrderData>({
    id: 0,
    date: "",
    trade_code: "",
    high: "",
    low: "",
    open: "",
    close: "",
    volume: "",
  });
  const [orderToUpdate, setOrderToUpdate] = useState<OrderData | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = () => {
    onAdd(newOrder);
    setOpenAdd(false);
    setNewOrder({
      id: 0,
      date: "",
      trade_code: "",
      high: "",
      low: "",
      open: "",
      close: "",
      volume: "",
    });
  };

  const handleUpdateSubmit = (updatedOrder: OrderData) => {
    onUpdate(updatedOrder);
    setOpenUpdate(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAdd(true)}
        sx={{ mb: 2 }}
      >
        Add Trade
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            {[
              "Date",
              "Trade Code",
              "High",
              "Low",
              "Open",
              "Close",
              "Volume",
              "Actions",
            ].map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.trade_code}</TableCell>
              <TableCell>{order.high}</TableCell>
              <TableCell>{order.low}</TableCell>
              <TableCell>{order.open}</TableCell>
              <TableCell>{order.close}</TableCell>
              <TableCell>{order.volume}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {
                    setOrderToUpdate(order);
                    setOpenUpdate(true);
                  }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={() => onDelete(order.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddTradeForm
        open={openAdd}
        newOrder={newOrder}
        onClose={() => setOpenAdd(false)}
        onInputChange={handleInputChange}
        onSubmit={handleAddSubmit}
      />

      <UpdateForm
        open={openUpdate}
        orderToUpdate={orderToUpdate}
        onClose={() => setOpenUpdate(false)}
        onUpdate={handleUpdateSubmit}
      />
    </>
  );
};

export default DataTable;