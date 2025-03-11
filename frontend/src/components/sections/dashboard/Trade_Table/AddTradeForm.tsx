import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
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

interface AddTradeFormProps {
  open: boolean;
  newOrder: OrderData;
  onClose: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const AddTradeForm: React.FC<AddTradeFormProps> = ({
  open,
  newOrder,
  onClose,
  onInputChange,
  onSubmit,
}) => {
  // State to track validation errors
  const [errors, setErrors] = React.useState<Partial<Record<keyof OrderData, boolean>>>({});

  // Validate all fields
  const validateForm = () => {
    const newErrors: Partial<Record<keyof OrderData, boolean>> = {};
    const requiredFields: (keyof OrderData)[] = [
      "date",
      "trade_code",
      "high",
      "low",
      "open",
      "close",
      "volume",
    ];

    requiredFields.forEach((field) => {
      if (!newOrder[field]) {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("https://stock-market-ww6r.onrender.com/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error("Failed to add trade");
      
      alert("Trade added successfully!");
      onSubmit();
    } catch (error) {
      console.error("Error submitting trade:", error);
      alert("An error occurred while adding the trade.");
    }
  };

  const textFieldProps = {
    margin: "dense" as const,
    variant: "outlined" as const,
    InputLabelProps: { shrink: true },
    size: "small" as const,
    onChange: onInputChange,
    required: true,
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ mb: 2 }}>Add New Trade</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ mt: 3 }}>
            <TextField
              {...textFieldProps}
              label="Date"
              name="date"
              value={newOrder.date}
              type="date"
              fullWidth
              error={!!errors.date}
              helperText={errors.date ? "This field is required" : ""}
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 3 }}>
            <TextField
              {...textFieldProps}
              label="Trade Code"
              name="trade_code"
              value={newOrder.trade_code}
              sx={{ width: 200 }}
              error={!!errors.trade_code}
              helperText={errors.trade_code ? "This field is required" : ""}
            />
          </Grid>
          {["high", "low", "open", "close", "volume"].map((field) => (
            <Grid item xs={6} key={field}>
              <TextField
                {...textFieldProps}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={newOrder[field as keyof OrderData]}
                sx={{ width: 200 }}
                error={!!errors[field as keyof OrderData]}
                helperText={
                  errors[field as keyof OrderData] ? "This field is required" : ""
                }
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
          Add Trade
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTradeForm;