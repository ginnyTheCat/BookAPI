const OPAC = require("../opac");
const axios = require("axios");
const cheerio = require("cheerio");

const baseURL = "https://webopac.winbiap.net/";

class WinBIAP extends OPAC {
  constructor(name) {
    super();
    this.name = name;
  }

  async search(value, count, type = 0) {
    if (count === -1) {
      count = 1000000; // 1M, should be enough for most libraries
    }

    const typeId = [2, 12, 3, 24, 25, 26, 29][type];

    const res = await axios.get(
      baseURL +
        this.name +
        "/search.aspx?data=" +
        Buffer.from(
          "cmd=1&amp;sC=c_0=0%%m_0=1%%f_0=" +
            typeId +
            "%%o_0=8%%v_0=" +
            value +
            "&amp;pS=" +
            count
        ).toString("base64")
    );
    const $ = cheerio.load(res.data);

    const results = [];
    $(".ResultItem").each((_, element) => {
      const e = $(element);

      const cover = e.find("img").attr("data-src");

      const volumeStr = e.find(".title1Band").text();
      var seriesVolume;
      if (volumeStr !== "") {
        seriesVolume = parseInt(volumeStr.split(" ")[1]);
      }

      results.push({
        id: cover.split("&")[1].slice(6),
        title: e.find(".title1").text(),
        author: e.find(".autor").text(),
        publisher: e.find(".publisher").text(),
        year: e.find(".publishYear").text(),
        cover: cover,
        seriesVolume: seriesVolume,
        description: e.find(".annotation").text(),
        available: e.find(".mediaStatus").hasClass("StatusAvailable"),
      });
    });
    return results;
  }
}

module.exports = WinBIAP;
