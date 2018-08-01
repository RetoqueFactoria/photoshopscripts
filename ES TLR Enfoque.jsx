// TLR Contone Output Sharpening for CS3.js
// TLR Professional Sharpening Toolkit, Version 2.0
// (c) 2007, The Light's Right Studio, All Rights Reserved.
// http://www.thelightsrightstudio.com

// You may use this code freely for your own personal or professional use. You may not copy, upload, transmit,
// or share this code in any way without the express permission of the author.

// ============================================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: http://www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
// ============================================================================

//------------------------------- Global Constants for Setting User Preferences -------------------------------//

// Run without user interface
const suppressUI = false;

// Placement of the script's dialog window
const xoffset = 0;
const yoffset = 0;

// Default for layer mask
const useRevealAllLayerMask = true;

// Defaults for output options

// 80 dpi = 1, 150 dpi = 2, 200 dpi = 3, 267 dpi = 4, 300 dpi = 5, 400 dpi = 6;
const outputResolutionDefault = 5;

// Defaults for Preferences Checkboxes
const expertModeDefault = false;

// Defaults for Blend If Sliders
const lightBlendIf = [0, 0, 235, 250, 90, 90, 250, 250];
const darkBlendIf = [8, 16, 235, 250, 0, 0, 90, 90];

// Defaults for Highpass Filter Settings
const settingsHighpassFilter = [1.8, 1.8, 1.9, 1.8, 1.5, 1.6];

// Defaults for USM Filter Settings
const settingsUSM80 = [250, 0.8, 5];
const settingsUSM150 = [275, 0.8, 5];
const settingsUSM200 = [325, 0.7, 5];
const settingsUSM267 = [325, 0.7, 5];
const settingsUSM300 = [350, 0.6, 5];
const settingsUSM400 = [350, 0.6, 5];

//----------------------------- Global Constants for Localizing the User Interface ----------------------------//

const strUseExpertMode = 'Experto?: ';
const strCancelButton = 'CANCELAR';
const strOKButton = 'OK';
const strOutputResolution = 'Resolucion:     ';
const strOutputResolution1 = '80 dpi';
const strOutputResolution2 = '150 dpi';
const strOutputResolution3 = '200 dpi';
const strOutputResolution4 = '267 dpi';
const strOutputResolution5 = '300 dpi';
const strOutputResolution6 = '400 dpi';
const strNoActiveDocument = 'No hay Documentos Seleccionados.';
const strNoBackgroundLayer = 'El Documento Activo no tiene una verdadera Capa de Fondo.';
const strAllowedDocumentTypes = 'El Documento Activo debe estar en Modo RGB, CMYK, L*a*b, o Escala de Grices.';
const strLayerInsideLayerSet = 'El Documento Activo no puede estar dentro de un Grupo. Por favor cierra el Grupo antes de proceder.';
const strLayerIsLayerSet = 'La Capa Activa no puede estar dentro de un Grupo Abierto. Por favor cierra el Grupo antes de proceder.';
const strErrorMsgPart1 = 'Un error JavaScript inesperado ha ocurrido en ';
const strErrorMsgPart2 = '. Mensaje = ';
const strAdjustHighPassSettingsLight = 'Ajusta las Opciones del Filtro Paso Alto para el Halo Claro.';
const strAdjustHighPassSettingsDark = 'Ajusta las Opciones del Filtro Paso Alto para el Halo Oscuro.';
const strAdjustUSMSettingsLight = 'Ajusta las Opciones de la Mascara de Enfoque para el Halo Claro.';
const strAdjustUSMSettingsDark = 'Ajusta las Opciones de la Mascara de Enfoque para el Halo Oscuro.';
const strUnexpectedSharpeningValue = 'Valor inesperado. No se aplicara Enfoque.';

//-------------------------------------------------------------------------------------------------------------//


