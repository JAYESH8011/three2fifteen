loader.addModule('auth',
() => {
	const TOKEN_KEY = 'JWT';
	return {
		'setToken': (token) => {
			window.localStorage.setItem(TOKEN_KEY, token);
		},
		'getToken': () => {
			return window.localStorage.getItem(TOKEN_KEY);
		},
		'unsetToken': () => {
			console.log("unset token");
			throw "Shouldn't be here!";
			window.localStorage.removeItem(TOKEN_KEY);
		},
		'isLoggedIn': () => {
			return window.localStorage.getItem(TOKEN_KEY) != null;
		},
		'getHeader': () => {
			return {'X-Token': window.localStorage.getItem(TOKEN_KEY)}
		}
	};
});
