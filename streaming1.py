import os
import speech_recognition as sr
from tqdm import tqdm

with open("api-key.json") as f:
    GOOGLE_CLOUD_SPEECH_CREDENTIALS = f.read()

r = sr.Recognizer()

all_text = []


with sr.AudioFile("test.flac") as source:
    audio = r.record(source)

text = r.recognize_google_cloud(audio, credentials_json=GOOGLE_CLOUD_SPEECH_CREDENTIALS)
all_text.append(text)

transcript = ""
for i, t in enumerate(all_text):
    total_seconds = i * 30
    # Cool shortcut from:
    # https://stackoverflow.com/questions/775049/python-time-seconds-to-hms
    # to get hours, minutes and seconds
    m, s = divmod(total_seconds, 60)
    h, m = divmod(m, 60)

    # Format time as h:m:s - 30 seconds of text
    transcript = transcript + "{:0>2d}:{:0>2d}:{:0>2d} {}\n".format(h, m, s, t)

print(transcript)

with open("transcript.txt", "w") as f:
    f.write(transcript)
