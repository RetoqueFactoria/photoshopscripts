// Rename Layers - Adobe Photoshop Script
// Requirements: Adobe Photoshop CS2, or higher
// Description: renames and numbers all layers in the active document (using the supplied name pattern)
// Version: 1.8.1, 5/June/2010
// Author: Trevor Morris (trevor@morris-photographics.com)
// Website: http://morris-photographics.com/
// ============================================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
// ============================================================================
// AYUDA: permite ingresar un Patrón de Renombrado que se utilizará en todas las Capas. 
// Por ejemplo, ingresa “Banner” para renombrar las Capas como “Banner 001”, “Banner 002”, etc.
// ============================================================================

// enable double-clicking from Mac Finder or Windows Explorer
// this command only works in Photoshop CS2 and higher
#target photoshop

// bring application forward for double-click events
app.bringToFront();

///////////////////////////////////////////////////////////////////////////////
// main - main function
///////////////////////////////////////////////////////////////////////////////
function main() {
	// user settings
	var prefs = new Object();
	prefs.countFrom     = 1;   // number to start counting from (default: 1)
	prefs.zeroPadding   = 3;   // number of digits to use for the layer number (defaul: 3)
	prefs.nameSeparator = ' '; // character to insert between the layer name and number (default: ' ')
	prefs.topToBottom   = false; // rename layers top to bottom (true) or bottom to top (false)

	// prompt for layer name
	prefs.layerPattern = prompt('Ingresa el patron de renombrado que se utilizara en todas las Capas.\n' +
		'Por ejemplo, ingresa "Banner" para renombrar las Capas como "Banner 001", "Banner 002", etc.', 'Banner');

	// rename layers
	if (prefs.layerPattern) {
		renameLayers(activeDocument, prefs);
	}
}

///////////////////////////////////////////////////////////////////////////////
// renameLayers - rename layers, top to bottom, or bottom to top
///////////////////////////////////////////////////////////////////////////////
function renameLayers(ref, prefs) {
	// declare local variables
	var len = ref.layers.length;

	// rename layers top to bottom
	if (prefs.topToBottom) {
		for (var i = 0; i < len; i++) {
			rename();
		}
	}
	// rename layers bottom to top
	else {
		for (var i = len - 1; i >= 0; i--) {
			rename();
		}
	}

	// rename - rename layer
	function rename() {
		var layer = ref.layers[i];
		var vis = layer.visible;

		// check for groups
		if (layer.typename == 'LayerSet') {
			renameLayers(layer, prefs);
		}
		// rename layer
		else {
			layer.name = prefs.layerPattern + prefs.nameSeparator +
				(prefs.countFrom + Math.pow(10, prefs.zeroPadding)).toString().substr(1);
			if (!vis) {
				layer.visible = false;
			}
			prefs.countFrom++;
		}
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
		alert('This script requires Adobe Photoshop CS2 or higher.', 'Wrong Version', false);
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
		alert('No hay documentos abiertos.', 'No Documents Open', false);
		return false;
	}
}

///////////////////////////////////////////////////////////////////////////////
// showError - display error message if something goes wrong
///////////////////////////////////////////////////////////////////////////////
function showError(err) {
	if (confirm('Error.\n' +
		'Mas informacion?', true, 'Unknown Error')) {
			alert(err + ': on line ' + err.line, 'Script Error', true);
	}
}


///////////////////////////////////////////////////////////////////////////////
// test initial conditions prior to running main function
///////////////////////////////////////////////////////////////////////////////
if (isCorrectVersion() && isOpenDocs()) {
	try {
		// suspend history for CS3 (v10) or higher
		if (parseInt(version, 10) >= 10) {
			activeDocument.suspendHistory('Rename Layers', 'main()');
		}
		// just run main for CS2 (v9)
		else {
			main();
		}
	}
	catch(e) {
		if (e.number != 8007) { // don't report error on user cancel
			showError(e);
		}
	}
}
