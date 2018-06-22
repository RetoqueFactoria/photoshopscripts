/*****************************************************************
 *
 * TextConvert.Export 1.1 - by Bramus! - https://www.bram.us/
 *
 * v 1.1 - 2016.02.17 - UTF-8 support
 *                      Update license to MIT License
 *
 * v 1.0 - 2008.10.30 - (based upon TextExport 1.3, without the "save dialog" option)
 *
 *****************************************************************
 *
 * Copyright (c) 2016 Bram(us) Van Damme - https://www.bram.us/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 *****************************************************************/

	/**
	 *  TextConvert.Export Init function
	 * -------------------------------------------------------------
	 */


	 	function initTextConvertExport() {

			// Linefeed shizzle
			if ($.os.search(/windows/i) != -1)
				fileLineFeed = "windows";
			else
				fileLineFeed = "macintosh";

			// Do we have a document open?
			if (app.documents.length === 0) {
				alert("Please open a file", "TextConvert.Export Error", true);
				return;
			}

			// Oh, we have more than one document open!
			if (app.documents.length > 1) {

				var runMultiple = confirm("Se detectaron multiples documentos.\nDeseas ejecutar el comando en todos los documentos abiertos? Se sugiere utilizar documento por documento.", true, "TextConvert.Export");

				if (runMultiple === true) {
					docs	= app.documents;
				} else {
					docs	= [app.activeDocument];
				}

			// Only one document open
			} else {

				runMultiple 	= false;
				docs 			= [app.activeDocument];

			}

			// Loop all documents
			for (var i = 0; i < docs.length; i++)
			{

				// Auto set filePath and fileName
				filePath = Folder.myDocuments + '/TextConvert-' + docs[i].name + '.txt';

				// create outfile
				var fileOut	= new File(filePath);

				// set linefeed
				fileOut.linefeed = fileLineFeed;

				// Set encoding
				fileOut.encoding = "UTF8"

				// open for write
				fileOut.open("w", "TEXT", "????");

				// Set active document
				app.activeDocument = docs[i];

				// call to the core with the current document
				goTextExport2(app.activeDocument, fileOut, '/');

				// close the file
				fileOut.close();

			}

			// Post processing: give notice (multiple) or open file (single)
			if (runMultiple === true) {
				alert("Cantidad " + documents.length + " documentos;\nLos archivos fueron salvados en las carpetas de tus documentos.", "TextExport");
			} else {
				fileOut.execute();
			}

		}


  	/**
  	 * TextExport Core Function (V2)
  	 * -------------------------------------------------------------
	 */

		function goTextExport2(el, fileOut, path)
		{

			// Get the layers
			var layers = el.layers;

			// Loop 'm
			for (var layerIndex = layers.length; layerIndex > 0; layerIndex--)
			{

				// curentLayer ref
				var currentLayer = layers[layerIndex-1];

				// currentLayer is a LayerSet
				if (currentLayer.typename == "LayerSet") {

					goTextExport2(currentLayer, fileOut, path + currentLayer.name + '/');

				// currentLayer is not a LayerSet
				} else {

					// Layer is visible and Text --> we can haz copy paste!
					if ( (currentLayer.visible) && (currentLayer.kind == LayerKind.TEXT) )
					{
						fileOut.writeln('');
						fileOut.writeln('');
						fileOut.writeln('');
						fileOut.writeln('');
						fileOut.writeln('[Inicio ' + path + currentLayer.name + ' ]');
						fileOut.writeln(currentLayer.textItem.contents);
						fileOut.writeln('[Final ' + path + currentLayer.name + ' ]');
					}
				}


			}


		}


	/**
	 *  TextConvert.Export Boot her up
	 * -------------------------------------------------------------
	 */

	 	initTextConvertExport();