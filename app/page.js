'use client';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { collection, deleteDoc, doc, query, getDocs, getDoc, setDoc } from 'firebase/firestore';
import { Box, Modal, Typography, Stack, TextField, Button, Grid, Card, CardContent, CardActions, Snackbar, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontWeight: 400,
      color: '#333',
    },
    h6: {
      fontWeight: 400,
      color: '#666',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', 
        },
      },
    },
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const minBoxes = 12;

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
        setSnackbarMessage('Item removed');
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
        setSnackbarMessage('Quantity decreased');
      }
      setOpenSnackbar(true);
      await updateInventory();
    }
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
      setSnackbarMessage('Quantity increased');
    } else {
      await setDoc(docRef, { quantity: 1 });
      setSnackbarMessage('Item added');
    }
    setOpenSnackbar(true);
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box width="100vw" display="flex" flexDirection="column"
        justifyContent="center" alignItems="center" gap={2}>
        <Typography variant="h4" sx={{ marginTop: 0, marginBottom: 2 }}>Pantry Management</Typography>
        <Modal open={open} onClose={handleClose}>
          <Box position="absolute" top="50%" left="50%" width={400}
            bgcolor="white" border="2px solid #000" boxShadow={24} p={4}
            display="flex" flexDirection="column" gap={3}
            sx={{ transform: "translate(-50%, -50%)" }}>
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField variant="outlined" fullWidth value={itemName}
                onChange={(e) => setItemName(e.target.value)} />
              <Button variant="outlined" onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}>
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" onClick={handleOpen}>Add New Item</Button>
        <Grid container spacing={2} sx={{ maxWidth: 1200, marginTop: 2 }}>
          {inventory.map(({ name, quantity }) => (
            <Grid item xs={12} sm={6} md={3} key={name}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Quantity: {quantity}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => addItem(name)}>Add</Button>
                  <Button size="small" onClick={() => removeItem(name)}>Remove</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {Array.from({ length: minBoxes - inventory.length }, (_, index) => (
            <Grid item xs={12} sm={6} md={3} key={`placeholder-${index}`}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h5" color="#ccc" textAlign="center">
                    Empty
                  </Typography>
                  <Typography variant="subtitle1" color="#ccc" textAlign="center">
                    No items
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
