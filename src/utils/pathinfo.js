'use strict';

/* -------------------------
 * Portions of this code are from Path utilities under the MIT license.
 *
 * (c) 2012 TJ Holowaychuk <tj@vision-media.ca>
 *
 * For the full copyright and license information, please view the LICENSE-MIT
 * file that was distributed with this source code.
 */

class pathinfo {
    static filename(pathstr) {
        return pathstr.split('/').pop();
    }

    static dirname(pathstr) {
        return pathstr.split('/').slice(0, -1).join('/') || '';
    }

    static basename(pathstr) {
        let base = this.filename(pathstr);
        if (!~base.indexOf('.')) {
            return '';
        }

        return base.split('.').shift();
    }

    static extension(pathstr) {
        let base = this.filename(pathstr);
        if (!~base.indexOf('.')) {
            return '';
        }

        return base.split('.').pop();
    }
}

module.exports = pathinfo;
