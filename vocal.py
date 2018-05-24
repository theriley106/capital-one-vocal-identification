from googletrans import Translator
# This is used for tranlating the text
import requests

def generateURL(keyWords, region):
	# This generates the GOOGLE TRANSLATE URL
	keyWords = keyWords.replace(" ", "%20")
	# Google translate url doesn't have a space
	return "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q={}&tl={}".format(keyWords, region)

def translateText(text, toLanguage):
	# This translates text into the language described in fromLanguage
	translator = Translator()
	# Initiates translator class
	translation = translator.translate(text, dest=toLanguage)
	# .to_dict or .text work with this object
	return translation.text

