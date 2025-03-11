import Grid from '@mui/material/Grid';

import RecentOrders from 'components/sections/dashboard/Trade_table';
import Reports from 'components/sections/dashboard/reports';

const Dashboard = () => {
  return (
    <Grid container px={3.75} spacing={3.75}>
      <Grid item xs={12}>
      </Grid>
      <Grid item xs={12} md={7}>
        <Reports />
      </Grid>
      <Grid item xs={12} md={12}>
        <RecentOrders />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
