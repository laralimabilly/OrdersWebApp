import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import axiosInstance from '../services/api';
import config from '../config';
import ErrorDialog from './ErrorDialog';
import Header from './Header';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axiosInstance.post('auth', {
                "usuario": username,
                "senha": password,
                "aplicacaoId": `${config.appId}`
            });
        
            if(response){
                const credData = response.data?.credenciais[0];
                console.log(credData);
                axiosInstance.defaults.headers.common['aplicacaoid'] = credData.aplicacaoid;
                axiosInstance.defaults.headers.common['username'] = credData.username;
        
                navigate('/orders');
            }
        } catch (error) {
            console.log(error);
            setError('An error occurred. Please try again.');
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };    

    return (
        <Container maxWidth="xs">
            <Header title="Login" />
            <Box mt={8} textAlign="center">
                <TextField
                    fullWidth
                    margin="normal"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                    Acessar
                </Button>
            </Box>
            <ErrorDialog open={open} onClose={handleClose} errorMessage={error} />
        </Container>
    );
};

export default Login;