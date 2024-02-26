const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ugbxhsw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();



        //insert Brand name and logo from database
        const BrandsName = client.db("BrandsName").collection('Brands');

        ///---------------------------Brand name & logo get from database-----------------------------------///

        app.get('/Brands', async (req, res) => {
            const cursor = BrandsName.find();
            const result = await cursor.toArray();
            res.send(result);
        });



        ///----------------------Get All Brands name,price, rating & image from database--------------------///

        const AllCars = client.db("BrandsName").collection('AllCars');
        app.get('/AllCars/:brand', async (req, res) => {
            const brand = req.params.brand;
            console.log(brand)
            const query = { brand_name: brand }
            const result = await AllCars.find(query).toArray()
            res.send(result)
        });



        ///----------------------------Get Brand Details from database--------------------------------------///
        app.get('/AllCar/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await AllCars.findOne(query);
            console.log(result)
            res.send(result)

        });


        //---------------------------Post cart in My cart------------------------------------------------///


        const MyCart = client.db("BrandsName").collection('MyCart');

        app.post('/MyCart', async (req, res) => {
            const newCart = req.body;
            console.log(newCart);
            const result = await MyCart.insertOne(newCart);
            res.send(result);
        })


        //-------------------------Get My Cart Data -----------------------------------------------------///

        app.get('/MyCart', async (req, res) => {
            const cursor = MyCart.find();
            const result = await cursor.toArray();
            res.send(result);
        })



        ///---------------------------POST add product in database


        const AddProduct = client.db("BrandsName").collection('AddProduct');

        app.post('/AddProduct', async (req, res) => {
            const addProduct = req.body;
            console.log(addProduct);
            const result = await AddProduct.insertOne(addProduct);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        //await client.db("admin").command({ ping: 1 });
        //console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('KS Automotive Limited server is running')
})

app.listen(port, () => {
    console.log(`KS Automotive Limited server is running on port : ${port}`)
})
