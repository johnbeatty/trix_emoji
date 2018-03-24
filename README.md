# Let’s Add an Emoji Converter to Trix with Stimulus

## Getting Started
We’ve been exploring using Stimulus to add interactivity to our apps. Let’s use Stimulus to watch for typing changes, and convert an [emoji short code](https://www.webpagefx.com/tools/emoji-cheat-sheet/) into the actual glyph, such as `:smiley:` to 😀 

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

## Installing Trix

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

You’ll want to add the webpacker stylesheet and javascript tags to `layouts/application.html.erb`:
```
<%= javascript_pack_tag 'application', 'data-turbolinks-track': 'reload' %>
<%= stylesheet_pack_tag 'application', 'data-turbolinks-track': 'reload' %>
```

And now we can add our Trix Editor to our html:

```
<trix-editor></trix-editor>
```

##  Adding Stimulus

Let’s add the proper annotations to our HTML for our Trix controller:

```
<trix-editor data-controller="emoji-converter" 
             data-target="emoji-converter.editor"></trix-editor>
```

The editor will be a target for the controller so that we can filter out events that might not correspond the current controller instance. Here is the code for the `emoji_converter_controller.js`:

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

When the controller connects to the dom, it starts listening for the trix-change event, which is fired after a change occurs in a trix editor. We make sure that the change is from our controller’s editor, and then we’ll scan through the text to look for the emoji shortcodes.