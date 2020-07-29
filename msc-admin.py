import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import storage
import argparse
import sys
import csv
import shutil
import os

def parse_args(args):
    parser = argparse.ArgumentParser(
        description="Backend data processor for Malayalam speech corpus app"
    )
    parser.add_argument(
        "-i",
        "--infile",
        metavar="INPUT.txt",
        help="Input text file containing sentences per line",
        nargs="?",
    )
    parser.add_argument(
        "-c",
        "--category",
        help="Category of the input text corpus.",
        default="default",
        nargs="?",
    )
    return parser.parse_args(args)


class MSCFirestore:
    def __init__(self):
        cred = credentials.Certificate(
            "malayalam-speech-corpora-firebase-adminsdk-2dav1-46f57ee2b2.json"
        )
        firebase_admin.initialize_app(
            cred, {
                "databaseURL": "https://malayalam-speech-corpora.firebaseio.com",
                "storageBucket": "malayalam-speech-corpora.appspot.com"
            }
        )
        db = firestore.client()
        self.sentences = db.collection("sentences")
        self.speech = db.collection("speech")
        self.users = db.collection("users")

    def add_sentence(self, sentence, category):
        docs = self.sentences.where('sentence', '==', sentence).stream()
        exist = False
        for doc in docs:
            exist = True
            if category != doc.to_dict()['category']:
                print("[Edit] %s %s %s" % (doc.id, sentence, category))
                self.sentences.document(doc.id).set({
                        "sentence": sentence,
                        "category": category
                    })
            else:
                print("[Skip] %s %s %s" % (doc.id, sentence, category))

        if not exist:
            self.sentences.add({
                "sentence": sentence,
                "category": category
            })
            print("[Add] %s %s" % (sentence, category))

    def remove_sentence(self, key):
        self.sentences.child(key).delete()

def process_input_file(infile, category, dbref):
    with open(infile, "r") as file:
        for sentence in file:
            dbref.add_sentence(sentence.rstrip(), category)

def save_data(docs, outfile, keys):
    with open(outfile, "w") as tsvout:
        tsvout = csv.writer(tsvout, delimiter='\t')
        index=0
        for doc in docs:
            docDict=doc.to_dict()
            if index==0:
                tsvout.writerow(keys)
            values=[]
            for key in keys:
                if key=='id':
                    values.append(doc.id)
                else:
                    values.append(docDict.get(key,'default'))
            tsvout.writerow(values)
            index += 1
        print('Wrote {} items to {}'.format(index, outfile))

def download_samples():
    print('Downloading samples...')
    client = storage.bucket().client
    blobs = client.list_blobs('malayalam-speech-corpora.appspot.com', prefix='audio/')
    for blob in blobs:
        try:
            blob.download_to_filename(blob.name)
        except:
            pass

def main(args=None):
    options = parse_args(args)
    firestore = MSCFirestore()
    if options.infile:
        process_input_file(options.infile, options.category, firestore )
    else:
        sentences=firestore.sentences.stream()
        save_data(sentences, 'sentences.tsv', keys=['id', 'sentence', 'category'])
        speech=firestore.speech.stream()
        save_data(speech, 'speech.tsv', keys=['id', 'sentence', 'user', 'fileName','sample','time', 'vote'])
        users=firestore.users.stream()
        save_data(users, 'users.tsv', keys=['id', 'name', 'gender', 'ageGroup' ])
        # shutil.rmtree('audio', ignore_errors=True)
        # os.mkdir('audio')
        # download_samples()

if __name__ == "__main__":
    sys.exit(main())
