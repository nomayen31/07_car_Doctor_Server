const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app= express();
const port = process.env.PORT || 5000;

//Middlewares

app.use(cors());
app.use(express.json()); // for parsing application/json  



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.07lgbsy.mongodb.net/?retryWrites=true&w=majority`;

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
    const serverCollection = client.db("carDoctor").collection("services");
    const checkOutCollection = client.db("carDoctor").collection("checkOut");

    app.get('/services',async(req,res)=>{
        const cursor = serverCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/services/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const options = {
            projection: {  title: 1, price:1, service_Id:1, img:1 },
          };
        const result = await serverCollection.findOne(query, options);
        res.send(result);
    })

    app.get('/checkout', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
          query = { email: req.query.email }
      }
      const result = await checkOutCollection.find(query).toArray();
      res.send(result);
 
    })

    app.post('/checkout',async(req,res)=>{
      const checkout = req.body;
      console.log(checkout);
      const result = await checkOutCollection.insertOne(checkout);
      res.send(result)
    })

    app.delete('checkout/:id',async(req, res)=>{
        const id = req.params;
        const query = { _id: new ObjectId(id) };
        const result = await checkOutCollection.deleteOne(query);
        res.send(result)

    })

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('doctor is running')
})

app.listen(port, ()=>{
    console.log(`car doctor server is running on port ${port}`);
})



