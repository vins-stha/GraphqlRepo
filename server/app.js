const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')


const app = express();

mongoose.connect('mongodb+srv://******:**********@cluster-for-graphql.e3jq0.mongodb.net/cluster-for-graphql?retryWrites=true&w=majority')
mongoose.connection.once('open', ()=>{
    console.log("Database connected already wonline");
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql :true

}));
app.listen(4000, ()=>{console.log("express server up and listening in 4000");})