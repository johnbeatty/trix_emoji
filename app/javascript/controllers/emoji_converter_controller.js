import { Controller } from "stimulus"

const CODES = {
  ":smiley:": "😀",
  ":stuck_out_tongue_winking_eye:": "😜",
  ":bowtie:": "🤵",
}

const PATTERN = new RegExp(Object.keys(CODES).join("|"))

export default class extends Controller {
  convert() {
    this.text.replace(PATTERN, (code, offset) => {
      this.editor.setSelectedRange([offset, offset + code.length])
      this.editor.insertString(CODES[code])
    })
  }

  get editor() {
    return this.element.editor
  }

  get text() {
    return this.editor.getDocument().toString()
  }
}
