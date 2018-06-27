/*
<javascriptresource>
<about>$$$/JavaScripts/ExifData/About=JJMack's ExifData.^r^rCopyright 2009 Mouseprints.^r^rScript utility for action.^rNOTE:Adds Text layer with EXIF data!</about>
<category>JJMack's Action Utility</category>
</javascriptresource>
*/

// enable double-clicking from Mac Finder or Windows Explorer
#target photoshop // this command only works in Photoshop CS2 and higher

// bring application forward for double-click events
app.bringToFront();

// ensure at least one document open
if (!documents.length) {
	alert('There are no documents open.', 'No Document');
}

// if at least one document exists, then proceed
else {
	main();
}

///////////////////////////////////////////////////////////////////////////////
// main - main function
///////////////////////////////////////////////////////////////////////////////
function main() {

	/* Variables You can hard code your business owner here */
        /*  sizeFactor influences text size 1 will use largest font 2 will half that font size	*/
	var sizeFactor = 1;
        /* textX and TextY positions text placement 0 and 0 Top Left corner of image in pixels	*/
	var textX = 200;									
	var textY = 200;	
	/* Internal Photoshop Text name								*/								
        var fontName = "ArialMT";
	var fontName = "TimesNewRomanPSMT"
	/* Text Color										*/
	textColor = new SolidColor;						
	textColor.rgb.red = 0;
	textColor.rgb.green = 0;
	textColor.rgb.blue = 0;
	/* END Variables You can hard code your business owner here */

        // remember users Ruler avd Type Units and set ours
	var strtRulerUnits = app.preferences.rulerUnits; 
	var strtTypeUnits = app.preferences.typeUnits; 
	app.preferences.rulerUnits = Units.PIXELS;
 	app.preferences.typeUnits = TypeUnits.PIXELS; 

	/* Trying to figure out font size for the number of lines to cover the document height		*/
	/* and getting setting text area to cover the document was a trip. Adobe Postscript trip	*/
	/* I believe that 72 or 72.27 Point/Pica Size Photoshop Preference maybe I should see if	*/
	/* I could retrieve it. Anyway mine is set to 72 Setting the document resolution taking		*/
	/* the document width and dividing by 72 would probably yield number of characters that		*/
	/* would fit in the document width. Setting the documents resolution comes into play		*/
	/* with Photoshop text support. Using the documents height and dividing the by the number	*/
	/* of lines of text I needed I hoped would yield the font size I needed. However that		*/
	/* did not work the text area was correct the number of text lines did not fit. I needed	*/
	/* to use a smaller font.  When the document resolution is set to 72 DPI and I set a text	*/
	/* layer font size to 72 and the text area the number of pixels I want and observing		*/
	/* Photoshop's text options bar there I see a one 1 to one relationship. 72 px = 72 px.		*/
	/* If I set the documents resolution lower and set a Photoshop text layer font size to		*/
	/* 72 px I see Photoshop scale the number to a lower number of pixels in the option bar.	*/
	/* Just what I needed. Setting the Documents resolution to 60 DPI let the number of line	*/
	/* I needed fit on the document. However Photoshop also scaled the text area I set down		*/
	/* in size and that number of lines did not fit within that area. I needed to scale the		*/
	/* text area up. Scaling the Text area up using 72/resolution did the trick... 			*/ 
        var testres = 60;
	res = app.activeDocument.resolution;
	if(res!=testres){ app.activeDocument.resizeImage(app.activeDocument.width.value,app.activeDocument.height.value,testres); }
 

	try {   // get active document
		var doc = app.activeDocument; 
	} 
	catch (e){ 
		alert("No Document Open..." ); 
	}
 
	var exifInfo = ""; 
	
try { 
		// alert( "doc.info.exif=" + doc.info.exif ); 
		var numExifItems = doc.info.exif.length; 
		// alert( "numExifItems=" + numExifItems ); 
                for (var i = 0; i < doc.info.exif.length; i++){ 
			exifInfo = exifInfo + doc.info.exif[i][0] + " = " + doc.info.exif[i][1] + "\r";
		} 
	} 
	catch (e){ 
		alert("No EXIF data exists..." ); 
	} 


	if ( exifInfo == "" ) {
		alert( "No EXIF data exists..." );
	} 
	else {
		// alert( "exifInfo=" + exifInfo );

		text_layer = doc.artLayers.add();						// Add a Layer
		text_layer.name = "EXIF Data";							// Name Layer
		text_layer.kind = LayerKind.TEXT;						// Make Layer a Text Layer
		text_layer.textItem.color = textColor;						// set text layer color 
		text_layer.textItem.kind = TextType.PARAGRAPHTEXT;				// Set text layers text type
		text_layer.textItem.font = fontName;						// set text font
		text_layer.blendMode = BlendMode.NORMAL						// blend mode
		text_layer.textItem.fauxBold = false;						// Bold
		text_layer.textItem.fauxItalic = false;						// Italic
		text_layer.textItem.underline = UnderlineType.UNDERLINEOFF;			// Underlibn
		text_layer.textItem.capitalization = TextCase.NORMAL;				// Case
		text_layer.textItem.antiAliasMethod = AntiAlias.SHARP;				// antiAlias

		var fontSize = Math.round((doc.height- textY) / ((numExifItems +1) * sizeFactor)); // Calulate font size to use Item nomber + last \r
		if (fontSize<10){fontSize=10};							// don't use Font size smaller then 10
		text_layer.textItem.size = fontSize;						// set text font Size

		text_layer.textItem.position = Array(textX, textY );				// set text layers position in and down 
		textWidth = ((doc.width - textX) * 72/testres );				// Text width document width - offset
		textHeight = ((doc.height - textY) * 72/testres );				// Text height document height - offset
		text_layer.textItem.width = textWidth;						// set text area width  
		text_layer.textItem.height = textHeight;					// set text area height  
 
/* 
 		alert( 
		"res=" + res + " sizeFactor=" + sizeFactor + " numExifItems=" + numExifItems
		+ "\r" + "fontsize=" + fontSize + " font=" +fontName 
		+ "\r" + "Image area width=" + doc.width + " height=" + doc.height
		+ "\r"	+ "text area width=" + textWidth + " height=" + textHeight
		+ "\r"	+ "Text Position top left=" + textX + "," + textY
		+ " bottom right=" + (textX + textWidth )+ "," + (textY +  textHeight ) 
		);
 */

		try{ 
			text_layer.textItem.contents = exifInfo; 
		} 
		catch (er) { 
			alert("Error Setting Contents..."); 
		}
	} 

	if(res != testres){ app.activeDocument.resizeImage(app.activeDocument.width.value,app.activeDocument.height.value,res); }

	app.preferences.rulerUnits = strtRulerUnits; 
	app.preferences.typeUnits = strtTypeUnits; 

}
