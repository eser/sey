const Sey = require('./Sey.js'),
    TasksAddIn = require('./addins/tasks/index.js'),
    BundlesAddIn = require('./addins/bundles/index.js');

const instance = new Sey();

instance.addins.add(new TasksAddIn());
instance.addins.add(new BundlesAddIn());

module.exports = instance;
