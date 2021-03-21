class BoggleGame {
  
    constructor(boardId) {
      this.words = new Set();
      this.board = $("#" + boardId);
    }


    /* show word in list of words */
    showWord(word) {
        $(".words", this.board).append($("<li>", { text: word }));
    }


    /* handle submission of word, check for validity */
    async handleSubmit(e) {
      e.preventDefault();
      const $word = $(".word", this.board);
  
      let word = $word.val();
      if (!word) return;
  
      // querry server if word is valid and on board
      const resp = await axios.get("/check-word", { params: { word: word }});
      if (resp.data.result === "not-word") {
        this.showMessage(`${word} is not in the dictionary`, "err");
      } else if (resp.data.result === "not-on-board") {
        this.showMessage(`${word} is not on this board`, "err");
      } else {
        this.showWord(word);
        this.words.add(word);
      }
  
      $word.val("").focus();
    }
  

}
  