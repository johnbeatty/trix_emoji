import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["editor"]

  connect() {
    window.addEventListener("trix-change", this.trixChange.bind(this))
  }

  trixChange(event) {
    if (event.target == this.editorTarget) {
    }
  }
}