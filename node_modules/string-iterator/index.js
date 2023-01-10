var fs = require( 'fs' ),
	StringIterator = module.exports = require( "./lib/StringIterator.js" );

StringIterator.exportScript = function( callback ) {
	if ( callback ) {
		fs.readFile( __dirname + '/lib/StringIterator.js', 'utf8', callback );
	}
	else {
		return fs.readFileSync( __dirname + '/lib/StringIterator.js', 'utf8' );
	}
};
