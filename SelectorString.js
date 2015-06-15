jQuery.extend(jQuery, {
    SelectorString: {
        useClasses: true,
        excludedClasses: [],

        addExcludedClass: function(classString) {
            this.excludedClasses.push(classString);
        },
        removeExcludedClass: function(classString) {
            this.excludedClasses.splice(this.excludedClasses.indexOf(classString), 1);
        }
    }
});

jQuery.fn.extend({
    /**
     * creates a unique selector string for the fn element
     * @param  {boolean} useClasses true if we want to use classes in the selector string
     * @return {string}            a unique selector string for the current node
     */
    getPath: function(useClasses) {
        if (typeof useClasses === "undefined") useClasses = jQuery.SelectorString.useClasses;
        var path, node = this;
        while (node.length) {
            var domNode = node[0],
                name = domNode.localName;
            if (!name) break;
            /*current element has ID then we can return the selector*/
            else if (domNode.id) {
                path = "#" + domNode.id + (path && path.length > 0 ? " > " + path : "");
                break;
            }
            var parent = node.parent();
            name = this.getSelectorToParent.apply(node, [parent]);
            if (node !== this && path && name[name.length - 1] === ")") name += " :scope";
            path = name + (path ? ' > ' + path : '')
            node = parent;
        }
        return path;
    },
    getSelectorToParent: function(parent, useClasses) {
        if (typeof useClasses === "undefined") useClasses = jQuery.SelectorString.useClasses;
        if (!parent) parent = this.parent();
        var domNode = this[0],
            selector = domNode.localName,
            classes = [],
            childResults = parent.children(selector),
            bestResult = childResults.length,
            bestClassIndex = 0;
        domNode.classList.forEach(function(value) {
            classes.push(value);
        });
        /*Find the class combination which will return the less nodes*/
        if (useClasses)
            while (classes.length && bestResult > 1 && bestClassIndex >= 0) {
                var bestClassIndex = -1;
                for (var i = 0; i < classes.length && bestResult > 1; i++) {
                    var currentClass = classes[i];
                    if (currentClass.length === 0 || jQuery.SelectorString.excludedClasses.indexOf(currentClass) > -1) break;
                    childResults = parent.children(selector + "." + currentClass)
                    if (childResults.length < bestResult) {
                        bestResult = childResults.length;
                        bestClassIndex = i;
                    }
                }
                if (bestClassIndex >= 0) {
                    selector += "." + classes[bestClassIndex];
                    classes.splice(bestClassIndex, 1);
                    i = 0;
                }
            }
        childResults = parent.children(selector);
        return selector + (childResults.length > 1 ? ":eq(" + childResults.index(this) + ")" : "");
    }
});




//Activate Selector Prompt
//Display Prompt icon on screen while live
