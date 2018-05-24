from textblob import TextBlob
import re
from rake_nltk import Rake

r = Rake()

def getSentiment(text):
	# Returns sentiment polarity of the words said
	lyrics = re.sub('\s+',' ', text)
	# Removes punctuation
	return TextBlob(text).sentiment.polarity
	# Returns the polarity using Textblob

def getKeywords(text):
	# Returns ranked keywords
	r.extract_keywords_from_text(text)
	return r.get_ranked_phrases()
