# mBoxd provides dynamo-static content by watching files for changes
require('console-stamp')(console, 'HH:MM:ss.l')
engine = 
  requires:
    watch:   'node-watch'
    m2h:     new (require 'showdown').Converter()
    fs:      'fs'
    yaml:    'node-yaml'
    yml2js:  'js-yaml'
    glob:    'glob'
    express: 'express'
    touch:   'touch'
    log:     console.log
  options: 
    port:  2000
    from: 'private'
    via:  'protected'
    into: 'public'
    users:
      admin: "password"
  
  
    
  
  read: (name) =>
    @fs.readFileSync name, encoding: 'utf8'
  
  
  write: (name, content) =>
    return null unless content
    name = name.replace @from, @into;dir = name.replace /[^/]+$/, ''
    @fs.mkdirSync dir unless @fs.existsSync dir
    name = name.replace /\.[^+]$/, '/index.$1' if @fs.existsSync name.replace /\.[^+]$/, '/'
    @fs.writeFile name, content, (err) => @log "I don't get these'", err if err
    
    
  watch: (name) =>
    #Nothing to do
    try
      nameInto= name.replace @from, @into
      if /\/_/.test(name) or /\/\.DS/.test(name) or !@fs.existsSync(name)
        return null 
      if @fs.statSync(name).isDirectory()
        return null if !@fs.existsSync(nameInto)
        return @fs.mkdirSync nameInto
      ext = name.split('.').pop()
      unless this[ext]
        if !@fs.existsSync nameInto.replace /[^/]+\.[^/]+/, ''
          @fs.mkdirSync nameInto.replace /[^/]+\.[^/]+/, ''
        return @fs.copyFileSync name, nameInto
      #Let's gooo
      this[ext] name, engine.write
    catch e
      console.log e
    
  
  exts:
    coffee: (name, callback) ->
      #if name.match '.post.'
       # @touch.sync @base+'/app.coffee'
      compiler = require('coffeescript').compile;minifier = require('uglify-js').minify
      try content = compiler @fs.readFileSync name, encoding: 'utf8'
      catch e
        console.log e
      #content = minifier content
      callback name.replace('.coffee', '.js'), content
    
    
    md: (name, callback) -> 
      
      #Read mds
      try mds = @fs.readFileSync @via+'/mds.json', encoding: 'utf8'
      catch e
        @fs.writeFileSync @via+'/mds.json', '{}'
        mds = "{}"
      
      mds = JSON.parse mds
      
      #get Content
      content = @fs.readFileSync name, encoding: 'utf8'
      #get title
      content = content.split "\n"
      title = content.shift().replace '# ', ''
      content.shift() if content[0] is ""
      content = content.join "\n"
      post = {title:title,content:@m2h.makeHtml content}
      
      loc = name.replace(@from+'/', '').replace('.md', '').split '/'
      console.log loc
      mds[loc[0]] = {}                         if loc[0] isnt undefined and mds[loc[0]] is undefined
      mds[loc[0]][loc[1]] = {}                 if loc[1] isnt undefined and mds[loc[0]][loc[1]] is undefined
      mds[loc[0]][loc[1]][loc[2]] = {}         if loc[2] isnt undefined and mds[loc[0]][loc[1]][loc[2]] is undefined
      mds[loc[0]][loc[1]][loc[2]][loc[3]] = {} if loc[3] isnt undefined and mds[loc[0]][loc[1]][loc[2]][loc[3]] is undefined
            
      mds[loc[0]]=post                         unless loc[1]
      mds[loc[0]][loc[1]]=post                 unless loc[2]
      mds[loc[0]][loc[1]][loc[2]]=post         unless loc[3]
      mds[loc[0]][loc[1]][loc[2]][loc[3]]=post unless loc[4]
      
      
      @fs.writeFileSync @via+'/mds.json', JSON.stringify mds
      
      callback null
    
    
    pug: (name, callback, plural=false) ->
      pug = require 'pug'
      data = {}
      mds = {}
      try data= @yaml.readSync name.replace /\/[^/]+$/, '/data.yml' # Protect for errors
      try mds = JSON.parse @fs.readFileSync(@via+'/mds.json', encoding: 'utf8')
      catch e
        console.log e
      console.log mds
      content = @fs.readFileSync name, encoding: 'utf8'
      yml = content.replace /^---\n(.+)\n---\n(.+)$/s, '$1'
      unless yml is content
        content=content.replace "---\n"+yml+"\n---\n", ''
      yml = if yml is content then {} else @yaml.parse yml
      for key, val of yml
        if typeof val is "string" and val.match /\./
          lines = val.split /\./
          val = if lines[1] then data[lines[0]][lines[1]] else data[lines[0]]
        data[key] = val
      if plural
        dir = name.replace '.pugs', ''
        files = {}
        for branch,leaves of data[data.tree]
          data.branch = branch
          callback name.replace('.pugs','')+'/'+branch+'.html', pug.render content, document: data, filename: name
      else
        callback name.replace('.pug','.html'), pug.render(content, document: mds, filename:name),'html' #, plugins: [multiplePath imports]
    
    
    pugs: (name, callback) -> @pug name, callback, true
    
    
    styl: (name, callback=null) ->
      unless callback
        yml = name.replace /^---\n(.+)\n---\n(.+)$/s, '$1'
        yml = if yml is content then {} else @yaml.parse yml
        return yml
      
      styl = require 'stylus'
      nib  = require 'nib'
      render = (err, content) =>
        return console.log err if err
        callback name.replace('.styl','.css'), content
      content = @fs.readFileSync name, encoding: 'utf8'
      styl content
        .set 'filename', name
        .set 'paths', [name.replace /\/[^/]+$/, '/']
        .set 'compress', false
        .use nib()
        .import('nib')
        .render render
    
    
    yml: (name, callback) ->
      dir = name.replace /[^/]+$/, ''
      for file,i in @fs.readdirSync dir
        @touch.sync dir+file if file.match '.pug'
      if name.includes '_'
        callback null
      else
        callback name.replace('.yml','.json'), JSON.stringify (@yml2js.load @fs.readFileSync name, encoding: 'utf8')
      #data = @yaml.readSync filename
      #@log @base + 'data.yml'
      #if filename is @base + 'data.yml' # prime data.yml
        #@data = data
        #@log @data
  
  
  
  core: (options) =>
    for key, value of engine.requires
      this[key] = if typeof value is 'string' then require value else value
    @base = options.base or require.main.filename.replace /[^/]+$/, ''
    @data = {};try @data = @yaml.readSync @base + @options.from + '/data.yml'
    this[key]  = val for key,val of engine.exts
    @options = engine.options
    @options[key] = val for key,val of options
    @from = @base + '/' + @options.from;@into = @base + '/' + @options.into;@via = @base + '/' + @options.via
    app = @express()
    app.use require('body-parser').urlencoded(extended:true);app.use require('body-parser').json()
    auth = require('express-basic-auth')
      users:
        @options.users
      challenge: true
      realm: "toto"
    app.use( "/admin", [ auth, @express.static( @into + "/admin" ) ] );
    app.use @express.static @into, extensions: ['html'], index: 'index.html', redirect: false
    app.mboxd = this
    for post in @glob.sync @into+'/**/*.post.coffee'
      app.post post.replace(@from,'').replace('.post.coffee',''), require post
    
    # Is the following necessary?
    app.set    'views',@data.from
    app.engine 'pug',   engine.exts.pug.engine
    app.engine 'pug',  (filePath, @options, callback) -> null
    
    @watch @from, engine.watch
    
    app.listen @options.port, => @log 'Ready! Server on port %d', @options.port


engine.exts.pug.engine = ()->
  {}

module.exports = engine.core
module.exports[key] = val for key, val of engine
module.exports engine.options if require.main is module