import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Pagination,
} from '@mui/material';
import { CreditCard, QrCode } from '@mui/icons-material';
import axiosInstance from '../services/api';
import ErrorDialog from './ErrorDialog';
import Header from './Header';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage]);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('financeiro/faturas', {
        params: {
          Page: page,
          PageSize: rowsPerPage,
        },
      });
      setOrders(response.data.list);
      setFilteredOrders(response.data.list);
      setTotalResults(response.data.totalResults);
    } catch (error) {
      console.log(error);
      setError('Ocorreu um erro ao consultar os pedidos.');
      setOpen(true);
      navigate('/');
    }
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearch(text);
    const filteredData = orders.filter(
      (order) =>
        order.pessoa.cpfCnpj.includes(text) ||
        order.pessoa.codigo.includes(text) ||
        order.pessoa.nome.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredOrders(filteredData);
  };

  const handleSelectOrder = (order: any) => {
    navigate('/payment', { state: { orderData: order } });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getPaymentIcon = (tipoPagamento: number) => {
    switch (tipoPagamento) {
      case 3:
        return <CreditCard />;
      case 4:
        return <CreditCard />;
      default:
        return <QrCode />;
    }
  };

  return (
    <Container maxWidth="xs">
        <Header title="Pedidos" backScreen={'/'} />
        <Box mt={4} mb={2} textAlign="center">
            <TextField
            fullWidth
            margin="normal"
            label="Procure por CPF, Código ou Nome"
            value={search}
            onChange={handleFilter}
            />
        </Box>
        <List>
            {filteredOrders.map((order) => (
            <div key={order.numeroFatura}>
                <ListItem disablePadding>
                <ListItemButton onClick={() => handleSelectOrder(order)} className="flex flex-column flex-align-start">
                    <ListItemText
                    primary={`Número do pedido: ${order.numeroFatura}`}
                    secondary={
                        <>
                        <Typography component="span" variant="body2">
                            Nome: {order.pessoa.nome}
                        </Typography>
                        <br />
                        CPF/CNPJ: {order.pessoa.cpfCnpj}
                        <br />
                        Histórico: {order.historico}
                        </>
                    }
                    />
                    <ListItemText
                        primary={`Valor Total: R$${order.valorFatura.toFixed(2)}`}
                    />
                    <div>
                        <ListItemText
                            secondary={`Método de Pagamento: `}
                        />
                        {order.pagamento
                        ? order.pagamento.map((p) => (
                            <div key={p.tipoPagamento} className="paymentMethodWrapper">
                                {getPaymentIcon(p.tipoPagamento)} {p.nome} ({p.numeroParcelas}x)
                            </div>
                            ))
                        : 'N/A'}
                        <br />
                    </div>
                </ListItemButton>
                </ListItem>
                <Divider />
            </div>
            ))}
        </List>
        <Pagination
            count={Math.ceil(totalResults / rowsPerPage)}
            page={page}
            onChange={(event, value) => setPage(value)}
            showFirstButton
            showLastButton
            sx={{ mt: 2, mb: 2 }}
        />
        <ErrorDialog open={open} onClose={handleClose} errorMessage={error} />
    </Container>
  );
};

export default Orders;
