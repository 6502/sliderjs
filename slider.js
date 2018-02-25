//
// Simple slider the way I like it
// By Andrea "6502" Griffini
//
// This is free and unencumbered software released into the public domain.
// 
// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non - commercial, and by any
// means.
// 
// In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights
// to this software under copyright law.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
// 
// For more information, please refer to < http://unlicense.org/>
//
function slider(x, low, high, format) {
    let p = document.body.appendChild(document.createElement("div")),
        d = p.appendChild(document.createElement("div")),
        t = d.appendChild(document.createElement("div")),
        i = p.appendChild(document.createElement("input"));
    p.style.position = "relative";
    p.style.background = "#EEE";
    p.style.display = "inline-block";
    p.style.margin = "8px";
    p.style.padding = "8px";
    p.style.boxShadow = "inset 1px 1px 1px rgba(0, 0, 0, 0.25)";
    p.style.borderRadius = "4px";

    i.style.width = "60px";
    i.style.display = "inline-block";
    i.style.textAlign = "center";
    i.style.marginLeft = "4px";
    i.style.verticalAlign = "middle";

    d.style.display = "inline-block";
    d.style.width = "120px";
    d.style.height = "4px";
    d.style.borderRadius = "2px";
    d.style.marginTop = "15px";
    d.style.marginBottom = "15px";
    d.style.background = "#888";
    d.style.verticalAlign = "middle";
    d.style.position = "relative";
    
    t.style.display = "inline-block";
    t.style.width = "12px";
    t.style.height = "20px";
    t.style.border = "solid 1px #888";
    t.style.background = "#FFF";
    t.style.borderRadius = "3px";
    t.style.boxShadow = "2px 2px 2px rgba(0, 0, 0, 0.25)";
    t.style.position = "absolute";
    function update() {
        t.style.left = (d.offsetWidth - t.offsetWidth) * (x - low) / (high - low) + "px";
        t.style.top = (d.offsetHeight - t.offsetHeight) / 2 + "px";
    }

    function changed() {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        p.dispatchEvent(evt);
        i.value = (format || (x => x.toFixed(2)))(x);
        update();
    }

    i.value = (format || (x => x.toFixed(2)))(x);
    i.onchange = event => {
        event.preventDefault();
        event.stopPropagation();
        x = Math.max(low, Math.min(high, +i.value));
        changed();
    };
    update();
    t.onmousedown = event => {
        event.preventDefault();
        event.stopPropagation();
        i.focus();
        let ox = event.clientX, k = (high - low) / (d.offsetWidth - t.offsetWidth);
        function mm(event) {
            event.preventDefault();
            event.stopPropagation();
            x = Math.max(low, Math.min(high, x + (event.clientX - ox) * k));
            ox = event.clientX;
            changed();
        }
        function mu(event) {
            event.preventDefault();
            event.stopPropagation();
            document.removeEventListener("mousemove", mm);
            document.removeEventListener("mouseup", mu);
        }
        document.addEventListener("mousemove", mm);
        document.addEventListener("mouseup", mu);
    };
    function norec(f) {
        let cf = false;
        return function(...args) {
            let res = undefined;
            if (!cf) {
                cf = true;
                res = f(...args);
                cf = false;
            }
            return res;
        };
    }
    Object.defineProperty(p, "value", {
        get() { return x; },
        set: norec(v => {
            x = Math.max(low, Math.min(high, +v));
            changed();
        })
    });
    Object.defineProperty(p, "low", {
        get() { return low; },
        set: norec(v => { low = v; p.value = x; })
    });
    Object.defineProperty(p, "high", {
        get() { return high; },
        set: norec(v => { high = v; p.value = x; })
    });
    let focused = false;
    i.onfocus = () => focused = true;
    i.onblur = () => focused = false;
    p.onwheel = event => {
        if (focused) {
            event.preventDefault();
            event.stopPropagation();
            p.value = x + event.deltaY*[0.01, 0.1, 0.25][event.deltaMode]/20*(high-low);
        }
    };
    return p;
}
