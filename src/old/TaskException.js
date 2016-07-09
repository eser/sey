class TaskException {
    constructor() {
        this.issues = [];
    }

    add(severity, file, message, isHandled = false) {
        this.issues.push({
            severity: severity,
            file: file,
            message: message,
            isHandled: isHandled
        });
    }

    export() {
        const issuesLength = this.issues.length,
            messages = '';

        for (let i = 0; i < issuesLength; i++) {
            const issue = this.issues[i],
                severity = (issue.severity === this.ERROR) ? 'ERROR' : 'WARNING';

            if (issue.isHandled) {
                continue;
            }

            messages += `${severity} File: ${issue.file.file.path}\n${issue.message}\n`;
        }

        return messages;
    }
}

TaskException.WARNING = 1;
TaskException.ERROR = 2;

module.exports = TaskException;
