function middle(str, startChar, endChar) {
	var start = str.indexOf(startChar) + 1;
	var end = str.indexOf(endChar);
	if (start !== -1 && end !== -1) {
		return str.substring(start, end);
	} else {
		return str;
	}
}