function createUI()
{

	// Create an empty dialog window near the center of the screen
	var dlg = new Window('dialog', 'TLR Enfoque Profesional');
	dlg.frameLocation = [xoffset, yoffset];
	dlg.spacing = 5;

	// Place static text labels at top of dialog window
	dlg.header1 = dlg.add('statictext', undefined, '  TLR Enfoque Profesional ');
	dlg.header2 = dlg.add('statictext', undefined, '');
	dlg.header3 = dlg.add('statictext', undefined, 'Version 2.0');
	dlg.spacer1 = dlg.add('statictext', undefined, '');
		
	// Add a panel for sharpening settings
	dlg.outputPnl = dlg.add('panel', undefined, '');
	dlg.outputPnl.orientation = 'column';
	dlg.outputPnl.alignChildren = 'left';
	
	// Add control to the panel
	with (dlg.outputPnl) {
		OutputResolution = dlg.outputPnl.add('group');
			OutputResolution.lblOutputResolution = OutputResolution.add('statictext', undefined, strOutputResolution);
			OutputResolution.lblOutputResolution.preferredSize = [75,15];
			OutputResolution.ddlOutputResolution = OutputResolution.add('dropdownlist', undefined, [strOutputResolution1, strOutputResolution2, strOutputResolution3,
																									strOutputResolution4, strOutputResolution5, strOutputResolution6]);
		ExpertMode = dlg.outputPnl.add('group');
			ExpertMode.lblExpertMode = ExpertMode.add('statictext', undefined, strUseExpertMode);
			ExpertMode.lblExpertMode.preferredSize = [75,15];
			ExpertMode.cbExpertMode = ExpertMode.add('checkbox', undefined, '');
	}

	// Add a panel for command buttons
	dlg.spacer2 = dlg.add('statictext', undefined, '');
	dlg.btnPnl = dlg.add('panel', undefined, '');
	dlg.btnPnl.orientation = 'row';
	
	// Add buttons to the panel
	dlg.btnPnl.cancelBtn = dlg.btnPnl.add('button', undefined, strCancelButton, {name:'cancel'});
	dlg.btnPnl.OKBtn = dlg.btnPnl.add('button', undefined, strOKButton, {name:'ok'});

	// Place static text labels at bottom of dialog window	
	dlg.spacer3 = dlg.add('statictext', undefined, '');
	dlg.footer1 = dlg.add('statictext', undefined, "  (c) 2007, The Light's Right Studio  ");
	dlg.footer2 = dlg.add('statictext', undefined, '    ');
	
	return dlg;	
}


function runUI(ui)
{
	// Initialize the UI
	initializeUI(ui);
	
	// Run the builder dialog
	if (checkAssumptions() == true) 
		if (suppressUI == true) app.activeDocument.suspendHistory('TLR Contone Output Sharpening','ui.btnPnl.OKBtn.notify();');
		else app.activeDocument.suspendHistory('TLR Contone Output Sharpening','ui.show();');
	else {
		ui.close(0);
	}
}


function initializeUI(ui)
{
	var moduleName = 'initializeUI';

	try {	
		if (app.documents.length == 0) {
			return;
		}
	
		var docRef = app.activeDocument;
		var psVersion = new String(app.version);
	
		// Set up initial control states
		with (ui) {
			header1.justify = 'center';
			header2.justify = 'center';
			header3.justify = 'center';
			footer1.justify = 'center';
			footer2.justify = 'center';
			btnPnl.OKBtn.enabled = true;
		}

		with (ui.outputPnl) {
			ExpertMode.cbExpertMode.value = expertModeDefault;
		}

		switch (outputResolutionDefault) {
			case 1: OutputResolution.ddlOutputResolution.selection = 0; break;
			case 2: OutputResolution.ddlOutputResolution.selection = 1; break;
			case 3: OutputResolution.ddlOutputResolution.selection = 2; break;
			case 4: OutputResolution.ddlOutputResolution.selection = 3; break;
			case 5: OutputResolution.ddlOutputResolution.selection = 4;	break;
			case 6: OutputResolution.ddlOutputResolution.selection = 5;	break;
		}

		// Attach event callback functions to controls
		with (ui.btnPnl) {
			cancelBtn.onClick = function() {ui.close(0);}
			OKBtn.onClick = 
				function(){
					var uiParamArray = new Array();
					uiParamArray = parseDialog(ui);
					
					// Perform remaining required tasks
					performOutputSharpening(uiParamArray, 'L');
					performOutputSharpening(uiParamArray, 'D');
					addLayerSet(uiParamArray);
					ui.close(1);
					return;
				}
	
		}
	}
	catch(someError)
	{
		alert( "An unexpected JavaScript error occurred in " +  moduleName + ". Message = " + someError.description);
		ui.close(0);
	}
}


