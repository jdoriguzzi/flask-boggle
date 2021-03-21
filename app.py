from flask import Flask, request, render_template, jsonify, session
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "secretwxyz"

boggle_game = Boggle()

debug = DebugToolbarExtension(app)


@app.route("/")
def homepage():
    """Show game board."""

    board = boggle_game.make_board()
    session['board'] = board

    return render_template("index.html", board=board)

@app.route("/check-word")
def check_word():
    """Check if word is in dictionary."""

    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})



