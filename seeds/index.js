require("dotenv").config();
const mongoose = require("mongoose");
const { artists } = require("./artists");
const { songs } = require("./songs");
const Artist = require("../models/artist");
const Song = require("../models/song");
// const dBUrl = "mongodb://localhost:27017/mystic-beats";
const dBUrl = process.env.DB_URL;

mongoose.connect(dBUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("***DATABASE CONNECTED***");
});

const seedData = async () => {
	await Artist.deleteMany({});
	await Song.deleteMany({});
	for (let artist of artists) {
		const art = new Artist({
			name: artist.name,
			details: artist.details,
			image: artist.image,
		});
		await art.save();
		for (let song of songs) {
			if (song.artist === artist.name) {
				const gaana = new Song({
					title: song.title,
					artist: art._id,
					file: song.file,
					language: song.language,
				});
				await Artist.updateOne(
					{ name: artist.name },
					{ $push: { songs: gaana._id } }
				);
				await gaana.save();
			}
		}
	}
};

seedData()
	.then(() => {
		mongoose.connection.close();
	})
	.catch((e) => {
		console.log(e);
	});
