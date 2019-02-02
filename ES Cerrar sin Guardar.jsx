// Close Without Saving - Adobe Photoshop Script
// Description: closes the current document, all documents, or all except the current document, without saving
// Requirements: Adobe Photoshop CS2, or higher
// Version: 2.2.0, 9/July/2009
// Author: Trevor Morris (trevor@morris-photographics.com)
// Website: http://morris-photographics.com/
// ============================================================================
// Features include:
// Full-feature user interface
// Options include: close current document, all documents, or all except current document
// Tooltips/helptips available for all controls
// ============================================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
// ============================================================================
// AYUDA: permite cerrar los documentos abiertos en Photoshop sin guardar cambios.
// Incluye: cerrar diocumento actual, cerrar todos los documentos, o Cerrar todos excepto el actual.  
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
	// begin dialog layout
	var dlg = new Window('dialog');
	dlg.text = 'CERRAR SIN GUARDAR PRO';
	dlg.alignChildren = 'center';

		var options = dlg.add('panel');
		options.orientation = 'column';
		options.text = 'Opciones:';
		options.alignChildren = 'left';
		options.margins = 15;

			var allRB = options.add('radiobutton');
			allRB.text = '&Todos';
			allRB.helpTip = 'Cerrar todos los Documentos.';
			allRB.value = true;

			var inactiveRB = options.add('radiobutton');
			inactiveRB.text = 'Otros';
			inactiveRB.helpTip = 'Cerrar el resto de los Documentos.';

			var activeRB = options.add('radiobutton');
			activeRB.text = '&Actual';
			activeRB.helpTip = 'Cerrar el Documento actual.';

		var buttons = dlg.add('group');
		buttons.orientation = 'row';

			var okBtn = buttons.add('button');
			okBtn.text = 'OK';
			//okBtn.properties = {name: 'ok'};

			var cancelBtn = buttons.add('button');
			cancelBtn.text = 'Cancelar';
			//cancelBtn.properties = {name: 'cancel'};

	dlg.defaultElement = okBtn;
	dlg.cancelElement = cancelBtn;
	dlg.center();
	// end dialog layout

	// display dialog; continue if OK button was pressed (OK = 1, Cancel = 2)
	if (dlg.show() == 1) {
		if (inactiveRB.value) {
			closeInactiveDocuments();
		}
		else if (allRB.value) {
			closeAllDocuments();
		}
		else if (activeRB.value) {
			closeCurrentDocument();
		}
	}
}

///////////////////////////////////////////////////////////////////////////////
// closeInactiveDocuments - close all documents except the active document
///////////////////////////////////////////////////////////////////////////////
function closeInactiveDocuments() {
	var name = activeDocument.name;
	while (documents.length > 1) {
		for (var i = 0; i < documents.length; i++) {
			if (name != documents[i].name) {
				documents[i].close(SaveOptions.DONOTSAVECHANGES);
			}
		}
	}
}

///////////////////////////////////////////////////////////////////////////////
// closeAllDocuments - close all documents without saving changes
///////////////////////////////////////////////////////////////////////////////
function closeAllDocuments() {
	while (documents.length > 0) {
		activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	}
}

///////////////////////////////////////////////////////////////////////////////
// closeCurrentDocument - close the current document without saving
///////////////////////////////////////////////////////////////////////////////
function closeCurrentDocument() {
	activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}


///////////////////////////////////////////////////////////////////////////////
// isCorrectVersion - check for Adobe Photoshop CS2 (v9) or higher
///////////////////////////////////////////////////////////////////////////////
function isCorrectVersion() {
	if (parseInt(version, 10) >= 9) {
		return true;
	}
	else {
		alert('Este Script requiere una version posterior de Adobe Photoshop.', 'Wrong Version', false);
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
	if (confirm('Error desconocido.\n' +
		'Mas informacion?', true, 'Unknown Error')) {
			alert(err + ': on line ' + err.line, 'Script Error', true);
	}
}


// test initial conditions prior to running main function
if (isCorrectVersion() && isOpenDocs()) {
	try {
		main();
	}
	catch(e) {
		// don't report error on user cancel
		if (e.number != 8007) {
			showError(e);
		}
	}
}
