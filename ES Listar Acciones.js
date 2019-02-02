// ============================================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
// ============================================================================
// AYUDA: “lista” las acciones que estén cargadas en Photoshop. 
// Permite exportar el detalle en un archivo de texto (log).
// ============================================================================

// ActionLister
//    This is a sample application that uses part of the Xtended ActionManger
//    APIs. This file contains all that is needed to examine the action sets
//    and actions loaded in the current runtime action palette.
//
//    While this demo app (the 'main' function) is interesting, I would expect
//    that the more typical use would be to read the runtime palette and use
//    that object to determine if needed action sets and actions have been
//    loaded. In CS/CS2, it could be part of a GUI where a user could select an
//    action to run on an image a some point during the execution of a script.
//    It's also useful as is if you just want to get an inventory of what
//    actions you have loaded. My CS installation, for instance, has 144 action
//    files loaded with a total of 1004 actions. Now, I can dump the string
//    that is built in 'main' to a file to help me get some idea of what I have
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

var app;
if (!app) app = this; // for PS7

// stock stuff
cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };
isPS7 = function() { return version.match(/^7\./); };

//================================= Action ====================================
Action = function() {
  var self = this;
  self.name = '';
  self.parent = null;
  return self;
};
Action.prototype.typename = "Action";
Action.prototype.getName       = function() { return this.name; };

Action.prototype.readRuntime = function(desc) {
  var self = this;

  // Name
  if (desc.hasKey(cTID("Nm  "))) {
    self.name = desc.getString(cTID("Nm  "));
  }

  return;
};

//================================ ActionSet ==================================
ActionSet = function() {
  var self = this;

  self.parent = null;
  self.name = '';
  self.count = 0;
  self.actions = [];
  return self;
};

ActionSet.prototype.typename = "ActionSet";

ActionSet.prototype.getName     = function(act) { return this.name; }
ActionSet.prototype.getCount    = function(act) { return this.count; }

ActionSet.prototype.getNames = function() {
  var self = this;
  var names = [];
  
  for (var i = 0; i < self.actions.length; i++) {
    var act = self.actions[i];
    names.push(act.name);
  }
  return names;
};
ActionSet.prototype.getByName = function(name) {
  var self = this;
  for (var i = 0; i < self.actions.length; i++) {
    var act = self.actions[i];
    if (act.name == name) {
      return act;
    }
  }
  return undefined;
};
ActionSet.prototype.byIndex = function(index) {
  var self = this;
  return self.actions[index];
};
ActionSet.prototype.readRuntime = function() {
  var self = this;
  var max = self.count;
  self.actions = [];

  for (var i = 1; i <= max; i++) {
    var ref = new ActionReference();
    ref.putIndex(cTID("Actn"), i);            // Action
    ref.putIndex(cTID("ASet"), self.index);   // ActionSet

    var desc = executeActionGet(ref);
    var act = new Action();
    act.index = i;
    act.readRuntime(desc);
    self.add(act);
  }
};
ActionSet.prototype.add = function(action) {
  var self = this;

  action.parent = self;
  self.actions.push(action);
  self.count = self.actions.length;
};


//============================ ActionsPalette =================================
//
// An ActionsPalette is a collection of ActionSets, either from the
// runtime palette or a palette file
//
ActionsPalette = function() {
  var self = this;

  self.name = app.name;
  self.count = 0;
  self.actionSets = [];
};
ActionsPalette.prototype.typename = "ActionsPalette";
ActionsPalette.prototype.getName    = function() { return this.name; };
ActionsPalette.prototype.getCount   = function() { return this.count; };

//
//
//
ActionsPalette.prototype.getNames = function() {
  var self = this;
  var names = [];
  
  for (var i = 0; i < self.actionSets.length; i++) {
    var as = self.actionSets[i];
    names.push(as.name);
  }
  return names;
};
ActionsPalette.prototype.getByName = function(name) {
  var self = this;
  for (var i = 0; i < self.actionSets.length; i++) {
    var as = self.actionSets[i];
    if (as.name == name) {
      return as;
    }
  }
  return undefined;
};
ActionsPalette.prototype.byIndex = function(index) {
  var self = this;
  return self.actionSets[index];
};
ActionsPalette.prototype.readRuntime = function() {
  var self = this;
  var i = 1;

  while (true) {
    var ref = new ActionReference();
    ref.putIndex(cTID("ASet"), i);    // ActionSet
    var desc;
    try {
      desc = executeActionGet(ref);
    } catch (e) {
      break;    // all done
    }
    var as = new ActionSet();
    as.parent = self;
    as.index = i;

    // Name
    if (desc.hasKey(cTID("Nm  "))) {
      as.name = desc.getString(cTID("Nm  "));
    }
    // NumberOfChildren
    if (desc.hasKey(cTID("NmbC"))) {
      as.count = desc.getInteger(cTID("NmbC"));
      as.readRuntime(i);
    }
    self.add(as);
    i++;
  }
  self.count = self.actionSets.length;
};
ActionsPalette.prototype.add = function(actionSet) {
  var self = this;
  actionSet.parent = self;
  self.actionSets.push(actionSet);
  self.count = self.actionSets.length;
};

//
// main()
//

function main() {
  var str = '';
  var pal = new ActionsPalette();
  var outfile = new File("/c/temp/actions.txt");

  //$.level = 1; debugger;
  pal.readRuntime();

  var totalActs = 0;
  var cnt = pal.getCount();
  
  for (var i = 0; i < cnt; i++) {
    var actset = pal.byIndex(i);
    str += '[' + actset.getName() + "]\r\n";
    acnt = actset.getCount();

    for (var j = 0; j < acnt; j++) {
      var act = actset.byIndex(j);
      str += '\t' + act.getName() + "\r\n";
      totalActs++;
    }
  }

  var totalStr =
      "Total de Sets de Acciones: " + i + "\r\n" +
      "Total de Acciones   : " + totalActs;

  // PS7 can't do alerts or confirms longer than 4 lines of text
  if (isPS7()) {
    if (!outfile.open()) {
      throw "Unable to open " + outfile + ": " + outfile.error;
    }
    outfile.writeln(totalStr);
    outfile.writeln(str);
    outfile.close();
    alert("Action list written to " + outfile);

  } else {
    var logwin = new LogWindow('LISTAR ACCIONES');
    logwin.append(totalStr);
    logwin.append(str);
    logwin.show();
  }
};

main();

"ActionLister.js"; // done

