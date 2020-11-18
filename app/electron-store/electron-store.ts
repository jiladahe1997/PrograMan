const Store = require('electron-store');
const yaml = require('js-yaml');
const electron = require('electron');

const store = new Store({
	fileExtension: 'yaml',
	name:"PrograMan_config",
	serialize: yaml.safeDump,
	deserialize: yaml.safeLoad,
	cwd: (electron.app || electron.remote.app).getPath('desktop')
});

export default store