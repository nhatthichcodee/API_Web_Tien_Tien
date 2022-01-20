const express = require('express');
const app = express()
var expressEjsExtend = require('express-ejs-extend');
const port = 3000
const router = require('./src/router/web');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static("./src/public"));

app.engine("ejs", expressEjsExtend)
app.set("view engine", "ejs");
app.set("views", "./src/views")

router.initWebRouter(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })