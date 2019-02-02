// RemoveAlphaChannels
//   Removes all of the alpha channels from a document
// $Id$
// Copyright: (c)2007, xbytor
// License: http://www.opensource.org/licenses/bsd-license.php
// Contact: xbytor@gmail.com
// ============================================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
// ============================================================================
// AYUDA: Elimina todos los Canales Alpha del Documento actual.
// ============================================================================

function main() {
  if (app.documents.length == 0) {
    return;
  }

  var doc = app.activeDocument;

  var channels = doc.channels;
  var alphas = [];
  for (var i = 0; i < channels.length; i++) {
    var channel = channels[i];
    if (channel.kind == ChannelType.COMPONENT) {
      continue;
    }
    alphas.push(channel);
  }
  while (alphas.length) {
    var channel = alphas.pop();
    channel.remove();
  }
};

main();

"RemoveAlphaChannels.jsx";
// EOF

