sey.tasks.add('do', function (resolve, reject) { resolve(5); });
// sey.tasks.do.exec();

sey.bundles.add('main', { target: 'node', standard: 2016, dest: 'build/' });
sey.bundles.main.ops.add({ src: [], dest: 'extra/', addheader: { enabled: true, banner: 'x' }, eolfix: true });
// sey.bundles.main.exec();
// sey.bundles.readFromConfig();

console.log('tasks', sey.tasks.keys);
console.log('bundles', sey.bundles.keys);
