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
        var children = node.children(),
            self = this;
        try {
            var nodePath = node.getPath();
            if (node[0] !== selectLib(nodePath)[0])
                self.fails[nodePath] = node;
        } catch (e) {
            self.fails[nodePath] = node;
            console.warn(e.name);
            console.warn(e.message);
        }
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
        console.warn(this.getFailsCount() + "/" + this.testCount + " element tested failed! That's a " +
            (((this.testCount - this.getFailsCount()) / this.testCount) * 100).toFixed(2) + "% success rate!");
        return this.fails;
    }
};

var selectorTest = new SelectorUnitTest(jQuery("body"), jQuery);
