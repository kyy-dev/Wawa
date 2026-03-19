const axios = require("axios");

const clean = (data) => {
  let regex = /(<([^>]+)>)/gi;
  data = data.replace(/(<br?\s?\/>)/gi, " \n");
  return data.replace(regex, "");
};

async function shortener(url) {
  return url; // sementara tanpa shortlink
}

exports.Tiktok = async (query) => {
  let response = await axios("https://lovetik.com/api/ajax/search", {
    method: "POST",
    data: new URLSearchParams(Object.entries({ query })),
  });

  let result = {};
  result.creator = "KyyBot";
  result.title = clean(response.data.desc);
  result.author = clean(response.data.author);
  result.nowm = await shortener(response.data.links[0].a || "");
  result.watermark = await shortener(response.data.links[1].a || "");
  result.audio = await shortener(response.data.links[2].a || "");
  result.thumbnail = await shortener(response.data.cover);

  return result;
};













