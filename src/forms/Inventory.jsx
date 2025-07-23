import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import {Link} from 'react-router-dom'

import TextField from '@mui/material/TextField';

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SaveIcon from '@mui/icons-material/Save';

import {Button, Alert, Autocomplete, Backdrop, CircularProgress, Typography, Modal, Stack, Box, Breadcrumbs} from '@mui/material';

import axios from 'axios'

import dayjs from 'dayjs';
import { useParams } from "react-router";

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

function CreateInventory() {

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

    function Navigation()
    {
        return (
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/my">
                    Dashboard
                </Link>

                <Link underline="hover" color="inherit" to="/inventory">
                    Inventory
                </Link>

                <Typography sx={{ color: 'white' }}>Create Inventory</Typography>
            </Breadcrumbs>
        )
    }

    const categoryType = [ 'Ingredient', 'Supply' ];

    const quantityType = [ 'mg', 'gm', 'kg', 'ml', 'ltr' ];

    const onSubmit = async (data) => {
        if(!data) return;
        
        try{
            const response = await axios.post('http://localhost:3000/inventory/create', data)
            console.log(response)
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

                <Box sx={{ width: '100%', margin: 'auto', padding: 4, display: 'flex', flexDirection: 'column', gap: 3, backgroundColor: 'lightgray',borderRadius: 2}}>
        
                    <TextField id="outlined-basic" label="Item name" variant="outlined" name="itemname" {...register('itemname', { required: 'Item name cannot be empty' })} />
                    {errors.itemname && <p>{errors.itemname.message}</p>}
                
                    <Autocomplete disablePortal name="category" options={categoryType} sx={{ width: '100%' }} renderInput={(params) => <TextField {...params} label="Category" {...register('category', {required: 'Please select a category'})}/>}/>
                    {errors.category && <p>{errors.category.message}</p>}
                

                    <TextField id="outlined-basic" label="Store Name" variant="outlined" name="store_name" {...register('store_name', { required: 'Store name cannot be empty' })} />
                    {errors.store_name && <p>{errors.store_name.message}</p>}

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Purchased Date" name="purchase_date" {...register('purchase_date', { required: "Date cannot be empty" })} onChange={(date) => setValue('purchase_date', date)} value={watch('purchase_date') || null} />
                        {errors.purchase_date && <p>{errors.purchase_date.message}</p>}
                    </LocalizationProvider>

                    <TextField id="outlined-basic" label="Quantity" variant="outlined" name="quantity" type="number" {...register('quantity', { required: 'Quantity cannot be empty' })} />
                    {errors.quantity && <p>{errors.quantity.message}</p>}

                    <Autocomplete disablePortal options={quantityType} name="quantity_type" sx={{ width: '100%' }} renderInput={(params) => <TextField {...params} label="Quantity type" {...register('quantity_type', {required: 'Please select a type'})}/>}/>
                    {errors.quantity_type && <p>{errors.quantity_type.message}</p>}

                    <TextField id="outlined-basic" label="Units" variant="outlined" name="units" type="number" {...register('units', { required: 'Units cannot be empty' })} />
                    {errors.units && <p>{errors.units.message}</p>}

                    <TextField id="outlined-basic" label="Price" variant="outlined" name="price" type="number" {...register('price', { required: 'Price cannot be empty' })} />
                    {errors.price && <p>{errors.price.message}</p>}

                    <Stack direction="row" spacing={2}>
                        <Link to="/inventory">
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
    );
}

function UpdateInventory() 
{
    const {id}  = useParams();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const [dataDb, setDataDb] = useState({})
    const [updateDataStatus, setUpdateDataStatus] = useState({status:''});
    const [open, setOpen] = useState(false);

    function Navigation()
    {
        return (
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/my">
                    Dashboard
                </Link>

                <Link underline="hover" color="inherit" to="/inventory">
                    Inventory
                </Link>

                <Typography sx={{ color: 'white' }}>Edit Inventory</Typography>
            </Breadcrumbs>
        )
    }

    const categoryType = [ 'Ingredient', 'Supply' ];

    const quantityType = [ 'mg', 'gm', 'kg', 'ml', 'ltr' ];

    const category = watch('category');
    const quantityTypeValue = watch('quantity_type');

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
                <Navigation/>

                <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">

                    <Box sx={popupStyle}>

                        {updateDataStatus.status == 'success' && 
                            <div>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Inventory item updated successfully!
                                </Typography>

                                <br/>

                                <Link to="/inventory" sx={{ mt: 7, ml:5 }}>
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

        if(!id) return;

        const getDataDb = async () => {
            try
            {
                const response = await axios.post(`http://localhost:3000/inventory/${id}`, [id]);
                setDataDb(response.data)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        
        getDataDb()

    }, [id])

    useEffect(() => {

        if (dataDb)
        {
            setValue("itemname", dataDb.itemname || "");
            setValue("category", dataDb.category || "");
            setValue("store_name", dataDb.store_name || "");
            setValue("purchase_date", dayjs(dataDb.purchase_date, 'DD-MM-YYYY'));
            setValue("quantity", dataDb.quantity || "");
            setValue("quantity_type", dataDb.quantity_type || "");
            setValue("units", dataDb.units || "");
            setValue("price", dataDb.price || "");
        }

    }, [ dataDb, setValue ])

    const onSubmit = async (data) => {
        try{
            const response = await axios.post(`http://localhost:3000/inventory/update/${id}`, data)

            setUpdateDataStatus({status: 'loading'});

            if(response.data == 'updated')
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
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <>

            <ModalPopup/>

            {updateDataStatus.status == 'error' && 
                <Alert variant="filled" severity="error" sx={{ width: '100%' }}>
                    Inventory cannot be updated
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
        
                    <TextField id="outlined-basic" label="Item name" variant="outlined" name="itemname" {...register('itemname', { required: 'Item name cannot be empty' })} InputLabelProps={{ shrink: true }} />
                    {errors.itemname && <p>{errors.itemname.message}</p>}
                
                    <Autocomplete id="outlined-basic" disablePortal variant="outlined" value={category || ""} name="category" options={categoryType} sx={{ width: '100%' }} renderInput={(params) => <TextField {...params} label="Category" {...register('category', {required: 'Please select a category'})}/>} InputLabelProps={{ shrink: true }} onChange={(e, newValue) => setValue('category', newValue)}/>
                    {errors.category && <p>{errors.category.message}</p>}

                    <TextField id="outlined-basic" label="Store Name" variant="outlined" name="store_name" {...register('store_name', { required: 'Store name cannot be empty'})} InputLabelProps={{ shrink: true }} />
                    {errors.store_name && <p>{errors.store_name.message}</p>}

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Purchased Date" name="purchase_date" {...register('purchase_date', { required: "Date cannot be empty" })} onChange={(date) => setValue('purchase_date', date)} value={watch('purchase_date') || null} />
                        {errors.purchase_date && <p>{errors.purchase_date.message}</p>}
                    </LocalizationProvider>

                    <TextField id="outlined-basic" label="Quantity" variant="outlined" type="number" name="quantity" {...register('quantity', { required: 'Quantity cannot be empty' })} InputLabelProps={{ shrink: true }}/>
                    {errors.quantity && <p>{errors.quantity.message}</p>}

                    <Autocomplete disablePortal options={quantityType} sx={{ width: '100%' }} value={quantityTypeValue || ""}  renderInput={(params) => <TextField {...params} label="Quantity type" name="quantity_type" {...register('quantity_type', {required: 'Please select a type'})}/>} InputLabelProps={{ shrink: true }} onChange={(e, newValue) => setValue('quantity_type', newValue)}/>
                    {errors.quantity_type && <p>{errors.quantity_type.message}</p>}

                    <TextField id="outlined-basic" label="Units" variant="outlined" name="units" type="number" {...register('units', { required: 'Units cannot be empty' })} InputLabelProps={{ shrink: true }}/>
                    {errors.units && <p>{errors.units.message}</p>}

                    <TextField id="outlined-basic" label="Price" variant="outlined" name="price" type="number" {...register('price', { required: 'Price cannot be empty' })} InputLabelProps={{ shrink: true }}/>
                    {errors.price && <p>{errors.price.message}</p>}

                     <Stack direction="row" spacing={2}>
                        <Link to="/inventory">
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
    );
}

function InventoryList()
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

                <Typography sx={{ color: 'white' }}>Inventory</Typography>
            </Breadcrumbs>
        )
    }

    useEffect(() => 
    {
        const getInventoryData = async() => {
            try{
                let inventoryData = await axios.post('http://localhost:3000/allInventory');
                
                if(inventoryData)
                {
                    let dataDb = inventoryData.data.datadb;
                    setError(false)
                    setDataDbVal(dataDb)
                }
            }
            catch(err)
            {
                setError(true)
            }            
        }

        getInventoryData()

    }, [])

    const columns = [
    { field: 'sno', headerName: 'S.No', width: 10 },
    { field: 'itemname', headerName: 'Item name', width: 130 },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'store_name', headerName: 'Store name', width: 130 },
    { field: 'purchase_date', headerName: 'Purchased date', width: 130 },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    { field: 'units', headerName: 'Units', width: 130 },
    { field: 'price', headerName: 'Price (INR)', width: 130 },
    { field: 'timecreated', headerName: 'Time created', width: 130 },
    { field: 'timemodified', headerName: 'Time modified', width: 130 },
    { 
        field: 'action', 
        headerName: 'Actions', 
        width: 130, 
        renderCell: (params) => 
        (
            <Stack direction="row" spacing={2}>
                <Link to={`/inventory/${params.row.id}`}>Edit</Link>
                <Link to={`/inventory/delete/${params.row.id}`}>Delete</Link>
            </Stack>
        )
     }
    
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

            <Link to="/inventory/create" className="float-right" style={{ textDecoration: 'none' }}>
                <Button variant="contained">Create Inventory Item</Button>
            </Link>

            <Paper sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    columns={columns}
                    rows={dataDbVal}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 20]}
                    checkboxSelection
                    sx={{ border: 1 }}
                />
            </Paper>
        </>
    )
}

export {CreateInventory, UpdateInventory, InventoryList }