function checkAssumptions(uiParamArray)
{
	var moduleName = 'checkAssumptions';

	try {	
		// Check that there is a loaded document
		if (app.documents.length == 0) {
			alert ('No hay Documentos Seleccionados.');
			return false;
		}
	
		// Check that there is a background layer
		var hasBackgroundLayer = false;
		for (var i = 0; i < app.activeDocument.artLayers.length; i++) {
			if (app.activeDocument.artLayers[i].isBackgroundLayer == true) hasBackgroundLayer = true;
		} 
		if (hasBackgroundLayer == false) {
			alert ('El documento aactivo no tiene una verdadera capoa de fondo.');
			return false;		
		}
		
		// Check if Bitmap, Duotone, Multichannel
		if ((app.activeDocument.mode == DocumentMode.BITMAP) || (app.activeDocument.mode == DocumentMode.DUOTONE) ||
			(app.activeDocument.mode == DocumentMode.MULTICHANNEL) || (app.activeDocument.mode == DocumentMode.INDEXEDCOLOR)) {
			alert ('El documento debe estar en modo RGB, CMYK, L*a*b, o Escala de Grises.');
			return false;					
		}
		
		// Check if layer is inside a layer set/group
		var layerParentName = app.activeDocument.activeLayer.parent.name;
		var documentName = app.activeDocument.name;
		if (layerParentName != documentName) {
			alert('La capa activa no puede estar dentro de un grupo de capas.');
			return false;
		}
		
		// Check if layer is an open layer set/group by creating a new layer and checking the parent
		
		// =======================================================
		var id259 = charIDToTypeID( "Mk  " );
			var desc66 = new ActionDescriptor();
			var id260 = charIDToTypeID( "null" );
				var ref44 = new ActionReference();
				var id261 = charIDToTypeID( "Lyr " );
				ref44.putClass( id261 );
			desc66.putReference( id260, ref44 );
		executeAction( id259, desc66, DialogModes.NO );
		// =======================================================
		layerParentName = app.activeDocument.activeLayer.parent.name;
		app.activeDocument.activeLayer.remove();
		if (layerParentName != documentName) {
			alert('La capa activa no puede ser un grupo abierto.');
			return false;
		}		
		
		return true;
	}
	catch(someError)
	{
		alert( "An unexpected JavaScript error occurred in " +  moduleName + ". Message = " + someError.description);
		ui.close(0);
	}
}


function parseDialog(ui)
{
	var moduleName = 'parseDialog';

	try {	

		// Parse information on the UI to determine sharpening settings to perform
		var outputResolutionString = '';
		var expertMode = false;	

		with (ui.outputPnl) {	
			outputResolutionString = OutputResolution.ddlOutputResolution.selection.toString();
			expertMode = ExpertMode.cbExpertMode.value;	
		}
		
		outputResolution = 0;
		switch (outputResolutionString) {
			case strOutputResolution1: outputResolution = 0; break;
			case strOutputResolution2: outputResolution = 1; break;
			case strOutputResolution3: outputResolution = 2; break;
			case strOutputResolution4: outputResolution = 3; break;
			case strOutputResolution5: outputResolution = 4; break;
			case strOutputResolution6: outputResolution = 5; break;
		}

		var uiParamArray = [outputResolution, expertMode];
						  	
		return uiParamArray;
	}
	catch(someError)
	{
		alert( "An unexpected JavaScript error occurred in " +  moduleName + ". Message = " + someError.description);
		ui.close(0);
	}
}


