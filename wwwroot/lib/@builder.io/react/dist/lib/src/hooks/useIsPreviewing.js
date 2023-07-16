"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsPreviewing = void 0;
var react_1 = require("react");
var sdk_1 = require("@builder.io/sdk");
function useIsPreviewing() {
    var _a = (0, react_1.useState)(false), isPreviewing = _a[0], setIsPreviewing = _a[1];
    (0, react_1.useEffect)(function () {
        if (sdk_1.Builder.isEditing || sdk_1.Builder.isPreviewing) {
            setIsPreviewing(true);
        }
    }, []);
    return isPreviewing;
}
exports.useIsPreviewing = useIsPreviewing;
//# sourceMappingURL=useIsPreviewing.js.map