// https://www.oclc.org/go/de/OPEN-Anwender.html

const cheerio = require("cheerio");
const axios = require("axios");
const FormData = require("form-data");
const OPAC = require("../opac");

const fieldPrefix = "dnn$ctr388$MainView$";
const viewState =
  "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";
const eventVerification =
  "yu3MvYKeqjE7t2i9kdeXxK+IuosSolD4V3lgoVvS3ZqRL75bCKsW9ZAq6vqtxHb/C7wFUl/2hOaB3QmJcR9N+/dqj7wG/dnNKwMmjyczY/GSpZIO+RGQCKBDUMIi0GSA+6nn3EOKLaPpOTem35wf3umWlP8hq5H3XCCHSulGB2gbcTeU8jFO8teuVOkoENpbFx7+PqnSP0hWqlpaz39J7C5DMzPHgOMxPyTweSYfEUn2XMXHYjhAmDMwgRnVcqHZMhoogdhnM5nw/3Z/GC+4gzUHq9BvZ3v2Mv8u85lubp7Vfj+siH8um2ywqlGB32NnYCw3DpDGkEEbZPUo+PIAXpSEfkldPibhszfaS4LxJAlucJXVT7gT8SeSFTBJDMos7J23LvFaHtXgmPR05PeN0dtTGTSOcMCfgHZRLkUVEofgeEE74Q3c/aJTGyMr+eRquzie1c4Jz/lKR6ybCzKAVJrW5CBVjfAkRvMZCqjKN0ozlypA5STCVqmQU899kxAp03agtbVzfcO3DSpSgduHQZ1iA4ryBWRjYpMrz4qqDKpgw7OsmmLn9OwwqzmtGZQ8aFIscWiQmOgDophdgYZiUQ9b1YdGTxoM282mZj5LmJNaA6R0vHG1QCHWo6LT+iaB4SrpvrjKLIGvYGCTwRM6Xp/m59JflDoO0h9SWb6nCOC/AxAcROSPECIkXDMBn1Sf+yFiNOiQrtpzwvaOiVISI5RYNIftK07vvTRJXNIVhzlfzMW/VQC5uLVzvvGoC0lxYMGfIY5sTX+R017sFFr+4UC3Cl+m91IHJUd8O17zx36b9wNsbY+PGDydXPjLgqsgS1KBGTYbebpg7BBRIvOjClOYayX8cmZy+PMLoCVEIt3P1ZbekZBd1Ns2mtLlofVt5wuahfYdl8ShdHgnFO+QcuwwIjCLjRrnZYA0iwuacWB+SN8fugBOnOG51IAE3AyOfVpAv3ENKyutVfo17nSS/Z892ozJGkt+1LX6bh7aFqG5/ZNFbgPolRETrGOE5Zt0FO50py3E30lCDpBKHxRyuN70tv02b676+A6mJlfQuEI3SMK3Pr8QGiCIeBwa4KIHWrwvM6ji2b+M1B9N8ejxXq38XABFmaTFey/nWU0DCkfcsTG3h9zmuTESYkBUvCpqJXdFSqoawAiPABPq0F0FJEcCyDKp6gQXgp1DNIER6mRywk/eV4JGOIXSEKdbvWlxeuA7+JK/HCbXRDbnhhZ5gEda+RbBL1rc+pLQdXG+s2/iQC6JynIdHQkmIAsiQbZOwOsD6TDtGot4zHTR7hTmx/ceO2S3RLPdqhvks7FN92I8zuKR6ovbjYYBrPZWFlcIMycmj4D6hr1bwNcOpmQ+KaXSXMuAYpeJZLStubSoxQZcqWa2Q8Buvv6vWX1cqsrAXf7XYJifdyExP/ACe6acmpg/NbJIKNMohsIl2fyFB3/gT1MvuCP5/ioSIUGs4mXSh68TonJdO7yf0WKvmBFA83ndtY6yiFOU7HKEja4bqzUVIUXNrL7k68BHZS9FlhbNoru64gghugmS7qGviSOSET+TihVD+dK/2gR6dCeLtZU1eUYk15sM1zt0Hc1+rjRxI+E6F18yfIjrWiX7l8vymFbn+o96+ylIwwFbj8r6UOUSGu5CrSPrhzJGR+KGQKteJDJB2D3pe+ZpCJKUOUauui9YkKFhW+MaBgVqRhE6Bi36mwhisCMeuy2zkRj0jJwShe+Sg4HfG7YtC2XeMWZoOYX0EjpM8qs5nOI/p3QBeVCt8nHjU1IMePFPHWziq8cPhGwonhkIp/LYlEjL0tqNd9nqO4e8GDkh3MA7aMun7nhKfUTsKHvrJZ+jD98i6LnG9EN9A7JM3Txsoykao2zPpnAgUs8BcyFV4mjIUPxU28zQBjXPTv8CEPYIFZuiYAMR0UjOHLZUAPjSAJqowurv71t3TXp6MQVjOSsX9SEBUyqf+ZkGCcimyj7mfHKkr74SX//MDMSea1g9jg3Y+EksXZXF8QX8JutZVVwFPGDJSWV4viClqzTEVybiIMiw0IXNRCyXe1hyVRVpt0uNzkvrkA+Od1jCEpjKcOeGGQ2b2M8TZoGzOh3nU9NKcZ85BLyRXsGhNwNWz444fY5wx2NGNlXL/cfr5UcUDcVdMlOYYjYyosWPsbvdM/zzgn3X8LupFY9rQJ3+EoeZoqorX+0Nu18D7szRZvJ3F2Xnx9EvRvXtuFbESorWPWSItsRqR+2iWC2IjVrVBjgvcwPpssi7PFrRfc5tqHxRf11p9fw1SSFslOGY1wwKUZ44lLLzL9Uy4tIcqb9YEL2KGU080uN0ocuzWbxCQXejBTfOcj+h4RBPnh/GZg4EpRRXkIkddyPvOdZgVkbkHhbtFAGipoDmG1wcborSHzUMbXePcWAJASPDIGyk/TeK0kd4YcdelQAx2/VeGLbSKWZ58ecj2sSn3ravw3h2/iESWQP91KkyOMJ5m0YA";

