import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Footer from './footer';

const MainLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack>
      <Box component="main" flexGrow={1} sx={{ overflowX: 'hidden' }}>
        <Box mt={12}>{children}</Box>
        <Footer />
      </Box>
    </Stack>
  );
};

export default MainLayout;
