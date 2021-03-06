from flask import Flask, render_template, request, url_for, redirect, Markup, jsonify, make_response, send_from_directory, session
import vocal
import time
import analytics
import json
import random
from flask_cors import CORS
from werkzeug.datastructures import ImmutableMultiDict
import re
import requests
import os


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

@app.route('/updates', methods=["GET", "POST"])
def generateUpdate():
	if request.method == 'POST':
		try:
			print request.form
			#text = str(request.form).partition("'text', ")[2].partition("'")[2].partition("'")[0]
			text = str(request.form).partition("'text', ")[2]
			if '"' in str(text)[:5]:
				text = text.partition('"')[2].partition(")]")[0][:-1]
			else:
				text = text.partition("'")[2].partition(")]")[0][:-1]
			languageVal = text.partition("| ")[2].partition("'")[0].partition('"')[0].strip()
			text = text.partition('|')[0]
			tempText = text
			vocal.translateText(text, languageVal)
			print text
			print languageVal
			text = vocal.translateText(text, languageVal)
			partGenerateAudio(text, languageVal)
			with open('updates.txt', 'w') as the_file:
				the_file.write(text)
			with open('rawUpdate.txt', 'w') as the_file:
				the_file.write(tempText)
			return jsonify({"success": True})
		except Exception as exp:
			print exp
			return jsonify({"success": False})
	if request.method == 'GET':
		try:
			e = open("updates.txt").read().strip()
			f = open("rawUpdate.txt").read().strip()
			return jsonify({"text": e, "raw_data": f, "success": True})
		except Exception as exp:
			print exp
			return jsonify({"text": "", "success": True})

def splitWords(string):
	audioLength = 100
	prevLen = 0
	words = string
	allVals = []
	for i in range(10):
		if len(words) > 5:
			words = words[prevLen:]
			newWord = words[:audioLength][::-1].strip().partition(' ')[2][::-1]
			prevLen = len(newWord)
			print newWord
			if len(newWord) > 3:
				allVals.append(newWord)
	return allVals


@app.route('/getAudio', methods=["POST"])
def generateAudio():
	try:
		os.system("rm *.mp3")
		os.system("rm static/output.mp3")
	except:
		pass
	allFiles = {"audio_files": []}
	print str(request.form)
	text = str(request.form).partition("'text', ")[2]
	if '"' in str(text)[:5]:
		text = text.partition('"')[2].partition(")]")[0][:-1]
	else:
		text = text.partition("'")[2].partition(")]")[0][:-1]

	print text
	for val in splitWords(text):
		allFiles['audio_files'].append(vocal.generateURL(str(val), 'en'))
	if len(allFiles['audio_files']) == 1:
		saveMP3(allFiles['audio_files'][0], "static/output.mp3")
	else:
		for i, val in enumerate(allFiles['audio_files']):
			saveMP3(val, "{}.mp3".format(str(i).zfill(2)))
		os.system("mp3wrap output.mp3 *.mp3")
		os.system("mv *MP3WRAP.mp3 static/output.mp3")
		os.system('ls')
	return allFiles

def partGenerateAudio(text, languageVal='en'):
	try:
		os.system("rm *.mp3")
		os.system("rm static/output.mp3")
	except:
		pass
	allFiles = {"audio_files": []}
	for val in splitWords(text):
		print re.sub(r'([^\s\w]|_)+', '', val)
		allFiles['audio_files'].append(vocal.generateURL(str(val), languageVal))
	if len(allFiles['audio_files']) == 1:
		saveMP3(allFiles['audio_files'][0], "static/output.mp3")
	else:
		for i, val in enumerate(allFiles['audio_files']):
			saveMP3(val, "{}.mp3".format(str(i).zfill(2)))
		os.system("mp3wrap output.mp3 *.mp3")
		os.system("mv *MP3WRAP.mp3 static/output.mp3")
		os.system('ls')
	return allFiles

def saveMP3(mp3URL, fileName):
	#return MP3 file name
	mp3File = '{}'.format(fileName)
	#calls it a random file name to later delete
	with open(mp3File, 'wb') as f:
		#this saves the response locally as an actual mp3 file
		f.write(requests.get(mp3URL).content)
	return mp3File

@app.route('/audio/')
def audio():
    return url_for('static', filename='output.mp3')


if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000, threaded=True)
