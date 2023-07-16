"use strict";
beforeEach(function () {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
});
afterEach(function () {
    jest.spyOn(global.Math, 'random').mockRestore();
});
//# sourceMappingURL=setupTests.js.map