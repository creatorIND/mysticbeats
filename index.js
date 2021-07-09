//Mystic Beats
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const Song = require("./models/song");
const Artist = require("./models/artist");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
// const dbUrl = "mongodb://localhost:27017/mystic-beats";
const dbUrl = process.env.DB_URL;
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("***DATABASE CONNECTED***");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function dynamicSort(property) {
	let sortOrder = 1;
	if (property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a, b) {
		const result =
			a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
		return result * sortOrder;
	};
}

app.get("/", (req, res) => {
	res.render("home");
});

app.get(
	"/songs",
	catchAsync(async (req, res) => {
		const songs = await Song.find({}).populate("artist");
		songs.sort(dynamicSort("title"));
		res.render("main/songs", { songs });
	})
);

app.get(
	"/artists",
	catchAsync(async (req, res) => {
		const artists = await Artist.find({});
		artists.sort(dynamicSort("name"));
		res.render("main/artists", { artists });
	})
);

app.get(
	"/artists/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const artist = await Artist.findById(id).populate("songs");
		res.render("main/artistShow", { artist });
	})
);

app.get(
	"/languages/:lang",
	catchAsync(async (req, res) => {
		let { lang } = req.params;
		lang = lang.charAt(0).toUpperCase() + lang.slice(1);
		const songs = await Song.find({ language: lang }).populate("artist");
		songs.sort(dynamicSort("title"));
		res.render("main/language", { songs, lang });
	})
);

app.all("*", (req, res, next) => {
	next(new ExpressError("PAGE NOT FOUND!", 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) {
		err.message = "OH NO, SOMETHING WENT WRONG!";
	}
	res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`SERVING ON PORT ${port}...`);
});
