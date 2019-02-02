// ============================================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
// ============================================================================
// AYUDA: “lista” las fuentes (aka: tipografías) que estén cargadas en Photoshop. 
// Permite exportar el detalle en un archivo de texto (log).
// ============================================================================

// FontLister
//   This returns a list of all of the information about fonts that can be
//   retrieved from the Photoshop runtime.
//
// FontList is the collection of Fonts found
// FontInfo is the information we have on each font. There are 4 properties:
//   FontInfo.name - the human readable name, as seen in the Font menu in PS
//   FontInfo.postscript - the name needed when you are scripting PS
//   FontInfo.family - the family of the font (e.g. Arial, Courier)
//   FontInfo.style - the style of the font (e.g. Bold, Italic, Regular)
//
// The demo app code (main) loads up the FontList and dumps the content to
// a CSV file.
//
// This has been successfully tested in CS and CS2.
//
// Note that this doesn't/can't work PS7 because there is not way to get to
// the information from JavaScript.
//
// $Id$
// Copyright: (c)2005, xbytor
// License: http://www.opensource.org/licenses/bsd-license.php
// Contact: xbytor@gmail.com
//
//
//
// LogWindow
// This is UI code that provides a window for logging information
//
// $Id$
// Copyright: (c)2005, xbytor
// License: http://www.opensource.org/licenses/bsd-license.php
// Contact: xbytor@gmail.com
//
//@show include
// ============================================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: http://www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
// ============================================================================


LogWindow = function LogWindow(title, bounds, text) {
  var self = this;

  self.title = (title || 'Log Window');
  self.bounds = (bounds || [100,100,740,580]);
  self.text = (text ? text : '');
  self.useTS = false;
  self.textType = 'edittext'; // or 'statictext'
  self.inset = 15;
  self.debug = false;

  LogWindow.prototype.textBounds = function() {
    var self = this;
    var ins = self.inset;
    var bnds = self.bounds;
    var tbnds = [ins,ins,bnds[2]-bnds[0]-ins,bnds[3]-bnds[1]-35];
    return tbnds; 
  }
  LogWindow.prototype.btnPanelBounds = function() {
    var self = this;
    var ins = self.inset;
    var bnds = self.bounds;
    var tbnds = [ins,bnds[3]-bnds[1]-35,bnds[2]-bnds[0]-ins,bnds[3]-bnds[1]];
    return tbnds; 
  }
  
  LogWindow.prototype.setText = function setText(text) {
    var self = this;
    self.text = text;
    //fullStop();
    if (self.win != null) {
      try { self.win.log.text = self.text; } catch (e) {}
    }
  }
  LogWindow.prototype.init = function(text) {
    var self = this;
    if (!text) text = '';
    self.win = new Window('dialog', self.title, self.bounds);
    var win = self.win;
    win.owner = self;
    win.log = win.add(self.textType, self.textBounds(), text,
                                {multiline:true});
    win.btnPanel = win.add('panel', self.btnPanelBounds());
    var pnl = win.btnPanel;
    pnl.okBtn = pnl.add('button', [15,5,115,25], 'OK', {name:'ok'});
    pnl.clearBtn = pnl.add('button', [150,5,265,25], 'LIMPIAR', {name:'clear'});
    if (self.debug) {
      pnl.debugBtn = pnl.add('button', [300,5,415,25], 'Debug',
                             {name:'debug'});
    }
    pnl.saveBtn = pnl.add('button', [450,5,565,25], 'GUARDAR .log', {name:'save'});
    self.setupCallbacks();
  }
  LogWindow.prototype.setupCallbacks = function() {
    var self = this;
    var pnl = self.win.btnPanel;
    
    pnl.okBtn.onClick = function()    { this.parent.parent.owner.okBtn(); }
    pnl.clearBtn.onClick = function() { this.parent.parent.owner.clearBtn(); }
    if (self.debug) {
      pnl.debugBtn.onClick = function() {
        this.parent.parent.owner.debugBtn();
      }
    }
    pnl.saveBtn.onClick = function()  { this.parent.parent.owner.saveBtn(); }
  }
  LogWindow.prototype.okBtn    = function() { this.close(1); }
  LogWindow.prototype.clearBtn = function() { this.clear(); }
  LogWindow.prototype.debugBtn = function() { $.level = 1; debugger; }
  LogWindow.prototype.saveBtn    = function() {
    var self = this;
    // self.setText(self.text + self._prefix() + '\r\n');
    self.save();
  }

  LogWindow.prototype.save = function() {
    try {
      var self = this;
      var f = LogWindow.selectFileSave("Log File",
                                       "Log file:*.log,All files:*",
                                       "/c/temp");
      if (f) {
        f.open("w") || throwError(f.error);
        try { f.write(self.text); }
        finally { try { f.close(); } catch (e) {} }
      }
    } catch (e) {
      alert(e.toSource());
    }
  }
  
  LogWindow.prototype.show = function(text) {
    var self = this;
    if (self.win == undefined) {
      self.init();
    }
    self.setText(text || self.text);
    return self.win.show();
  }
  LogWindow.prototype.close = function(v) {
    var self = this;
    self.win.close(v);
    self.win = undefined;
  }
  LogWindow.prototype._prefix = function() {
    var self = this;
    if (self.useTS) {
      return LogWindow.toISODateString() + "$ ";
    }
    return '';
  }
  LogWindow.prototype.prefix = LogWindow.prototype._prefix;
  LogWindow.prototype.append = function(str) {
    var self = this;
    self.setText(self.text + self.prefix() + str + '\r\n');
  }
  LogWindow.prototype.clear = function clear() {
    this.setText('');
  }

  LogWindow.toISODateString = function (date) {
    if (!date) date = new Date();
    var str = '';
    function _zeroPad(val) { return (val < 10) ? '0' + val : val; }
    if (date instanceof Date) {
      str = date.getFullYear() + '-' +
      _zeroPad(date.getMonth()+1) + '-' +
      _zeroPad(date.getDate()) + ' ' +
      _zeroPad(date.getHours()) + ':' +
      _zeroPad(date.getMinutes()) + ':' +
      _zeroPad(date.getSeconds());
    }
    return str;
  }

 LogWindow.selectFileSave = function(prompt, select, startFolder) {
   var oldFolder = Folder.current;
   if (startFolder) {
     if (typeof(startFolder) == "object") {
       if (!(startFolder instanceof "Folder")) {
         throw "Folder object wrong type";
       }
       Folder.current = startFolder;
     } else if (typeof(startFolder) == "string") {
       var s = startFolder;
       startFolder = new Folder(s);
       if (startFolder.exists) {
         Folder.current = startFolder;
       } else {
         startFolder = undefined;
         // throw "Folder " + s + "does not exist";
       }
     }
   }
   var file = File.saveDialog(prompt, select);
   //alert("File " + file.path + '/' + file.name + " selected");
   if (Folder.current == startFolder) {
     Folder.current = oldFolder;
   }
   return file;
 };
};

