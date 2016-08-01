

module.exports = {
	replaceall: function(text, result, string) {
		var replace = new RegExp(string, 'g');
		return text.replace(replace, result);
	}
}