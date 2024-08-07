import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

interface FullScreenLoaderProps {
  loading: boolean;
  message?: string;
  success: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ loading, message, success }) => {
    if (!loading) return null;

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="fixed"
            top={0}
            left={0}
            width="100%"
            height="100%"
            bgcolor="rgba(0, 0, 0, 0.8)"
            zIndex={1300}
            color="#fff"
            flexDirection="column"
        >
            {!success ? <CircularProgress color="inherit" /> : <TaskAltIcon color="inherit" />}
            {message && <Typography variant="h6" mt={2}>{message}</Typography>}
        </Box>
    );
};

export default FullScreenLoader;