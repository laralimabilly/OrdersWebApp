import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import api from '../services/api';
import ErrorDialog from './ErrorDialog';
import FullScreenLoader from './FullScreenLoader';
import Header from './Header';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PixIcon from '@mui/icons-material/Pix';
import InputMask from 'react-input-mask';

const Payment: React.FC = () => {
    const location = useLocation();
    const { orderData } = location.state as { orderData: any };
    const [paymentMethod, setPaymentMethod] = useState<'Credit' | 'Debit' | 'Pix' | null>(null);
    const [cardNumber, setCardNumber] = useState('');
    const [validThru, setValidThru] = useState('');
    const [cvv, setCvv] = useState('');
    const [pixKey, setPixKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handlePayment = async () => {
        setLoading(true);
        const body = {
            faturas: [orderData],
            valorTotal: orderData.valorFatura,
            resultadoTransacao: {
                idTransacao: '12345',
                nsu: '67890',
                codAut: '54321',
                codControle: '09876',
                dRetorno: new Date().toISOString(),
                numCartao: cardNumber,
                bandeira: 'Visa', // Example value
                rede: 'Rede', // Example value
                adquirente: 'Adquirente', // Example value
                valorPagamento: orderData.valorFatura,
                tipoPagamento: paymentMethod === 'Credit' ? 3 : paymentMethod === 'Debit' ? 4 : 5,
                qtdeParcelas: 1, // Example value
                dTransacao: new Date().toISOString(),
                status: 0,
                msgRetorno: 'Payment successful',
                arqRetorno: 'File path',
            }
        };

        try {
            const response = await api.post('financeiro/retorno', body);

            setTimeout(() => {
                if(response.status === 200) {
                    console.log(response.data);
                    setSuccess(true);
                    
                    setTimeout(() => {
                        setSuccess(false);
                        setLoading(false);
                        navigate('/orders');
                    }, 2000);
                }

            }, 2000);

            
        } catch (error) {
            console.log(error);
            setError('Ocorreu um erro ao efetuar o pagamento.');
            setOpen(true);
            setLoading(false);
        } finally {
            
        }
    };

    const handlePaymentMethodClick = (method: 'Credit' | 'Debit' | 'Pix') => {
        setPaymentMethod(method);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container maxWidth="xs">
            <Header title="Pagamento" backScreen={'/orders'} />
            <Box mt={4} mb={2}>
                <Typography variant="h5">Detalhes do Pedido</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="Número do Pedido" secondary={orderData.numeroFatura} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Valor Total" secondary={orderData.valorFatura} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Nome" secondary={orderData.pessoa.nome} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="CPF/CNPJ" secondary={orderData.pessoa.cpfCnpj} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Histórico" secondary={orderData.historico} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Pagamento Parcial" secondary={orderData.pagamentoParcial ? 'Sim' : 'Não'} />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                        primary="Métodos de Pagamento"
                        secondary={
                            orderData.pagamento
                            ? orderData.pagamento.map((p: any) => `${p.nome} (${p.numeroParcelas}x)`).join(', ')
                            : 'N/A'
                        }
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                        primary="Origem"
                        secondary={
                            orderData.origem
                            ? orderData.origem.map((o: any) => `${o.origem}: ${o.numero} (${o.infAdic})`).join(', ')
                            : 'N/A'
                        }
                        />
                    </ListItem>
                </List>
            </Box>

            <Box mt={4} mb={2}>
                <Typography variant="h5">Método de Pagamento</Typography>
                <Box display="flex" justifyContent="space-around" mt={2}>
                <Box
                    onClick={() => handlePaymentMethodClick('Credit')}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    p={2}
                    border={1}
                    borderColor={paymentMethod === 'Credit' ? 'primary.main' : 'grey.400'}
                    borderRadius={2}
                    sx={{ cursor: 'pointer' }}
                >
                    <CreditCardIcon color={paymentMethod === 'Credit' ? 'primary' : 'inherit'} />
                    <Typography color={paymentMethod === 'Credit' ? 'primary' : 'inherit'} >Credit Card</Typography>
                </Box>
                <Box
                    onClick={() => handlePaymentMethodClick('Debit')}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    p={2}
                    border={1}
                    borderColor={paymentMethod === 'Debit' ? 'primary.main' : 'grey.400'}
                    borderRadius={2}
                    sx={{ cursor: 'pointer' }}
                >
                    <CreditCardIcon color={paymentMethod === 'Debit' ? 'primary' : 'inherit'} />
                    <Typography color={paymentMethod === 'Debit' ? 'primary' : 'inherit'} >Debit Card</Typography>
                </Box>
                <Box
                    onClick={() => handlePaymentMethodClick('Pix')}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    p={2}
                    border={1}
                    borderColor={paymentMethod === 'Pix' ? 'primary.main' : 'grey.400'}
                    borderRadius={2}
                    sx={{ cursor: 'pointer' }}
                >
                    <PixIcon color={paymentMethod === 'Pix' ? 'primary' : 'inherit'} />
                    <Typography color={paymentMethod === 'Pix' ? 'primary' : 'inherit'} >Pix</Typography>
                </Box>
                </Box>
            </Box>

            {paymentMethod === 'Credit' || paymentMethod === 'Debit' ? (
                <Box mt={2}>
                    <InputMask
                        mask="9999 9999 9999 9999"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                    >
                        {(inputProps: any) => <TextField {...inputProps} fullWidth label="Número do Cartão" variant="standard" />}
                    </InputMask>
                    <InputMask
                        mask="99/99"
                        value={validThru}
                        onChange={(e) => setValidThru(e.target.value)}
                    >
                        {(inputProps: any) => <TextField {...inputProps} fullWidth label="Validade (MM/AA)" variant="standard" />}
                    </InputMask>
                    <InputMask
                        mask="999"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                    >
                        {(inputProps: any) => <TextField {...inputProps} fullWidth label="CVV" variant="standard" />}
                    </InputMask>
                </Box>
            ) : paymentMethod === 'Pix' ? (
                <Box mt={2}>
                    <TextField
                        fullWidth
                        label="Chave Pix"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                    />
                </Box>
            ) : null}

            <Button className="actionBtn" variant="contained" color="primary" fullWidth onClick={handlePayment} disabled={loading}>
                Pagar
            </Button>
            <ErrorDialog open={open} onClose={handleClose} errorMessage={error} />
            <FullScreenLoader loading={loading} success={success} message={success ? 'Pagamento efetuado com sucesso' : 'Processando pagamento...'} />
        </Container>
    );
};

export default Payment;