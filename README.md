# Let’s Add an Emoji Converter to Trix with Stimulus

##Getting Started
We’ve been exploring using Stimulus to add interactivity to our apps. Let’s use Stimulus to watch for typing changes, and convert an [emoji short code] into the actual glyph, such as `:smiley:` to 😀 

Let’s create a new rails app (using rails 5.2.0.rc2): 
'' rails new trix_emoji --webpack=stimulus

We’re going to add a controller called Documents and a show method on it. We need to add the appropriate routes in `routes.rb`.

'' Rails.application.routes.draw do
''   resource :document
'' end

And the controller, `documents_controller.rb`:

'' class DocumentsController < ApplicationController 
''   def show
''   end
'' end

And we’ll add a view, `documents/show.html.erb`:

'' <h1>Trix Emoji Converter 2000</h1> 

##Installing Trix

Let’s add Trix to our `package.json` file with Yarn:

'' $ yarn add trix

Then, we’ll add Trix to our webpack root file, `javascripts/packs/applications.js`:

'' import "trix/dist/trix.css";
'' import { Trix } from "trix"

The first line imports the CSS for the `trix-editor` element, and the next line imports the Javascript code that makes the editor run.

You’ll want to add the webpacker stylesheet and javascript tags to `layouts/application.html.erb`:
'' <%= javascript_pack_tag 'application', 'data-turbolinks-track': 'reload' %>
'' <%= stylesheet_pack_tag 'application', 'data-turbolinks-track': 'reload' %>

And now we can add our Trix Editor to our html:

'' <trix-editor></trix-editor>

