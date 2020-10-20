const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));



app.listen(8000, () => 'Server listening on PORT 8000');