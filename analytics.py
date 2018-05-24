from textblob import TextBlob
import re

def getSentiment(text):
	# Returns sentiment polarity of the words said
	lyrics = re.sub('\s+',' ', text)
	# Removes punctuation
	return TextBlob(text).sentiment.polarity
	# Returns the polarity using Textblob