LogWindow.open = function(str, title) {
  var logwin = new LogWindow(title, undefined, str);
  logwin.show();
  return logwin;
};

function throwError(e) {
  throw e;
};

"LogWindow.js";
// EOF


//
var app; if (!app) app = this; // for PS7

// stock stuff
cTID  = function(s) { return app.charIDToTypeID(s); };
sTID  = function(s) { return app.stringIDToTypeID(s); };
isPS7 = function()  { return version.match(/^7\./); };

FontInfo = function() {
  var self = this;
  self.typename = "FontInfo";

  self.name = '';
  self.postscript = '';
  self.family = '';
  self.style = '';
};

FontList = function() {
  var self = this;
  self.typename = "FontList";

  self.length = 0;
};

//FontList.prototype = new Array();  doesn't work in CS

FontList.prototype.push = function(fi) {
  var self = this;
  self[self.length++] = fi;
};

FontList.prototype.loadFonts = function() {
  var self = this;

  var appDesc = FontList.getAppInfo();
  var fontList = appDesc.getObjectValue(sTID("fontList")); // can't work in PS7

  var keyFontName  = cTID("FntN");
  var keyStyleName = cTID("FntS");

  var names    = fontList.getList(keyFontName);
  var psnames  = fontList.getList(sTID("fontPostScriptName"));
  var families = fontList.getList(sTID("fontFamilyName"));
  var styles   = fontList.getList(keyStyleName);

  var max = names.count;

  for (var i = 0; i < max; i++) {
    var fi = new FontInfo();

    fi.name       = names.getString(i);
    fi.postscript = psnames.getString(i);
    fi.family     = families.getString(i);
    fi.style      = styles.getString(i);
    
    self.push(fi);
  }
};

//
// FontList.getByName
// Search for a FontInfo from the list. If 'name' is a string, the first font
// with that exact name will be returned. If 'name' is a regular expression,
// it will return the first match to that regular expression. If 'all' is
// additionally set to true, it will return all fonts that match.
//
FontList.prototype.getByName = function(name, all) {
  var self = this;

  // check for a bad index
  if (!name) throw "'undefined' is an invalid name/index";

  var matchFtn;

  if (name instanceof RegExp) {
    matchFtn = function(s1, re) { return s1.match(re) != null; }
  } else {
    matchFtn = function(s1, s2) { return s1 == s2;  }
  }

  var obj = [];

  for (var i = 0; i < container.length; i++) {
    if (matchFtn(self[i].name, name)) {
      if (all != true) {
        return self[i];     // there can be only one
      }
      obj.push(self[i]);    // add it to the list
    }
  }

  return all ? obj : undefined;
};

//
//
// FontList.getAllByName
// Returns all fonts in the list that match the specified name
//
FontList.prototype.getAllByName = function(name) {
  return this.getByName(name, true);
};

FontList.prototype.asString = function() {
  var self = this;
  var str = '';
  var csvHeader = "Nombre, PostScript, Familia, Estilo";

  str += csvHeader + "\r\n";
  for (var i = 0; i < self.length; i++) {
    var fnt = self[i];
    str += fnt.name + ',' +
      fnt.postscript + ',' +
      fnt.family + ',' +
      fnt.style + '\r\n';
  }
  return str;
};

FontList.prototype.writeToCSV = function(file) {
  var self = this;
  file.writeln(self.asString());
};

FontList.getAppInfo = function() {
  var classApplication = cTID("capp");
  var typeOrdinal      = cTID("Ordn");
  var enumTarget       = cTID("Trgt");

  var ref = new ActionReference();
  ref.putEnumerated(classApplication, typeOrdinal, enumTarget);
  return app.executeActionGet(ref);
};

throwError = function(e) { throw e; };

function main() {
  if (isPS7()) {
    alert("Este SCRIPT no corre en versiones anteriores a PS7.");
    return;
  }
  var fl = new FontList();
  fl.loadFonts();
  
  var logwin = new LogWindow('LISTAR FUENTES');
  logwin.append(fl.asString());
  logwin.show();
};

main();

"FontLister.js";
// EOF

