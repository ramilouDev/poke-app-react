import { Container, Box } from '@mui/material';
import { Header } from '@/components/Header';
import { FilterControls } from '@/components/FilterControls';
import { ListView } from '@/components/ListView';
import { GridView } from '@/components/GridView';
import { useAppSelector } from '@/store/hooks';

export const Index = () => {
  const viewMode = useAppSelector((state) => state.ui.viewMode);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <FilterControls />
        {viewMode === 'list' ? <ListView /> : <GridView />}
      </Container>
    </Box>
  );
};

