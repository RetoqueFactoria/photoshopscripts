// ============================================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
// 
// pfaffenbichler de ps-scripts.com sugiere el script
// pfaffenbichler 2015, use it at your own risk;
// ============================================================================

// enable double-clicking from Mac Finder or Windows Explorer

#target photoshop

if (app.documents.length > 0) {

var doc = app.activeDocument;
var selected = [];

var findReplaceString = prompt("Buscar:Reemplazar\nRenombra las Composiciones de Capas Seleccionadas.\nSi ninguna está seleccionada, todas serán procesadas.\n\n<< CASE Sensitive >>\nUse ' : ' as a separator.", "REEMPLAZAR ESTO:POR ESTO").split(":");

//Gather selected layer comps, if none selected, set collection to all layer comps
for (var m = 0; m < doc.layerComps.length; m++) {
if (doc.layerComps[m].selected == true) {	
selected.push(doc.layerComps[m]);
}
}

if (selected.length < 1) selected = doc.layerComps;

for (var m = 0; m < selected.length; m++) {
var CompName = selected[m].name.replace(findReplaceString[0], findReplaceString[1]);
selected[m].name = CompName;
}
};