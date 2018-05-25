from flask import Flask, render_template, request, url_for, redirect, Markup, jsonify, make_response, send_from_directory, session
import vocal
import time
import analytics
import json
import random
from flask_cors import CORS
from werkzeug.datastructures import ImmutableMultiDict
import re


COMMENTS = json.load(open("data.json"))

app = Flask(__name__, static_url_path='/static')
CORS(app)

@app.route('/', methods=['GET'])
def index():
	return jsonify({"Type": "Test from Capital One"})

@app.route('/submitSpeech', methods=['POST'])
def submitSpeech():
	start = time.time()
	tempDict = {}
	try:
		print request.data
	except:
		pass
	print request.form
	if 'to_language' in request.form:
		# To language is the language to convert to
		# ^ Agent language
		language = request.form['to_language']
		text = request.form['text']
	elif 'form-data; name="text"' in str(request.form):
		g = str(request.form).split("\n\n")
		text = g[1].partition("\n")[0]
		language = g[2].partition("\n")[0]
		print text
		print language
	else:
		tempDict['success'] = False
		tempDict['message'] = "Yo look to your left"
		end = time.time()
		tempDict['time_elapsed'] = (end - start)
		return jsonify(tempDict)
	tempDict = {}
	languageInfo = vocal.getLanguage(text)
	tempDict['language'] = languageInfo.lang
	tempDict['language_confidence'] = languageInfo.confidence
	tempDict['success'] = True
	tempDict['message'] = "Hello from the software engineering summit!"
	tempDict['original_text'] = text
	tempDict['new_text'] = vocal.translateText(text, language)
	tempDict['new_text_speech'] = vocal.generateURL(tempDict['new_text'], language)
	tempDict['sentiment'] = float("{0:.2f}".format(analytics.getSentiment(text)))
	tempDict['keywords'] = analytics.getKeywords(tempDict['new_text'])
	tempDict['verbosity'] = float("{0:.2f}".format(float(len(' '.join(tempDict['keywords']).split(' '))) / float(len(text.split(" ")))))
	tempDict['word_count'] = len(text.split(" "))
	tempDict['new_word_count'] = len(tempDict['new_text'].split(" "))
	end = time.time()
	tempDict['time_elapsed'] = (end - start)
	return jsonify(tempDict)

@app.route('/genComment', methods=["GET"])
def generateComment():
	tempDict = {}
	text = random.choice(COMMENTS['complaints'])
	tempDict['text'] = text
	tempDict['sentiment'] = float("{0:.2f}".format(analytics.getSentiment(text)))
	tempDict['success'] = True
	tempDict['message'] = "Hello from the software engineering summit!"
	tempDict['new_text_speech'] = vocal.generateURL(re.sub(r'([^\s\w]|_)+', '', text), 'en')
	tempDict['sentiment'] = float("{0:.2f}".format(analytics.getSentiment(text)))
	tempDict['keywords'] = analytics.getKeywords(text)
	tempDict['verbosity'] = float("{0:.2f}".format(float(len(' '.join(tempDict['keywords']).split(' '))) / float(len(text.split(" ")))))
	tempDict['word_count'] = len(text.split(" "))
	return jsonify(tempDict)


if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000)
