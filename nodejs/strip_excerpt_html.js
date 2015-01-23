/**
 * Node.js script which strips out html from post excerpts.
 * Expects a csv in format 
 * ID,"exceprt"
 * ID,"exceprt"
 * ...
 * ID,"exceprt"
 *
 * And produces an output sql file which updates each excerpt to get rid of the html or escaped html.
 */

var csv = require('fast-csv');
var fs = require('fs');

// assume file name
var csvFileName = "../wp_posts.csv";

var sqlFileName = "output.sql";

function stripHtml(s) {
	var rexSpaces = /\&nbsp\;/g;
	s = s.replace( rexSpaces, "");

	var rex = /&lt;[a-zA-Z\s\"\'\=0-9\/]+&gt;/g;
	s = s.replace( rex, "" );
	return s;
}

function stripSpaces(s) {
	var rexSpaces = /\s+/g;
	s = s.replace( rexSpaces, " " );
	return s;
}

function sqlString(s) {
	var rexApos = /\'/g;
	s = s.replace( rexApos, "\\'");
	return s;
}

// proceed
var sql = "";
csv.fromPath(csvFileName).on( "data", function(data) {
	var strippedHtml = stripHtml(data[1]);
	var strippedHtml = stripSpaces(strippedHtml);
	var sqlExcerpt = sqlString(strippedHtml);
	sql += "UPDATE wp_posts SET post_excerpt='" + sqlExcerpt + "' WHERE id=" + data[0] + ";\n";
}).on( "end", function() {
	fs.writeFile( sqlFileName, sql );
});
