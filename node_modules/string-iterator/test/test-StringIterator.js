munit( 'StringIterator', {

	init: function( assert ) {
		var string = "Some\nMulti\rline\r\nString",
			iter = new StringIterator( string );

		assert.isFunction( 'class is a function', StringIterator )
			.isString( 'string', iter.string )
			.equal( 'index', iter.index, -1 )
			.equal( 'length', iter.length, string.length - 1 )
			.equal( 'character', iter.character, 1 )
			.equal( 'line', iter.line, 1 )
			.equal( 'c', iter.c, "" )
			.equal( 'next', iter.next, "" )
			.equal( 'prev', iter.prev, "" );

		assert.deepEqual( 'chars', iter.chars, [
			'S', 'o', 'm', 'e', '\n', 'M', 'u', 'l', 't', 'i', '\r', 'l', 'i', 'n', 'e', '\r\n', 'S', 't', 'r', 'i', 'n', 'g',
		]);

		console.log( iter.lines );
		assert.deepEqual( 'lines', iter.lines, [
			[ 'S', 'o', 'm', 'e' ],
			[ 'M', 'u', 'l', 't', 'i' ],
			[ 'l', 'i', 'n', 'e' ],
			[ 'S', 't', 'r', 'i', 'n', 'g' ]
		]);

		assert.throws( 'throws when no string is passed to the constructor', "No string found", function(){
			StringIterator( null );
		});
	},

	goto: function( assert ) {
		var iter = new StringIterator( "abc\ndef\rghi\r\njkl" );

		// Test index's
		[
			{ index: 0, line: 1, character: 1, c: "a", prev: "", next: "b" },
			{ index: 1, line: 1, character: 2, c: "b", prev: "a", next: "c" },
			{ index: 2, line: 1, character: 3, c: "c", prev: "b", next: "\n" },
			{ index: 3, line: 2, character: 0, c: "\n", prev: "c", next: "d" },
			{ index: 4, line: 2, character: 1, c: "d", prev: "\n", next: "e" },
			{ index: 5, line: 2, character: 2, c: "e", prev: "d", next: "f" },
			{ index: 6, line: 2, character: 3, c: "f", prev: "e", next: "\r" },
			{ index: 7, line: 3, character: 0, c: "\r", prev: "f", next: "g" },
			{ index: 8, line: 3, character: 1, c: "g", prev: "\r", next: "h" },
			{ index: 9, line: 3, character: 2, c: "h", prev: "g", next: "i" },
			{ index: 10, line: 3, character: 3, c: "i", prev: "h", next: "\r\n" },
			{ index: 11, line: 4, character: 0, c: "\r\n", prev: "i", next: "j" },
			{ index: 12, line: 4, character: 1, c: "j", prev: "\r\n", next: "k" },
			{ index: 13, line: 4, character: 2, c: "k", prev: "j", next: "l" },
			{ index: 14, line: 4, character: 3, c: "l", prev: "k", next: "" },

		].forEach(function( match ) {
			iter.goto( match.index );

			assert.equal( "combo-" + match.index + "-index", iter.index, match.index );
			assert.equal( "combo-" + match.index + "-line", iter.line, match.line );
			assert.equal( "combo-" + match.index + "-character", iter.character, match.character );
			assert.equal( "combo-" + match.index + "-prev", iter.prev, match.prev );
			assert.equal( "combo-" + match.index + "-next", iter.next, match.next );
			assert.equal( "combo-" + match.index + "-c", iter.c, match.c );
		});

		// Type checks
		assert.throws( "should throw when number isn't passed", "Expecting a number for goto", function(){
			iter.goto( null );
		});
		assert.throws( "should throw when number is too small", "Number too small for goto", function(){
			iter.goto( -1 );
		});
		assert.throws( "should throw when number is too large", "Number too large for goto", function(){
			iter.goto( 99 );
		});
	},

	each: function( assert ) {
		var iter = new StringIterator( "123456789" ),
			handle = assert.spy(function( c ) {
				return c === '5' ? false : true;
			}),
			result;

		result = iter.each( handle );
		assert.equal( "handle should have been triggered 5 times", handle.count, 5 );
		assert.equal( "result should be the substr up to 5", result, "12345" );
		assert.equal( "index for first half should be 4", iter.index, 4 );

		handle.reset();
		result = iter.each( handle );
		assert.equal( "handle should have been triggered the final 4 times", handle.count, 4 );
		assert.equal( "result should be the rest of the string after 5", result, "6789" );
		assert.equal( "index for second half should be 8 since string finished", iter.index, 8 );

		handle.reset();
		iter = new StringIterator( "1" );
		iter.each( handle );
		assert.deepEqual( "handle arguments", handle.args, [ '1', iter ] );

		assert.throws( "each requires a function to be passed", "No function found", function(){
			iter.each( null );
		});
	},

	seek: function( assert ) {
		var iter = new StringIterator( "1234567" ),
			eachSpy = assert.spy( iter, 'each', { passthru: true } ),
			result;

		result = iter.seek( "4" );
		assert.equal( "each should have been triggered", eachSpy.count, 1 );
		assert.isFunction( "only function passed to each", eachSpy.args[ 0 ] );
		assert.equal( "result should be everything up to 4", result, "1234" );
		assert.equal( "index for string seek be 3", iter.index, 3 );

		eachSpy.reset();
		result = iter.seek( /6/ );
		assert.equal( "each triggered for regex matching", eachSpy.count, 1 );
		assert.equal( "result should be from 5 to 6 for regex match", result, "56" );
		assert.equal( "index for regex seek be 5", iter.index, 5 );

		eachSpy.reset();
		iter = new StringIterator( "12\\3123123" );
		result = iter.seek( "3" );
		assert.equal( "seek should skip over escaped characters", result, "12\\3123" );
		assert.equal( "index for escaped seek be 6", iter.index, 6 );

		assert.throws( "seek throws when no regex or seek char passed", "No seek found", function(){
			iter.seek( null );
		});
	},

	skip: function( assert ) {
		var iter = new StringIterator( "12345678910" ),
			eachSpy = assert.spy( iter, 'each', { passthru: true } ),
			result;

		result = iter.skip( 6 );
		assert.equal( "each should have been triggered", eachSpy.count, 1 );
		assert.isFunction( "only function passed to each", eachSpy.args[ 0 ] );
		assert.equal( "result should be everything up to 6", result, "123456" );
		assert.equal( "index for multi skip should be 5", iter.index, 5 );

		eachSpy.reset();
		result = iter.skip();
		assert.equal( "each triggered for single skip", eachSpy.count, 1 );
		assert.equal( "result should only be 7", result, "7" );
		assert.equal( "index for single skip after multi should be 6", iter.index, 6 );

		assert.throws( "skip throws when any object but a number is passed", "Expecting a number for skip", function(){
			iter.skip( null );
		});
	},

	reverse: function( assert ) {
		var iter = new StringIterator( "abc\ndefg\nhijk" ),
			handle = assert.spy(function( c ) {
				return false;
			}),
			result;

		iter.index = iter.length;
		result = iter.reverse();
		assert.equal( "result should be the last letter", result, "k" );
		assert.equal( "index should be 12, 1 from the edge", iter.index, 12 );

		iter.index = iter.length;
		result = iter.reverse( 3 );
		assert.equal( "result should be the last 3 letters", result, "ijk" );
		assert.equal( "index should be 10, 3 from the edge", iter.index, 10 );

		iter.index = iter.length;
		result = iter.reverse( handle );
		assert.equal( "handle should have been triggered", handle.count, 1 );
		assert.equal( "handle result should be the last letter", result, "k" );
		assert.deepEqual( "handle arguments", handle.args, [ "k", iter ] );

		assert.throws( "reverse should throw on invalid param", "Expecting a number or function for reverse", function(){
			iter.reverse( null );
		});
	},

	restart: function( assert ) {
		var iter = new StringIterator( "abc\ndefg\nhijk" ), result;

		iter.seek( "e" );
		result = iter.restart();
		assert.equal( "restart should return iter", result, iter );
		assert.equal( "index", iter.index, -1 );
		assert.equal( "character", iter.character, 1 );
		assert.equal( "line", iter.line, 1 );
		assert.equal( "c", iter.c, "" );
		assert.equal( "next", iter.next, "" );
		assert.equal( "prev", iter.prev, "" );
	},

	"nested each": function( assert ) {
		var iter = new StringIterator( "abcdefghijklmnop" ),
			level1, level2, level3;

		level1 = iter.each(function( c ) {
			if ( c == 'c' ) {
				level2 = iter.each(function( c ) {
					if ( c == 'f' ) {
						level3 = iter.each(function( c ) {
							if ( c == 'i' ) {
								return false;
							}
						});
					}
					else if ( c == 'l' ) {
						return false;
					}
				});
			}
			else if ( c == 'n' ) {
				return false;
			}
		});

		assert.equal( "level-1", level1, "abcmn" );
		assert.equal( "level-2", level2, "defjkl" );
		assert.equal( "level-3", level3, "ghi" );
	},

});
