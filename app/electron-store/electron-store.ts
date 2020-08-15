const Store = require('electron-store');
const yaml = require('js-yaml');

const store = new Store({
	fileExtension: 'yaml',
	serialize: yaml.safeDump,
	deserialize: yaml.safeLoad
});

export default store