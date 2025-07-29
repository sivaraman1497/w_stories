import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router";
import {Link} from 'react-router-dom'

import TextField from '@mui/material/TextField';

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SaveIcon from '@mui/icons-material/Save';

import {Button, Alert, Autocomplete, Backdrop, CircularProgress, Typography, Modal, Stack, Box, Breadcrumbs } from '@mui/material';

import dayjs from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const quantityType = [ 'mg', 'gm', 'kg', 'ml', 'ltr' ];
const statusType = [ 'Baked/Yet to deliver', 'Ordered', 'Cancelled', 'Ordered/no response', 'Delivered'];

function Orders()
{
    const {register, handleSubmit, watch, setValue, formState: { errors }} = useForm();

    function Navigation()
    {
        return (
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/my">
                    Dashboard
                </Link>

                <Link underline="hover" color="inherit" to="/orders">
                    Orders
                </Link>

                <Typography sx={{ color: 'white' }}>Create Order</Typography>
            </Breadcrumbs>
        )
    }

    const onSubmit = async (data) => 
    {
        try {
            const response = await axios.post('http://44.201.226.92:3000/insertOrder', data)
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <>
            <Navigation/>

            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ width: '100%', margin: 'auto', padding: 5, display: 'flex', flexDirection: 'column', gap: 3, backgroundColor: 'lightgray',borderRadius: 2}}>
                    <TextField id="outlined-basic" label="Order name" variant="outlined" name="order_name" {...register('order_name', { required: 'Order name cannot be empty' })} />
                    {errors.order_name && <p>{errors.order_name.message}</p>}

                    <TextField id="outlined-basic" label="Units" variant="outlined" name="units" type="number" {...register('units', { required: 'Units cannot be empty' })} />
                    {errors.units && <p>{errors.units.message}</p>}

                    <TextField id="outlined-basic" label="Quantity" variant="outlined" name="quantity" type="number" {...register('quantity', { required: 'Quantity cannot be empty' })} />
                    {errors.quantity && <p>{errors.quantity.message}</p>}

                    <Autocomplete disablePortal options={quantityType} name="quantity_type" sx={{ width: '100%' }} renderInput={(params) => <TextField {...params} label="Quantity type" {...register('quantity_type', {required: 'Please select a type'})}/>}/>
                    {errors.quantity_type && <p>{errors.quantity_type.message}</p>}

                    <TextField id="outlined-basic" label="Price" variant="outlined" name="price" {...register('price', { required: 'Price cannot be empty' })} />
                    {errors.price && <p>{errors.price.message}</p>}

                    <Autocomplete disablePortal options={statusType} name="status" sx={{ width: '100%' }} renderInput={(params) => <TextField {...params} label="Status type" {...register('status', {required: 'Please select a type'})}/>}/>
                    {errors.status && <p>{errors.status.message}</p>}

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Expected date of delivery" name="expected_date_of_delivery" {...register('expected_date_of_delivery', { required: "Date cannot be empty" })} onChange={(date) => setValue('expected_date_of_delivery', date)} value={watch('expected_date_of_delivery') || null} />
                        {errors.expected_date_of_delivery && <p>{errors.expected_date_of_delivery.message}</p>}
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Actual date of delivery" name="actual_date_of_delivery" {...register('actual_date_of_delivery', { required: "Date cannot be empty" })} onChange={(date) => setValue('actual_date_of_delivery', date)} value={watch('actual_date_of_delivery') || null} />
                        {errors.actual_date_of_delivery && <p>{errors.actual_date_of_delivery.message}</p>}
                    </LocalizationProvider>

                    <TextField id="outlined-basic" label="Customer Info" variant="outlined" name="customer_info" {...register('customer_info')}/>
                    {errors.customer_info && <p>{errors.customer_info.message}</p>}

                    <Stack direction="row" spacing={2}>
                        <Link to="/orders">
                            <Button variant="outlined" startIcon={<KeyboardBackspaceIcon />}>
                                Back
                            </Button>
                        </Link>
                        <Button variant="contained" endIcon={<SaveIcon />} type='submit'>
                            Save
                        </Button>
                    </Stack>

                </Box>
            </Box>
        </>
    )
}

