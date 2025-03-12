import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";

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

interface UpdateFormProps {
  open: boolean;
  orderToUpdate: OrderData | null;
  onClose: () => void;
  onUpdate: (updatedOrder: OrderData) => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  open,
  orderToUpdate,
  onClose,
  onUpdate,
}) => {
  const [updatedOrder, setUpdatedOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    setUpdatedOrder(orderToUpdate);
  }, [orderToUpdate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updatedOrder) {
      setUpdatedOrder({ ...updatedOrder, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    if (!updatedOrder) return;

    try {
      const response = await fetch(`https://stock-market-ww6r.onrender.com/data/${updatedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder),
      });

      if (!response.ok) throw new Error("Failed to update trade");

      alert("Trade updated successfully!");
      onUpdate(updatedOrder);
      onClose();
    } catch (error) {
      console.error("Error updating trade:", error);
      alert("An error occurred while updating the trade.");
    }
  };

  const textFieldProps = {
    margin: "dense" as const,
    variant: "outlined" as const,
    InputLabelProps: { shrink: true },
    size: "small" as const,
    onChange: handleInputChange,
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ mb: 2 }}>Update Trade</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ mt: 3 }}>
            <TextField
              {...textFieldProps}
              label="Date"
              name="date"
              value={updatedOrder?.date || ""}
              type="date"
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 3 }}>
            <TextField
              {...textFieldProps}
              label="Trade Code"
              name="trade_code"
              value={updatedOrder?.trade_code || ""}
              sx={{ width: 200 }}
            />
          </Grid>
          {["high", "low", "open", "close", "volume"].map((field) => (
            <Grid item xs={6} key={field}>
              <TextField
                {...textFieldProps}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={updatedOrder?.[field as keyof OrderData] || ""}
                sx={{ width: 200 }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Update Trade
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateForm;