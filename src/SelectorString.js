/**
 * @file Manages the configuration settings for the widget.
 * @author Guillaume Lebedel
 * @version 0.3 
 */

//Extend the $ object with our SelectorString object
$.extend($, {
    SelectorString: {
        //enable or disable the use of classes in selector paths
        useClasses: true,
        useIDs: true,
        //stores all the classes we want to exclude from selector paths
        excludedClasses: [],
        dynamicDetectClasses: {
            functions: ["addClass"],
            properties: [".className"]
        },
        excludedIDs: [],
        dynamicDetectIDs: {
            functions: ["setAttr"],
            properties: [".id"]
        },
        /**
         * add a class string to the excluded classes array
         * @param {string or array} classes the string of the class we want to be excluded from selector paths
         */
        addExcludedClass: function(classes) {
            if (typeof(classes) !== "string")
                this.excludedClasses.concat(classes)
            else
                this.excludedClasses.push(classes);
        },
        /**
         * remove a class from the excluded class array
         * @param  {string} classString string of the class we don't want to exclude anymore
         */
        removeExcludedClass: function(classString) {
            this.excludedClasses.splice(this.excludedClasses.indexOf(classString), 1);
        },
        excludeDynamics: function() {
            //key is name of the function and value is its following character
            var scripts = $("script");
            var scriptsContent = "";
            scripts.each(function(index, value) {
                scriptsContent += $(value).text();
            });
            var res;
            var reg;
            var excludeArray = this.dynamicDetectClasses.functions;
            for (var i = 0; i < excludeArray.length; i++) {
                reg = new RegExp(excludeArray[i] + "\\s*\\(['\"]([\\w-]*)", "g")
                if ((res = reg.exec(scriptsContent))) this.addExcludedClass(res.shift());
            }
            excludeArray = this.dynamicDetectClasses.properties;
            for (var i = 0; i < excludeArray.length; i++) {
                reg = new RegExp(excludeArray[i] + "\\s*[+-=]*\\s*['\"]\\s*([\\w-]+)['\"]", "g");
                if ((res = reg.exec(scriptsContent))) this.addExcludedClass(res.shift());
            }
        }
    }
});

$.fn.extend({
    /**
     * creates a unique selector string for the fn element
     * @param  {boolean} useClasses true if we want to use classes in the selector string
     * @return {string}            a unique selector string for the current node
     */
    getPath: function(useClasses) {
        if (typeof useClasses === "undefined") useClasses = $.SelectorString.useClasses;
        var path, node = this;
        // traverse the node tree up
        while (node.length) {
            var domNode = node[0],
                name = domNode.localName;
            if (!name) break;
            //current element has ID then we can return the selector*/
            else if (domNode.id) {
                path = "#" + domNode.id + (path && path.length > 0 ? " > " + path : "");
                break;
            }
            var parent = node.parent();
            //gets the best selector of a node relative to its parent
            name = this.getSelectorToParent.apply(node, [parent]);
            //if (node !== this && path && name[name.length - 1] === ")") name += " :scope"; // this is strictly for the use of eq:() parsing within querySelectorAll
            path = name + (path ? ' > ' + path : '');
            node = parent;
        }
        return path;
    },
    /**
     * gets the best selector of a node relative to its parent
     * @param  {$ object} parent       parent of the node
     * @param  {boolean} useClasses         do we want to use classes to find the best selector
     * @return {string}                     the selector representing the best path of the node to its parent
     */
    getSelectorToParent: function(parent, useClasses) {
        if (typeof useClasses === "undefined") useClasses = $.SelectorString.useClasses;
        if (!parent) parent = this.parent();
        var domNode = this[0],
            selector = domNode.localName,
            classes = [],
            childResults = parent.children(selector);
        //copy the node classes to a new string array
        domNode.classList.forEach(function(value) {
            classes.push(value);
        });
        //Find the class combination which will return the less nodes
        if (useClasses)
        //check the best class combination until we haven't found one that returns a unique node*/
            for (var bestClassIndex = 0, bestResult = childResults.length; classes.length && bestResult > 1 && bestClassIndex >= 0;) {
            bestClassIndex = -1;
            //find the class which identifies our node the best comapred to its parent
            for (var i = 0; i < classes.length && bestResult > 1; i++) {
                if (classes[i].length === 0 || $.SelectorString.excludedClasses.indexOf(classes[i]) > -1) break;
                childResults = parent.children(selector + "." + classes[i]);
                if (childResults.length < bestResult) {
                    bestResult = childResults.length;
                    bestClassIndex = i;
                }
            }
            if (bestClassIndex >= 0) {
                //since we found a class improving the selector we add it to the result
                selector += "." + classes[bestClassIndex];
                //delete that class from the class array
                classes.splice(bestClassIndex, 1);
                i = 0;
            }
        }
        childResults = parent.children(selector);
        //if the selector doesn't give us a unique node we add the :eq
        return selector + (childResults.length > 1 ? ":eq(" + childResults.index(this) + ")" : "");
    }
});
