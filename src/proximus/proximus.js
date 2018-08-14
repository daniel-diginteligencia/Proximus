// Note: Proximus with no jquery requierments
/* global cookie */ 
let proximus = ((cookieCtrl, window) => { // eslint-disable-line
	let proximusObj = {
		defaultLngName: 'en',
		defaultcookieName: 'lng',
		lngByIdClass: '.i18n',
		lngImgClass: '.i18nImg',
		lngByAtrrClass: '.i18nAtt',
		lngAtrrName: 'data-i18n'
	};

	// Note: Read cookie from url and replace/sets new cookie
	const replaceUrlCookie = (cookieName, paramValue) => {
		let url = window.location.href;
		let pattern = new RegExp(`${cookieName}=[a-z]+`);
		cookieCtrl.create(cookieName,`${paramValue};path=/`);
		if (url.match(pattern)) {
			window.location = 
				url.replace(pattern, `${cookieName}=${paramValue}`);
		} else {
			window.location = 
				`${url}${url.indexOf('?') > 0 ? '&' : '?'}${cookieName}=${paramValue}`;
		}
	};

	// Note: gets the language and returns it
	const getLang = (cookieName, defaulLanguage) => {
		// Check if the cookie allrady has a value if not set defaul value
		let language = 
			cookieCtrl.read(cookieName) != null ? cookieCtrl.read(cookieName) : defaulLanguage;
		
		// Checks if cookie language was set on url, if yes returns that one
		let tmp = [];
		location.search.substr(1).split('&').forEach(item => {
			tmp = item.split('=');
			if(tmp[0] === cookieName)
				language = decodeURIComponent(tmp[1]);
		});

		// change/create cookie with lng and returns value
		cookieCtrl.create(cookieName, language);
		return language;
	};

	// Note: get all html with that class and change the context, base on language object
	const changeEachInnerHtml = (classToCheck, langObject, attribute) => {
		document.querySelectorAll(classToCheck).forEach((el) => {
			try {
				let attVal = el.getAttribute(attribute);
				if (langObject[attVal]) {
					el.innerHTML = langObject[attVal];
				} else if (!langObject[attVal] || attVal === undefined) {
					el.innerHTML = `Missing ${attribute} value`;
				} else {
					el.innerHTML = attVal;
				}
			} catch (e) {
				console.log(e); // eslint-disable-line
			}
		});
	};
	
	// Note: get all html with that class and change the src, base on language object
	const changeEachHtmlSrc = (classToCheck, langObject, attribute) => {
		document.querySelectorAll(classToCheck).forEach((el) => {
			try {
				let attVal = el.getAttribute(attribute);
				if (langObject[attVal]) {
					el.src = langObject[attVal];
				} else if (!langObject[attVal]) {
					el.src = `Missing${attribute}Value`;
					el.alt = `Missing ${attribute} value`;
				} else {
					el.src = attVal;
				}
			} catch (e) {
				console.log(e); // eslint-disable-line
			}
		});
	};

	const setupEventListeners = (languageObject, language, cookieName) => {
		var langObj = languageObject[getLang(cookieName, language)];
		
		// Change by id
		changeEachInnerHtml(proximusObj.lngByIdClass, langObj, 'id');
		
		// Change by attribute
		changeEachInnerHtml(proximusObj.lngByAtrrClass, langObj, proximusObj.lngAtrrName);
		
		// Change src by attribute
		changeEachHtmlSrc(proximusObj.lngImgClass, langObj, proximusObj.lngAtrrName);

		// Note: add a wey to return object and select value by somthing like data-value  

		// Note: add a way to add your tagname and change that tag name base on your obj
	};

	return {
		init(
			langObj,
			lng = proximusObj.defaultLngName,
			cookieName = proximusObj.defaultcookieName
		) {
			setupEventListeners(langObj, lng, cookieName);
		},

		change(newValue, cookieName = proximusObj.defaultcookieName) {
			replaceUrlCookie(cookieName, newValue);
		},

		getVariables() {
			return proximusObj;
		}
	};

})(cookie, window);

// Init
// proximus.init(bundle, "es", "lnp");

// Change language
// change('es', 'ln');

// Get all variables
// getVariables();