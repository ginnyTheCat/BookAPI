const OPEN = require("./opacs/open");
const WinBIAP = require("./opacs/winbiap");

const lib = new OPEN("https://opac.example.com");

lib.bookInfo(420).then(console.log);
lib.search("Book Title", -1).then(console.log);
