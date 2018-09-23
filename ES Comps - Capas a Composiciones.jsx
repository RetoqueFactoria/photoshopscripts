// Layers to Comps - Adobe Photoshop Script 
// Description: Creates a layer comp for each layer in the current document
// Requirements: Adobe Photoshop CS, or higher
// Version: 1.1.0, 9/July/2009
// Author: Trevor Morris (trevor@morris-photographics.com)
// Website: http://morris-photographics.com/
// ============================================================================
// Installation:
// 1. Place script in 'C:\Program Files\Adobe\Adobe Photoshop CS#\Presets\Scripts\'
// 2. Restart Photoshop
// 3. Choose File > Scripts > Layers to Comps
// ============================================================================
//
// ============================================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
// ============================================================================

// enable double-clicking from Mac Finder or Windows Explorer
// this command only works in Photoshop CS2 and higher
#target Photoshop


// bring application forward for double-click events
app.bringToFront();

///////////////////////////////////////////////////////////////////////////////
// main - main function
///////////////////////////////////////////////////////////////////////////////
function main() {
	// declare local variables
	var doc = app.activeDocument;

	// check for groups (layer sets)
	if (doc.layerSets.length) {
		 alert('Este Script crea Composiciones de Capas desde Capas.\n' +
		 	'Las capas dentro de los grupos (conjuntos de capas) serán ignoradas.', 'Capas a Composiciones', false);
	}

	// check for existing comps; offer to delete them
	var comps = doc.layerComps.length;
	if (comps && confirm('El Documento ya contiene Composiciones de Capas ' + comps + ' Composiciones de Capas.\n' +
		'Te gustaría borrarlas antes de crear las nuevas Composiciones de Capas?', true, 'Eliminar Composiciones de Capas?')) {
			doc.layerComps.removeAll();
	}

	// save initial document state as a layer comp
	doc.layerComps.add('Estado Inicial', '', true, true, true);

	// hide layers; create comps
	hideAllLayers(doc);
	createLayerComps(doc);

	// apply 'Initial Conditions' comp to restore original document state
	doc.layerComps.getByName('Estado Inicial').apply();
}

///////////////////////////////////////////////////////////////////////////////
// hideAllLayers - set visibility of all layers to off
///////////////////////////////////////////////////////////////////////////////
function hideAllLayers(doc) {
	var len = doc.layers.length;
	for (var i = 0; i < len; i++) {
		doc.layers[i].visible = false;
	}
}

///////////////////////////////////////////////////////////////////////////////
// createLayerComps - create layer comps for all layers
///////////////////////////////////////////////////////////////////////////////
function createLayerComps(doc) {
	// declare local variables
	var compName = '';
	var compIndex = 1;
	var zeroPadding = 2;
	var layerIndex = doc.layers.length - 1;

	// loop through all layers to create comps
	for (layerIndex, compIndex; layerIndex >= 0; layerIndex--, compIndex++) {
		doc.layers[layerIndex].visible = true;
		compName = 'Comp ' + (compIndex + Math.pow(10, zeroPadding)).toString().substr(1);
		doc.layerComps.add(compName, '', true, true, true);
		doc.layers[layerIndex].visible = false;
	}
}

///////////////////////////////////////////////////////////////////////////////
// isCorrectVersion - check for Adobe Photoshop CS2 (v9) or higher
///////////////////////////////////////////////////////////////////////////////
function isCorrectVersion() {
	if (parseInt(version, 10) >= 9) {
		return true;
	}
	else {
		alert('Este script requiere Adobe Photoshop CS2 o superior.', 'Error de Versión', false);
		return false;
	}
}

///////////////////////////////////////////////////////////////////////////////
// isOpenDocs - ensure at least one document is open
///////////////////////////////////////////////////////////////////////////////
function isOpenDocs() {
	if (documents.length) {
		return true;
	}
	else {
		alert('No hay Documentos abiertos.', 'No hay Documentos', false);
		return false;
	}
}

///////////////////////////////////////////////////////////////////////////////
// hasLayers - ensure that the active document contains at least one layer
///////////////////////////////////////////////////////////////////////////////
function hasLayers() {
	var doc = activeDocument;
	if (doc.layers.length == 1 && doc.activeLayer.isBackgroundLayer) {
		alert('El Documentos activo no tiene Capas.', 'No hay Capas', false);
		return false;
	}
	else {
		return true;
	}
}

///////////////////////////////////////////////////////////////////////////////
// showError - display error message if something goes wrong
///////////////////////////////////////////////////////////////////////////////
function showError(err) {
	if (confirm('Un error desconocido a ocurrido.\n' +
		'Te gustaría ver más información?', true, 'Error desconocido')) {
			alert(err + ': en linea ' + err.line, 'Script Error', true);
	}
}


// test initial conditions prior to running main function
if (isCorrectVersion() && isOpenDocs() && hasLayers()) {
	try {
		// suspend history for CS3 (v10) or higher
		if (parseInt(version, 10) >= 10) {
			activeDocument.suspendHistory('Capas a Composiciones', 'main()');
		}
		// just run main for CS2 (v9)
		else {
			main();
		}
	}
	catch(e) {
		// don't report error on user cancel
		if (e.number != 8007) {
			showError(e);
		}
	}
}
