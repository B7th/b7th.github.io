# Box, Cast or any other name

## Directory

The directory goes as followed

    /
    /app.coffee  Starts the process, accesses the app.
    /private/    Holds raw information
    /protected/  Holds precompiled files if necessary
    /public/     Holds file for the public

Nothing else.

## Files

There is a limited amount of documents that get transformed into other ones.

md -> html
pug -> html
styl -> css
yml -> json
coffee -> js

Every other file is copied over as is.

Starting with an underscore (_), it won't be transferred, Those private documents are for other documents creation.

### md

.md documents will be turned to html with the use of top yml.

## Dynamic

So there is a dynamic part that is not yet made.

It will look like bbedit a little bit.

* Directory view on the left
* Current file name and directory on the top
* Editor at the bottom