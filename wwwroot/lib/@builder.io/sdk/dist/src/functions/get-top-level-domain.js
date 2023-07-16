"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopLevelDomain = void 0;
/**
 * Only gets one level up from hostname
 * wwww.example.com -> example.com
 * www.example.co.uk -> example.co.uk
 */
function getTopLevelDomain(host) {
    var parts = host.split('.');
    if (parts.length > 2) {
        return parts.slice(1).join('.');
    }
    return host;
}
exports.getTopLevelDomain = getTopLevelDomain;
//# sourceMappingURL=get-top-level-domain.js.map