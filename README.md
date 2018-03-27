# Let’s Add an Emoji Converter to Trix with Stimulus

We’ve been exploring using Stimulus to add interactivity to our apps. Let’s use Stimulus to watch for typing changes, and convert an [emoji short code] into the actual glyph, such as `:smiley:` to 😀 

## Getting Started
I’ve [uploaded my code to Github], so you can follow along with an actual Rails project if you’re ever stuck, or ask me[ on twitter].

Let’s create a new rails app (using rails 5.2.0.rc2): 
```
rails new trix_emoji --webpack=stimulus
```

We’re going to add a controller called Documents and a show method on it. We need to add the appropriate routes in `routes.rb`.

```
Rails.application.routes.draw do
  resource :document
end
```

And the controller, `documents_controller.rb`:

```
class DocumentsController < ApplicationController 
  def show
  end
end
```

And we’ll add a view, `documents/show.html.erb`:

```
<h1>Trix Emoji Converter 2000</h1> 
```

## Configuring Trix With Yarn and Webpack

Let’s add Trix to our `package.json` file with Yarn:
```
$ yarn add trix
```

Then, we’ll add Trix to our webpack root file, `javascripts/packs/applications.js`:

```
import "trix/dist/trix.css";
import { Trix } from "trix"
```

The first line imports the CSS for the `trix-editor` element, and the next line imports the Javascript code that makes the editor run.

You’ll want to make sure to add the webpacker stylesheet and javascript tags to `layouts/application.html.erb`:
```
<%= javascript_pack_tag 'application', 'data-turbolinks-track': 'reload' %>
<%= stylesheet_pack_tag 'application', 'data-turbolinks-track': 'reload' %>
```

And now we can add our Trix Editor to our html:
```
<trix-editor></trix-editor>
```

## Adding Stimulus

Let’s add the proper annotations to our HTML for our Trix controller:
```
<trix-editor data-controller="emoji-converter" 
        data-target="emoji-converter.editor"></trix-editor>
```

The editor will be a target for the controller so that we can filter out events that might not correspond the current controller instance. Here is the skeleton code for the `emoji_converter_controller.js`:
```
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
```

When the controller connects to the dom, it starts listening for the `trix-change` event, which is fired after a change occurs in a trix editor. We make sure that the change is from our controller’s editor, and then we’ll scan through the text to look for the emoji short codes.

## Let’s Find those Short Codes :smiley:

Inside the `trixChange` function, we’ll go through every character of the editor’s text, and we’ll see if we find a short code. If we find a one, we’ll see if we have the short code to emoji mapping. If we have a mapping, we’ll replace the text, and stop scanning, because replacing the text is going to create another change event, which will allow us to look again very shortly.

Let’s add a small set of supported emojis to our controller, by creating a dictionary in our connect method:

```
  connect() {
    window.addEventListener("trix-change", this.trixChange.bind(this))
    this.supportedEmojis = {
      ":smiley:" : "😀",
      ":stuck_out_tongue_winking_eye:" : "😜",
      ":bowtie:" : "🤵",
    }
  }
```

Then in the change method, we’ll process each change and look for a short code.
```
  trixChange(event) {
    if (event.target == this.editorTarget) {
```

We’re going to get the text of the document from our editor:
```
      let stringDoc = this.editorTarget.editor.getDocument().toString()
```

We’ll set up some variables to keep track of what we’ve found as we go over the string:
```
      var foundItem = false
      var foundStart = -1
      var foundText = ""

      // Iterating over every 16 bit unicode character, 
      // since `for (var letter of stringDoc)` method won't work
      // in this particular situation.
      for (var count = 0; count<stringDoc.length; count++) {
```

We’ll look at every letter, and check to see if it’s a colon (:) character:
```
        let letter = stringDoc[count];
        if (letter == ":") {
          if (foundItem) {
            foundText += letter
```

If we found a supported emoji, we’ll replace the short code. Otherwise, we’ll ignore it, and keep looking. We also keep track of a new colon character, and any text we find between colons.
```
            let emoji = this.supportedEmojis[foundText]
            if (emoji) {
              this.editorTarget.editor.setSelectedRange([foundStart, count + 1])
              this.editorTarget.editor.insertString(emoji)
              return // break out and wait for next trix-change event
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
          // If we come across a space, it's not a supported emoji, so reset
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
```
And now Trix will convert short codes into Emoji!

This is a fun and simple example, but I imagine it could be used for more complicated interactivity, like looking for @username values, or automatically linking to anther project.

Again, You can find all the code on Github here: https://github.com/johnbeatty/trix\_emoji and let me know how it worked on twitter: https://twitter.com/@jpbeatty