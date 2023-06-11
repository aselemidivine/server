const express = require('express');
const { default: mongoose } = require('mongoose');
const PORT = 5000;
const app = express();
const {MONGOURI} = require('./keys');

require('./models/user')

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

// mongoose
//   .connect(
//     "mongodb+srv://Ronald-Partners:ronald-partners@cluster0.gwdmzoy.mongodb.net/",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => console.log("connected to mongodb"))
//   .catch((err) => console.log("Mongodb connection failed"));


app.use(express.json());
app.use(require('./routes/auth'))


app.listen(PORT, () => {
    console.log("server is running on" , PORT);
});