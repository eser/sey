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
        const issuesLength = this.issues.length,
            messages = new Array(issuesLength);

        for (let i = 0; i < issuesLength; i++) {
            const issue = this.issues[i],
                severity = (issue.severity === this.ERROR) ? 'ERROR' : 'WARNING';

            messages[i] = `${severity} File: ${issue.file.file.path}\n${issue.message}\n`;
        }

        return messages.join('\n');
    }
}

taskException.WARNING = 1;
taskException.ERROR = 2;

module.exports = taskException;