function performOutputSharpening(uiParamArray, layerType)
{
	var docRef = app.activeDocument;
	var moduleName = 'performSharpening';

	try {
			
		var outputResolution = uiParamArray[0];
		var expertMode = uiParamArray[1];
		
		docRef.activeChannels = docRef.componentChannels;
		
		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		mergeAllVisible();

		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		switch (layerType) {
			case 'L': setLayerProperties('Enfoque Claro', 'BLUE'); break;
			case 'D': setLayerProperties('Enfoque Oscuro', 'BLUE'); break;
		}

		// Turn On Dialogs, If Expert Mode
		if ((expertMode == true)  && (layerType == 'L')) alert(strAdjustUSMSettingsLight);
		if ((expertMode == true)  && (layerType == 'D')) alert(strAdjustUSMSettingsDark);
		if (expertMode == true) app.displayDialogs = DialogModes.ALL;

		// Change opacity to 65%
		docRef.activeLayer.opacity = 65;
	
		// Set Blend If settings
		switch (layerType) {
			case 'L': applyBlendIf(lightBlendIf); break;
			case 'D': applyBlendIf(darkBlendIf); break;
		}

		// Change blend mode to luminosity
		if ((app.activeDocument.mode == DocumentMode.RGB) || (app.activeDocument.mode == DocumentMode.CMYK) ||
			(app.activeDocument.mode == DocumentMode.LAB)) {
			docRef.activeLayer.blendMode = BlendMode.LUMINOSITY;
		}
		
		switch (outputResolution) {
			case 0: usmSettingsArray = settingsUSM80; break;
			case 1: usmSettingsArray = settingsUSM150; break;
			case 2: usmSettingsArray = settingsUSM200; break;
			case 3: usmSettingsArray = settingsUSM267; break;
			case 4: usmSettingsArray = settingsUSM300; break; 
			case 5: usmSettingsArray = settingsUSM400; break; 
		 	default: alert('Valor inesperado. No se aplicara enfoque.'); break;
		}

		var usmAmount = usmSettingsArray[0];
		var usmRadius = usmSettingsArray[1];
		var usmThreshold = usmSettingsArray[2];
		docRef.activeLayer.applyUnSharpMask(usmAmount, usmRadius, usmThreshold);
		
		// Fade to Luminosity Blend
		if ((app.activeDocument.mode == DocumentMode.RGB) || (app.activeDocument.mode == DocumentMode.CMYK) ||
			(app.activeDocument.mode == DocumentMode.LAB)) {
			fadeToLuminosity();
		}

		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Display Dialogs, If Expert Mode
		if ((expertMode == true)  && (layerType == 'L')) alert(strAdjustHighPassSettingsLight);
		if ((expertMode == true)  && (layerType == 'D')) alert(strAdjustHighPassSettingsDark);
		
		// Apply Highpass settings
		docRef.activeLayer.blendMode = BlendMode.OVERLAY;
		docRef.activeLayer.applyHighPass(settingsHighpassFilter[outputResolution]);

		// Turn Off Dialogs
		app.displayDialogs = DialogModes.NO;
		
		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Refresh app
		app.refresh();

		// Cleanup before returning
		docRef.activeChannels = docRef.componentChannels;
	}
	catch(someError)
	{
		alert( "An unexpected JavaScript error occurred in " +  moduleName + ". Message = " + someError.description);
		ui.close(0);
	}
}


