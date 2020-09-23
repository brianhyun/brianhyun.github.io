const express = require('express');

const indexRouter = require('./routes/index');
const errorController = require('./controllers/error');

const app = express(); 

app.use(express.static('public'));

app.use(indexRouter);
app.use(errorController);

app.listen(process.env.PORT || 3000, () => {
	console.log('Sorting Visualizer App running on port', 3000);
});