import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ReportsChart from './ReportsChart';
import ActionMenu from 'components/common/ActionMenu';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const actions = [
  { id: 1, icon: 'mage:refresh', title: 'Refresh' },
  { id: 2, icon: 'solar:export-linear', title: 'Export' },
  { id: 3, icon: 'mage:share', title: 'Share' },
];

interface TradeData {
  trade_code: string;
  close: number;
  volume: number;
  date: string;
}

const Reports = () => {
  const [data, setData] = useState<TradeData[]>([]);
  const [tradeCodes, setTradeCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get<TradeData[]>('https://stock-market-ww6r.onrender.com/data')
      .then((response) => {
        setData(response.data);
        const uniqueTradeCodes = [...new Set(response.data.map((item) => item.trade_code))];
        setTradeCodes(uniqueTradeCodes);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Failed to load data.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Paper sx={{ pr: 0, height: 410, p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" color="text.secondary">
          Trade Reports
        </Typography>
        <ActionMenu actions={actions} />
      </Stack>

      {loading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ height: '320px' }}>
          <CircularProgress />
        </Stack>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <ReportsChart
          data={data}
          tradeCodes={tradeCodes}
          sx={{ height: '320px !important' }}
        />
      )}
    </Paper>
  );
};

export default Reports;