function addLayerSet(uiParamArray)
{
	var docRef = app.activeDocument;
	var moduleName = 'addLayerSet';

	try {	
		// Use layer sets, if Photoshop CS
		var psVersion = new String(app.version);
		if ((psVersion.charAt(0) == '8') || (psVersion.charAt(0) == '9')|| ((psVersion.charAt(0) == '1') && (psVersion.charAt(1) == '0'))) {
			// Make new layer set and set properties, if PS CS version
			// =======================================================
			var id346 = charIDToTypeID( "Mk  " );
			var desc79 = new ActionDescriptor();
			var id347 = charIDToTypeID( "null" );
			var ref58 = new ActionReference();
			var id348 = stringIDToTypeID( "layerSection" );
			ref58.putClass( id348 );
			desc79.putReference( id347, ref58 );
			var id349 = charIDToTypeID( "Usng" );
			var desc80 = new ActionDescriptor();
			var id350 = charIDToTypeID( "Nm  " );
			desc80.putString( id350, "TLR Output Sharpening" );
			var id351 = charIDToTypeID( "Clr " );
			var id352 = charIDToTypeID( "Clr " );
			var id353 = charIDToTypeID( "Bl  " );
			desc80.putEnumerated( id351, id352, id353 );
			var id354 = stringIDToTypeID( "layerSection" );
			desc79.putObject( id349, id354, desc80 );
			executeAction( id346, desc79, DialogModes.NO );
			// =======================================================
			
			// Set reference to active layer set
			var layerSetRef = docRef.activeLayer;
			
			// Move layers into layer set
			layerRef = docRef.layers['Enfoque Claro'];
			layerRef.moveToEnd(layerSetRef);
			layerRef.visible = true;
			layerRef = docRef.layers['Enfoque Oscuro'];
			layerRef.moveToEnd(layerSetRef);
			layerRef.visible = true;
		}
	}
	catch(someError)
	{
		alert( "An unexpected JavaScript error occurred in " +  moduleName + ". Message = " + someError.description);
		ui.close(0);
	}
}


function applyBlendIf(blendIfSettings)
{
	var moduleName = 'applyBlendIf';

	ThisBlackLow = blendIfSettings[0];
	ThisBlackHigh = blendIfSettings[1];
	ThisWhiteLow = blendIfSettings[2];
	ThisWhiteHigh = blendIfSettings[3];
	UnderlyingBlackLow = blendIfSettings[4];
	UnderlyingBlackHigh = blendIfSettings[5];
	UnderlyingWhiteLow = blendIfSettings[6];
	UnderlyingWhiteHigh = blendIfSettings[7];

	try {
		// Code generated by ScriptListener
		// =======================================================
		var id1457 = charIDToTypeID( "setd" );
		var desc339 = new ActionDescriptor();
		var id1458 = charIDToTypeID( "null" );
		var ref262 = new ActionReference();
		var id1459 = charIDToTypeID( "Lyr " );
		var id1460 = charIDToTypeID( "Ordn" );
		var id1461 = charIDToTypeID( "Trgt" );
		ref262.putEnumerated( id1459, id1460, id1461 );
		desc339.putReference( id1458, ref262 );
		var id1462 = charIDToTypeID( "T   " );
		var desc340 = new ActionDescriptor();
		var id1463 = charIDToTypeID( "Blnd" );
		var list117 = new ActionList();
		var desc341 = new ActionDescriptor();
		var id1464 = charIDToTypeID( "Chnl" );
		var ref263 = new ActionReference();
		var id1465 = charIDToTypeID( "Chnl" );
		var id1466 = charIDToTypeID( "Chnl" );
		var id1467 = charIDToTypeID( "Gry " );
		ref263.putEnumerated( id1465, id1466, id1467 );
		desc341.putReference( id1464, ref263 );
		var id1468 = charIDToTypeID( "SrcB" );
		desc341.putInteger( id1468, ThisBlackLow );
		var id1469 = charIDToTypeID( "Srcl" );
		desc341.putInteger( id1469, ThisBlackHigh );
		var id1470 = charIDToTypeID( "SrcW" );
		desc341.putInteger( id1470, ThisWhiteLow );
		var id1471 = charIDToTypeID( "Srcm" );
		desc341.putInteger( id1471, ThisWhiteHigh );
		var id1472 = charIDToTypeID( "DstB" );
		desc341.putInteger( id1472, UnderlyingBlackLow );
		var id1473 = charIDToTypeID( "Dstl" );
		desc341.putInteger( id1473, UnderlyingBlackHigh );
		var id1474 = charIDToTypeID( "DstW" );
		desc341.putInteger( id1474, UnderlyingWhiteLow );
		var id1475 = charIDToTypeID( "Dstt" );
		desc341.putInteger( id1475, UnderlyingWhiteHigh );
		var id1476 = charIDToTypeID( "Blnd" );
		list117.putObject( id1476, desc341 );
		desc340.putList( id1463, list117 );
		var id1477 = charIDToTypeID( "Lefx" );
		var desc342 = new ActionDescriptor();
		var id1478 = charIDToTypeID( "Scl " );
		var id1479 = charIDToTypeID( "#Prc" );
		desc342.putUnitDouble( id1478, id1479, 333.333333 );
		var id1480 = charIDToTypeID( "Lefx" );
		desc340.putObject( id1477, id1480, desc342 );
		var id1481 = charIDToTypeID( "Lyr " );
		desc339.putObject( id1462, id1481, desc340 );
		executeAction( id1457, desc339, DialogModes.NO );
		// =======================================================
	}
	catch(someError)
	{
		alert( "An unexpected JavaScript error occurred in " +  moduleName + ". Message = " + someError.description);
		ui.close(0);
	}
}

