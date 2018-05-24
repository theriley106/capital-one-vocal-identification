from flask import Flask, render_template, request, url_for, redirect, Markup, jsonify, make_response, send_from_directory, session
import vocal
import time

app = Flask(__name__, static_url_path='/static')


@app.route('/', methods=['GET'])
def index():
	return jsonify({"Type": "Test from Capital One"})

@app.route('/submitSpeech', methods=['POST'])
def submitSpeech():
	start = time.time()
	language = "ES"
	if request.form['text']:
		text = request.form['text']
		tempDict = {}
		tempDict['success'] = True
		tempDict['message'] = "Hello from the software engineering summit!"
		tempDict['original_text'] = text
		tempDict['new_text'] = vocal.translateText(text, language)
		tempDict['language'] = language

		end = time.time()
		tempDict['time_elapsed'] = (end - start)
		return jsonify(tempDict)
	else:
		tempDict['success'] = False
		tempDict['message'] = "Request failed - Are you sure you added form data?"
		end = time.time()
		tempDict['time_elapsed'] = (end - start)
		return jsonify({"status": "404"})

if __name__ == '__main__':
	app.run(host='127.0.0.1', port=5000)
