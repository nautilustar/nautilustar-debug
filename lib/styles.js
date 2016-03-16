"use strict";

/**
  * 8/16 Colors
  * @link http://misc.flogisoft.com/bash/tip_colors_and_formatting
  **/
var styles = {
    normal: [0, 0],

    bold: [1, 21],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    blink: [5, 25],
    reverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],

    default: [39, 39],
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    light_gray: [37, 39],
    dark_gray: [90, 39],
    light_red: [91, 39],
    light_green: [92, 39],
    light_yellow: [93, 39],
    light_blue: [94, 39],
    light_magenta: [95, 39],
    light_cyan: [96, 39],
    gray: [90, 39],
    grey: [90, 39],
    white: [97, 39],
};

Object.keys(styles).forEach(function (key){
    let s  = styles[key];
    styles[key] = [
        "\u001b[" + s[0] + "m",
        "\u001b[" + s[1] + "m",
    ];
});

module.exports = styles;
