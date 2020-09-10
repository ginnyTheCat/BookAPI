class OPAC {
  /* 0: any
     1: title
     2: author 
     3: keyword
     4: interest group 
     5: systematic 
     6: ISBN */
  async search(value, count, type = 0) {}

  async bookInfo(id) {}
}

module.exports = OPAC;
