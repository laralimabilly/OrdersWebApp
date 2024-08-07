import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface HeaderProps {
  title: string;
  backScreen?: string;
}

const Header: React.FC<HeaderProps> = ({ title, backScreen }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        backScreen ? navigate(backScreen) : () => {};
    };

    return (
        <Box className="headerTop" display="flex" alignItems="center" p={2} borderBottom={1} borderColor="grey.300">
            {backScreen ? 
                <IconButton onClick={handleBack}>
                    <ArrowBackIcon />
                </IconButton>
            : <></>}
            <Typography variant="h6" ml={2}>
                {title}
            </Typography>
        </Box>
    );
};

export default Header;