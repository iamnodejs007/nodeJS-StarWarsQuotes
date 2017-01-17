console.log('May Node be with you')

const MONGODB_URI = 'mongodb://test:test@ds025379.mlab.com:25379/star-wars-quotes'


const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static('public'))

const mongoClient = require('mongodb').MongoClient

mongoClient.connect(MONGODB_URI, (err, database) => {
	if (err) return console.log(err)
	db = database
	app.listen(3000, function() {
		console.log('listening on 3000')
	})
})


app.get('/', (req, res) => {
	var cursor = db.collection('quotes').find().toArray(function(err, result){
		console.log(result)
		res.render('index.ejs', {quotes: result})
	})
})

app.post('/quotes', (req, res) => {
	console.log(req.body)
	db.collection('quotes').save(req.body, (err, result) => {
		if (err) return console.log(err)
		console.log('saved to database')
		res.redirect('/')
	})
})


app.put('/quotes', (req, res) => {
	db.collection('quotes').findOneAndUpdate({name: 'Yoda'}, {
		$set: {
			name: req.body.name,
			quote:req.body.quote
		}
	}, {
		sort: {_id: -1},
		upsert: true
	}, (err, result) => {
		if (err) return res.send(err)
		res.send(result)
	})
})

app.delete('/quotes', (req, res) => {
	db.collection('quotes').findOneAndDelete({
		name: req.body.name
	}, (err, result) => {
		if (err) return res.send(500, err)
		res.send('A darth vadar quote got deleted')
	})
})
