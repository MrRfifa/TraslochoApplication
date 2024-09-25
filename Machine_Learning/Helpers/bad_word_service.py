import os

class BadWordService:
    def __init__(self, directory):
        self.bad_words = self.load_bad_words(directory)

    def load_bad_words(self, directory):
        bad_words = {}
        for filename in os.listdir(directory):
            if filename.endswith('.txt'):
                lang = filename[:-4]  # Remove .txt to get the language name
                with open(os.path.join(directory, filename), 'r', encoding='utf-8') as file:
                    bad_words[lang] = {line.strip().lower() for line in file}
        return bad_words

    def contains_bad_words(self, review):
        review_words = set(review.lower().split())
        # Check against all loaded bad words from all languages
        return any(bad_word in review_words for lang in self.bad_words for bad_word in self.bad_words[lang])