function findValue($, e, name) {
  return e
    .find(".oclc-module-label")
    .filter((_, el) => {
      return $(el).text().trim() === name;
    })
    .parent()
    .text()
    .trim()
    .slice(name.length)
    .trim();
}

function basicBookInfos($, e) {
  const splitChar = "; ";
  const rawSeries = findValue($, e, "Reihe:");
  const index = rawSeries.lastIndexOf(splitChar);

  var seriesName;
  var seriesVol;
  if (index === -1) {
    seriesName = rawSeries;
  } else {
    seriesName = rawSeries.substr(0, index);
    seriesVol = rawSeries.substr(index + splitChar.length);
  }

  var cover = e.find(".coverBig").attr("sources").split("|")[2];
  if (cover.startsWith("/DesktopModules")) {
    cover = undefined;
  }

  return {
    title: e.find(".boldText").text(),
    author: findValue($, e, "Verfasser:"),
    publisher: findValue($, e, "Verlag:"),
    year: findValue($, e, "Jahr:"),
    series: findValue($, e, "Übergeordnetes Werk:") || seriesName,
    seriesVolume: findValue($, e, "Bandangabe:") || seriesVol,
    cover: cover,
  };
}

class OPEN extends OPAC {
  constructor(url) {
    super();
    this.url = url;
  }

  async search(value, count, type = 0) {
    const url = await this._searchURL(value, type);
    console.log(url);

    var results = [];
    var page = 1;
    var pageRes;
    var lastPage = false;

    while (!lastPage && (count === -1 || count > results.length)) {
      [pageRes, lastPage] = await this._searchPage(url, page++, 50);
      results = results.concat(pageRes);
    }

    return results;
  }

  async _searchPage(url, page, size) {
    const res = await axios.get(
      url + "&top=y&pagesize=" + size + "&page=" + page
    );
    const $ = cheerio.load(res.data);

    const results = [];
    $(
      ".oclc-searchmodule-mediumview, .oclc-searchmodule-comprehensiveitemview "
    ).each((_, element) => {
      const e = $(element);
      const info = basicBookInfos($, e);
      info.id = e.find(".availRegion > input[value]").val();
      results.push(info);
    });
    const lastPage = $("[title='Zur letzten Seite blättern']").length === 0;
    return [results, lastPage];
  }

  async _searchURL(value, type) {
    const form = new FormData();
    form.append("__VIEWSTATE", viewState);
    form.append("__EVENTVALIDATION", eventVerification);
    form.append(fieldPrefix + "BtnSearch", "Suchen");

    form.append(
      fieldPrefix + "FirstSearchField",
      [
        "Free",
        "Title",
        "Autor",
        "Keyword",
        "SubjectType",
        "Systematic",
        "ISBNandISSN",
      ][type]
    );
    form.append(fieldPrefix + "FirstSearchValue", value);

    /* 0: all
       1: e-media
       2: physical media */
    form.append(fieldPrefix + "RbMediaTypeList", 0);

    const res = await axios.post(
      this.url + "/Mediensuche/Erweiterte-Suche",
      form,
      {
        headers: form.getHeaders(),
        maxRedirects: 0,
        validateStatus: (s) => s === 302,
      }
    );
    return res.headers.location;
  }

  async bookInfo(id) {
    const res = await axios.get(this.url + "?id=" + id);
    const $ = cheerio.load(res.data);

    const info = basicBookInfos($, $(".oclc-searchmodule-mediumview"));
    info.id = id;
    info.available =
      $(".oclc-searchmodule-mediumview-controls span").text() === "verfügbar";
    return info;
  }
}

module.exports = OPEN;
