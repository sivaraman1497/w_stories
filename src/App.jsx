import {Route, Routes, BrowserRouter as Router, Link} from 'react-router-dom'

import {Orders, EditOrder, OrderList} from './forms/Orders'
import {CreateInventory, UpdateInventory, InventoryList} from './forms/Inventory'

import Dashboard from './Components/Dashboard'

import './App.css'

function App()
{

    function ErrorComponent()
    {
        return (
            <>
                <h1>Error</h1>
            </>
        )
    }

    return (
        <Router>
                <Routes>
                    <Route path="/order/create" element={<Orders />}/>
                    <Route path="/order/:id" element={<EditOrder />}/>
                    <Route path="/inventory/create" element={<CreateInventory/>}/>
                    <Route path="/inventory/:id" element={<UpdateInventory/>}/>
                    
                    <Route path='/inventory' element={<InventoryList/>}/>
                    <Route path='/orders' element={<OrderList/>}/>

                    <Route path='/my' element={<Dashboard/>}/>
                    <Route path="*" element={<ErrorComponent/>}/>
                </Routes>
        </Router>
    )
}

export default App
