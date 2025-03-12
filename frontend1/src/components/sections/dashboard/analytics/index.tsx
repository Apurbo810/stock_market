import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ActionMenu from 'components/common/ActionMenu';
import AnalyticsChart from './AnalyticsChart';

const actions = [
  {
    id: 1,
    icon: 'mage:refresh',
    title: 'Refresh',
  },
  {
    id: 2,
    icon: 'solar:export-linear',
    title: 'Export',
  },
  {
    id: 3,
    icon: 'mage:share',
    title: 'Share',
  },
];

const financialData = [
  {
    date: "2020-08-10",
    trade_code: "1JANATAMF",
    high: 4.3,
    low: 4.1,
    open: 4.2,
    close: 4.1,
    volume: "2,285,416",
  },
  // Add more data as needed
];

// Transform data for the pie chart (high, low, open, close)
const transformedData = financialData.map((item) => [
  { id: 1, value: item.high, name: 'High' },
  { id: 2, value: item.low, name: 'Low' },
  { id: 3, value: item.open, name: 'Open' },
  { id: 4, value: item.close, name: 'Close' },
])[0]; // Selecting the first item, assuming you're passing one data point for simplicity

const Analytics = () => {
  return (
    <Paper sx={{ px: 0, height: 410 }}>
      <Stack mt={-0.5} px={3.75} alignItems="center" justifyContent="space-between">
        <Typography variant="h6" color="text.secondary" zIndex={1000}>
          Analytics
        </Typography>

        <ActionMenu actions={actions} />
      </Stack>

      <AnalyticsChart
        data={transformedData}
        sx={{ mt: -5.5, mx: 'auto', width: 300, height: '370px !important' }}
      />
    </Paper>
  );
};

export default Analytics;
