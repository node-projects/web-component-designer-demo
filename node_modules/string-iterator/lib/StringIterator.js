/*
 * String Iterator v0.0.1
 * Corey Hart @ http://www.codenothing.com
 * MIT License
 */
(function( global, undefined ) {

var Slice = Array.prototype.slice,
	toString = Object.prototype.toString,
	rnewline = /\r\n|\r|\n/;


function StringIterator( string ) {
	var self = this, i = -1, line = [], length, c;

	if ( ! ( self instanceof StringIterator ) ) {
		return new StringIterator( string );
	}
	else if ( ! StringIterator.isString( string ) ) {
		throw new Error( "No string found" );
	}

	// Meta
	self.string = string;
	self.index = -1;
	self.length = -1;
	self.character = 1;
	self.line = 1;
	self.c = "";
	self.next = "";
	self.prev = "";
	self.chars = [];
	self.lines = [ line ];

	// Break down each individual character, and seperate newlines
	for ( length = self.string.length; ++i < length; ) {
		c = self.string[ i ];
		if ( c == "\r" && self.string[ i + 1 ] == "\n" ) {
			c = "\r\n";
			i++;
		}

		self.chars.push( c );
		if ( rnewline.exec( c ) ) {
			self.lines.push( line = [] );
		}
		else {
			line.push( c );
		}
	}

	// Length should represent number of characters
	self.length = self.chars.length;
}

StringIterator.prototype = {

	// Skip to specific index
	goto: function( n ) {
		var self = this, count = 0, i = -1, line;

		if ( ! StringIterator.isNumber( n ) ) {
			throw new Error( "Expecting a number for goto" );
		}
		else if ( n < 0 ) {
			throw new Error( "Number too small for goto" );
		}
		else if ( n >= self.length ) {
			throw new Error( "Number too large for goto" );
		}

		self.index = n;
		self.c = self.chars[ n ];
		self.next = self.chars[ n + 1 ] || "";
		self.prev = self.chars[ n - 1 ] || "";

		while ( ( line = self.lines[ ++i ] ) ) {
			if ( self.index < ( count + line.length ) ) {
				self.line = i + 1;
				self.character = self.index - count + 1;
				break;
			}
			else {
				count += line.length + 1;
			}
		}

		return self;
	},

	// Forward iteration
	each: function( callback ) {
		var self = this, substr = "";

		// Test for function
		if ( ! StringIterator.isFunction( callback ) ) {
			throw new Error( "No function found" );
		}

		// Iterate
		for ( ; ++self.index < self.length; ) {
			self.goto( self.index );
			substr += self.c;

			if ( callback( self.c, self ) === false ) {
				break;
			}
		}

		if ( self.index >= self.length ) {
			self.index = self.length - 1;
		}

		return substr;
	},

	// Find a character while compiling a sub string
	seek: function( match ) {
		var self = this,
			regex = StringIterator.isRegExp( match ) ? match : null,
			endChar = StringIterator.isString( match ) ? match : null;

		// Make sure there is an end matcher
		if ( regex === null && endChar === null ) {
			throw new Error( "No seek found" );
		}

		// Iterate until we find the match
		return self.each(function( c ) {
			if ( self.prev == "\\" ) {
				return;
			}
			else if ( ( endChar && c === endChar ) || ( regex && regex.exec( c ) ) ) {
				return false;
			}
		});
	},

	// Skipping n string iterations
	skip: function( n ) {
		var self = this, count = 0;

		// No number means a single skip
		if ( n === undefined ) {
			n = 1;
		}
		// Make sure a number is passed
		else if ( ! StringIterator.isNumber( n ) ) {
			throw new Error( "Expecting a number for skip" );
		}

		// Iterate until count is matched
		return self.each(function( c ) {
			if ( ++count >= n ) {
				return false;
			}
		});
	},

	// Going back n string iterations
	reverse: function( value ) {
		var self = this,
			isFunction = StringIterator.isFunction( value ),
			substr = "",
			count = 0;

		// Number of iterations
		if ( value === undefined ) {
			value = 1;
		}
		// Make sure a number or function is passed
		else if ( ! isFunction && ! StringIterator.isNumber( value ) ) {
			throw new Error( "Expecting a number or function for reverse" );
		}

		// Reverse iterate until wall is hit
		for ( ; --self.index > 0; ) {
			self.goto( self.index );
			substr = self.c + substr;

			// Check to see if thresholds have been met
			if ( ( isFunction && value( self.c, self ) === false ) || ( ! isFunction && ++count >= value ) ) {
				break;
			}
		}

		return substr;
	},

	// Restarting iteration
	restart: function(){
		var self = this;

		self.index = -1;
		self.character = 1;
		self.line = 1;
		self.c = "";
		self.next = "";
		self.prev = "";

		return self;
	},

};


// Version
StringIterator.version = "0.0.1";


// Type tests
"Boolean Number String Function Array Date RegExp Object".split(' ').forEach(function( method ) {
	if ( method == 'Array' && Array.isArray ) {
		return ( StringIterator.isArray = Array.isArray );
	}

	var match = '[object ' + method + ']';
	StringIterator[ 'is' + method ] = function( object ) {
		return object !== undefined && object !== null && toString.call( object ) == match;
	};
});


// Expose
if ( typeof module == 'object' && typeof module.exports == 'object' ) {
	module.exports = StringIterator;
}
else {
	global.StringIterator = StringIterator;
}

})( this );