function convertForSmartFilters()
{
	var moduleName = 'convertForSmartFilters';

	try {
		// =======================================================
		var id8 = stringIDToTypeID( "newPlacedLayer" );
		executeAction( id8, undefined, DialogModes.NO );
		// =======================================================
	}
	catch(someError)
	{
		alert( "An unexpected JavaScript error occurred in " +  moduleName + ". Message = " + someError.description);
		ui.close(0);
	}
}

function convertLayerToChannel()
{
	var moduleName = 'applyConvertLayerToChannel';

	try {
		var id218 = charIDToTypeID( "Mk  " );
		var desc57 = new ActionDescriptor();
		var id219 = charIDToTypeID( "Nw  " );
		var id220 = charIDToTypeID( "Chnl" );
		desc57.putClass( id219, id220 );
		var id221 = charIDToTypeID( "Usng" );
		var desc58 = new ActionDescriptor();
		var id222 = charIDToTypeID( "T   " );
		var ref25 = new ActionReference();
		var id223 = charIDToTypeID( "Chnl" );
		var id224 = charIDToTypeID( "Chnl" );
		var id225 = charIDToTypeID( "Gry " );
		ref25.putEnumerated( id223, id224, id225 );
		var id226 = charIDToTypeID( "Lyr " );
		var id227 = charIDToTypeID( "Ordn" );
		var id228 = charIDToTypeID( "Mrgd" );
		ref25.putEnumerated( id226, id227, id228 );
		desc58.putReference( id222, ref25 );
		var id229 = charIDToTypeID( "Src2" );
		var ref26 = new ActionReference();
		var id230 = charIDToTypeID( "Chnl" );
		var id231 = charIDToTypeID( "Chnl" );
		var id232 = charIDToTypeID( "Gry " );
		ref26.putEnumerated( id230, id231, id232 );
		desc58.putReference( id229, ref26 );
		var id233 = charIDToTypeID( "Clcl" );
		desc57.putObject( id221, id233, desc58 );
		executeAction( id218, desc57, DialogModes.NO );
	}
	catch(someError)
	{
		alert( "An unexpected JavaScript error occurred in " +  moduleName + ". Message = " + someError.description);
		ui.close(0);
	}
}

