/**test**/
function SelectorUnitTest(element, selectorLibrary) {
    this.element = element;
    this.selectorLibrary = selectorLibrary ? selectorLibrary : jQuery;
}

SelectorUnitTest.prototype = {
    testCount: 0,
    fails: {},

    testNode: function(node, selectLib) {
        if (!node) node = this.element;
        if (!selectLib) selectLib = this.selectorLibrary;
        this.testCount++;
        var nodePath = node.getPath(),
            children = node.children(),
            self = this;
        if (node[0] !== selectLib(nodePath)[0])
            self.fails[nodePath] = node;
        //else
        //console.log(nodePath + " is a match!");
        children.each(function() {
            self.testNode(jQuery(this), selectLib);
        });
    },

    getFailsCount: function(failsObj) {
        if (!failsObj) failsObj = this.fails;
        return Object.keys(failsObj).length;
    },

    start: function(startNode, selectLib) {
        if (!startNode) startNode = this.element;
        if (!selectLib) selectLib = this.selectorLibrary;
        this.testCount = 0;
        this.fails = {};
        this.testNode(startNode, selectLib);
        console.warn(this.getFailsCount() + "/" + this.testCount + " element tested fails! That's a " +
            (((this.testCount - this.getFailsCount()) / this.testCount) * 100).toFixed(2) + "% success rate!");
        return this.fails;
    }
};

var selectorTest = new SelectorUnitTest(jQuery("body"), jQuery);