function EditOrder()
{
    const {id} = useParams();
    const {register, handleSubmit, watch, formState: { errors }, setValue} = useForm();
    const [dataDb, setdataDb] = useState({});
    const [updateDataStatus, setUpdateDataStatus] = useState({status:''});
    const [open, setOpen] = useState(false);

    function Navigation()
    {
        return (
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/my">
                    Dashboard
                </Link>

                <Link underline="hover" color="inherit" to="/orders">
                    Orders
                </Link>

                <Typography sx={{ color: 'white' }}>Edit Order</Typography>
            </Breadcrumbs>
        )
    }

    function ModalPopup()
    {

        const popupStyle = 
        {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-40%, -50%)',
            width: 400,
            bgcolor: '#000000b3',
            border: '2px solid #000',
            boxShadow: 20,
            pt: 2,
            px: 4,
            pb: 3,
        };

        return (
            <>
                <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">

                    <Box sx={popupStyle}>

                        {updateDataStatus.status == 'success' && 
                            <div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Order updated successfully!
                                </Typography>

                                <br/>

                                <Link to="/orders" sx={{ mt: 7, ml:5 }}>
                                    <Button variant="outlined">Go back</Button>
                                </Link>
                            </div>
                        }

                        {updateDataStatus.status == 'error' && 
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Oops! Error updating order
                            </Typography>
                        }
                    </Box>
                </Modal>
            </>
            
        )
    }

    useEffect(() => {
        
        const fetchOrderData = async () => 
        {
            try
            {
                const res = await axios.get(`http://44.201.226.92:3000/order/${id}`)
                setdataDb(res.data)
            }
            catch(err)
            {
                console.log(err)
            }
        }

        fetchOrderData()

    }, [id]);

    useEffect(() => 
    {
        if (dataDb)
        {
            setValue("order_name", dataDb.order_name || "");
            setValue("units", dataDb.units || "");
            setValue("quantity", dataDb.quantity || "");
            setValue("quantity_type", dataDb.quantity_type || "");
            setValue("price", dataDb.price || "");
            setValue("status", dataDb.status || "");
            setValue("customer_info", dataDb.customer_info || "");
            setValue("expected_date_of_delivery", dayjs(dataDb.expected_date, 'MM-DD-YYYY'));
            setValue("actual_date_of_delivery", dayjs(dataDb.actual_date, 'MM-DD-YYYY'));
        }

    }, [dataDb, setValue]); 

    const onSubmit = async (data) => {

        const res = await axios.post(`http://44.201.226.92:3000/order/update/${id}`, data);
        
        setUpdateDataStatus({status: 'loading'});

        if(res.data == 'updated')
        {
            setUpdateDataStatus({status: 'success'});
            setOpen(true);
        }
        else
        {
            setUpdateDataStatus({status: 'error'});
            setOpen(true);
        }
    }

    if (!dataDb.order_name) {
        return <p>Loading...</p>; 
    }

    return (
        <>
            <Navigation/>

            <ModalPopup/>

            {updateDataStatus.status == 'error' && 
                <Alert variant="filled" severity="error" sx={{ width: '100%' }}>
                    Order cannot be updated
                </Alert>
            }

            {updateDataStatus.status == 'loading' && 
                <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            }

            <br/>

            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>

                <Box sx={{ width: '100%', margin: 'auto', padding: 5, display: 'flex', flexDirection: 'column', gap: 3, backgroundColor: 'lightgray', borderRadius: 3}}>
                    <TextField id="outlined-basic" label="Order name" variant="outlined" name="order_name" {...register('order_name', { required: 'Order name cannot be empty' })} />
                    {errors.order_name && <p>{errors.order_name.message}</p>}

                    <TextField id="outlined-basic" label="Units" variant="outlined" name="units" type="number" {...register('units', { required: 'Units cannot be empty' })} />
                    {errors.units && <p>{errors.units.message}</p>}

                    <TextField id="outlined-basic" label="Quantity" variant="outlined" name="quantity" type="number" {...register('quantity', { required: 'Quantity cannot be empty' })} />
                    {errors.quantity && <p>{errors.quantity.message}</p>}

                    <Autocomplete disablePortal options={quantityType} name="quantity_type" sx={{ width: '100%' }} renderInput={(params) => <TextField {...params} label="Quantity type" {...register('quantity_type', {required: 'Please select a type'})}/>} value={watch('quantity_type')}/>
                    {errors.quantity_type && <p>{errors.quantity_type.message}</p>}

                    <TextField id="outlined-basic" label="Price" variant="outlined" name="price" {...register('price', { required: 'Price cannot be empty' })} />
                    {errors.price && <p>{errors.price.message}</p>}

                    <Autocomplete disablePortal options={statusType} name="status" sx={{ width: '100%' }} renderInput={(params) => <TextField {...params} label="Status type" {...register('status', {required: 'Please select a type'})}/>} onChange={(e, newValue) => setValue('status', newValue)} value={watch('status')}/>
                    {errors.status && <p>{errors.status.message}</p>}

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Expected date of delivery" name="expected_date_of_delivery" {...register('expected_date_of_delivery', { required: "Date cannot be empty" })} onChange={(date) => setValue('expected_date_of_delivery', date)} value={watch('expected_date_of_delivery') || null} />
                        {errors.expected_date_of_delivery && <p>{errors.expected_date_of_delivery.message}</p>}
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Actual date of delivery" name="actual_date_of_delivery" {...register('actual_date_of_delivery', { required: "Date cannot be empty" })} onChange={(date) => setValue('actual_date_of_delivery', date)} value={watch('actual_date_of_delivery') || null} />
                        {errors.actual_date_of_delivery && <p>{errors.actual_date_of_delivery.message}</p>}
                    </LocalizationProvider>

                    <TextField id="outlined-basic" label="Customer Info" variant="outlined" name="customer_info" {...register('customer_info')}/>
                    {errors.customer_info && <p>{errors.customer_info.message}</p>}

                    <Stack direction="row" spacing={2}>
                        <Link to="/orders">
                            <Button variant="outlined" startIcon={<KeyboardBackspaceIcon />}>
                                Back
                            </Button>
                        </Link>
                        <Button variant="contained" endIcon={<SaveIcon />} type='submit'>
                            Save
                        </Button>
                    </Stack>

                </Box>
            </Box>
        </>
    )
}

