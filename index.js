const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g0ipecx.mongodb.net/?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g0ipecx.mongodb.net/?retryWrites=true&w=majority`;



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
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const productCollaction = client.db("Adidas").collection('product')
        const MyCartCollaction = client.db("Adidas").collection('mycart')

        app.get('/product', async (req, res) => {
            const cursor = productCollaction.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        
        app.get('/product/:id' , async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollaction.findOne(query)
            res.send(result)

        })
        app.get('/mycart' , async (req, res) => {
            const cursor = MyCartCollaction.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/mycart' , async (req, res) => {
            const addProduct = req.body
            console.log(addProduct);
            const result = await MyCartCollaction.insertOne(addProduct)
            res.send(result)
        })
        app.get('/mycart/:id' , async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await MyCartCollaction.findOne(query)
            res.send(result)

        })
        
        
        
        app.delete('/mycart/:id' , async (req, res)=>{
            const id =req.params.id
            const query ={ _id: new ObjectId(id) }
            const result = await MyCartCollaction.deleteOne(query)
            res.send(result)
        })

        // post opciton
        app.post('/product' , async (req, res) => {
            const addProduct = req.body
            console.log(addProduct);
            const result = await productCollaction.insertOne(addProduct)
            res.send(result)
        })
        

        // update opction

        app.put('/product/:id' , async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const UpdateProduct = req.body
            const Updates = {
                $set: {
                    name: UpdateProduct.name,
                    brand: UpdateProduct.brand,
                    type: UpdateProduct.type,
                    price: UpdateProduct.price,
                    shortDescription: UpdateProduct.shortDescription,
                    rating: UpdateProduct.rating,
                    photoURL: UpdateProduct.photoURL
                }
            }
            const result = await productCollaction.updateOne(filter, Updates, options)
            res.send(result)
        })

        



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Fashion store server is running")
})

app.listen(port, () => {
    console.log(`Fashion store server is running on port : ${port}`);
})