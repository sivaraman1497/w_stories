import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import connection from './db.js';

import dotenv from 'dotenv'

dotenv.config(); 

const app = express();
const PORT = 3000;

app.use(cors({
	origin:'http://whiskedstories.s3-website-us-east-1.amazonaws.com'
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hi there!')
}) 

/* Order management starts */

    app.post('/insertOrder', (req, res) => {
        const { order_name, quantity, price, units, quantity_type, status, expected_date_of_delivery, actual_date_of_delivery, customer_info } = req.body;
        
        let expected_date_of_deliveryval = new Date(expected_date_of_delivery);
        let expected_date_of_deliveryDay = String(expected_date_of_deliveryval.getDate()).padStart(2, 0);
        let expected_date_of_deliveryMonth = String(expected_date_of_deliveryval.getMonth()+1).padStart(2, 0);
        let expected_date_of_deliveryYear = expected_date_of_deliveryval.getFullYear();

        expected_date_of_deliveryval = `${expected_date_of_deliveryDay}-${expected_date_of_deliveryMonth}-${expected_date_of_deliveryYear}`;

        let actual_date_of_deliveryval = new Date(actual_date_of_delivery);
        let actual_date_of_deliveryDay = String(actual_date_of_deliveryval.getDate()).padStart(2, 0);
        let actual_date_of_deliveryMonth = String(actual_date_of_deliveryval.getMonth()+1).padStart(2, 0);
        let actual_date_of_deliveryYear = actual_date_of_deliveryval.getFullYear();

        actual_date_of_deliveryval = `${actual_date_of_deliveryDay}-${actual_date_of_deliveryMonth}-${actual_date_of_deliveryYear}`

        let timecreated = dayjs().unix();
        let timemodified = 0;

        const query = `INSERT INTO orders (order_name, quantity, price, units, quantity_type, status, expected_date, actual_date, customer_info, timecreated, timemodified, deleted) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`

        connection.query(query, [ order_name, quantity, price, units, quantity_type, status, expected_date_of_deliveryval, actual_date_of_deliveryval, customer_info, timecreated, timemodified ], (err, results) => {
            console.log(results);
        })
    })

    app.get('/order/:id', (req, res) => {
        const orderId = req.params.id;
        const query = `SELECT * FROM orders WHERE id = ?`
        
        connection.query(query, [orderId], (err, result) => {
            let orderData = result[0];

            let { order_name, quantity, price, units, quantity_type, status, expected_date, actual_date, customer_info } = orderData;

            res.send({ order_name, quantity, price, units, quantity_type, status, expected_date, actual_date, customer_info }).status(200)

        })
    })

    app.post('/order/update/:id', (req, res) => {
        const id = req.params.id;
        let { order_name, quantity, price, units, quantity_type, status, expected_date_of_delivery, actual_date_of_delivery, customer_info } = req.body;

        expected_date_of_delivery = dayjs(expected_date_of_delivery).format('DD-MM-YYYY');
        actual_date_of_delivery = dayjs(actual_date_of_delivery).format('DD-MM-YYYY');

        let timemodified = dayjs().unix();

        const query = `UPDATE orders SET order_name = ?, quantity = ?, price = ?, units = ?, quantity_type = ?, status = ?, expected_date = ?, actual_date = ?, customer_info = ?, timemodified = ? WHERE id = ?`;

        connection.query(query, [ order_name, quantity, price, units, quantity_type, status, expected_date_of_delivery, actual_date_of_delivery, customer_info, timemodified, id ], (err, results) => {

            if(results.affectedRows > 0)
            {
                res.send('updated').status(200)
            }
            else
            {
                console.log(err)
                res.send('error').status(404)
            }
        })
    })

    app.delete('/delete/order/:id', (req, res) => {
        let id = req.params.id;

        let query = `UPDATE orders SET deleted = 1 WHERE id = ${id}`;

        connection.query(query, (err, results) => {
            
            if(results.affectedRows > 0)
            {
                res.send('success').status(200)    
            }
            else
            {
                console.log(err)
            }
        })
    })

/* Order management ends */

/* Inventory management starts */

    app.post('/inventory/create', (req, res) => {
        let { itemname, store_name, purchase_date, quantity, units, price, category, quantity_type } = req.body;
        const query = `INSERT INTO inventory(itemname, store_name, purchase_date, quantity, units, price, category, quantity_type, timecreated, timemodified) VALUE(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const date = new Date(purchase_date);
        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth()+1).padStart(2, '0');
        let year = date.getFullYear();

        purchase_date = `${day}-${month}-${year}`;

        let timecreated = dayjs().unix();
        let timemodified = 0;

        connection.query(query, [ itemname, store_name, purchase_date, quantity, units, price, category, quantity_type, timecreated, timemodified ], (err, results) => {
            if(results.affectedRows > 0)
            {
                res.send('updated').status(200)
            }
            else
            {
                console.log(err)
                res.send('error').status(404)
            }
        })
    })

    app.post('/inventory/:id', (req, res) => {
        const id = req.params.id;

        const query = `SELECT * FROM inventory WHERE id = ?`;

        connection.query(query, [ id ], (err, results) => {

            let { itemname, store_name, purchase_date, quantity, units, price, category, quantity_type } = results[0];

            if(err)
            {
                res.send({err})
            }
            else
            {
                res.send({ itemname, store_name, purchase_date, quantity, units, price, category, quantity_type })
            }
        })
    })

    app.post('/inventory/update/:id', (req, res) => {

        let id = req.params.id;
        let { itemname, store_name, purchase_date, quantity, units, price, category, quantity_type } = req.body;

        let timemodified = dayjs().unix();

        const query = `UPDATE inventory SET itemname = ?, store_name = ? , purchase_date = ?, quantity = ?, units = ?, price = ?, category = ?, quantity_type = ?, timemodified = ? WHERE id = ?`;
        
        purchase_date = dayjs(purchase_date).format('DD-MM-YYYY');

        connection.query(query, [ itemname, store_name, purchase_date, quantity, units, price, category, quantity_type, timemodified, id ], (err, results) => {

            if(results.affectedRows > 0)
            {
                res.send('updated').status(200)
            }
            else
            {
                console.log(err)
                res.send('error').status(404)
            }
        })
    })

    app.delete('/inventory/delete/:id', (req, res) => {
        let id = req.params.id;

        let query = `DELETE FROM inventory WHERE id = ${id}`;

        connection.query(query, (err, results) => {
            if(results.affectedRows > 0)
            {
                res.send('success').status(200)
            }
            else
            {
                console.log(err)
            }
        })
    })

/* Inventory management ends */

/* Listings start */

    app.post('/allInventory', (req, res) => {
        let query = `SELECT * FROM inventory ORDER BY itemname ASC`;

        connection.query(query, (err, results) => {
            
            if(results.length > 0)
            {
                let datadb = results.map((val, index) =>  (
                    {...val, 
                        sno: index+1, 
                        quantity: `${val.quantity} ${val.quantity_type}`, 
                        timecreated: (val.timecreated > 0) ? dayjs.unix(val.timecreated).format('DD-MM-YYYY') : '-',
                        timemodified: (val.timemodified > 0) ? dayjs.unix(val.timemodified).format('DD-MM-YYYY') : '-',
                        action: `${val.id}`
                    }
                ));

                res.send({datadb})
            }   
            else if(err)
            {
                res.send('error').status(404)
            }
            else
            {
                res.send('no data').status(404)
            }
        })
    })

    app.post('/allOrders', (req, res) => {
        let query = `SELECT * FROM orders WHERE deleted = 0 ORDER BY order_name ASC`;

        connection.query(query, (err, results) => {

            let datadb = results.map((val, index) =>  (
                {...val, 
                    sno: index+1, 
                    quantity: `${val.quantity} ${val.quantity_type}`, 
                    timecreated: (val.timecreated > 0) ? dayjs.unix(val.timecreated).format('DD-MM-YYYY') : '-',
                    timemodified: (val.timemodified > 0) ? dayjs.unix(val.timemodified).format('DD-MM-YYYY') : '-',
                    action: `${val.id}`
                }
            ));

            res.send({datadb})
        })
    })

/* Listings end */

app.listen(PORT, '0.0.0.0', () => {
    console.log('Running on port 3000')
})
