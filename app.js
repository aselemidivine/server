const express = require('express');
const { default: mongoose } = require('mongoose');
const PORT = 5000;
const app = express();
const {MONGOURI} = require('./keys');

require('./models/user')
require('./models/post')


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log("connected to mongodb");
})

mongoose.connection.on('error', () => {
    console.log("errorconnecting to mongodb");
})

app.use(express.json());
app.use(require('./routes/auth'))
app.use(require('./routes/post'))


app.listen(PORT, () => {
    console.log("server is running on" , PORT);
});