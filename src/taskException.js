'use strict';

class taskException {
    constructor() {
        this.issues = [];
    }

    add(severity, file, message) {
        this.issues.push({
            severity: severity,
            file: file,
            message: message
        });
    }

    export() {
        let messages = [];

        for (let issue of this.issues) {
            const severity = (issue.severity === this.ERROR) ? 'ERROR' : 'WARNING';
            messages.push(`${severity} File: ${issue.file.file.path}\n${issue.message}\n`);
        }

        return messages.join('\n');
    }
}

taskException.WARNING = 1;
taskException.ERROR = 2;

module.exports = taskException;
