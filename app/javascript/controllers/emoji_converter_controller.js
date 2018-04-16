import { Controller } from "stimulus"

const CODES = {
  ":smiley:": "😀",
  ":stuck_out_tongue_winking_eye:": "😜",
  ":bowtie:": "🤵",
}

const PATTERN = new RegExp(Object.keys(CODES).join("|"))

export default class extends Controller {
  convert() {
    const { editor } = this.element
    const text = editor.getDocument().toString()

    text.replace(PATTERN, (code, offset) => {
      editor.setSelectedRange([offset, offset + code.length])
      editor.insertString(CODES[code])
    })
  }
}
