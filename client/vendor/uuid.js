"use strict";!function(){function r(r,t){return Math.floor(Math.random()*(t-r))+r}function t(r){if("string"==typeof r)return/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(r)}function n(t){var n;if(void 0!==d){if(void 0===i||u+t>o.BUFFER_SIZE)if(u=0,d.getRandomValues)i=new Uint8Array(o.BUFFER_SIZE),d.getRandomValues(bytes);else{if(!d.randomBytes)throw new Error("Non-standard crypto library");i=d.randomBytes(o.BUFFER_SIZE)}return i.slice(u,u+=t)}for(n=[],f=0;f<t;f++)n.push(r(0,255));return n}function e(){var r=n(16);return r[6]=15&r[6]|64,r[8]=63&r[8]|128,r}function o(){var r=e();return a[r[0]]+a[r[1]]+a[r[2]]+a[r[3]]+"-"+a[r[4]]+a[r[5]]+"-"+a[r[6]]+a[r[7]]+"-"+a[r[8]]+a[r[9]]+"-"+a[r[10]]+a[r[11]]+a[r[12]]+a[r[13]]+a[r[14]]+a[r[15]]}var i,f,u=0,a=[];for(o.BUFFER_SIZE=512,o.bin=e,o.test=t,f=0;f<256;f++)a[f]=(f+256).toString(16).substr(1);if("undefined"!=typeof module&&"function"==typeof require){var d=require("crypto");module.exports=o}else"undefined"!=typeof window&&(window.uuid=o)}();
