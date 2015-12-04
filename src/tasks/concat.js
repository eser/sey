import opfile from '../opfile.js';

let concat = function () {
    let self = this;

    self.processBundle = async function (bundle, files) {
        let content = '';

        for (let fileKey in files) {
            let file = files[fileKey],
                token = file.addTask('concat');

            content += file.getPreviousContent();
        }

        return [
            new opfile('concat', 'concat', null, content)
        ];
    };
};

export default concat;
