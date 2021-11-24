const axios = require("axios");
const cheerio = require("cheerio");
// require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");
const News = require("../../Models/News");
const mongo_uri = process.env.MONGO_URI;

const url = "https://www.thehindu.com/news/national";
const connURL = mongo_uri;
console.log(mongo_uri);

//getting almost 20 pages though there are almost 2400 pages but only first page contains the latest news so we are currently focusing on that
async function getTotalPages($) {
  try {
    let pagination = $(".pagination").first();
    let a = $(pagination).find("a").text().trim();
    let arr = a.split("\n");
    arr = arr.filter((item) => item != "" && /[0-9]/.test(item));
    return Promise.resolve(arr);
  } catch (err) {
    Promise.reject(err);
  }
}

//we are collecting from other stories
async function getOtherArticles($, page) {
  try {
    let otherArticles = $(".Other-StoryCard");
    let othArt = [];

    otherArticles.each((i, item) => {
      // console.log(i);
      let data = {};
      let heading = $(item).children("h3").children("a").text().trim();
      let desc = $(item).children("a").text().trim();
      let link = $(item).children("a").attr("href");
      let date = $(item)
        .children("h3")
        .children("a")
        .attr("title")
        .trim()
        .split("\r");
      // console.log(heading);
      // console.log(desc);
      // console.log(link);
      data.source = { id: null, name: "The Hindu" };
      data.topic = "national";
      data.section = "Other Articles";
      data.subtopic = "";
      data.title = heading;
      data.publishedAt = date[0];
      data.description = desc;
      data.url = link;
      data.urlToImage = "";
      data.page = page;
      othArt.push(data);
    });
    fs.writeFileSync("otherArticle.json", JSON.stringify(othArt));
    return Promise.resolve(othArt);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
}

async function getMainArticles($, page) {
  try {
    let newsArticles = $(".story-card");
    let newsArr = [];
    newsArticles.each((i, item) => {
      let data = {};
      let link = $(item).children(".story-card-img").attr("href");
      // let img_link = $(item).children('a').html();
      let heading = $(item)
        .children(".story-card-news")
        .children("h3")
        .children("a")
        .text()
        .trim();
      let date = $(item)
        .children(".story-card-news")
        .children("h3")
        .children("a")
        .attr("title");
      if (date != undefined || date != null) {
        date = date.split("\r");
      }

      data.source = { id: null, name: "The Hindu" };
      data.topic = "national";
      data.section = "Main Articles";
      data.subtopic = "";
      data.title = heading;
      if (date != undefined || date != null) data.publishedAt = date[0];
      data.description = null;
      data.url = link;
      data.urlToImage = "";
      data.page = page;
      if (heading != "") newsArr.push(data);
    });
    fs.writeFileSync("mainArticle.json", JSON.stringify(newsArr));
    return Promise.resolve(newsArr);
  } catch (err) {
    return Promise.reject({ error_in_getMainArticles: err });
  }
}

async function getNationalData(url, page) {
  try {
    if (page) {
      url = url + `/?page=${page}`;
    }
    let { data } = await axios.get(url);
    let $ = cheerio.load(data);
    // let news = $('.story-card');
    // await News.deleteMany({});
    // let pages = await getTotalPages($);
    // console.log(pages);
    let arr = await getMainArticles($, page);
    let arr2 = await getOtherArticles($, page);
    arr = arr.concat(arr2);

    let res = await News.insertMany(arr);
    return Promise.resolve(res.length);
  } catch (err) {
    return Promise.reject(err);
  }
}

mongoose
  .connect(connURL)
  .then(() => {
    console.log("connected to mongo db");
    News.deleteMany({}).then(() => {
      const page1 = getNationalData(url, 1).then((rows) => {
        console.log(`inserted rows from page 1- ${rows}`);
      });

      const page2 = getNationalData(url, 2).then((rows) => {
        console.log(`inserted rows from page 2- ${rows}`);
      });
      Promise.all([page1, page2]).then(() => {
        mongoose.disconnect();
      });
    });
  })
  .catch((err) => {
    console.log(err);
    mongoose.disconnect();
  });
