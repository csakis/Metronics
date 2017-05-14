function loadDefaultStylesIntoHead () {
	var styleComponent = document.createElement('link');
	var styleColor = document.createElement('link');

	styleComponent.rel = "stylesheet"; 
	styleComponent.id = "style_components"; 
	styleComponent.type = "text/css"; 
	styleComponent.href = "assets/global/css/components-md.min.css"; 

	styleColor.rel = "stylesheet"; 
	styleColor.id = "style_color"; 
	styleColor.type = "text/css"; 
	styleColor.href = "assets/layouts/layout/css/themes/darkblue.min.css"; 
	document.head.appendChild(styleComponent);
	document.head.appendChild(styleColor);	
} 