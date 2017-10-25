/**
 * This function is sent to the browser by selenium to find the element(s)
 * @param selector The selector to find the element
 * @param multiple Whether we need to find multiple elements
 * @returns {*}
 */

export default function (selector, multiple) {
    var selectors = selector;
    if (document.body.createShadowRoot || document.body.attachShadow) {
        selectors = selectors.split(' ');
    }

    function findElement(selectors) {
        var currentElement = document;
        for (var i = 0; i < selectors.length; i++) {
            // If the element is a shadow host, go into the shadowRoot
            let testUseShadowDom = [];
            if (selectors[i - 1]) {
                testUseShadowDom = selectors[i - 1].split(':notShadowRoot');
            }
            if (i > 0 && currentElement.shadowRoot && testUseShadowDom.length < 2) {
                currentElement = currentElement.shadowRoot;
            }

            if (i === selectors.length - 1) {
                // Final selector part. If multiple=true, try to find multiple elements
                if (multiple) {
                    currentElement = currentElement.querySelectorAll(selectors[i]);
                } else {
                    currentElement = currentElement.querySelector(selectors[i]);
                }
                break;
            } else {
                const rewriteSelector = selectors[i].split(':notShadowRoot');
                if (rewriteSelector.length < 2) {
                currentElement = currentElement.querySelector(selectors[i]);
                } else {
                currentElement = currentElement.querySelector(rewriteSelector[0]);
                }
            }

            if (!currentElement) {
                break;
            }
        }


        return currentElement
    }

    return findElement(selectors);
}