function fadeToLuminosity()
{
	// =======================================================
	var id14 = charIDToTypeID( "Fade" );
		var desc5 = new ActionDescriptor();
		var id15 = charIDToTypeID( "Opct" );
		var id16 = charIDToTypeID( "#Prc" );
		desc5.putUnitDouble( id15, id16, 65.000000 );
		var id17 = charIDToTypeID( "Md  " );
		var id18 = charIDToTypeID( "BlnM" );
		var id19 = charIDToTypeID( "Lmns" );
		desc5.putEnumerated( id17, id18, id19 );
	executeAction( id14, desc5, DialogModes.NO );
}

function getPSVersion()
{
	var psVersion = new String(app.version);
	return psVersion.charAt(0);
}

function mergeAllVisible()
{
	var moduleName = 'applyMergeAllVisible';

	try {
		// =======================================================
		var id836 = charIDToTypeID( "Mk  " );
			var desc233 = new ActionDescriptor();
			var id837 = charIDToTypeID( "null" );
				var ref196 = new ActionReference();
				var id838 = charIDToTypeID( "Lyr " );
				ref196.putClass( id838 );
			desc233.putReference( id837, ref196 );
		executeAction( id836, desc233, DialogModes.NO );
		
		// =======================================================
		var id839 = charIDToTypeID( "MrgV" );
			var desc234 = new ActionDescriptor();
			var id840 = charIDToTypeID( "Dplc" );
			desc234.putBoolean( id840, true );
		executeAction( id839, desc234, DialogModes.NO );
	}
	catch(someError)
	{
		alert( "An unexpected JavaScript error occurred in " +  moduleName + ". Message = " + someError.description);
		ui.close(0);
	}
}

function setLayerProperties(layerName, layerColor)
{
	colorCode = new String(layerColor);
	colorCode = colorCode.toUpperCase();
	var moduleName = 'setLayerProperties';


	try {
		// Code generated by ScriptListener
		// =======================================================
		var id50 = charIDToTypeID( "setd" );
			var desc17 = new ActionDescriptor();
			var id51 = charIDToTypeID( "null" );
				var ref1 = new ActionReference();
				var id52 = charIDToTypeID( "Lyr " );
				var id53 = charIDToTypeID( "Ordn" );
				var id54 = charIDToTypeID( "Trgt" );
				ref1.putEnumerated( id52, id53, id54 );
			desc17.putReference( id51, ref1 );
			var id55 = charIDToTypeID( "T   " );
				var desc18 = new ActionDescriptor();
				var id56 = charIDToTypeID( "Nm  " );
				desc18.putString( id56, layerName );
				var id57 = charIDToTypeID( "Clr " );
				var id58 = charIDToTypeID( "Clr " );
				switch (colorCode) {
					case 'RED': id59 = charIDToTypeID( "Rd  " ); break;
					case 'ORANGE': id59 = charIDToTypeID( "Orng" ); break;
					case 'YELLOW': id59 = charIDToTypeID( "Ylw " ); break;
					case 'GREEN': id59 = charIDToTypeID( "Grn " ); break;
					case 'BLUE': id59 = charIDToTypeID( "Bl  " ); break;
					case 'VIOLET': id59 = charIDToTypeID( "Vlt " ); break;
					case 'GRAY': id59 = charIDToTypeID( "Gry " ); break;
					 default: id59 = charIDToTypeID( "Clr " );
				}
				desc18.putEnumerated( id57, id58, id59 );
			var id60 = charIDToTypeID( "Lyr " );
			desc17.putObject( id55, id60, desc18 );
		executeAction( id50, desc17, DialogModes.NO );
		// =======================================================
	}
	catch(someError)
	{
		alert( "An unexpected JavaScript error occurred in " +  moduleName + ". Message = " + someError.description);
		ui.close(0);
	}
}

//--------------------MAIN SCRIPT--------------------//

// Create a reference to the UI
var ui = createUI();

// Display the UI and wait for user interaction
runUI(ui);

