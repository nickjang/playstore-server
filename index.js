const express = require('express');
const morgan = require('morgan');
const Store = require('./playStore');


const app = express();
app.use(morgan('dev'));

app.get('/apps', (req, res)=>{
	const { sort, genres } = req.query;
	const collection = Store;
	const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

	if (sort && sort !== 'rating' && sort !== 'app') {
		return res
			.status(400)
			.json( { message: 'invalid sort: must be one of "rating" or "app"' } );
	}

	if (genres && !validGenres.some(currEl=> genres.toLowerCase() === currEl.toLowerCase())){
		return res
			.status(400)
			.json( { message: `invalid genre: must be one of ${validGenres.join(', ')}` } );
	}

	if (sort) {
		//sort buy whatever
	}

	if (genres) {
		//filter genre
	}

	res.json(collection);
});

app.listen(8000, () => 'Server listening on PORT 8000');
