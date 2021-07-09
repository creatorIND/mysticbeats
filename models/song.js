const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema({
	title: String,
	artist: {
		type: Schema.Types.ObjectId,
		ref: "Artist",
	},
	file: String,
	language: String,
});

module.exports = mongoose.model("Song", songSchema);
