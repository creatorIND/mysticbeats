const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artistSchema = new Schema({
	name: String,
	details: String,
	image: String,
	songs: [
		{
			type: Schema.Types.ObjectId,
			ref: "Song",
		},
	],
});

module.exports = mongoose.model("Artist", artistSchema);