function OrderList()
{
    const [dataDbVal, setDataDbVal] = useState([])
    const [err, setError] = useState(false);

    function Navigation()
    {
        return (
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/my">
                    Dashboard
                </Link>

                <Typography sx={{ color: 'white' }}>Orders</Typography>
            </Breadcrumbs>
        )
    }

    const deleteOrder = async(orderid) => {
        try
        {
            await axios.delete(`http://44.201.226.92:3000/delete/order/${orderid}`);

            const res = await axios.post('http://44.201.226.92:3000/allOrders');

            let datadb = res.data.datadb;
            setDataDbVal(datadb)    
        }
        catch(err)
        {
            console.log(err)
        }
    }   

    useEffect(() => {
        const getOrderData = async() => {
            try
            {
                let inventoryData = await axios.post('http://44.201.226.92:3000/allOrders');
                
                if(inventoryData)
                {
                    let dataDb = inventoryData.data.datadb;
                    setDataDbVal(dataDb)    
                }   
            }
            catch(err)
            {
                setError(true)
            }
            
        }

        getOrderData()

    }, [])

    const columns = [
    { field: 'sno', headerName: 'S.No', width: 10 },
    { field: 'order_name', headerName: 'Order name', width: 130 },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    { field: 'price', headerName: 'Price', width: 130 },
    { field: 'units', headerName: 'Units', width: 130 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'expected_date', headerName: 'Expected date', width: 130 },
    { field: 'actual_date', headerName: 'Actual date', width: 130 },
    { field: 'customer_info', headerName: 'Customer info', width: 130 },
    { field: 'timecreated', headerName: 'Time created', width: 130 },
    { field: 'timemodified', headerName: 'Time modified', width: 130 },
    { 
        field: 'action', 
        headerName: 'Action', 
        width: 130, 
        renderCell: (params) => 
        (
            <Stack direction="row" spacing={2}>
                <Link to={`/order/${params.row.id}`}>Edit</Link>
                <Link onClick={() => {deleteOrder(params.row.id)}}>Delete</Link>
            </Stack>
        )
     },
    ];

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <>
            <Navigation/>

            {err && 
                <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            }

            <Box display="flex" justifyContent="flex-end" padding={2}>
                <Link to="/order/create" className="float-right" style={{ textDecoration: 'none'}}>
                    <Button variant="contained">Create Order</Button>
                </Link>
            </Box>
            
            <Paper sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    columns={columns}
                    rows={dataDbVal}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    sx={{ border: 1 }}
                />
            </Paper>
        </>
    )
}

export {EditOrder, Orders, OrderList}
