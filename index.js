const express = require('express');
const app = express();
const { MongoClient, MONGO_CLIENT_EVENTS } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require("cors");
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());
const uri = "mongodb+srv://abanka:l3R3DdCyIDr0NCpl@cluster0.li11u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000, // Adjust the timeout values as needed
    socketTimeoutMS: 30000,
  });
  
async function run() {
    await client.connect();
    console.log("client connected");

    // perform actions on the collection object
    const ourPoliciesCollections = client.db("abanka").collection("ourPolicies");
    const reviewCollection = client.db("abanka").collection("reviews");
    const userCollection = client.db("abanka").collection("users");
    const applicantCollection = client.db("abanka").collection("applicants");
    const faqCollection = client.db("abanka").collection("faq");
    const paidCollection = client.db("abanka").collection("paid");

    app.get("/ourPolicies", async (req, res) => {
        const ourPolicies = await ourPoliciesCollections.find({}).toArray();
        res.send(ourPolicies);
    })
    app.get("/reviews", async (req, res) => {
        const review = await reviewCollection.find({}).toArray();
        res.send(review);
    })
    app.get("/users", async (req, res) => {

        const users = await userCollection.find({}).toArray();
        res.json(users);
    })
    app.get("/users/admin", async (req, res) => {
        const email = req.query.email;
        const particularUser = await userCollection.findOne({ email: email });


        let isAdmin = false;
        if (particularUser?.role === 'admin') {
            isAdmin = true;
        }
        res.json({ admin: isAdmin });
    })
    app.get("/faq", async (req, res) => {
        const faqs = await faqCollection.find({}).toArray();
        res.json(faqs);
    })
    app.get("/applicant", async (req, res) => {
        const loans = await applicantCollection.find({}).toArray();
        res.json(loans);
    })
    app.get("/applicant/:email", async (req, res) => {
        const email = req.params.email;
        const applicant = await applicantCollection.find({ email: email }).toArray();
        res.json(applicant);
    })

    app.post("/reviews", async (req, res) => {
        const review = await reviewCollection.insertOne(req.body);
        res.json(review);
    })
    app.post("/paid", async (req, res) => {
        const paid = await paidCollection.insertOne(req.body);
        res.json(paid);
    })
    app.post("/faq", async (req, res) => {

        const newFaq = await faqCollection.insertOne(req.body);
        res.json(newFaq);
    })
    app.post("/ourPolicies", async (req, res) => {
        console.log(req.body);
        const policy = await ourPoliciesCollections.insertOne({ policyName: req.body.feature });
        res.json(policy);
    })
    app.put("/users/admin", async (req, res) => {
        const email = req.body.admin;
        const query = { email: email };
        const updateDoc = { $set: { role: "admin" } };
        const options = { upsert: false };
        const result = await userCollection.updateOne(query, updateDoc, options);

        res.json(result);

    })
    app.put("/applicant/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const options = { upsert: false };
        const updateDoc = {
            $set: {
                status: "approved"
            }
        }
        const result = await applicantCollection.updateOne(query, updateDoc, options);
        res.json(result);
    })
    app.post("/users", async (req, res) => {

        const users = await userCollection.insertOne(req.body);
        res.json(users);
    })
    app.post("/applicant", async (req, res) => {
        const applicant = await applicantCollection.insertOne(req.body);
        res.json(applicant);
    })
}
run().catch(console.dir)

app.get("/", (req, res) => {
    res.json("Backend is working");
})
app.listen(port, () => {
    console.log("Listening to port", port);
})