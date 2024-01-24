app.directive('numberField', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});

//for ladda button
(function (t, e) { "object" == typeof exports ? module.exports = e() : "function" == typeof define && define.amd ? define(["spin"], e) : t.Ladda = e(t.Spinner) })(this, function (t) { "use strict"; function e(t) { if (t === void 0) return console.warn("Ladda button target must be defined."), void 0; t.querySelector(".ladda-label") || (t.innerHTML = '<span class="ladda-label">' + t.innerHTML + "</span>"); var e = i(t), n = document.createElement("span"); n.className = "ladda-spinner", t.appendChild(n); var r, a = { start: function () { return t.setAttribute("disabled", ""), t.setAttribute("data-loading", ""), clearTimeout(r), e.spin(n), this.setProgress(0), this }, startAfter: function (t) { return clearTimeout(r), r = setTimeout(function () { a.start() }, t), this }, stop: function () { return t.removeAttribute("disabled"), t.removeAttribute("data-loading"), clearTimeout(r), r = setTimeout(function () { e.stop() }, 1e3), this }, toggle: function () { return this.isLoading() ? this.stop() : this.start(), this }, setProgress: function (e) { e = Math.max(Math.min(e, 1), 0); var n = t.querySelector(".ladda-progress"); 0 === e && n && n.parentNode ? n.parentNode.removeChild(n) : (n || (n = document.createElement("div"), n.className = "ladda-progress", t.appendChild(n)), n.style.width = (e || 0) * t.offsetWidth + "px") }, enable: function () { return this.stop(), this }, disable: function () { return this.stop(), t.setAttribute("disabled", ""), this }, isLoading: function () { return t.hasAttribute("data-loading") } }; return o.push(a), a } function n(t, n) { n = n || {}; var r = []; "string" == typeof t ? r = a(document.querySelectorAll(t)) : "object" == typeof t && "string" == typeof t.nodeName && (r = [t]); for (var i = 0, o = r.length; o > i; i++) (function () { var t = r[i]; if ("function" == typeof t.addEventListener) { var a = e(t), o = -1; t.addEventListener("click", function () { a.startAfter(1), "number" == typeof n.timeout && (clearTimeout(o), o = setTimeout(a.stop, n.timeout)), "function" == typeof n.callback && n.callback.apply(null, [a]) }, !1) } })() } function r() { for (var t = 0, e = o.length; e > t; t++) o[t].stop() } function i(e) { var n, r = e.offsetHeight; r > 32 && (r *= .8), e.hasAttribute("data-spinner-size") && (r = parseInt(e.getAttribute("data-spinner-size"), 10)), e.hasAttribute("data-spinner-color") && (n = e.getAttribute("data-spinner-color")); var i = 12, a = .2 * r, o = .6 * a, s = 7 > a ? 2 : 3; return new t({ color: n || "#fff", lines: i, radius: a, length: o, width: s, zIndex: "auto", top: "auto", left: "auto", className: "" }) } function a(t) { for (var e = [], n = 0; t.length > n; n++) e.push(t[n]); return e } var o = []; return { bind: n, create: e, stopAll: r } });


String.prototype.limit = function (length) {
    return this.length > length ? (this.substring(0, length) + '...') : this;
}


function moveToProductRequirement(doWait) {
    if (doWait) {
        setTimeout(function () {
            $('html, body').animate({ scrollTop: $(".bookpost_div").offset().top - 144 }, 500);
        }, 350);
    }
    else {
        $('html, body').animate({ scrollTop: $(".bookpost_div").offset().top - 144 }, 500);
    }
}

function timeAgo(d) {

    //if (isNaN(d)) { return ''; }

    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    var d1 = new Date(d);
    var d2 = new Date();
    var diffhours = ((d2 - d1) / (1000 * 60 * 60));
    var diffmins = ((d2 - d1) / (1000 * 60));
    var diffsecs = ((d2 - d1) / (1000));

    if (diffsecs < 60) {
        return diffsecs.toFixed(0) + ' secs ago';
    }
    else if (diffmins < 60) {
        return diffmins.toFixed(0) + ' mins ago';
    }
    else if (diffhours < 24) {

        return diffhours.toFixed(0) + ' hour ago';
    }
    else if (diffhours > 24 && diffhours < 168) {

        var diffday = (diffhours / 24).toFixed(0);
        return diffday + (diffday == 1 ? ' day ago' : ' days ago');
    }
    else if (diffhours > 168 && diffhours < 672) {
        return (((diffhours + 168) / 24) / 7).toFixed(0) + ' weeks ago';
    }
    else {
        return monthNames[d1.getMonth()] + ' ’' + d1.getFullYear().toString().substr(2, 2) + '.';

    }
}

function ScaleImage(targetwidth, targetheight, fLetterBox, obj, resultHeightOffset, resultWidthOffset) {

    var result = { width: 0, height: 0, targetleft: 0, targettop: 0, fScaleToTargetWidth: true };

    if ((obj.imageWidth <= 0) || (obj.imageHeight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
        return result;
    }

    // scale to the target width
    var scaleX1 = targetwidth;
    var scaleY1 = (obj.imageHeight * targetwidth) / obj.imageWidth;

    // scale to the target height
    var scaleX2 = (obj.imageWidth * targetheight) / obj.imageHeight;
    var scaleY2 = targetheight;

    // now figure out which one we should use
    var fScaleOnWidth = (scaleX2 > targetwidth);
    if (fScaleOnWidth) {
        fScaleOnWidth = fLetterBox;
    }
    else {
        fScaleOnWidth = !fLetterBox;
    }

    if (fScaleOnWidth) {
        result.width = Math.floor(scaleX1);
        result.height = Math.floor(scaleY1);
        result.fScaleToTargetWidth = true;
    }
    else {
        result.width = Math.floor(scaleX2);
        result.height = Math.floor(scaleY2);
        result.fScaleToTargetWidth = false;
    }
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    if (result.height >= targetheight) {
        result.height = result.height - resultHeightOffset;
    }

    if (result.width >= targetwidth) {
        result.width = result.width - resultWidthOffset;
    }

    obj.t = result.targettop + 'px';
    obj.ww = targetwidth + 'px';
    obj.t = result.targettop + 'px';
    obj.l = result.targetleft + 'px';
    obj.h = result.height + 'px';
    obj.w = result.width + 'px';

    return obj;
    //return result;
}

