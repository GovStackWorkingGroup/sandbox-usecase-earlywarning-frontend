import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

export const NotFoundRoute = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: '13rem',
        fontWeight: 600,
      }}
    >
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" replace>
        Go to Home
      </Link>
    </Box>
  );
};
