//  ==================================================
//  Layer Names Editor
//  by pattesdours
//  ==================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
//  ==================================================

#target photoshop
app.bringToFront();

// ensure that there is at least one document open
function docCheck() {
    if (!documents.length) {
        alert('No hay documentos abiertos.');
        return; // quit
    } layerNamesEditor();
}

docCheck();

// main script function
function layerNamesEditor()
{
   try
   {
   function findReplaceLayerName(obj,Find,Replace)
   {
      var regFind = new RegExp(Find,"gi");
      if(obj.artLayers.length>0)
      {
         for(var z = 0;z<obj.artLayers.length;z++)
         {
            var layer = obj.artLayers[z];
         if(!win.setsOnly.value){
            layer.name = layer.name.replace(regFind,Replace);
         }
         }
      if(obj.layerSets.length > 0)
      {
         for(var l=0;l<obj.layerSets.length;l++)
         {
            var lname = obj.layerSets[l].name.replace(regFind,Replace);          
          if(!win.layersOnly.value){
            obj.layerSets[l].name=lname;    
         }//layers Only
            findReplaceLayerName(obj.layerSets[l],Find,Replace);
         }
      }
   }
}

      // build dialog box
      var win = new Window("dialog{text:'Editor de Nombres de Capa',bounds:[100,100,510,420], \n" +
      "panel0:Panel{bounds:[210,10,400,120] , text:'Buscar y Reemplazar' ,properties:{borderStyle:'etched',su1PanelCoordinates:true}, \n" +
         "button0:Button{bounds:[110,70,180,90] , text:'Reemplazar' }, \n" +
         "statictext1:StaticText{bounds:[10,21,80,38] , text:'Buscar' ,properties:{scrolling:undefined,multiline:false}}, \n" +
         "statictext2:StaticText{bounds:[10,42,80,59] , text:'Reemplazar' ,properties:{scrolling:undefined,multiline:false}}, \n" +
         "edittext0:EditText{bounds:[80,19,170,39] , text:'' ,properties:{multiline:false,noecho:false,readonly:false}}, \n" +
         "edittext1:EditText{bounds:[80,41,170,61] , text:'' ,properties:{multiline:false,noecho:false,readonly:false}}}, \n" +
      "panel1:Panel{bounds:[210,130,400,240] , text:'Remover' ,properties:{borderStyle:'etched',su1PanelCoordinates:true}, \n" +
         "button1:Button{bounds:[110,70,180,90] , text:'Remover' }, \n" +
         "statictext7:StaticText{bounds:[10,20,180,70] , text:'Este comando remueve instanacias de < copy n>.' ,properties:{scrolling:undefined,multiline:true}}}, \n" +
      "button2:Button{bounds:[220,260,390,300] , text:'OK' }, \n" +
      "panel2:Panel{bounds:[10,200,200,310] , text:'Añadir Prefijo / Sufijo' ,properties:{borderStyle:'etched',su1PanelCoordinates:true}, \n" +
         "button3:Button{bounds:[110,70,180,90] , text:'Añadir' }, \n" +
         "statictext4:StaticText{bounds:[10,21,80,38] , text:'Prefijo' ,properties:{scrolling:undefined,multiline:false}}, \n" +
         "statictext5:StaticText{bounds:[10,44,80,61] , text:'Sufijo' ,properties:{scrolling:undefined,multiline:false}}, \n" +
         "edittext2:EditText{bounds:[80,19,170,39] , text:'' ,properties:{multiline:false,noecho:false,readonly:false}}, \n" +
         "edittext3:EditText{bounds:[80,41,170,61] , text:'' ,properties:{multiline:false,noecho:false,readonly:false}}}, \n" +
      "layersOnly:RadioButton{bounds:[20,43,170,64] , text:'Capas' }, \n" +
      "setsOnly:RadioButton{bounds:[20,66,170,87] , text:'Grupos' }, \n" +
      "both:RadioButton{bounds:[20,20,170,41] , text:'Capas y Grupos', properties:{selected:true}}, \n" +
      "panel3:Panel{bounds:[10,100,200,190] , text:'Seleccionar Elementos por Nombre' ,properties:{borderStyle:'etched',su1PanelCoordinates:true}, \n" +
         "edittext0:EditText{bounds:[10,20,171,40] , text:'' ,properties:{multiline:false,noecho:false,readonly:false}}, \n" +
         "button0:Button{bounds:[110,50,181,71] , text:'Buscar' }}};");


      win.both.value = true;

      // Find and replace command
      win.panel0.button0.onClick = function() {
         findReplaceLayerName(activeDocument,win.panel0.edittext0.text,win.panel0.edittext1.text);
         alert("Encontrar y Reemplazar completado!");
      }

       // Find and replace command (remove ' copy n' text)
      win.panel1.button1.onClick = function() {
      findReplaceLayerName(activeDocument, " copy( \\d+)?$", '')
      alert("Remover completado!");
      }
   
       // Add prefix/suffix command
       win.panel2.button3.onClick = function() {
      addPrefixSuffix(activeDocument, win.panel2.edittext2.text, win.panel2.edittext3.text);
      alert("Añadir Prefijo / Sufijo completado!");
      }

       // Select element by name command
       win.panel3.button0.onClick = function() {
     selectLayerByName(activeDocument, win.panel3.edittext0.text);
      alert("Seleccionar elemento por Nombre completado!");
      }   

      // show dialog
      win.center();
      win.show();

   } catch(e) {
      // if the script fails, give the user a reason
      alert("El Script falló con el siguiente error: \n\n"+ e);
   }
// Add Prefix/Suffix
function addPrefixSuffix(obj, layerNamePrefix, layerNameSuffix)
{
   
   if(obj.artLayers.length>0)
   {
      for(var z = 0;z<obj.artLayers.length;z++)
      {
         var layer = obj.artLayers[z];
       if(!win.setsOnly.value){
         layer.name = layerNamePrefix + layer.name + layerNameSuffix;
       }
      }
   }
   if(obj.layerSets.length > 0)
   {
      for(var l=0;l<obj.layerSets.length;l++)
      {
         var layer = obj.layerSets[l];
       if(!win.layersOnly.value){
         layer.name = layerNamePrefix + layer.name + layerNameSuffix;
       }
         addPrefixSuffix(obj.layerSets[l], layerNamePrefix, layerNameSuffix);
      }
   }
}

// find layer/layerset and select it
function selectLayerByName (sl_doc, tname)
{
   var dlayers = sl_doc.layers;
   var flAr = [];
   for (var ahk = 0; ahk < dlayers.length; ahk++)
   {
      flAr.push(dlayers[ahk]);
   }
   for (var ahi = 0;ahi < flAr.length;ahi++)
   {
      var tLayer = flAr[ahi];
      if (flAr[ahi].name == tname)
      {
         sl_doc.activeLayer = flAr[ahi];
         return true;
      }
   if (flAr[ahi].typename == 'LayerSet')
   {
      for (var ahj = 0; ahj < flAr[ahi].layers.length; ahj++)
      {
         flAr.push(flAr[ahi].layers[ahj]);
      }
   }
}

return false;
}
}

// run script