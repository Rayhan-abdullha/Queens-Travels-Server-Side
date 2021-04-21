const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();

const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.exmxz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get("/", (req, res) => {
    res.send('This is server side')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("travelsData").collection("services");

    app.get('/service', (req, res) => {
        collection.find({})
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.get('/service/:id', (req, res) => {
        collection.find({_id: ObjectId(req.params.id)})
        .toArray((err, document) => {
            res.send(document[0])
        })
    })
    
    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        collection.insertOne(newEvent)
        .then(result => {
            console.log('inserted count', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.delete("/deleted/:id" , (req, res) => {
        collection.deleteOne({_id: ObjectId(req.params.id)})
        .then((err, result) => {
            res.send(result)
        })
    })
});

// package
client.connect(err => {
    const packageCollection = client.db("travelsData").collection("package");

    app.get('/package', (req, res) => {
        packageCollection.find({})
        .toArray((err, items) => {
            res.send(items)
        })
    })
    app.post('/addPackage', (req, res) => {
        const newEvent = req.body;
        packageCollection.insertOne(newEvent)
        .then(result => {
            console.log('inserted count', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

});

// destination
client.connect(err => {
    const destinationCollection = client.db("travelsData").collection("destination");

    app.get('/destinations', (req, res) => {
        destinationCollection.find({})
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.post('/AddDestinaions', (req, res) => {
        const newEvent = req.body;
        destinationCollection.insertOne(newEvent)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
});

// reviews

client.connect(err => {
    const reviewCollection = client.db("travelsData").collection("reviews");

    app.get('/review', (req, res) => {
        reviewCollection.find({})
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.post('/addReview', (req, res) => {
        const newEvent = req.body;
        reviewCollection.insertOne(newEvent)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

});

// booking
client.connect(err => {
    const bookingCollection = client.db("travelsData").collection("bookings");

    app.post('/addBooking', (req, res) => {
        const newBooking = req.body;
        bookingCollection.insertOne(newBooking)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/checkOut', (req, res) => {
        bookingCollection.find({})
        .toArray((err, items) => {
            res.send(items)
        })
    })

});

// admin server
client.connect(err => {
    const addminCollection = client.db("travelsData").collection("allAdmin");

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        addminCollection.insertOne(newAdmin)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/checkAdmin', (req, res) => {
        const email = req.body.email
        addminCollection.find({email: email})
        .toArray((err, document) => {
            res.send(document)
        })
    })

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});