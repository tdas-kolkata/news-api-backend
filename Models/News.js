const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
	source: {
		id: {
			type: String
		},
		name: {
			type: String
		}
	},
	topic: {
		type: String
	},
	page:{
		type:String
	},
	section: {
		type: String
	},
	subtopic: {
		type: String
	},
	title: {
		type: String,
		required: true
	},
	publishedAt: {
		type: String
	},
	description: {
		type: String
	},
	url: {
		type: String,
		required: true
	},
	urlToImage: {
		type: String
	},
	loadDttm: {
		type: Date,
		default: Date.now()
	}

});


const News = mongoose.model('news', NewsSchema);

module.exports = News;
