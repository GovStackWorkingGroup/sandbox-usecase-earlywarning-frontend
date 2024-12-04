import { Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Typography sx={{ color: '#426834', textAlign: 'center', fontSize: 12 }}>
      <a
        href="https://govstack.gitbook.io/sandbox/access-demos/early-warning-tech-demo"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', color: '#426834' }}
      >
        Apache 2.0 licensed Early Warning Prototype of GovStack
      </a>
    </Typography>
  );
};
