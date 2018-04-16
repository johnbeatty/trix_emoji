import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    this.supportedEmojis = {
      ":smiley:" : "😀",
      ":stuck_out_tongue_winking_eye:" : "😜",
      ":bowtie:" : "🤵",
    }
  }

  convert() {
    let stringDoc = this.element.editor.getDocument().toString()

    var foundItem = false
    var foundStart = -1
    var foundText = ""

    // Instead iterating over every 16 bit unicode character,
    // since for (var letter of stringDoc) method won't work.
    // Trix isn't accounting for emojis peculiar unicode syntax
    for (var count = 0; count<stringDoc.length; count++) {
      let letter = stringDoc[count];

      if (letter == ":") {
        if (foundItem) {
          foundText += letter

          let emoji = this.supportedEmojis[foundText]
          if (emoji) {
            this.element.editor.setSelectedRange([foundStart, count + 1])
            this.element.editor.insertString(emoji)
            return // break out and wait for next 'trix-change' event
          } else {
            foundItem = false
            foundStart = -1
            foundText = ""
          }
        } else {
          foundItem = true
          foundStart = count
          foundText = letter
        }
      } else if (foundItem) {
        // If we come across a space, it's not a supported emoji
        if (letter == " ") {
          foundItem = false
          foundStart = -1
          foundText = ""
        } else {
          foundText += letter
        }
      }

    }
  }
}
