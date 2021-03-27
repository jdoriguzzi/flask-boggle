class BoggleGame {
  constructor(boardId) {
    this.words = new Set();
    this.board = $("#" + boardId);
    this.score = 0;
    this.time = 60; 
    this.showClock();
    $("#add-word", this.board).on("submit", this.handleSubmit.bind(this));
    this.timer = setInterval(this.clock.bind(this), 1000);
    
  }


  /* show word in list of words played */
  showWord(word) {
      $("#words", this.board).append($("<li>", { text: word }));

  }

  showMessage(msg) {
    $("#msg", this.board).text(msg);
  }

  updateScore() {
    $("#score", this.board).text(this.score);
  }

  /* handle submission of word, check for validity */
  async handleSubmit(e) {
    e.preventDefault();

    const $word = $(".word", this.board);
    
    let word = $word.val();
   
    if (word==="") return; // no word was entered

    if (this.words.has(word)) {
      this.showMessage(`${word} has already been played!`, "err");
      return;
    }
    
    // querry server if word is valid and on board
    const resp = await axios.get("/check-word", { params: { word: word }});
    if (resp.data.result === "not-word") {
      this.showMessage(`${word} is not in the dictionary`);
    } else if (resp.data.result === "not-on-board") {
      this.showMessage(`${word} is not on this board`);
    } else {
      this.showWord(word);
      this.words.add(word);
      this.score += word.length;
      this.updateScore();
      this.showMessage("");
    }

    $word.val("").focus();
  }

  showClock() {
    $("#timer", this.board).text(this.time);
  }

  /* Count down the seconds */

  async clock() {
    this.time -= 1;
    this.showClock();

    if (this.time === 0) {
      clearInterval(this.timer);
      await this.scoreGame();
    }
  }

  /* end of game: score and update message. */

  async scoreGame() {
    $("#add-word", this.board).hide();
    const resp = await axios.post("/post-score", { score: this.score });
    if (resp.data.brokeRecord) {
      this.showMessage(`New record: ${this.score}`);
    } else {
      this.showMessage(`Final score: ${this.score}`);
    }
  }


}
