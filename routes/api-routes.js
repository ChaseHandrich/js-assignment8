const express = require('express')
const {MongoClient, ObjectId} = require('mongodb')
const route = express.Router()

const {url} = process.env.MONGODB_URL || require('../secrets/mongodb.json')
const client = new MongoClient(url)

const getCollection = async (dbName, collectionName) => {
    await client.connect()
    return client.db(dbName).collection(collectionName) 
}

// GET /api/todos
route.get('/',async(_,response)=>{
    const collection = await getCollection('todo-api','todos')
    const todos = await collection.find().toArray()
	response.json(todos)
})
// POST /api/todos
route.post('/',async(request,response)=>{
	const { item } = request.body
	const complete = false
    const collection = await getCollection('todo-api','todos')
    const {insertedId} = await (await collection.insertOne({item,complete}))
	response.json({insertedId})
})
// PUT /api/todos/:id
route.put('/:id',async(request,response)=>{
	const { id } = request.params
    const collection = await getCollection('todo-api','todos')
	const task = await collection.findOne({_id:new ObjectId(id)})
	const complete = !task.complete // toggle the complete property
    const result = await collection.updateOne({_id:new ObjectId(id)},{$set : {complete}})
	response.json({id,"complete":complete})
})

module.exports = route