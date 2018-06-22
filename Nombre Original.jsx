// (c) Copyright 2008.  Adobe Systems, Incorporated.  All rights reserved.
// ============================================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: http://www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
/*
@@@BUILDINFO@@@ OpenAsLayer.jsx 1.1.0.0
*/

var begDesc = "$$$/JavaScripts/OpenAsLayer/Description=Assign this to the open document event. This will promote a document with only a background layer to a layer with the document name." // endDesc


// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

var stripExtension = true;

if ( app.documents.length > 0 ) {
	var doc = activeDocument;
	if ( doc.layers.length == 1 && doc.activeLayer.isBackgroundLayer ) {
		doc.activeLayer.isBackgroundLayer = false;
		var docNameNoExtension = doc.name;
		if (stripExtension) {
			var extensionIndex = docNameNoExtension.lastIndexOf (".");
			if (extensionIndex != -1) {
				docNameNoExtension = docNameNoExtension.substr(0, extensionIndex);
			}
		}
		doc.activeLayer.name = docNameNoExtension;
	}
}
