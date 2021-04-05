const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000;
const _ = require('lodash');

app.use(cors());

const mysql = require('mysql')
var connection = mysql.createConnection({
		host: 'us-cdbr-east-03.cleardb.com',
		user: 'b50bc5ae6d7aac',
		password: 'ab952b7f',
		database: 'heroku_71698719d72c476',
		charset: 'utf8mb4'
})


const {
  fetchHtmlFromUrl,
} = require("./util");

app.get('/scrapeYoutubeVideos',(req,res) =>{
	fetchHtmlFromUrl('https://www.youtube.com/feed/trending').then((page)=>{
		console.log('page')
		const dataInJSON = page('script').get()[33].children[0].data.split('var ytInitialData = ')[1].split(';')[0];
		// console.log(dataInJSON);
		const parsedData = JSON.parse(dataInJSON);
		const youtubeTrendingVideos = parsedData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.flatMap(content => {
			if(content.itemSectionRenderer.contents[0].shelfRenderer.content.expandedShelfContentsRenderer)
				return content.itemSectionRenderer.contents[0].shelfRenderer.content.expandedShelfContentsRenderer.items
			return [];
		})

		connection.query("DELETE from Video");
		connection.query("DELETE from Channel");

		

		youtubeTrendingVideos.forEach((item, index) => {
		  const title = _.escape(_.toString(item.videoRenderer.title.runs[0].text));
		  const thumbnail = _.toString(item.videoRenderer.thumbnail.thumbnails[0].url);
		  const description = _.escape(_.toString(item.videoRenderer.descriptionSnippet?.runs[0].text)) ?? '';
		  const channel_title = item.videoRenderer.longBylineText.runs[0].text;
		  const viewcount = _.toString(item.videoRenderer.viewCountText.simpleText);
		  const video_url = _.toString(item.videoRenderer.navigationEndpoint.commandMetadata.webCommandMetadata.url);
			connection.query("INSERT INTO Channel(channel_title) VALUES ('" + channel_title + "')", function (err, rows, fields){
				connection.query("INSERT INTO Video (channel_id  ,Video_URL, Video_Thumbnail , Video_Title , Description , Viewcount) VALUES("+ rows.insertId +",'" + video_url + "','" + thumbnail + "','" + title + "','" + description + "','" +viewcount +"');",function (err, rows, fields) {
		  			if (err) throw err
				})

			});

		  	

		})

		res.send(youtubeTrendingVideos)
	});
})



app.get('/returnYoutubeVideos',(req,res) =>{

	connection.query('SELECT * FROM Video',(error, result) =>{
		if (error) throw error;

		res.send(result);
	})
	
})


app.get('/youtubeVideo/:id',(req,res) => {
	const id = req.params.id;
	connection.query('SELECT * FROM Video RIGHT JOIN Channel ON Video.channel_id = Channel.channel_id WHERE video_id = ?', id,  (error, result) => {
		if (error) throw error ;
		res.send(result);
	})

})

app.listen(port,() => {
	console.log('Example app listening at http://localhost:${port}')
})

 