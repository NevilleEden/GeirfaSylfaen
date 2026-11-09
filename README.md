# Geirfa Sylfaen

A flashcard and typing drill for the vocabulary of *Sylfaen y Gogledd*
(argraffiad 2025). It is the same app as the Geirfa vocabulary drill, with
a different word list and its own saved progress, so the two never mix.

## Features

- Flashcard mode and typed-answer mode, Welsh → English and English → Welsh
- Noun gender colour-coding (blue masculine, pink feminine)
- Forgiving English matching; Welsh answers must be exact
- "Struggling" and "mastered" flags saved in your browser
- Welsh pronunciation from Bangor University's Techiaith text-to-speech service

## Where the words come from

- The alphabetical glossary at the back of the book
- A few extra words that appear only in the unit vocabulary boxes

Genders and plurals are as printed in the book. Words marked "De Cymru" are
southern forms. Words with no gender shown were not given one in the book.

## Running it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

## Deploying to Vercel

Put this folder in a GitHub repository, then in Vercel choose
**Add New… → Project**, select the repository and click **Deploy**.
No settings need changing.

## Changing the word list

All the words are in the `WORDS` array near the top of `src/App.jsx`.
Add entries in the same style, save and redeploy.
