const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log(process.env.DH_PASSWORD)

//Mongodb code here
const uri = `mongodb+srv://${process.env.DH_USER}:${process.env.DH_PASSWORD}@cluster0.dlzg3av.mongodb.net/?retryWrites=true&w=majority`;

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

        const allToysCat = client.db('devilsHornToys').collection('alltoys');
        const newAddedToy =  client.db('devilsHornToys').collection('addedToy');

        app.get('/alltoys', async (req, res) => {
            const cursor = allToysCat.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { "toys.toy_id": id };
            const options = {
                projection: { _id: 0, toys: { $elemMatch: { toy_id: id } } },
            };
            const result = await allToysCat.findOne(query, options);
            res.send(result);
        })

        app.get('/addedtoy', async(req, res) =>{
            console.log(req.query.sellerEmail);
            let query ={};
            if(req.query?.sellerEmail){
                query = {sellerEmail: req.query.sellerEmail}
            }
            const result = await newAddedToy.find().toArray();
            res.send(result);

        })

        app.post('/addedtoy', async(req, res) => {
            const addedToy = req.body;
            console.log(addedToy);
            const result = await newAddedToy.insertOne(addedToy);
            res.send(result);
        });




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Devils Horn toy shops data stored here')
})

app.listen(port, () => {
    console.log(`DevilsHorn server is running on port ${port}`)
})