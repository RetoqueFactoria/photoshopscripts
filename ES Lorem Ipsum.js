// ============================================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
// ============================================================================
// AYUDA: genera “Texto de muestra” (aka: Lorem Ipsum, Dummy text). Orientado a Diseño Gráfico y Web.
// ============================================================================

var loremString = "latin";

function objectTag()
{
    	var lorem = new Array();

    	switch(loremString)
    	{
    		case "latin":
    		{
				lorem[0] = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ";
				lorem[1] = "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ";
				lorem[2] = "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. ";
				lorem[3] = "Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. ";
				lorem[4] = "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis. ";
				lorem[5] = "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat. ";
				lorem[6] = "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus. ";
    			break;
    		}
    	}

        if( "characters" == genType )
        {
        	var outputString = '';
            var numOfChars = dlg.inputText.text;
            numOfChars = parseInt( numOfChars );
            var tempString = lorem.join( "\n\n" );
            while ( outputString.length < numOfChars ) outputString += tempString;
				 dlg.outputText.text = outputString.substring(0, numOfChars );
        }
        else if( "words" == genType )
        {
            var numOfWords = dlg.inputText.text;
            numOfWords = parseInt( numOfWords );

            var list = new Array();
            var wordList = new Array();
            wordList = lorem[ 0 ].split( ' ' );
            var iParagraphCount = 0;
            var iWordCount = 0;

            while( list.length < numOfWords )
            {
            	if( iWordCount > wordList.length )
            	{
            		iWordCount = 0;
            		iParagraphCount++;
            		if( iParagraphCount + 1 > lorem.length ) iParagraphCount = 0;
            		wordList = lorem[ iParagraphCount ].split( ' ' );
            		wordList[ 0 ] = "\n\n" + wordList[ 0 ];
            	}

            	list.push( wordList[ iWordCount ] );

            	iWordCount++;
            }
				 dlg.outputText.text = list.join( ' ' );
        }
        else
        {
            var numOfParagraphs = dlg.inputText.text;
            numOfParagraphs = parseInt( numOfParagraphs );

            var list = new Array();
			var iParagraphCount = 0;

            while( list.length < numOfParagraphs )
            {
            	if( iParagraphCount +1 > lorem.length )
            	{
            		iParagraphCount = 0;
            	}

            	list.push( lorem[ iParagraphCount ] );
            	iParagraphCount++;
            }
				 dlg.outputText.text = list.join( "\n\n" );
        }
}

if (app.documents.length > 0) {
	try {
		var genType = "words";
		var dlg = new Window('dialog', 'Generar Lorem Ipsum');
		dlg.bounds = {x:0, y:0, width:402, height:410};
		dlg.inputPanel = dlg.add ('panel', [15,10,250,96], 'Opciones');
		dlg.descText = dlg.inputPanel.add('statictext', [10,13,55,30], "Num");
		dlg.inputText = dlg.inputPanel.add('edittext', [58,10,100,30], 50, {multiline:false});

		dlg.wordOption = dlg.inputPanel.add('radiobutton', [110,11,220,30], 'Palabras'); 
		dlg.characterOption = dlg.inputPanel.add('radiobutton', [110,27,220,50], 'Caracteres'); 
		dlg.paragraphOption = dlg.inputPanel.add('radiobutton', [110,43,220,70], 'Parrafos');

		dlg.wordOption.value = true;
		
		dlg.outputPanel = dlg.add ('panel', [15,100,387,395], 'Lorem Ipsum');
		dlg.outputText = dlg.outputPanel.add('edittext', [10,11,357,275], '', {multiline:true});
		
		dlg.inputText.active = true;
		dlg.okBtn = dlg.add('button', [259,15,387,35], 'Generar', {name:'ok'});
		dlg.canelBtn = dlg.add('button', [259,40,387,60], 'Cerrar', {name:'cancel'});
		
		dlg.wordOption.onClick = function() { genType = "words"; }
		dlg.characterOption.onClick = function() { genType = "characters"; }
		dlg.paragraphOption.onClick = function() { genType = "paragraphs"; }

		dlg.okBtn.onClick = function() {
			objectTag();
		}
	
		dlg.canelBtn.onClick = function() {
			dlg.close();
		}

		dlg.center();
		dlg.show();
	}
	catch (e) { }
}
