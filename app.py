from flask import Flask, render_template, request, url_for, redirect, Markup, jsonify, make_response, send_from_directory, session
import vocal

app = Flask(__name__, static_url_path='/static')


@app.route('/', methods=['GET'])
def index():
	return jsonify({"Type": "Test from Capital One"})

@app.route('/submitSpeech', methods=['POST'])
def submitSpeech():
	language = "ES"
	if request.form['text']:
		tempDict = {}
		tempDict['original_text'] = request.form['text']
		tempDict['new_text'] = vocal.translateText(text, language)
		tempDict['language'] = language
		return jsonify({"Text": text, "newText": newText})
	else:
		return jsonify({"status": "404"})

if __name__ == '__main__':
	app.run(host='127.0.0.1', port=5000)
