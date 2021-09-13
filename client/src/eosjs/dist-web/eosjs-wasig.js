var eosjs_wasig;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/eosjs-numeric.ts":
/*!******************************!*\
  !*** ./src/eosjs-numeric.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.signatureToString = exports.stringToSignature = exports.privateKeyToString = exports.privateKeyToLegacyString = exports.stringToPrivateKey = exports.convertLegacyPublicKeys = exports.convertLegacyPublicKey = exports.publicKeyToString = exports.publicKeyToLegacyString = exports.stringToPublicKey = exports.signatureDataSize = exports.privateKeyDataSize = exports.publicKeyDataSize = exports.KeyType = exports.base64ToBinary = exports.binaryToBase58 = exports.base58ToBinary = exports.signedBinaryToDecimal = exports.binaryToDecimal = exports.signedDecimalToBinary = exports.decimalToBinary = exports.negate = exports.isNegative = void 0;
/**
 * @module Numeric
 */
var hash_js_1 = __webpack_require__(/*! hash.js */ "./node_modules/hash.js/lib/hash.js");
// copyright defined in eosjs/LICENSE.txt
var ripemd160 = __webpack_require__(/*! ./ripemd */ "./src/ripemd.js").RIPEMD160.hash;
var base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var create_base58_map = function () {
    var base58M = Array(256).fill(-1);
    for (var i = 0; i < base58Chars.length; ++i) {
        base58M[base58Chars.charCodeAt(i)] = i;
    }
    return base58M;
};
var base58Map = create_base58_map();
var create_base64_map = function () {
    var base64M = Array(256).fill(-1);
    for (var i = 0; i < base64Chars.length; ++i) {
        base64M[base64Chars.charCodeAt(i)] = i;
    }
    base64M['='.charCodeAt(0)] = 0;
    return base64M;
};
var base64Map = create_base64_map();
/** Is `bignum` a negative number? */
var isNegative = function (bignum) {
    return (bignum[bignum.length - 1] & 0x80) !== 0;
};
exports.isNegative = isNegative;
/** Negate `bignum` */
var negate = function (bignum) {
    var carry = 1;
    for (var i = 0; i < bignum.length; ++i) {
        var x = (~bignum[i] & 0xff) + carry;
        bignum[i] = x;
        carry = x >> 8;
    }
};
exports.negate = negate;
/**
 * Convert an unsigned decimal number in `s` to a bignum
 *
 * @param size bignum size (bytes)
 */
var decimalToBinary = function (size, s) {
    var result = new Uint8Array(size);
    for (var i = 0; i < s.length; ++i) {
        var srcDigit = s.charCodeAt(i);
        if (srcDigit < '0'.charCodeAt(0) || srcDigit > '9'.charCodeAt(0)) {
            throw new Error('invalid number');
        }
        var carry = srcDigit - '0'.charCodeAt(0);
        for (var j = 0; j < size; ++j) {
            var x = result[j] * 10 + carry;
            result[j] = x;
            carry = x >> 8;
        }
        if (carry) {
            throw new Error('number is out of range');
        }
    }
    return result;
};
exports.decimalToBinary = decimalToBinary;
/**
 * Convert a signed decimal number in `s` to a bignum
 *
 * @param size bignum size (bytes)
 */
var signedDecimalToBinary = function (size, s) {
    var negative = s[0] === '-';
    if (negative) {
        s = s.substr(1);
    }
    var result = (0, exports.decimalToBinary)(size, s);
    if (negative) {
        (0, exports.negate)(result);
        if (!(0, exports.isNegative)(result)) {
            throw new Error('number is out of range');
        }
    }
    else if ((0, exports.isNegative)(result)) {
        throw new Error('number is out of range');
    }
    return result;
};
exports.signedDecimalToBinary = signedDecimalToBinary;
/**
 * Convert `bignum` to an unsigned decimal number
 *
 * @param minDigits 0-pad result to this many digits
 */
var binaryToDecimal = function (bignum, minDigits) {
    if (minDigits === void 0) { minDigits = 1; }
    var result = Array(minDigits).fill('0'.charCodeAt(0));
    for (var i = bignum.length - 1; i >= 0; --i) {
        var carry = bignum[i];
        for (var j = 0; j < result.length; ++j) {
            var x = ((result[j] - '0'.charCodeAt(0)) << 8) + carry;
            result[j] = '0'.charCodeAt(0) + x % 10;
            carry = (x / 10) | 0;
        }
        while (carry) {
            result.push('0'.charCodeAt(0) + carry % 10);
            carry = (carry / 10) | 0;
        }
    }
    result.reverse();
    return String.fromCharCode.apply(String, __spreadArray([], __read(result), false));
};
exports.binaryToDecimal = binaryToDecimal;
/**
 * Convert `bignum` to a signed decimal number
 *
 * @param minDigits 0-pad result to this many digits
 */
var signedBinaryToDecimal = function (bignum, minDigits) {
    if (minDigits === void 0) { minDigits = 1; }
    if ((0, exports.isNegative)(bignum)) {
        var x = bignum.slice();
        (0, exports.negate)(x);
        return '-' + (0, exports.binaryToDecimal)(x, minDigits);
    }
    return (0, exports.binaryToDecimal)(bignum, minDigits);
};
exports.signedBinaryToDecimal = signedBinaryToDecimal;
var base58ToBinaryVarSize = function (s) {
    var e_1, _a;
    var result = [];
    for (var i = 0; i < s.length; ++i) {
        var carry = base58Map[s.charCodeAt(i)];
        if (carry < 0) {
            throw new Error('invalid base-58 value');
        }
        for (var j = 0; j < result.length; ++j) {
            var x = result[j] * 58 + carry;
            result[j] = x & 0xff;
            carry = x >> 8;
        }
        if (carry) {
            result.push(carry);
        }
    }
    try {
        for (var s_1 = __values(s), s_1_1 = s_1.next(); !s_1_1.done; s_1_1 = s_1.next()) {
            var ch = s_1_1.value;
            if (ch === '1') {
                result.push(0);
            }
            else {
                break;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (s_1_1 && !s_1_1.done && (_a = s_1.return)) _a.call(s_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    result.reverse();
    return new Uint8Array(result);
};
/**
 * Convert an unsigned base-58 number in `s` to a bignum
 *
 * @param size bignum size (bytes)
 */
var base58ToBinary = function (size, s) {
    if (!size) {
        return base58ToBinaryVarSize(s);
    }
    var result = new Uint8Array(size);
    for (var i = 0; i < s.length; ++i) {
        var carry = base58Map[s.charCodeAt(i)];
        if (carry < 0) {
            throw new Error('invalid base-58 value');
        }
        for (var j = 0; j < size; ++j) {
            var x = result[j] * 58 + carry;
            result[j] = x;
            carry = x >> 8;
        }
        if (carry) {
            throw new Error('base-58 value is out of range');
        }
    }
    result.reverse();
    return result;
};
exports.base58ToBinary = base58ToBinary;
/**
 * Convert `bignum` to a base-58 number
 *
 * @param minDigits 0-pad result to this many digits
 */
var binaryToBase58 = function (bignum, minDigits) {
    var e_2, _a, e_3, _b;
    if (minDigits === void 0) { minDigits = 1; }
    var result = [];
    try {
        for (var bignum_1 = __values(bignum), bignum_1_1 = bignum_1.next(); !bignum_1_1.done; bignum_1_1 = bignum_1.next()) {
            var byte = bignum_1_1.value;
            var carry = byte;
            for (var j = 0; j < result.length; ++j) {
                var x = (base58Map[result[j]] << 8) + carry;
                result[j] = base58Chars.charCodeAt(x % 58);
                carry = (x / 58) | 0;
            }
            while (carry) {
                result.push(base58Chars.charCodeAt(carry % 58));
                carry = (carry / 58) | 0;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (bignum_1_1 && !bignum_1_1.done && (_a = bignum_1.return)) _a.call(bignum_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    try {
        for (var bignum_2 = __values(bignum), bignum_2_1 = bignum_2.next(); !bignum_2_1.done; bignum_2_1 = bignum_2.next()) {
            var byte = bignum_2_1.value;
            if (byte) {
                break;
            }
            else {
                result.push('1'.charCodeAt(0));
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (bignum_2_1 && !bignum_2_1.done && (_b = bignum_2.return)) _b.call(bignum_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
    result.reverse();
    return String.fromCharCode.apply(String, __spreadArray([], __read(result), false));
};
exports.binaryToBase58 = binaryToBase58;
/** Convert an unsigned base-64 number in `s` to a bignum */
var base64ToBinary = function (s) {
    var len = s.length;
    if ((len & 3) === 1 && s[len - 1] === '=') {
        len -= 1;
    } // fc appends an extra '='
    if ((len & 3) !== 0) {
        throw new Error('base-64 value is not padded correctly');
    }
    var groups = len >> 2;
    var bytes = groups * 3;
    if (len > 0 && s[len - 1] === '=') {
        if (s[len - 2] === '=') {
            bytes -= 2;
        }
        else {
            bytes -= 1;
        }
    }
    var result = new Uint8Array(bytes);
    for (var group = 0; group < groups; ++group) {
        var digit0 = base64Map[s.charCodeAt(group * 4 + 0)];
        var digit1 = base64Map[s.charCodeAt(group * 4 + 1)];
        var digit2 = base64Map[s.charCodeAt(group * 4 + 2)];
        var digit3 = base64Map[s.charCodeAt(group * 4 + 3)];
        result[group * 3 + 0] = (digit0 << 2) | (digit1 >> 4);
        if (group * 3 + 1 < bytes) {
            result[group * 3 + 1] = ((digit1 & 15) << 4) | (digit2 >> 2);
        }
        if (group * 3 + 2 < bytes) {
            result[group * 3 + 2] = ((digit2 & 3) << 6) | digit3;
        }
    }
    return result;
};
exports.base64ToBinary = base64ToBinary;
/** Key types this library supports */
var KeyType;
(function (KeyType) {
    KeyType[KeyType["k1"] = 0] = "k1";
    KeyType[KeyType["r1"] = 1] = "r1";
    KeyType[KeyType["wa"] = 2] = "wa";
})(KeyType = exports.KeyType || (exports.KeyType = {}));
/** Public key data size, excluding type field */
exports.publicKeyDataSize = 33;
/** Private key data size, excluding type field */
exports.privateKeyDataSize = 32;
/** Signature data size, excluding type field */
exports.signatureDataSize = 65;
var digestSuffixRipemd160 = function (data, suffix) {
    var d = new Uint8Array(data.length + suffix.length);
    for (var i = 0; i < data.length; ++i) {
        d[i] = data[i];
    }
    for (var i = 0; i < suffix.length; ++i) {
        d[data.length + i] = suffix.charCodeAt(i);
    }
    return ripemd160(d);
};
var stringToKey = function (s, type, size, suffix) {
    var whole = (0, exports.base58ToBinary)(size ? size + 4 : 0, s);
    var result = { type: type, data: new Uint8Array(whole.buffer, 0, whole.length - 4) };
    var digest = new Uint8Array(digestSuffixRipemd160(result.data, suffix));
    if (digest[0] !== whole[whole.length - 4] || digest[1] !== whole[whole.length - 3]
        || digest[2] !== whole[whole.length - 2] || digest[3] !== whole[whole.length - 1]) {
        throw new Error('checksum doesn\'t match');
    }
    return result;
};
var keyToString = function (key, suffix, prefix) {
    var digest = new Uint8Array(digestSuffixRipemd160(key.data, suffix));
    var whole = new Uint8Array(key.data.length + 4);
    for (var i = 0; i < key.data.length; ++i) {
        whole[i] = key.data[i];
    }
    for (var i = 0; i < 4; ++i) {
        whole[i + key.data.length] = digest[i];
    }
    return prefix + (0, exports.binaryToBase58)(whole);
};
/** Convert key in `s` to binary form */
var stringToPublicKey = function (s) {
    if (typeof s !== 'string') {
        throw new Error('expected string containing public key');
    }
    if (s.substr(0, 3) === 'EOS') {
        var whole = (0, exports.base58ToBinary)(exports.publicKeyDataSize + 4, s.substr(3));
        var key = { type: KeyType.k1, data: new Uint8Array(exports.publicKeyDataSize) };
        for (var i = 0; i < exports.publicKeyDataSize; ++i) {
            key.data[i] = whole[i];
        }
        var digest = new Uint8Array(ripemd160(key.data));
        if (digest[0] !== whole[exports.publicKeyDataSize] || digest[1] !== whole[34]
            || digest[2] !== whole[35] || digest[3] !== whole[36]) {
            throw new Error('checksum doesn\'t match');
        }
        return key;
    }
    else if (s.substr(0, 7) === 'PUB_K1_') {
        return stringToKey(s.substr(7), KeyType.k1, exports.publicKeyDataSize, 'K1');
    }
    else if (s.substr(0, 7) === 'PUB_R1_') {
        return stringToKey(s.substr(7), KeyType.r1, exports.publicKeyDataSize, 'R1');
    }
    else if (s.substr(0, 7) === 'PUB_WA_') {
        return stringToKey(s.substr(7), KeyType.wa, 0, 'WA');
    }
    else {
        throw new Error('unrecognized public key format');
    }
};
exports.stringToPublicKey = stringToPublicKey;
/** Convert public `key` to legacy string (base-58) form */
var publicKeyToLegacyString = function (key) {
    if (key.type === KeyType.k1 && key.data.length === exports.publicKeyDataSize) {
        return keyToString(key, '', 'EOS');
    }
    else if (key.type === KeyType.r1 || key.type === KeyType.wa) {
        throw new Error('Key format not supported in legacy conversion');
    }
    else {
        throw new Error('unrecognized public key format');
    }
};
exports.publicKeyToLegacyString = publicKeyToLegacyString;
/** Convert `key` to string (base-58) form */
var publicKeyToString = function (key) {
    if (key.type === KeyType.k1 && key.data.length === exports.publicKeyDataSize) {
        return keyToString(key, 'K1', 'PUB_K1_');
    }
    else if (key.type === KeyType.r1 && key.data.length === exports.publicKeyDataSize) {
        return keyToString(key, 'R1', 'PUB_R1_');
    }
    else if (key.type === KeyType.wa) {
        return keyToString(key, 'WA', 'PUB_WA_');
    }
    else {
        throw new Error('unrecognized public key format');
    }
};
exports.publicKeyToString = publicKeyToString;
/** If a key is in the legacy format (`EOS` prefix), then convert it to the new format (`PUB_K1_`).
 * Leaves other formats untouched
 */
var convertLegacyPublicKey = function (s) {
    if (s.substr(0, 3) === 'EOS') {
        return (0, exports.publicKeyToString)((0, exports.stringToPublicKey)(s));
    }
    return s;
};
exports.convertLegacyPublicKey = convertLegacyPublicKey;
/** If a key is in the legacy format (`EOS` prefix), then convert it to the new format (`PUB_K1_`).
 * Leaves other formats untouched
 */
var convertLegacyPublicKeys = function (keys) {
    return keys.map(exports.convertLegacyPublicKey);
};
exports.convertLegacyPublicKeys = convertLegacyPublicKeys;
/** Convert key in `s` to binary form */
var stringToPrivateKey = function (s) {
    if (typeof s !== 'string') {
        throw new Error('expected string containing private key');
    }
    if (s.substr(0, 7) === 'PVT_R1_') {
        return stringToKey(s.substr(7), KeyType.r1, exports.privateKeyDataSize, 'R1');
    }
    else if (s.substr(0, 7) === 'PVT_K1_') {
        return stringToKey(s.substr(7), KeyType.k1, exports.privateKeyDataSize, 'K1');
    }
    else {
        // todo: Verify checksum: sha256(sha256(key.data)).
        //       Not critical since a bad key will fail to produce a
        //       valid signature anyway.
        var whole = (0, exports.base58ToBinary)(exports.privateKeyDataSize + 5, s);
        var key = { type: KeyType.k1, data: new Uint8Array(exports.privateKeyDataSize) };
        if (whole[0] !== 0x80) {
            throw new Error('unrecognized private key type');
        }
        for (var i = 0; i < exports.privateKeyDataSize; ++i) {
            key.data[i] = whole[i + 1];
        }
        return key;
    }
};
exports.stringToPrivateKey = stringToPrivateKey;
/** Convert private `key` to legacy string (base-58) form */
var privateKeyToLegacyString = function (key) {
    if (key.type === KeyType.k1 && key.data.length === exports.privateKeyDataSize) {
        var whole_1 = [];
        whole_1.push(128);
        key.data.forEach(function (byte) { return whole_1.push(byte); });
        var digest = new Uint8Array((0, hash_js_1.sha256)().update((0, hash_js_1.sha256)().update(whole_1).digest()).digest());
        var result = new Uint8Array(exports.privateKeyDataSize + 5);
        for (var i = 0; i < whole_1.length; i++) {
            result[i] = whole_1[i];
        }
        for (var i = 0; i < 4; i++) {
            result[i + whole_1.length] = digest[i];
        }
        return (0, exports.binaryToBase58)(result);
    }
    else if (key.type === KeyType.r1 || key.type === KeyType.wa) {
        throw new Error('Key format not supported in legacy conversion');
    }
    else {
        throw new Error('unrecognized public key format');
    }
};
exports.privateKeyToLegacyString = privateKeyToLegacyString;
/** Convert `key` to string (base-58) form */
var privateKeyToString = function (key) {
    if (key.type === KeyType.r1) {
        return keyToString(key, 'R1', 'PVT_R1_');
    }
    else if (key.type === KeyType.k1) {
        return keyToString(key, 'K1', 'PVT_K1_');
    }
    else {
        throw new Error('unrecognized private key format');
    }
};
exports.privateKeyToString = privateKeyToString;
/** Convert key in `s` to binary form */
var stringToSignature = function (s) {
    if (typeof s !== 'string') {
        throw new Error('expected string containing signature');
    }
    if (s.substr(0, 7) === 'SIG_K1_') {
        return stringToKey(s.substr(7), KeyType.k1, exports.signatureDataSize, 'K1');
    }
    else if (s.substr(0, 7) === 'SIG_R1_') {
        return stringToKey(s.substr(7), KeyType.r1, exports.signatureDataSize, 'R1');
    }
    else if (s.substr(0, 7) === 'SIG_WA_') {
        return stringToKey(s.substr(7), KeyType.wa, 0, 'WA');
    }
    else {
        throw new Error('unrecognized signature format');
    }
};
exports.stringToSignature = stringToSignature;
/** Convert `signature` to string (base-58) form */
var signatureToString = function (signature) {
    if (signature.type === KeyType.k1) {
        return keyToString(signature, 'K1', 'SIG_K1_');
    }
    else if (signature.type === KeyType.r1) {
        return keyToString(signature, 'R1', 'SIG_R1_');
    }
    else if (signature.type === KeyType.wa) {
        return keyToString(signature, 'WA', 'SIG_WA_');
    }
    else {
        throw new Error('unrecognized signature format');
    }
};
exports.signatureToString = signatureToString;


/***/ }),

/***/ "./src/eosjs-serialize.ts":
/*!********************************!*\
  !*** ./src/eosjs-serialize.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * @module Serialize
 */
// copyright defined in eosjs/LICENSE.txt
/* eslint-disable max-classes-per-file */
/* eslint-disable jsdoc/check-indentation */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.serializeQuery = exports.deserializeAnyArray = exports.serializeAnyArray = exports.deserializeAnyObject = exports.serializeAnyObject = exports.deserializeAnyvarShort = exports.deserializeAnyvar = exports.serializeAnyvar = exports.deserializeAction = exports.deserializeActionData = exports.serializeAction = exports.serializeActionData = exports.transactionHeader = exports.getTypesFromAbi = exports.getType = exports.createTransactionTypes = exports.createTransactionExtensionTypes = exports.createAbiTypes = exports.createInitialTypes = exports.hexToUint8Array = exports.arrayToHex = exports.symbolToString = exports.stringToSymbol = exports.blockTimestampToDate = exports.dateToBlockTimestamp = exports.timePointSecToDate = exports.dateToTimePointSec = exports.timePointToDate = exports.dateToTimePoint = exports.supportedAbiVersion = exports.SerialBuffer = exports.SerializerState = void 0;
var numeric = __webpack_require__(/*! ./eosjs-numeric */ "./src/eosjs-numeric.ts");
/** State for serialize() and deserialize() */
var SerializerState = /** @class */ (function () {
    function SerializerState(options) {
        if (options === void 0) { options = {}; }
        /** Have any binary extensions been skipped? */
        this.skippedBinaryExtension = false;
        this.options = options;
    }
    return SerializerState;
}());
exports.SerializerState = SerializerState;
/** Serialize and deserialize data */
var SerialBuffer = /** @class */ (function () {
    /**
     * @param __namedParameters
     * `array`: `null` if serializing, or binary data to deserialize
     * `textEncoder`: `TextEncoder` instance to use. Pass in `null` if running in a browser
     * `textDecoder`: `TextDecider` instance to use. Pass in `null` if running in a browser
     */
    function SerialBuffer(_a) {
        var _b = _a === void 0 ? {} : _a, textEncoder = _b.textEncoder, textDecoder = _b.textDecoder, array = _b.array;
        /** Current position while reading (deserializing) */
        this.readPos = 0;
        this.array = array || new Uint8Array(1024);
        this.length = array ? array.length : 0;
        this.textEncoder = textEncoder || new TextEncoder();
        this.textDecoder = textDecoder || new TextDecoder('utf-8', { fatal: true });
    }
    /** Resize `array` if needed to have at least `size` bytes free */
    SerialBuffer.prototype.reserve = function (size) {
        if (this.length + size <= this.array.length) {
            return;
        }
        var l = this.array.length;
        while (this.length + size > l) {
            l = Math.ceil(l * 1.5);
        }
        var newArray = new Uint8Array(l);
        newArray.set(this.array);
        this.array = newArray;
    };
    /** Is there data available to read? */
    SerialBuffer.prototype.haveReadData = function () {
        return this.readPos < this.length;
    };
    /** Restart reading from the beginning */
    SerialBuffer.prototype.restartRead = function () {
        this.readPos = 0;
    };
    /** Return data with excess storage trimmed away */
    SerialBuffer.prototype.asUint8Array = function () {
        return new Uint8Array(this.array.buffer, this.array.byteOffset, this.length);
    };
    /** Append bytes */
    SerialBuffer.prototype.pushArray = function (v) {
        this.reserve(v.length);
        this.array.set(v, this.length);
        this.length += v.length;
    };
    /** Append bytes */
    SerialBuffer.prototype.push = function () {
        var v = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            v[_i] = arguments[_i];
        }
        this.pushArray(v);
    };
    /** Get a single byte */
    SerialBuffer.prototype.get = function () {
        if (this.readPos < this.length) {
            return this.array[this.readPos++];
        }
        throw new Error('Read past end of buffer');
    };
    /** Append bytes in `v`. Throws if `len` doesn't match `v.length` */
    SerialBuffer.prototype.pushUint8ArrayChecked = function (v, len) {
        if (v.length !== len) {
            throw new Error('Binary data has incorrect size');
        }
        this.pushArray(v);
    };
    /** Get `len` bytes */
    SerialBuffer.prototype.getUint8Array = function (len) {
        if (this.readPos + len > this.length) {
            throw new Error('Read past end of buffer');
        }
        var result = new Uint8Array(this.array.buffer, this.array.byteOffset + this.readPos, len);
        this.readPos += len;
        return result;
    };
    /** Skip `len` bytes */
    SerialBuffer.prototype.skip = function (len) {
        if (this.readPos + len > this.length) {
            throw new Error('Read past end of buffer');
        }
        this.readPos += len;
    };
    /** Append a `uint16` */
    SerialBuffer.prototype.pushUint16 = function (v) {
        this.push((v >> 0) & 0xff, (v >> 8) & 0xff);
    };
    /** Get a `uint16` */
    SerialBuffer.prototype.getUint16 = function () {
        var v = 0;
        v |= this.get() << 0;
        v |= this.get() << 8;
        return v;
    };
    /** Append a `uint32` */
    SerialBuffer.prototype.pushUint32 = function (v) {
        this.push((v >> 0) & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >> 24) & 0xff);
    };
    /** Get a `uint32` */
    SerialBuffer.prototype.getUint32 = function () {
        var v = 0;
        v |= this.get() << 0;
        v |= this.get() << 8;
        v |= this.get() << 16;
        v |= this.get() << 24;
        return v >>> 0;
    };
    /** Append a `uint64`. *Caution*: `number` only has 53 bits of precision */
    SerialBuffer.prototype.pushNumberAsUint64 = function (v) {
        this.pushUint32(v >>> 0);
        this.pushUint32(Math.floor(v / 4294967296) >>> 0);
    };
    /**
     * Get a `uint64` as a `number`. *Caution*: `number` only has 53 bits of precision; some values will change.
     * `numeric.binaryToDecimal(serialBuffer.getUint8Array(8))` recommended instead
     */
    SerialBuffer.prototype.getUint64AsNumber = function () {
        var low = this.getUint32();
        var high = this.getUint32();
        return (high >>> 0) * 4294967296 + (low >>> 0);
    };
    /** Append a `varuint32` */
    SerialBuffer.prototype.pushVaruint32 = function (v) {
        while (true) {
            if (v >>> 7) {
                this.push(0x80 | (v & 0x7f));
                v = v >>> 7;
            }
            else {
                this.push(v);
                break;
            }
        }
    };
    /** Get a `varuint32` */
    SerialBuffer.prototype.getVaruint32 = function () {
        var v = 0;
        var bit = 0;
        while (true) {
            var b = this.get();
            v |= (b & 0x7f) << bit;
            bit += 7;
            if (!(b & 0x80)) {
                break;
            }
        }
        return v >>> 0;
    };
    /** Append a `varint32` */
    SerialBuffer.prototype.pushVarint32 = function (v) {
        this.pushVaruint32((v << 1) ^ (v >> 31));
    };
    /** Get a `varint32` */
    SerialBuffer.prototype.getVarint32 = function () {
        var v = this.getVaruint32();
        if (v & 1) {
            return ((~v) >> 1) | 2147483648;
        }
        else {
            return v >>> 1;
        }
    };
    /** Append a `float32` */
    SerialBuffer.prototype.pushFloat32 = function (v) {
        this.pushArray(new Uint8Array((new Float32Array([v])).buffer));
    };
    /** Get a `float32` */
    SerialBuffer.prototype.getFloat32 = function () {
        return new Float32Array(this.getUint8Array(4).slice().buffer)[0];
    };
    /** Append a `float64` */
    SerialBuffer.prototype.pushFloat64 = function (v) {
        this.pushArray(new Uint8Array((new Float64Array([v])).buffer));
    };
    /** Get a `float64` */
    SerialBuffer.prototype.getFloat64 = function () {
        return new Float64Array(this.getUint8Array(8).slice().buffer)[0];
    };
    /** Append a `name` */
    SerialBuffer.prototype.pushName = function (s) {
        if (typeof s !== 'string') {
            throw new Error('Expected string containing name');
        }
        var regex = new RegExp(/^[.1-5a-z]{0,12}[.1-5a-j]?$/);
        if (!regex.test(s)) {
            throw new Error('Name should be less than 13 characters, or less than 14 if last character is between 1-5 or a-j, and only contain the following symbols .12345abcdefghijklmnopqrstuvwxyz'); // eslint-disable-line
        }
        var charToSymbol = function (c) {
            if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) {
                return (c - 'a'.charCodeAt(0)) + 6;
            }
            if (c >= '1'.charCodeAt(0) && c <= '5'.charCodeAt(0)) {
                return (c - '1'.charCodeAt(0)) + 1;
            }
            return 0;
        };
        var a = new Uint8Array(8);
        var bit = 63;
        for (var i = 0; i < s.length; ++i) {
            var c = charToSymbol(s.charCodeAt(i));
            if (bit < 5) {
                c = c << 1;
            }
            for (var j = 4; j >= 0; --j) {
                if (bit >= 0) {
                    a[Math.floor(bit / 8)] |= ((c >> j) & 1) << (bit % 8);
                    --bit;
                }
            }
        }
        this.pushArray(a);
    };
    /** Get a `name` */
    SerialBuffer.prototype.getName = function () {
        var a = this.getUint8Array(8);
        var result = '';
        for (var bit = 63; bit >= 0;) {
            var c = 0;
            for (var i = 0; i < 5; ++i) {
                if (bit >= 0) {
                    c = (c << 1) | ((a[Math.floor(bit / 8)] >> (bit % 8)) & 1);
                    --bit;
                }
            }
            if (c >= 6) {
                result += String.fromCharCode(c + 'a'.charCodeAt(0) - 6);
            }
            else if (c >= 1) {
                result += String.fromCharCode(c + '1'.charCodeAt(0) - 1);
            }
            else {
                result += '.';
            }
        }
        while (result.endsWith('.')) {
            result = result.substr(0, result.length - 1);
        }
        return result;
    };
    /** Append length-prefixed binary data */
    SerialBuffer.prototype.pushBytes = function (v) {
        this.pushVaruint32(v.length);
        this.pushArray(v);
    };
    /** Get length-prefixed binary data */
    SerialBuffer.prototype.getBytes = function () {
        return this.getUint8Array(this.getVaruint32());
    };
    /** Append a string */
    SerialBuffer.prototype.pushString = function (v) {
        this.pushBytes(this.textEncoder.encode(v));
    };
    /** Get a string */
    SerialBuffer.prototype.getString = function () {
        return this.textDecoder.decode(this.getBytes());
    };
    /** Append a `symbol_code`. Unlike `symbol`, `symbol_code` doesn't include a precision. */
    SerialBuffer.prototype.pushSymbolCode = function (name) {
        if (typeof name !== 'string') {
            throw new Error('Expected string containing symbol_code');
        }
        var a = [];
        a.push.apply(a, __spreadArray([], __read(this.textEncoder.encode(name)), false));
        while (a.length < 8) {
            a.push(0);
        }
        this.pushArray(a.slice(0, 8));
    };
    /** Get a `symbol_code`. Unlike `symbol`, `symbol_code` doesn't include a precision. */
    SerialBuffer.prototype.getSymbolCode = function () {
        var a = this.getUint8Array(8);
        var len;
        for (len = 0; len < a.length; ++len) {
            if (!a[len]) {
                break;
            }
        }
        var name = this.textDecoder.decode(new Uint8Array(a.buffer, a.byteOffset, len));
        return name;
    };
    /** Append a `symbol` */
    SerialBuffer.prototype.pushSymbol = function (_a) {
        var name = _a.name, precision = _a.precision;
        if (!/^[A-Z]{1,7}$/.test(name)) {
            throw new Error('Expected symbol to be A-Z and between one and seven characters');
        }
        var a = [precision & 0xff];
        a.push.apply(a, __spreadArray([], __read(this.textEncoder.encode(name)), false));
        while (a.length < 8) {
            a.push(0);
        }
        this.pushArray(a.slice(0, 8));
    };
    /** Get a `symbol` */
    SerialBuffer.prototype.getSymbol = function () {
        var precision = this.get();
        var a = this.getUint8Array(7);
        var len;
        for (len = 0; len < a.length; ++len) {
            if (!a[len]) {
                break;
            }
        }
        var name = this.textDecoder.decode(new Uint8Array(a.buffer, a.byteOffset, len));
        return { name: name, precision: precision };
    };
    /** Append an asset */
    SerialBuffer.prototype.pushAsset = function (s) {
        if (typeof s !== 'string') {
            throw new Error('Expected string containing asset');
        }
        s = s.trim();
        var pos = 0;
        var amount = '';
        var precision = 0;
        if (s[pos] === '-') {
            amount += '-';
            ++pos;
        }
        var foundDigit = false;
        while (pos < s.length && s.charCodeAt(pos) >= '0'.charCodeAt(0) && s.charCodeAt(pos) <= '9'.charCodeAt(0)) {
            foundDigit = true;
            amount += s[pos];
            ++pos;
        }
        if (!foundDigit) {
            throw new Error('Asset must begin with a number');
        }
        if (s[pos] === '.') {
            ++pos;
            while (pos < s.length && s.charCodeAt(pos) >= '0'.charCodeAt(0) && s.charCodeAt(pos) <= '9'.charCodeAt(0)) {
                amount += s[pos];
                ++precision;
                ++pos;
            }
        }
        var name = s.substr(pos).trim();
        this.pushArray(numeric.signedDecimalToBinary(8, amount));
        this.pushSymbol({ name: name, precision: precision });
    };
    /** Get an asset */
    SerialBuffer.prototype.getAsset = function () {
        var amount = this.getUint8Array(8);
        var _a = this.getSymbol(), name = _a.name, precision = _a.precision;
        var s = numeric.signedBinaryToDecimal(amount, precision + 1);
        if (precision) {
            s = s.substr(0, s.length - precision) + '.' + s.substr(s.length - precision);
        }
        return s + ' ' + name;
    };
    /** Append a public key */
    SerialBuffer.prototype.pushPublicKey = function (s) {
        var key = numeric.stringToPublicKey(s);
        this.push(key.type);
        this.pushArray(key.data);
    };
    /** Get a public key */
    SerialBuffer.prototype.getPublicKey = function () {
        var type = this.get();
        var data;
        if (type === numeric.KeyType.wa) {
            var begin = this.readPos;
            this.skip(34);
            this.skip(this.getVaruint32());
            data = new Uint8Array(this.array.buffer, this.array.byteOffset + begin, this.readPos - begin);
        }
        else {
            data = this.getUint8Array(numeric.publicKeyDataSize);
        }
        return numeric.publicKeyToString({ type: type, data: data });
    };
    /** Append a private key */
    SerialBuffer.prototype.pushPrivateKey = function (s) {
        var key = numeric.stringToPrivateKey(s);
        this.push(key.type);
        this.pushArray(key.data);
    };
    /** Get a private key */
    SerialBuffer.prototype.getPrivateKey = function () {
        var type = this.get();
        var data = this.getUint8Array(numeric.privateKeyDataSize);
        return numeric.privateKeyToString({ type: type, data: data });
    };
    /** Append a signature */
    SerialBuffer.prototype.pushSignature = function (s) {
        var key = numeric.stringToSignature(s);
        this.push(key.type);
        this.pushArray(key.data);
    };
    /** Get a signature */
    SerialBuffer.prototype.getSignature = function () {
        var type = this.get();
        var data;
        if (type === numeric.KeyType.wa) {
            var begin = this.readPos;
            this.skip(65);
            this.skip(this.getVaruint32());
            this.skip(this.getVaruint32());
            data = new Uint8Array(this.array.buffer, this.array.byteOffset + begin, this.readPos - begin);
        }
        else {
            data = this.getUint8Array(numeric.signatureDataSize);
        }
        return numeric.signatureToString({ type: type, data: data });
    };
    return SerialBuffer;
}()); // SerialBuffer
exports.SerialBuffer = SerialBuffer;
/** Is this a supported ABI version? */
var supportedAbiVersion = function (version) {
    return version.startsWith('eosio::abi/1.');
};
exports.supportedAbiVersion = supportedAbiVersion;
var checkDateParse = function (date) {
    var result = Date.parse(date);
    if (Number.isNaN(result)) {
        throw new Error('Invalid time format');
    }
    return result;
};
/** Convert date in ISO format to `time_point` (miliseconds since epoch) */
var dateToTimePoint = function (date) {
    return Math.round(checkDateParse(date + 'Z') * 1000);
};
exports.dateToTimePoint = dateToTimePoint;
/** Convert `time_point` (miliseconds since epoch) to date in ISO format */
var timePointToDate = function (us) {
    var s = (new Date(us / 1000)).toISOString();
    return s.substr(0, s.length - 1);
};
exports.timePointToDate = timePointToDate;
/** Convert date in ISO format to `time_point_sec` (seconds since epoch) */
var dateToTimePointSec = function (date) {
    return Math.round(checkDateParse(date + 'Z') / 1000);
};
exports.dateToTimePointSec = dateToTimePointSec;
/** Convert `time_point_sec` (seconds since epoch) to to date in ISO format */
var timePointSecToDate = function (sec) {
    var s = (new Date(sec * 1000)).toISOString();
    return s.substr(0, s.length - 1);
};
exports.timePointSecToDate = timePointSecToDate;
/** Convert date in ISO format to `block_timestamp_type` (half-seconds since a different epoch) */
var dateToBlockTimestamp = function (date) {
    return Math.round((checkDateParse(date + 'Z') - 946684800000) / 500);
};
exports.dateToBlockTimestamp = dateToBlockTimestamp;
/** Convert `block_timestamp_type` (half-seconds since a different epoch) to to date in ISO format */
var blockTimestampToDate = function (slot) {
    var s = (new Date(slot * 500 + 946684800000)).toISOString();
    return s.substr(0, s.length - 1);
};
exports.blockTimestampToDate = blockTimestampToDate;
/** Convert `string` to `Symbol`. format: `precision,NAME`. */
var stringToSymbol = function (s) {
    if (typeof s !== 'string') {
        throw new Error('Expected string containing symbol');
    }
    var m = s.match(/^([0-9]+),([A-Z]+)$/);
    if (!m) {
        throw new Error('Invalid symbol');
    }
    return { name: m[2], precision: +m[1] };
};
exports.stringToSymbol = stringToSymbol;
/** Convert `Symbol` to `string`. format: `precision,NAME`. */
var symbolToString = function (_a) {
    var name = _a.name, precision = _a.precision;
    return precision + ',' + name;
};
exports.symbolToString = symbolToString;
/** Convert binary data to hex */
var arrayToHex = function (data) {
    var e_1, _a;
    var result = '';
    try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
            var x = data_1_1.value;
            result += ('00' + x.toString(16)).slice(-2);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result.toUpperCase();
};
exports.arrayToHex = arrayToHex;
/** Convert hex to binary data */
var hexToUint8Array = function (hex) {
    if (typeof hex !== 'string') {
        throw new Error('Expected string containing hex digits');
    }
    if (hex.length % 2) {
        throw new Error('Odd number of hex digits');
    }
    var l = hex.length / 2;
    var result = new Uint8Array(l);
    for (var i = 0; i < l; ++i) {
        var x = parseInt(hex.substr(i * 2, 2), 16);
        if (Number.isNaN(x)) {
            throw new Error('Expected hex string');
        }
        result[i] = x;
    }
    return result;
};
exports.hexToUint8Array = hexToUint8Array;
function serializeUnknown(buffer, data) {
    throw new Error('Don\'t know how to serialize ' + this.name);
}
function deserializeUnknown(buffer) {
    throw new Error('Don\'t know how to deserialize ' + this.name);
}
function serializeStruct(buffer, data, state, allowExtensions) {
    var e_2, _a;
    if (state === void 0) { state = new SerializerState(); }
    if (allowExtensions === void 0) { allowExtensions = true; }
    if (typeof data !== 'object') {
        throw new Error('expected object containing data: ' + JSON.stringify(data));
    }
    if (this.base) {
        this.base.serialize(buffer, data, state, allowExtensions);
    }
    try {
        for (var _b = __values(this.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
            var field = _c.value;
            if (field.name in data) {
                if (state.skippedBinaryExtension) {
                    throw new Error('unexpected ' + this.name + '.' + field.name);
                }
                field.type.serialize(buffer, data[field.name], state, allowExtensions && field === this.fields[this.fields.length - 1]);
            }
            else {
                if (allowExtensions && field.type.extensionOf) {
                    state.skippedBinaryExtension = true;
                }
                else {
                    throw new Error('missing ' + this.name + '.' + field.name + ' (type=' + field.type.name + ')');
                }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
function deserializeStruct(buffer, state, allowExtensions) {
    var e_3, _a;
    if (state === void 0) { state = new SerializerState(); }
    if (allowExtensions === void 0) { allowExtensions = true; }
    var result;
    if (this.base) {
        result = this.base.deserialize(buffer, state, allowExtensions);
    }
    else {
        result = {};
    }
    try {
        for (var _b = __values(this.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
            var field = _c.value;
            if (allowExtensions && field.type.extensionOf && !buffer.haveReadData()) {
                state.skippedBinaryExtension = true;
            }
            else {
                result[field.name] = field.type.deserialize(buffer, state, allowExtensions);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return result;
}
function serializeVariant(buffer, data, state, allowExtensions) {
    if (!Array.isArray(data) || data.length !== 2 || typeof data[0] !== 'string') {
        throw new Error('expected variant: ["type", value]');
    }
    var i = this.fields.findIndex(function (field) { return field.name === data[0]; });
    if (i < 0) {
        throw new Error("type \"" + data[0] + "\" is not valid for variant");
    }
    buffer.pushVaruint32(i);
    this.fields[i].type.serialize(buffer, data[1], state, allowExtensions);
}
function deserializeVariant(buffer, state, allowExtensions) {
    var i = buffer.getVaruint32();
    if (i >= this.fields.length) {
        throw new Error("type index " + i + " is not valid for variant");
    }
    var field = this.fields[i];
    return [field.name, field.type.deserialize(buffer, state, allowExtensions)];
}
function serializeArray(buffer, data, state, allowExtensions) {
    var e_4, _a;
    buffer.pushVaruint32(data.length);
    try {
        for (var data_2 = __values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
            var item = data_2_1.value;
            this.arrayOf.serialize(buffer, item, state, false);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (data_2_1 && !data_2_1.done && (_a = data_2.return)) _a.call(data_2);
        }
        finally { if (e_4) throw e_4.error; }
    }
}
function deserializeArray(buffer, state, allowExtensions) {
    var len = buffer.getVaruint32();
    var result = [];
    for (var i = 0; i < len; ++i) {
        result.push(this.arrayOf.deserialize(buffer, state, false));
    }
    return result;
}
function serializeOptional(buffer, data, state, allowExtensions) {
    if (data === null || data === undefined) {
        buffer.push(0);
    }
    else {
        buffer.push(1);
        this.optionalOf.serialize(buffer, data, state, allowExtensions);
    }
}
function deserializeOptional(buffer, state, allowExtensions) {
    if (buffer.get()) {
        return this.optionalOf.deserialize(buffer, state, allowExtensions);
    }
    else {
        return null;
    }
}
function serializeExtension(buffer, data, state, allowExtensions) {
    this.extensionOf.serialize(buffer, data, state, allowExtensions);
}
function deserializeExtension(buffer, state, allowExtensions) {
    return this.extensionOf.deserialize(buffer, state, allowExtensions);
}
function serializeObject(buffer, data, state, allowExtensions) {
    var e_5, _a;
    var entries = Object.entries(data);
    buffer.pushVaruint32(entries.length);
    try {
        for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
            var _b = __read(entries_1_1.value, 2), key = _b[0], value = _b[1];
            var keyType = this.fields[0].type;
            var dataType = this.fields[1].type;
            keyType.serialize(buffer, key, state, allowExtensions);
            dataType.serialize(buffer, value, state, allowExtensions);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
}
function deserializeObject(buffer, state, allowExtensions) {
    var len = buffer.getVaruint32();
    var result = {};
    for (var i = 0; i < len; ++i) {
        var keyType = this.fields[0].type;
        var dataType = this.fields[1].type;
        var key = keyType.deserialize(buffer, state, allowExtensions);
        result[key] = dataType.deserialize(buffer, state, allowExtensions);
    }
    return result;
}
function serializePair(buffer, data, state, allowExtensions) {
    var _this = this;
    buffer.pushVaruint32(data.length);
    data.forEach(function (item) {
        _this.fields[0].type.serialize(buffer, item[0], state, allowExtensions);
        _this.fields[1].type.serialize(buffer, item[1], state, allowExtensions);
    });
}
function deserializePair(buffer, state, allowExtensions) {
    var result = [];
    var len = buffer.getVaruint32();
    for (var i = 0; i < len; ++i) {
        result.push(this.fields[0].type.deserialize(buffer, state, allowExtensions));
        result.push(this.fields[1].type.deserialize(buffer, state, allowExtensions));
    }
    return result;
}
var createType = function (attrs) {
    return __assign({ name: '<missing name>', aliasOfName: '', arrayOf: null, optionalOf: null, extensionOf: null, baseName: '', base: null, fields: [], serialize: serializeUnknown, deserialize: deserializeUnknown }, attrs);
};
var checkRange = function (orig, converted) {
    if (Number.isNaN(+orig) || Number.isNaN(+converted) || (typeof orig !== 'number' && typeof orig !== 'string')) {
        throw new Error('Expected number');
    }
    if (+orig !== +converted) {
        throw new Error('Number is out of range');
    }
    return +orig;
};
/** Create the set of types built-in to the abi format */
var createInitialTypes = function () {
    var result = new Map(Object.entries({
        bool: createType({
            name: 'bool',
            serialize: function (buffer, data) {
                if (!(typeof data === 'boolean' || typeof data === 'number' && (data === 1 || data === 0))) {
                    throw new Error('Expected boolean or number equal to 1 or 0');
                }
                buffer.push(data ? 1 : 0);
            },
            deserialize: function (buffer) { return !!buffer.get(); },
        }),
        uint8: createType({
            name: 'uint8',
            serialize: function (buffer, data) { buffer.push(checkRange(data, data & 0xff)); },
            deserialize: function (buffer) { return buffer.get(); },
        }),
        int8: createType({
            name: 'int8',
            serialize: function (buffer, data) { buffer.push(checkRange(data, data << 24 >> 24)); },
            deserialize: function (buffer) { return buffer.get() << 24 >> 24; },
        }),
        uint16: createType({
            name: 'uint16',
            serialize: function (buffer, data) { buffer.pushUint16(checkRange(data, data & 0xffff)); },
            deserialize: function (buffer) { return buffer.getUint16(); },
        }),
        int16: createType({
            name: 'int16',
            serialize: function (buffer, data) { buffer.pushUint16(checkRange(data, data << 16 >> 16)); },
            deserialize: function (buffer) { return buffer.getUint16() << 16 >> 16; },
        }),
        uint32: createType({
            name: 'uint32',
            serialize: function (buffer, data) { buffer.pushUint32(checkRange(data, data >>> 0)); },
            deserialize: function (buffer) { return buffer.getUint32(); },
        }),
        uint64: createType({
            name: 'uint64',
            serialize: function (buffer, data) {
                buffer.pushArray(numeric.decimalToBinary(8, '' + data));
            },
            deserialize: function (buffer) { return numeric.binaryToDecimal(buffer.getUint8Array(8)); },
        }),
        int64: createType({
            name: 'int64',
            serialize: function (buffer, data) {
                buffer.pushArray(numeric.signedDecimalToBinary(8, '' + data));
            },
            deserialize: function (buffer) { return numeric.signedBinaryToDecimal(buffer.getUint8Array(8)); },
        }),
        int32: createType({
            name: 'int32',
            serialize: function (buffer, data) { buffer.pushUint32(checkRange(data, data | 0)); },
            deserialize: function (buffer) { return buffer.getUint32() | 0; },
        }),
        varuint32: createType({
            name: 'varuint32',
            serialize: function (buffer, data) { buffer.pushVaruint32(checkRange(data, data >>> 0)); },
            deserialize: function (buffer) { return buffer.getVaruint32(); },
        }),
        varint32: createType({
            name: 'varint32',
            serialize: function (buffer, data) { buffer.pushVarint32(checkRange(data, data | 0)); },
            deserialize: function (buffer) { return buffer.getVarint32(); },
        }),
        uint128: createType({
            name: 'uint128',
            serialize: function (buffer, data) { buffer.pushArray(numeric.decimalToBinary(16, '' + data)); },
            deserialize: function (buffer) { return numeric.binaryToDecimal(buffer.getUint8Array(16)); },
        }),
        int128: createType({
            name: 'int128',
            serialize: function (buffer, data) {
                buffer.pushArray(numeric.signedDecimalToBinary(16, '' + data));
            },
            deserialize: function (buffer) { return numeric.signedBinaryToDecimal(buffer.getUint8Array(16)); },
        }),
        float32: createType({
            name: 'float32',
            serialize: function (buffer, data) { buffer.pushFloat32(data); },
            deserialize: function (buffer) { return buffer.getFloat32(); },
        }),
        float64: createType({
            name: 'float64',
            serialize: function (buffer, data) { buffer.pushFloat64(data); },
            deserialize: function (buffer) { return buffer.getFloat64(); },
        }),
        float128: createType({
            name: 'float128',
            serialize: function (buffer, data) { buffer.pushUint8ArrayChecked((0, exports.hexToUint8Array)(data), 16); },
            deserialize: function (buffer) { return (0, exports.arrayToHex)(buffer.getUint8Array(16)); },
        }),
        bytes: createType({
            name: 'bytes',
            serialize: function (buffer, data) {
                if (data instanceof Uint8Array || Array.isArray(data)) {
                    buffer.pushBytes(data);
                }
                else {
                    buffer.pushBytes((0, exports.hexToUint8Array)(data));
                }
            },
            deserialize: function (buffer, state) {
                if (state && state.options.bytesAsUint8Array) {
                    return buffer.getBytes();
                }
                else {
                    return (0, exports.arrayToHex)(buffer.getBytes());
                }
            },
        }),
        string: createType({
            name: 'string',
            serialize: function (buffer, data) { buffer.pushString(data); },
            deserialize: function (buffer) { return buffer.getString(); },
        }),
        name: createType({
            name: 'name',
            serialize: function (buffer, data) { buffer.pushName(data); },
            deserialize: function (buffer) { return buffer.getName(); },
        }),
        time_point: createType({
            name: 'time_point',
            serialize: function (buffer, data) { buffer.pushNumberAsUint64((0, exports.dateToTimePoint)(data)); },
            deserialize: function (buffer) { return (0, exports.timePointToDate)(buffer.getUint64AsNumber()); },
        }),
        time_point_sec: createType({
            name: 'time_point_sec',
            serialize: function (buffer, data) { buffer.pushUint32((0, exports.dateToTimePointSec)(data)); },
            deserialize: function (buffer) { return (0, exports.timePointSecToDate)(buffer.getUint32()); },
        }),
        block_timestamp_type: createType({
            name: 'block_timestamp_type',
            serialize: function (buffer, data) { buffer.pushUint32((0, exports.dateToBlockTimestamp)(data)); },
            deserialize: function (buffer) { return (0, exports.blockTimestampToDate)(buffer.getUint32()); },
        }),
        symbol_code: createType({
            name: 'symbol_code',
            serialize: function (buffer, data) { buffer.pushSymbolCode(data); },
            deserialize: function (buffer) { return buffer.getSymbolCode(); },
        }),
        symbol: createType({
            name: 'symbol',
            serialize: function (buffer, data) { buffer.pushSymbol((0, exports.stringToSymbol)(data)); },
            deserialize: function (buffer) { return (0, exports.symbolToString)(buffer.getSymbol()); },
        }),
        asset: createType({
            name: 'asset',
            serialize: function (buffer, data) { buffer.pushAsset(data); },
            deserialize: function (buffer) { return buffer.getAsset(); },
        }),
        checksum160: createType({
            name: 'checksum160',
            serialize: function (buffer, data) { buffer.pushUint8ArrayChecked((0, exports.hexToUint8Array)(data), 20); },
            deserialize: function (buffer) { return (0, exports.arrayToHex)(buffer.getUint8Array(20)); },
        }),
        checksum256: createType({
            name: 'checksum256',
            serialize: function (buffer, data) { buffer.pushUint8ArrayChecked((0, exports.hexToUint8Array)(data), 32); },
            deserialize: function (buffer) { return (0, exports.arrayToHex)(buffer.getUint8Array(32)); },
        }),
        checksum512: createType({
            name: 'checksum512',
            serialize: function (buffer, data) { buffer.pushUint8ArrayChecked((0, exports.hexToUint8Array)(data), 64); },
            deserialize: function (buffer) { return (0, exports.arrayToHex)(buffer.getUint8Array(64)); },
        }),
        public_key: createType({
            name: 'public_key',
            serialize: function (buffer, data) { buffer.pushPublicKey(data); },
            deserialize: function (buffer) { return buffer.getPublicKey(); },
        }),
        private_key: createType({
            name: 'private_key',
            serialize: function (buffer, data) { buffer.pushPrivateKey(data); },
            deserialize: function (buffer) { return buffer.getPrivateKey(); },
        }),
        signature: createType({
            name: 'signature',
            serialize: function (buffer, data) { buffer.pushSignature(data); },
            deserialize: function (buffer) { return buffer.getSignature(); },
        }),
    }));
    result.set('extended_asset', createType({
        name: 'extended_asset',
        baseName: '',
        fields: [
            { name: 'quantity', typeName: 'asset', type: result.get('asset') },
            { name: 'contract', typeName: 'name', type: result.get('name') },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    return result;
}; // createInitialTypes()
exports.createInitialTypes = createInitialTypes;
var createAbiTypes = function () {
    var initialTypes = (0, exports.createInitialTypes)();
    initialTypes.set('extensions_entry', createType({
        name: 'extensions_entry',
        baseName: '',
        fields: [
            { name: 'tag', typeName: 'uint16', type: null },
            { name: 'value', typeName: 'bytes', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('type_def', createType({
        name: 'type_def',
        baseName: '',
        fields: [
            { name: 'new_type_name', typeName: 'string', type: null },
            { name: 'type', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('field_def', createType({
        name: 'field_def',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'string', type: null },
            { name: 'type', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('struct_def', createType({
        name: 'struct_def',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'string', type: null },
            { name: 'base', typeName: 'string', type: null },
            { name: 'fields', typeName: 'field_def[]', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('action_def', createType({
        name: 'action_def',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'name', type: null },
            { name: 'type', typeName: 'string', type: null },
            { name: 'ricardian_contract', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('table_def', createType({
        name: 'table_def',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'name', type: null },
            { name: 'index_type', typeName: 'string', type: null },
            { name: 'key_names', typeName: 'string[]', type: null },
            { name: 'key_types', typeName: 'string[]', type: null },
            { name: 'type', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('clause_pair', createType({
        name: 'clause_pair',
        baseName: '',
        fields: [
            { name: 'id', typeName: 'string', type: null },
            { name: 'body', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('error_message', createType({
        name: 'error_message',
        baseName: '',
        fields: [
            { name: 'error_code', typeName: 'uint64', type: null },
            { name: 'error_msg', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('variant_def', createType({
        name: 'variant_def',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'string', type: null },
            { name: 'types', typeName: 'string[]', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('action_result', createType({
        name: 'action_result',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'name', type: null },
            { name: 'result_type', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('primary_key_index_def', createType({
        name: 'primary_key_index_def',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'name', type: null },
            { name: 'type', typeName: 'string', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('secondary_index_def', createType({
        name: 'secondary_index_def',
        baseName: '',
        fields: [
            { name: 'type', typeName: 'string', type: null },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('secondary_indices', createType({
        name: 'secondary_indices',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'name', type: null },
            { name: 'secondary_index_def', typeName: 'secondary_index_def', type: null }
        ],
        serialize: serializeObject,
        deserialize: deserializeObject,
    }));
    initialTypes.set('kv_table_entry_def', createType({
        name: 'kv_table_entry_def',
        baseName: '',
        fields: [
            { name: 'type', typeName: 'string', type: null },
            { name: 'primary_index', typeName: 'primary_key_index_def', type: null },
            { name: 'secondary_indices', typeName: 'secondary_indices', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('kv_table', createType({
        name: 'kv_table',
        baseName: '',
        fields: [
            { name: 'name', typeName: 'name', type: null },
            { name: 'kv_table_entry_def', typeName: 'kv_table_entry_def', type: null }
        ],
        serialize: serializeObject,
        deserialize: deserializeObject
    }));
    initialTypes.set('abi_def', createType({
        name: 'abi_def',
        baseName: '',
        fields: [
            { name: 'version', typeName: 'string', type: null },
            { name: 'types', typeName: 'type_def[]', type: null },
            { name: 'structs', typeName: 'struct_def[]', type: null },
            { name: 'actions', typeName: 'action_def[]', type: null },
            { name: 'tables', typeName: 'table_def[]', type: null },
            { name: 'ricardian_clauses', typeName: 'clause_pair[]', type: null },
            { name: 'error_messages', typeName: 'error_message[]', type: null },
            { name: 'abi_extensions', typeName: 'extensions_entry[]', type: null },
            { name: 'variants', typeName: 'variant_def[]$', type: null },
            { name: 'action_results', typeName: 'action_result[]$', type: null },
            { name: 'kv_tables', typeName: 'kv_table$', type: null },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    return initialTypes;
};
exports.createAbiTypes = createAbiTypes;
var createTransactionExtensionTypes = function () {
    var initialTypes = (0, exports.createInitialTypes)();
    initialTypes.set('resource_payer', createType({
        name: 'resource_payer',
        baseName: '',
        fields: [
            { name: 'payer', typeName: 'name', type: null },
            { name: 'max_net_bytes', typeName: 'uint64', type: null },
            { name: 'max_cpu_us', typeName: 'uint64', type: null },
            { name: 'max_memory_bytes', typeName: 'uint64', type: null },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    return initialTypes;
};
exports.createTransactionExtensionTypes = createTransactionExtensionTypes;
var createTransactionTypes = function () {
    var initialTypes = (0, exports.createInitialTypes)();
    initialTypes.set('permission_level', createType({
        name: 'permission_level',
        baseName: '',
        fields: [
            { name: 'actor', typeName: 'name', type: null },
            { name: 'permission', typeName: 'name', type: null },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('action', createType({
        name: 'action',
        baseName: '',
        fields: [
            { name: 'account', typeName: 'name', type: null },
            { name: 'name', typeName: 'name', type: null },
            { name: 'authorization', typeName: 'permission_level[]', type: null },
            { name: 'data', typeName: 'bytes', type: null },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('extension', createType({
        name: 'extension',
        baseName: '',
        fields: [
            { name: 'type', typeName: 'uint16', type: null },
            { name: 'data', typeName: 'bytes', type: null },
        ],
        serialize: serializePair,
        deserialize: deserializePair,
    }));
    initialTypes.set('transaction_header', createType({
        name: 'transaction_header',
        baseName: '',
        fields: [
            { name: 'expiration', typeName: 'time_point_sec', type: null },
            { name: 'ref_block_num', typeName: 'uint16', type: null },
            { name: 'ref_block_prefix', typeName: 'uint32', type: null },
            { name: 'max_net_usage_words', typeName: 'varuint32', type: null },
            { name: 'max_cpu_usage_ms', typeName: 'uint8', type: null },
            { name: 'delay_sec', typeName: 'varuint32', type: null },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    initialTypes.set('transaction', createType({
        name: 'transaction',
        baseName: 'transaction_header',
        fields: [
            { name: 'context_free_actions', typeName: 'action[]', type: null },
            { name: 'actions', typeName: 'action[]', type: null },
            { name: 'transaction_extensions', typeName: 'extension', type: null }
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    return initialTypes;
};
exports.createTransactionTypes = createTransactionTypes;
/** Get type from `types` */
var getType = function (types, name) {
    var type = types.get(name);
    if (type && type.aliasOfName) {
        return (0, exports.getType)(types, type.aliasOfName);
    }
    if (type) {
        return type;
    }
    if (name.endsWith('[]')) {
        return createType({
            name: name,
            arrayOf: (0, exports.getType)(types, name.substr(0, name.length - 2)),
            serialize: serializeArray,
            deserialize: deserializeArray,
        });
    }
    if (name.endsWith('?')) {
        return createType({
            name: name,
            optionalOf: (0, exports.getType)(types, name.substr(0, name.length - 1)),
            serialize: serializeOptional,
            deserialize: deserializeOptional,
        });
    }
    if (name.endsWith('$')) {
        return createType({
            name: name,
            extensionOf: (0, exports.getType)(types, name.substr(0, name.length - 1)),
            serialize: serializeExtension,
            deserialize: deserializeExtension,
        });
    }
    throw new Error('Unknown type: ' + name);
};
exports.getType = getType;
/**
 * Get types from abi
 *
 * @param initialTypes Set of types to build on.
 * In most cases, it's best to fill this from a fresh call to `getTypesFromAbi()`.
 */
var getTypesFromAbi = function (initialTypes, abi) {
    var e_6, _a, e_7, _b, e_8, _c, e_9, _d, e_10, _e;
    var types = new Map(initialTypes);
    if (abi && abi.types) {
        try {
            for (var _f = __values(abi.types), _g = _f.next(); !_g.done; _g = _f.next()) {
                var _h = _g.value, new_type_name = _h.new_type_name, type = _h.type;
                types.set(new_type_name, createType({ name: new_type_name, aliasOfName: type }));
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
            }
            finally { if (e_6) throw e_6.error; }
        }
    }
    if (abi && abi.structs) {
        try {
            for (var _j = __values(abi.structs), _k = _j.next(); !_k.done; _k = _j.next()) {
                var _l = _k.value, name_1 = _l.name, base = _l.base, fields = _l.fields;
                types.set(name_1, createType({
                    name: name_1,
                    baseName: base,
                    fields: fields.map(function (_a) {
                        var n = _a.name, type = _a.type;
                        return ({ name: n, typeName: type, type: null });
                    }),
                    serialize: serializeStruct,
                    deserialize: deserializeStruct,
                }));
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_k && !_k.done && (_b = _j.return)) _b.call(_j);
            }
            finally { if (e_7) throw e_7.error; }
        }
    }
    if (abi && abi.variants) {
        try {
            for (var _m = __values(abi.variants), _o = _m.next(); !_o.done; _o = _m.next()) {
                var _p = _o.value, name_2 = _p.name, t = _p.types;
                types.set(name_2, createType({
                    name: name_2,
                    fields: t.map(function (s) { return ({ name: s, typeName: s, type: null }); }),
                    serialize: serializeVariant,
                    deserialize: deserializeVariant,
                }));
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_o && !_o.done && (_c = _m.return)) _c.call(_m);
            }
            finally { if (e_8) throw e_8.error; }
        }
    }
    try {
        for (var types_1 = __values(types), types_1_1 = types_1.next(); !types_1_1.done; types_1_1 = types_1.next()) {
            var _q = __read(types_1_1.value, 2), name_3 = _q[0], type = _q[1];
            if (type.baseName) {
                type.base = (0, exports.getType)(types, type.baseName);
            }
            try {
                for (var _r = (e_10 = void 0, __values(type.fields)), _s = _r.next(); !_s.done; _s = _r.next()) {
                    var field = _s.value;
                    field.type = (0, exports.getType)(types, field.typeName);
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_s && !_s.done && (_e = _r.return)) _e.call(_r);
                }
                finally { if (e_10) throw e_10.error; }
            }
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (types_1_1 && !types_1_1.done && (_d = types_1.return)) _d.call(types_1);
        }
        finally { if (e_9) throw e_9.error; }
    }
    return types;
}; // getTypesFromAbi
exports.getTypesFromAbi = getTypesFromAbi;
var reverseHex = function (h) {
    return h.substr(6, 2) + h.substr(4, 2) + h.substr(2, 2) + h.substr(0, 2);
};
/** TAPoS: Return transaction fields which reference `refBlock` and expire `expireSeconds` after `timestamp` */
var transactionHeader = function (refBlock, expireSeconds) {
    var timestamp = refBlock.header ? refBlock.header.timestamp : refBlock.timestamp;
    var prefix = parseInt(reverseHex(refBlock.id.substr(16, 8)), 16);
    return {
        expiration: (0, exports.timePointSecToDate)((0, exports.dateToTimePointSec)(timestamp) + expireSeconds),
        ref_block_num: refBlock.block_num & 0xffff,
        ref_block_prefix: prefix,
    };
};
exports.transactionHeader = transactionHeader;
/** Convert action data to serialized form (hex) */
var serializeActionData = function (contract, account, name, data, textEncoder, textDecoder) {
    var action = contract.actions.get(name);
    if (!action) {
        throw new Error("Unknown action " + name + " in contract " + account);
    }
    var buffer = new SerialBuffer({ textEncoder: textEncoder, textDecoder: textDecoder });
    action.serialize(buffer, data);
    return (0, exports.arrayToHex)(buffer.asUint8Array());
};
exports.serializeActionData = serializeActionData;
/** Return action in serialized form */
var serializeAction = function (contract, account, name, authorization, data, textEncoder, textDecoder) {
    return {
        account: account,
        name: name,
        authorization: authorization,
        data: (0, exports.serializeActionData)(contract, account, name, data, textEncoder, textDecoder),
    };
};
exports.serializeAction = serializeAction;
/** Deserialize action data. If `data` is a `string`, then it's assumed to be in hex. */
var deserializeActionData = function (contract, account, name, data, textEncoder, textDecoder) {
    var action = contract.actions.get(name);
    if (typeof data === 'string') {
        data = (0, exports.hexToUint8Array)(data);
    }
    if (!action) {
        throw new Error("Unknown action " + name + " in contract " + account);
    }
    var buffer = new SerialBuffer({ textDecoder: textDecoder, textEncoder: textEncoder });
    buffer.pushArray(data);
    return action.deserialize(buffer);
};
exports.deserializeActionData = deserializeActionData;
/** Deserialize action. If `data` is a `string`, then it's assumed to be in hex. */
var deserializeAction = function (contract, account, name, authorization, data, textEncoder, textDecoder) {
    return {
        account: account,
        name: name,
        authorization: authorization,
        data: (0, exports.deserializeActionData)(contract, account, name, data, textEncoder, textDecoder),
    };
};
exports.deserializeAction = deserializeAction;
var serializeAnyvar = function (buffer, anyvar) {
    var _a, _b, _c, _d, _e, _f, _g;
    var def;
    var value;
    if (anyvar === null) {
        _a = __read([anyvarDefs.null_t, anyvar], 2), def = _a[0], value = _a[1];
    }
    else if (typeof anyvar === 'string') {
        _b = __read([anyvarDefs.string, anyvar], 2), def = _b[0], value = _b[1];
    }
    else if (typeof anyvar === 'number') {
        _c = __read([anyvarDefs.int32, anyvar], 2), def = _c[0], value = _c[1];
    }
    else if (anyvar instanceof Uint8Array) {
        _d = __read([anyvarDefs.bytes, anyvar], 2), def = _d[0], value = _d[1];
    }
    else if (Array.isArray(anyvar)) {
        _e = __read([anyvarDefs.any_array, anyvar], 2), def = _e[0], value = _e[1];
    }
    else if (Object.keys(anyvar).length === 2 && anyvar.hasOwnProperty('type') && anyvar.hasOwnProperty('value')) {
        _f = __read([anyvarDefs[anyvar.type], anyvar.value], 2), def = _f[0], value = _f[1];
    }
    else {
        _g = __read([anyvarDefs.any_object, anyvar], 2), def = _g[0], value = _g[1];
    }
    buffer.pushVaruint32(def.index);
    def.type.serialize(buffer, value);
};
exports.serializeAnyvar = serializeAnyvar;
var deserializeAnyvar = function (buffer, state) {
    var defIndex = buffer.getVaruint32();
    if (defIndex >= anyvarDefsByIndex.length) {
        throw new Error('Tried to deserialize unknown anyvar type');
    }
    var def = anyvarDefsByIndex[defIndex];
    var value = def.type.deserialize(buffer, state);
    if (state && state.options.useShortForm || def.useShortForm) {
        return value;
    }
    else {
        return { type: def.type.name, value: value };
    }
};
exports.deserializeAnyvar = deserializeAnyvar;
var deserializeAnyvarShort = function (buffer) {
    return (0, exports.deserializeAnyvar)(buffer, new SerializerState({ useShortForm: true }));
};
exports.deserializeAnyvarShort = deserializeAnyvarShort;
var serializeAnyObject = function (buffer, obj) {
    var e_11, _a;
    var entries = Object.entries(obj);
    buffer.pushVaruint32(entries.length);
    try {
        for (var entries_2 = __values(entries), entries_2_1 = entries_2.next(); !entries_2_1.done; entries_2_1 = entries_2.next()) {
            var _b = __read(entries_2_1.value, 2), key = _b[0], value = _b[1];
            buffer.pushString(key);
            (0, exports.serializeAnyvar)(buffer, value);
        }
    }
    catch (e_11_1) { e_11 = { error: e_11_1 }; }
    finally {
        try {
            if (entries_2_1 && !entries_2_1.done && (_a = entries_2.return)) _a.call(entries_2);
        }
        finally { if (e_11) throw e_11.error; }
    }
};
exports.serializeAnyObject = serializeAnyObject;
var deserializeAnyObject = function (buffer, state) {
    var len = buffer.getVaruint32();
    var result = {};
    for (var i = 0; i < len; ++i) {
        var key = buffer.getString();
        if (key in result) {
            var j = 1;
            while (key + '_' + j in result) {
                ++j;
            }
            key = key + '_' + j;
        }
        result[key] = (0, exports.deserializeAnyvar)(buffer, state);
    }
    return result;
};
exports.deserializeAnyObject = deserializeAnyObject;
var serializeAnyArray = function (buffer, arr) {
    var e_12, _a;
    buffer.pushVaruint32(arr.length);
    try {
        for (var arr_1 = __values(arr), arr_1_1 = arr_1.next(); !arr_1_1.done; arr_1_1 = arr_1.next()) {
            var x = arr_1_1.value;
            (0, exports.serializeAnyvar)(buffer, x);
        }
    }
    catch (e_12_1) { e_12 = { error: e_12_1 }; }
    finally {
        try {
            if (arr_1_1 && !arr_1_1.done && (_a = arr_1.return)) _a.call(arr_1);
        }
        finally { if (e_12) throw e_12.error; }
    }
};
exports.serializeAnyArray = serializeAnyArray;
var deserializeAnyArray = function (buffer, state) {
    var len = buffer.getVaruint32();
    var result = [];
    for (var i = 0; i < len; ++i) {
        result.push((0, exports.deserializeAnyvar)(buffer, state));
    }
    return result;
};
exports.deserializeAnyArray = deserializeAnyArray;
var addAdditionalTypes = function () {
    var initialTypes = (0, exports.createInitialTypes)();
    initialTypes.set('null_t', createType({
        name: 'null_t',
        serialize: function (buffer, anyvar) { },
        deserialize: function (buffer, state) { }
    }));
    initialTypes.set('any_object', createType({
        name: 'any_object',
        serialize: exports.serializeAnyObject,
        deserialize: exports.deserializeAnyObject
    }));
    initialTypes.set('any_array', createType({
        name: 'any_array',
        serialize: exports.serializeAnyArray,
        deserialize: exports.deserializeAnyArray
    }));
    return initialTypes;
};
var additionalTypes = addAdditionalTypes();
var anyvarDefs = {
    null_t: { index: 0, useShortForm: true, type: additionalTypes.get('null_t') },
    int64: { index: 1, useShortForm: false, type: additionalTypes.get('int64') },
    uint64: { index: 2, useShortForm: false, type: additionalTypes.get('uint64') },
    int32: { index: 3, useShortForm: true, type: additionalTypes.get('int32') },
    uint32: { index: 4, useShortForm: false, type: additionalTypes.get('uint32') },
    int16: { index: 5, useShortForm: false, type: additionalTypes.get('int16') },
    uint16: { index: 6, useShortForm: false, type: additionalTypes.get('uint16') },
    int8: { index: 7, useShortForm: false, type: additionalTypes.get('int8') },
    uint8: { index: 8, useShortForm: false, type: additionalTypes.get('uint8') },
    time_point: { index: 9, useShortForm: false, type: additionalTypes.get('time_point') },
    checksum256: { index: 10, useShortForm: false, type: additionalTypes.get('checksum256') },
    float64: { index: 11, useShortForm: false, type: additionalTypes.get('float64') },
    string: { index: 12, useShortForm: true, type: additionalTypes.get('string') },
    any_object: { index: 13, useShortForm: true, type: additionalTypes.get('any_object') },
    any_array: { index: 14, useShortForm: true, type: additionalTypes.get('any_array') },
    bytes: { index: 15, useShortForm: false, type: additionalTypes.get('bytes') },
    symbol: { index: 16, useShortForm: false, type: additionalTypes.get('symbol') },
    symbol_code: { index: 17, useShortForm: false, type: additionalTypes.get('symbol_code') },
    asset: { index: 18, useShortForm: false, type: additionalTypes.get('asset') },
};
var anyvarDefsByIndex = [
    anyvarDefs.null_t,
    anyvarDefs.int64,
    anyvarDefs.uint64,
    anyvarDefs.int32,
    anyvarDefs.uint32,
    anyvarDefs.int16,
    anyvarDefs.uint16,
    anyvarDefs.int8,
    anyvarDefs.uint8,
    anyvarDefs.time_point,
    anyvarDefs.checksum256,
    anyvarDefs.float64,
    anyvarDefs.string,
    anyvarDefs.any_object,
    anyvarDefs.any_array,
    anyvarDefs.bytes,
    anyvarDefs.symbol,
    anyvarDefs.symbol_code,
    anyvarDefs.asset,
];
var serializeQuery = function (buffer, query) {
    var _a, _b, _c, e_13, _d;
    var method;
    var arg;
    var filter;
    if (typeof query === 'string') {
        method = query;
    }
    else if (Array.isArray(query) && query.length === 2) {
        _a = __read(query, 2), method = _a[0], filter = _a[1];
    }
    else if (Array.isArray(query) && query.length === 3) {
        _b = __read(query, 3), method = _b[0], arg = _b[1], filter = _b[2];
    }
    else {
        _c = __read([query.method, query.arg, query.filter], 3), method = _c[0], arg = _c[1], filter = _c[2];
    }
    buffer.pushString(method);
    if (arg === undefined) {
        buffer.push(0);
    }
    else {
        buffer.push(1);
        (0, exports.serializeAnyvar)(buffer, arg);
    }
    if (filter === undefined) {
        buffer.push(0);
    }
    else {
        buffer.pushVaruint32(filter.length);
        try {
            for (var filter_1 = __values(filter), filter_1_1 = filter_1.next(); !filter_1_1.done; filter_1_1 = filter_1.next()) {
                var q = filter_1_1.value;
                (0, exports.serializeQuery)(buffer, q);
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (filter_1_1 && !filter_1_1.done && (_d = filter_1.return)) _d.call(filter_1);
            }
            finally { if (e_13) throw e_13.error; }
        }
    }
};
exports.serializeQuery = serializeQuery;


/***/ }),

/***/ "./src/eosjs-webauthn-sig.ts":
/*!***********************************!*\
  !*** ./src/eosjs-webauthn-sig.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * @module WebAuthn-Sig
 */
// copyright defined in eosjs/LICENSE.txt
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebAuthnSignatureProvider = void 0;
var ser = __webpack_require__(/*! ./eosjs-serialize */ "./src/eosjs-serialize.ts");
var numeric = __webpack_require__(/*! ./eosjs-numeric */ "./src/eosjs-numeric.ts");
var elliptic_1 = __webpack_require__(/*! elliptic */ "./node_modules/elliptic/lib/elliptic.js");
/** Signs transactions using WebAuthn */
var WebAuthnSignatureProvider = /** @class */ (function () {
    function WebAuthnSignatureProvider() {
        /** Map public key to credential ID (hex). User must populate this. */
        this.keys = new Map();
    }
    /** Public keys that the `SignatureProvider` holds */
    WebAuthnSignatureProvider.prototype.getAvailableKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.keys.keys())];
            });
        });
    };
    /** Sign a transaction */
    WebAuthnSignatureProvider.prototype.sign = function (_a) {
        var chainId = _a.chainId, requiredKeys = _a.requiredKeys, serializedTransaction = _a.serializedTransaction, serializedContextFreeData = _a.serializedContextFreeData;
        return __awaiter(this, void 0, void 0, function () {
            var signBuf, _b, _c, _d, digest, _e, signatures, requiredKeys_1, requiredKeys_1_1, key, id, assertion, e, pubKey, fixup, der, r, s, whatItReallySigned, _f, _g, _h, hash_1, _j, recid, sigData, sig, e_1_1;
            var e_1, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        signBuf = new ser.SerialBuffer();
                        signBuf.pushArray(ser.hexToUint8Array(chainId));
                        signBuf.pushArray(serializedTransaction);
                        if (!serializedContextFreeData) return [3 /*break*/, 2];
                        _c = (_b = signBuf).pushArray;
                        _d = Uint8Array.bind;
                        return [4 /*yield*/, crypto.subtle.digest('SHA-256', serializedContextFreeData.buffer)];
                    case 1:
                        _c.apply(_b, [new (_d.apply(Uint8Array, [void 0, _l.sent()]))()]);
                        return [3 /*break*/, 3];
                    case 2:
                        signBuf.pushArray(new Uint8Array(32));
                        _l.label = 3;
                    case 3:
                        _e = Uint8Array.bind;
                        return [4 /*yield*/, crypto.subtle.digest('SHA-256', signBuf.asUint8Array().slice().buffer)];
                    case 4:
                        digest = new (_e.apply(Uint8Array, [void 0, _l.sent()]))();
                        signatures = [];
                        _l.label = 5;
                    case 5:
                        _l.trys.push([5, 12, 13, 14]);
                        requiredKeys_1 = __values(requiredKeys), requiredKeys_1_1 = requiredKeys_1.next();
                        _l.label = 6;
                    case 6:
                        if (!!requiredKeys_1_1.done) return [3 /*break*/, 11];
                        key = requiredKeys_1_1.value;
                        id = ser.hexToUint8Array(this.keys.get(key));
                        return [4 /*yield*/, navigator.credentials.get({
                                publicKey: {
                                    timeout: 60000,
                                    userVerification: 'required',
                                    allowCredentials: [{
                                            id: id,
                                            type: 'public-key',
                                            transports: ['internal'],
                                        }],
                                    challenge: digest.buffer,
                                },
                            })];
                    case 7:
                        assertion = _l.sent();
                        e = new elliptic_1.ec('p256');
                        pubKey = e.keyFromPublic(numeric.stringToPublicKey(key).data.subarray(0, 33)).getPublic();
                        fixup = function (x) {
                            var a = Array.from(x);
                            while (a.length < 32) {
                                a.unshift(0);
                            }
                            while (a.length > 32) {
                                if (a.shift() !== 0) {
                                    throw new Error('Signature has an r or s that is too big');
                                }
                            }
                            return new Uint8Array(a);
                        };
                        der = new ser.SerialBuffer({ array: new Uint8Array(assertion.response.signature) });
                        if (der.get() !== 0x30) {
                            throw new Error('Signature missing DER prefix');
                        }
                        if (der.get() !== der.array.length - 2) {
                            throw new Error('Signature has bad length');
                        }
                        if (der.get() !== 0x02) {
                            throw new Error('Signature has bad r marker');
                        }
                        r = fixup(der.getUint8Array(der.get()));
                        if (der.get() !== 0x02) {
                            throw new Error('Signature has bad s marker');
                        }
                        s = fixup(der.getUint8Array(der.get()));
                        whatItReallySigned = new ser.SerialBuffer();
                        whatItReallySigned.pushArray(new Uint8Array(assertion.response.authenticatorData));
                        _g = (_f = whatItReallySigned).pushArray;
                        _h = Uint8Array.bind;
                        return [4 /*yield*/, crypto.subtle.digest('SHA-256', assertion.response.clientDataJSON)];
                    case 8:
                        _g.apply(_f, [new (_h.apply(Uint8Array, [void 0, _l.sent()]))()]);
                        _j = Uint8Array.bind;
                        return [4 /*yield*/, crypto.subtle.digest('SHA-256', whatItReallySigned.asUint8Array().slice())];
                    case 9:
                        hash_1 = new (_j.apply(Uint8Array, [void 0, _l.sent()]))();
                        recid = e.getKeyRecoveryParam(hash_1, new Uint8Array(assertion.response.signature), pubKey);
                        sigData = new ser.SerialBuffer();
                        sigData.push(recid + 27 + 4);
                        sigData.pushArray(r);
                        sigData.pushArray(s);
                        sigData.pushBytes(new Uint8Array(assertion.response.authenticatorData));
                        sigData.pushBytes(new Uint8Array(assertion.response.clientDataJSON));
                        sig = numeric.signatureToString({
                            type: numeric.KeyType.wa,
                            data: sigData.asUint8Array().slice(),
                        });
                        signatures.push(sig);
                        _l.label = 10;
                    case 10:
                        requiredKeys_1_1 = requiredKeys_1.next();
                        return [3 /*break*/, 6];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_1_1 = _l.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (requiredKeys_1_1 && !requiredKeys_1_1.done && (_k = requiredKeys_1.return)) _k.call(requiredKeys_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/, { signatures: signatures, serializedTransaction: serializedTransaction, serializedContextFreeData: serializedContextFreeData }];
                }
            });
        });
    };
    return WebAuthnSignatureProvider;
}());
exports.WebAuthnSignatureProvider = WebAuthnSignatureProvider;


/***/ }),

/***/ "./src/ripemd.js":
/*!***********************!*\
  !*** ./src/ripemd.js ***!
  \***********************/
/***/ ((module) => {

"use strict";
// https://gist.githubusercontent.com/wlzla000/bac83df6d3c51916c4dd0bc947e46947/raw/7ee3462b095ab22580ddaf191f44a590da6fe33b/RIPEMD-160.js

/*
	RIPEMD-160.js

		developed
			by K. (https://github.com/wlzla000)
			on December 27-29, 2017,

		licensed under


		the MIT license

		Copyright (c) 2017 K.

		 Permission is hereby granted, free of charge, to any person
		obtaining a copy of this software and associated documentation
		files (the "Software"), to deal in the Software without
		restriction, including without limitation the rights to use,
		copy, modify, merge, publish, distribute, sublicense, and/or
		sell copies of the Software, and to permit persons to whom the
		Software is furnished to do so, subject to the following
		conditions:

		 The above copyright notice and this permission notice shall be
		included in all copies or substantial portions of the Software.

		 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
		EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
		OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
		NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
		HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
		WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
		FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
		OTHER DEALINGS IN THE SOFTWARE.
*/



class RIPEMD160
{
    constructor()
    {
        // https://webcache.googleusercontent.com/search?q=cache:CnLOgolTHYEJ:https://www.cosic.esat.kuleuven.be/publications/article-317.pdf
        // http://shodhganga.inflibnet.ac.in/bitstream/10603/22978/13/13_appendix.pdf
    }

    static get_n_pad_bytes(message_size /* in bytes, 1 byte is 8 bits. */)
    {
        //  Obtain the number of bytes needed to pad the message.
        // It does not contain the size of the message size information.
        /*
			https://webcache.googleusercontent.com/search?q=cache:CnLOgolTHYEJ:https://www.cosic.esat.kuleuven.be/publications/article-317.pdf

			The Cryptographic Hash Function RIPEMD-160

			written by
				Bart Preneel,
				Hans Dobbertin,
				Antoon Bosselaers
			in
				1997.

			--------------------------------------------------

			§5     Description of RIPEMD-160

			......

			 In order to guarantee that the total input size is a
			multiple of 512 bits, the input is padded in the same
			way as for all the members of the MD4-family: one
			appends a single 1 followed by a string of 0s (the
			number of 0s lies between 0 and 511); the last 64 bits
			of the extended input contain the binary representation
			of the input size in bits, least significant byte first.
		*/
        /*
			https://tools.ietf.org/rfc/rfc1186.txt

			RFC 1186: MD4 Message Digest Algorithm.

			written by
				Ronald Linn Rivest
			in
				October 1990.

			--------------------------------------------------

			§3     MD4 Algorithm Description

			......

			Step 1. Append padding bits

			 The message is "padded" (extended) so that its length
			(in bits) is congruent to 448, modulo 512. That is, the
			message is extended so that it is just 64 bits shy of
			being a multiple of 512 bits long. Padding is always
			performed, even if the length of the message is already
			congruent to 448, modulo 512 (in which case 512 bits of
			padding are added).

			 Padding is performed as follows: a single "1" bit is
			appended to the message, and then enough zero bits are
			appended so that the length in bits of the padded
			message becomes congruent to 448, modulo 512.

			Step 2. Append length

			 A 64-bit representation of b (the length of the message
			before the padding bits were added) is appended to the
			result of the previous step. In the unlikely event that
			b is greater than 2^64, then only the low-order 64 bits
			of b are used. (These bits are appended as two 32-bit
			words and appended low-order word first in accordance
			with the previous conventions.)

			 At this point the resulting message (after padding with
			bits and with b) has a length that is an exact multiple
			of 512 bits. Equivalently, this message has a length
			that is an exact multiple of 16 (32-bit) words. Let
			M[0 ... N-1] denote the words of the resulting message,
			where N is a multiple of 16.
		*/
        // https://crypto.stackexchange.com/a/32407/54568
        /*
			Example case  # 1
				[0 bit: message.]
				[1 bit: 1.]
				[447 bits: 0.]
				[64 bits: message size information.]

			Example case  # 2
				[512-bits: message]
				[1 bit: 1.]
				[447 bits: 0.]
				[64 bits: message size information.]

			Example case  # 3
				[(512 - 64 = 448) bits: message.]
				[1 bit: 1.]
				[511 bits: 0.]
				[64 bits: message size information.]

			Example case  # 4
				[(512 - 65 = 447) bits: message.]
				[1 bit: 1.]
				[0 bit: 0.]
				[64 bits: message size information.]
		*/
        // The number of padding zero bits:
        //      511 - [{(message size in bits) + 64} (mod 512)]
        return 64 - ((message_size + 8) & 0b00111111 /* 63 */);
    }
    static pad(message /* An ArrayBuffer. */)
    {
        const message_size = message.byteLength;
        const n_pad = RIPEMD160.get_n_pad_bytes(message_size);

        //  `Number.MAX_SAFE_INTEGER` is ((2 ** 53) - 1) and
        // bitwise operation in Javascript is done on 32-bits operands.
        const divmod = (dividend, divisor) => [
            Math.floor(dividend / divisor),
            dividend % divisor
        ];
        /*
To shift

   00000000 000????? ???????? ???????? ???????? ???????? ???????? ????????
                                     t o
   00000000 ???????? ???????? ???????? ???????? ???????? ???????? ?????000

--------------------------------------------------------------------------------

Method #1

    00000000 000????? ???????? ????????  ???????? ???????? ???????? ????????
   [00000000 000AAAAA AAAAAAAA AAAAAAAA] (<A> captured)
   [00000000 AAAAAAAA AAAAAAAA AAAAA000] (<A> shifted)
                         (<B> captured) [BBBBBBBB BBBBBBBB BBBBBBBB BBBBBBBB]
                     (<B> shifted) [BBB][BBBBBBBB BBBBBBBB BBBBBBBB BBBBB000]
   [00000000 AAAAAAAA AAAAAAAA AAAAABBB] (<A> & <B_2> merged)
   [00000000 AAAAAAAA AAAAAAAA AAAAABBB][BBBBBBBB BBBBBBBB BBBBBBBB BBBBB000]
    00000000 ???????? ???????? ????????  ???????? ???????? ???????? ?????000

		const uint32_max_plus_1 = 0x100000000; // (2 ** 32)
		const [
			msg_byte_size_most, // Value range [0, (2 ** 21) - 1].
			msg_byte_size_least // Value range [0, (2 ** 32) - 1].
		] = divmod(message_size, uint32_max_plus_1);
		const [
			carry, // Value range [0, 7].
			msg_bit_size_least // Value range [0, (2 ** 32) - 8].
		] = divmod(message_byte_size_least * 8, uint32_max_plus_1);
		const message_bit_size_most = message_byte_size_most * 8
			+ carry; // Value range [0, (2 ** 24) - 1].

--------------------------------------------------------------------------------

Method #2
    00000000 000????? ???????? ????????  ???????? ???????? ???????? ????????
      [00000 000AAAAA AAAAAAAA AAAAAAAA  AAA] (<A> captured)
                         (<B> captured) [000BBBBB BBBBBBBB BBBBBBBB BBBBBBBB]
                          (<B> shifted) [BBBBBBBB BBBBBBBB BBBBBBBB BBBBB000]
   [00000000 AAAAAAAA AAAAAAAA AAAAAAAA][BBBBBBBB BBBBBBBB BBBBBBBB BBBBB000]
    00000000 ???????? ???????? ????????  ???????? ???????? ???????? ?????000

		*/
        const [
            msg_bit_size_most,
            msg_bit_size_least
        ] = divmod(message_size, 536870912 /* (2 ** 29) */)
            .map((x, index) => (index ? (x * 8) : x));

        // `ArrayBuffer.transfer()` is not supported.
        const padded = new Uint8Array(message_size + n_pad + 8);
        padded.set(new Uint8Array(message), 0);
        const data_view = new DataView(padded.buffer);
        data_view.setUint8(message_size, 0b10000000);
        data_view.setUint32(
            message_size + n_pad,
            msg_bit_size_least,
            true // Little-endian
        );
        data_view.setUint32(
            message_size + n_pad + 4,
            msg_bit_size_most,
            true // Little-endian
        );

        return padded.buffer;
    }

    static f(j, x, y, z)
    {
        if(0 <= j && j <= 15)
        { // Exclusive-OR
            return x ^ y ^ z;
        }
        if(16 <= j && j <= 31)
        { // Multiplexing (muxing)
            return (x & y) | (~x & z);
        }
        if(32 <= j && j <= 47)
        {
            return (x | ~y) ^ z;
        }
        if(48 <= j && j <= 63)
        { // Multiplexing (muxing)
            return (x & z) | (y & ~z);
        }
        if(64 <= j && j <= 79)
        {
            return x ^ (y | ~z);
        }
    }
    static K(j)
    {
        if(0 <= j && j <= 15)
        {
            return 0x00000000;
        }
        if(16 <= j && j <= 31)
        {
            // Math.floor((2 ** 30) * Math.SQRT2)
            return 0x5A827999;
        }
        if(32 <= j && j <= 47)
        {
            // Math.floor((2 ** 30) * Math.sqrt(3))
            return 0x6ED9EBA1;
        }
        if(48 <= j && j <= 63)
        {
            // Math.floor((2 ** 30) * Math.sqrt(5))
            return 0x8F1BBCDC;
        }
        if(64 <= j && j <= 79)
        {
            // Math.floor((2 ** 30) * Math.sqrt(7))
            return 0xA953FD4E;
        }
    }
    static KP(j) // K'
    {
        if(0 <= j && j <= 15)
        {
            // Math.floor((2 ** 30) * Math.cbrt(2))
            return 0x50A28BE6;
        }
        if(16 <= j && j <= 31)
        {
            // Math.floor((2 ** 30) * Math.cbrt(3))
            return 0x5C4DD124;
        }
        if(32 <= j && j <= 47)
        {
            // Math.floor((2 ** 30) * Math.cbrt(5))
            return 0x6D703EF3;
        }
        if(48 <= j && j <= 63)
        {
            // Math.floor((2 ** 30) * Math.cbrt(7))
            return 0x7A6D76E9;
        }
        if(64 <= j && j <= 79)
        {
            return 0x00000000;
        }
    }
    static add_modulo32(/* ...... */)
    {
        // 1.  Modulo addition (addition modulo) is associative.
        //    https://proofwiki.org/wiki/Modulo_Addition_is_Associative
 		// 2.  Bitwise operation in Javascript
        //    is done on 32-bits operands
        //    and results in a 32-bits value.
        return Array
            .from(arguments)
            .reduce((a, b) => (a + b), 0) | 0;
    }
    static rol32(value, count)
    { // Cyclic left shift (rotate) on 32-bits value.
        return (value << count) | (value >>> (32 - count));
    }
    static hash(message /* An ArrayBuffer. */)
    {
        // ////////       Padding       //////////

        // The padded message.
        const padded = RIPEMD160.pad(message);

        // ////////     Compression     //////////

        // Message word selectors.
        const r = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
            7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
            3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
            1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
            4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
        ];
        const rP = [ // r'
            5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
            6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
            15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
            8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
            12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
        ];

        // Amounts for 'rotate left' operation.
        const s = [
            11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
            7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
            11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
            11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
            9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
        ];
        const sP = [ // s'
            8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
            9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
            9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
            15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
            8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
        ];

        // The size, in bytes, of a word.
        const word_size = 4;

        // The size, in bytes, of a 16-words block.
        const block_size = 64;

        // The number of the 16-words blocks.
        const t = padded.byteLength / block_size;

        //  The message after padding consists of t 16-word blocks that
        // are denoted with X_i[j], with 0≤i≤(t − 1) and 0≤j≤15.
        const X = (new Array(t))
            .fill(undefined)
            .map((_, i) => j => (
                new DataView(
                    padded, i * block_size, block_size
                ).getUint32(
                    j * word_size,
                    true // Little-endian
                )
            ));

        //  The result of RIPEMD-160 is contained in five 32-bit words,
        // which form the internal state of the algorithm. The final
        // content of these five 32-bit words is converted to a 160-bit
        // string, again using the little-endian convention.
        const h = [
            0x67452301, // h_0
            0xEFCDAB89, // h_1
            0x98BADCFE, // h_2
            0x10325476, // h_3
            0xC3D2E1F0  // h_4
        ];

        for(let i = 0; i < t; ++i)
        {
            let A = h[0]; let B = h[1]; let C = h[2]; let D = h[3]; let E = h[4];
            let AP = A; let BP = B; let CP = C; let DP = D; let EP = E;
            for(let j = 0; j < 80; ++j)
            {
                // Left rounds
                let T = RIPEMD160.add_modulo32( // eslint-disable-line no-shadow
                    RIPEMD160.rol32(
                        RIPEMD160.add_modulo32(
                            A,
                            RIPEMD160.f(j, B, C, D),
                            X[i](r[j]),
                            RIPEMD160.K(j)
                        ),
                        s[j]
                    ),
                    E
                );
                A = E;
                E = D;
                D = RIPEMD160.rol32(C, 10);
                C = B;
                B = T;

                // Right rounds
                T = RIPEMD160.add_modulo32(
                    RIPEMD160.rol32(
                        RIPEMD160.add_modulo32(
                            AP,
                            RIPEMD160.f(
                                79 - j,
                                BP,
                                CP,
                                DP
                            ),
                            X[i](rP[j]),
                            RIPEMD160.KP(j)
                        ),
                        sP[j]
                    ),
                    EP
                );
                AP = EP;
                EP = DP;
                DP = RIPEMD160.rol32(CP, 10);
                CP = BP;
                BP = T;
            }
            const T = RIPEMD160.add_modulo32(h[1], C, DP);
            h[1] = RIPEMD160.add_modulo32(h[2], D, EP);
            h[2] = RIPEMD160.add_modulo32(h[3], E, AP);
            h[3] = RIPEMD160.add_modulo32(h[4], A, BP);
            h[4] = RIPEMD160.add_modulo32(h[0], B, CP);
            h[0] = T;
        }

        //  The final output string then consists of the concatenatation
        // of h_0, h_1, h_2, h_3, and h_4 after converting each h_i to a
        // 4-byte string using the little-endian convention.
        const result = new ArrayBuffer(20);
        const data_view = new DataView(result);
        h.forEach((h_i, i) => data_view.setUint32(i * 4, h_i, true));
        return result;
    }
}

module.exports = {
    RIPEMD160
};


/***/ }),

/***/ "?3fc0":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?7bec":
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"eosjs_wasig": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk_name_"] = self["webpackChunk_name_"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["externals"], () => (__webpack_require__("./src/eosjs-webauthn-sig.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	eosjs_wasig = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLEtBQUs7QUFDaEQ7QUFDQSx5TUFBeU07QUFDek07QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGNBQWM7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsUUFBUTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsU0FBUztBQUNwQztBQUNBLDRCQUE0QixPQUFPO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsZ0JBQWdCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLElBQUk7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsNkJBQTZCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZOztBQUVaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0EsMEJBQTBCLGNBQWMsY0FBYyxjQUFjO0FBQ3BFLHdCQUF3QixZQUFZLFlBQVksWUFBWTtBQUM1RCwyQkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3ZkQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NKQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9bbmFtZV0vLi9zcmMvZW9zanMtbnVtZXJpYy50cyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9zcmMvZW9zanMtc2VyaWFsaXplLnRzIiwid2VicGFjazovL1tuYW1lXS8uL3NyYy9lb3Nqcy13ZWJhdXRobi1zaWcudHMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vc3JjL3JpcGVtZC5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vaWdub3JlZHwvaG9tZS9hbWkvZGV2L3dvcmsvZW9zaW5hYm94L2Vvc2pzL25vZGVfbW9kdWxlcy9icm9yYW5kfGNyeXB0byIsIndlYnBhY2s6Ly9bbmFtZV0vaWdub3JlZHwvaG9tZS9hbWkvZGV2L3dvcmsvZW9zaW5hYm94L2Vvc2pzL25vZGVfbW9kdWxlcy9lbGxpcHRpYy9ub2RlX21vZHVsZXMvYm4uanMvbGlifGJ1ZmZlciIsIndlYnBhY2s6Ly9bbmFtZV0vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vW25hbWVdL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vW25hbWVdL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vW25hbWVdL3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vW25hbWVdL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL1tuYW1lXS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL1tuYW1lXS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vW25hbWVdL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX3JlYWQgPSAodGhpcyAmJiB0aGlzLl9fcmVhZCkgfHwgZnVuY3Rpb24gKG8sIG4pIHtcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XG4gICAgaWYgKCFtKSByZXR1cm4gbztcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcbiAgICB0cnkge1xuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cbiAgICB9XG4gICAgcmV0dXJuIGFyO1xufTtcbnZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbnZhciBfX3ZhbHVlcyA9ICh0aGlzICYmIHRoaXMuX192YWx1ZXMpIHx8IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2lnbmF0dXJlVG9TdHJpbmcgPSBleHBvcnRzLnN0cmluZ1RvU2lnbmF0dXJlID0gZXhwb3J0cy5wcml2YXRlS2V5VG9TdHJpbmcgPSBleHBvcnRzLnByaXZhdGVLZXlUb0xlZ2FjeVN0cmluZyA9IGV4cG9ydHMuc3RyaW5nVG9Qcml2YXRlS2V5ID0gZXhwb3J0cy5jb252ZXJ0TGVnYWN5UHVibGljS2V5cyA9IGV4cG9ydHMuY29udmVydExlZ2FjeVB1YmxpY0tleSA9IGV4cG9ydHMucHVibGljS2V5VG9TdHJpbmcgPSBleHBvcnRzLnB1YmxpY0tleVRvTGVnYWN5U3RyaW5nID0gZXhwb3J0cy5zdHJpbmdUb1B1YmxpY0tleSA9IGV4cG9ydHMuc2lnbmF0dXJlRGF0YVNpemUgPSBleHBvcnRzLnByaXZhdGVLZXlEYXRhU2l6ZSA9IGV4cG9ydHMucHVibGljS2V5RGF0YVNpemUgPSBleHBvcnRzLktleVR5cGUgPSBleHBvcnRzLmJhc2U2NFRvQmluYXJ5ID0gZXhwb3J0cy5iaW5hcnlUb0Jhc2U1OCA9IGV4cG9ydHMuYmFzZTU4VG9CaW5hcnkgPSBleHBvcnRzLnNpZ25lZEJpbmFyeVRvRGVjaW1hbCA9IGV4cG9ydHMuYmluYXJ5VG9EZWNpbWFsID0gZXhwb3J0cy5zaWduZWREZWNpbWFsVG9CaW5hcnkgPSBleHBvcnRzLmRlY2ltYWxUb0JpbmFyeSA9IGV4cG9ydHMubmVnYXRlID0gZXhwb3J0cy5pc05lZ2F0aXZlID0gdm9pZCAwO1xuLyoqXG4gKiBAbW9kdWxlIE51bWVyaWNcbiAqL1xudmFyIGhhc2hfanNfMSA9IHJlcXVpcmUoXCJoYXNoLmpzXCIpO1xuLy8gY29weXJpZ2h0IGRlZmluZWQgaW4gZW9zanMvTElDRU5TRS50eHRcbnZhciByaXBlbWQxNjAgPSByZXF1aXJlKCcuL3JpcGVtZCcpLlJJUEVNRDE2MC5oYXNoO1xudmFyIGJhc2U1OENoYXJzID0gJzEyMzQ1Njc4OUFCQ0RFRkdISktMTU5QUVJTVFVWV1hZWmFiY2RlZmdoaWprbW5vcHFyc3R1dnd4eXonO1xudmFyIGJhc2U2NENoYXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xudmFyIGNyZWF0ZV9iYXNlNThfbWFwID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBiYXNlNThNID0gQXJyYXkoMjU2KS5maWxsKC0xKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJhc2U1OENoYXJzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGJhc2U1OE1bYmFzZTU4Q2hhcnMuY2hhckNvZGVBdChpKV0gPSBpO1xuICAgIH1cbiAgICByZXR1cm4gYmFzZTU4TTtcbn07XG52YXIgYmFzZTU4TWFwID0gY3JlYXRlX2Jhc2U1OF9tYXAoKTtcbnZhciBjcmVhdGVfYmFzZTY0X21hcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYmFzZTY0TSA9IEFycmF5KDI1NikuZmlsbCgtMSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiYXNlNjRDaGFycy5sZW5ndGg7ICsraSkge1xuICAgICAgICBiYXNlNjRNW2Jhc2U2NENoYXJzLmNoYXJDb2RlQXQoaSldID0gaTtcbiAgICB9XG4gICAgYmFzZTY0TVsnPScuY2hhckNvZGVBdCgwKV0gPSAwO1xuICAgIHJldHVybiBiYXNlNjRNO1xufTtcbnZhciBiYXNlNjRNYXAgPSBjcmVhdGVfYmFzZTY0X21hcCgpO1xuLyoqIElzIGBiaWdudW1gIGEgbmVnYXRpdmUgbnVtYmVyPyAqL1xudmFyIGlzTmVnYXRpdmUgPSBmdW5jdGlvbiAoYmlnbnVtKSB7XG4gICAgcmV0dXJuIChiaWdudW1bYmlnbnVtLmxlbmd0aCAtIDFdICYgMHg4MCkgIT09IDA7XG59O1xuZXhwb3J0cy5pc05lZ2F0aXZlID0gaXNOZWdhdGl2ZTtcbi8qKiBOZWdhdGUgYGJpZ251bWAgKi9cbnZhciBuZWdhdGUgPSBmdW5jdGlvbiAoYmlnbnVtKSB7XG4gICAgdmFyIGNhcnJ5ID0gMTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJpZ251bS5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgeCA9ICh+YmlnbnVtW2ldICYgMHhmZikgKyBjYXJyeTtcbiAgICAgICAgYmlnbnVtW2ldID0geDtcbiAgICAgICAgY2FycnkgPSB4ID4+IDg7XG4gICAgfVxufTtcbmV4cG9ydHMubmVnYXRlID0gbmVnYXRlO1xuLyoqXG4gKiBDb252ZXJ0IGFuIHVuc2lnbmVkIGRlY2ltYWwgbnVtYmVyIGluIGBzYCB0byBhIGJpZ251bVxuICpcbiAqIEBwYXJhbSBzaXplIGJpZ251bSBzaXplIChieXRlcylcbiAqL1xudmFyIGRlY2ltYWxUb0JpbmFyeSA9IGZ1bmN0aW9uIChzaXplLCBzKSB7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgc3JjRGlnaXQgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChzcmNEaWdpdCA8ICcwJy5jaGFyQ29kZUF0KDApIHx8IHNyY0RpZ2l0ID4gJzknLmNoYXJDb2RlQXQoMCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBudW1iZXInKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2FycnkgPSBzcmNEaWdpdCAtICcwJy5jaGFyQ29kZUF0KDApO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNpemU7ICsraikge1xuICAgICAgICAgICAgdmFyIHggPSByZXN1bHRbal0gKiAxMCArIGNhcnJ5O1xuICAgICAgICAgICAgcmVzdWx0W2pdID0geDtcbiAgICAgICAgICAgIGNhcnJ5ID0geCA+PiA4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYXJyeSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdudW1iZXIgaXMgb3V0IG9mIHJhbmdlJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5leHBvcnRzLmRlY2ltYWxUb0JpbmFyeSA9IGRlY2ltYWxUb0JpbmFyeTtcbi8qKlxuICogQ29udmVydCBhIHNpZ25lZCBkZWNpbWFsIG51bWJlciBpbiBgc2AgdG8gYSBiaWdudW1cbiAqXG4gKiBAcGFyYW0gc2l6ZSBiaWdudW0gc2l6ZSAoYnl0ZXMpXG4gKi9cbnZhciBzaWduZWREZWNpbWFsVG9CaW5hcnkgPSBmdW5jdGlvbiAoc2l6ZSwgcykge1xuICAgIHZhciBuZWdhdGl2ZSA9IHNbMF0gPT09ICctJztcbiAgICBpZiAobmVnYXRpdmUpIHtcbiAgICAgICAgcyA9IHMuc3Vic3RyKDEpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gKDAsIGV4cG9ydHMuZGVjaW1hbFRvQmluYXJ5KShzaXplLCBzKTtcbiAgICBpZiAobmVnYXRpdmUpIHtcbiAgICAgICAgKDAsIGV4cG9ydHMubmVnYXRlKShyZXN1bHQpO1xuICAgICAgICBpZiAoISgwLCBleHBvcnRzLmlzTmVnYXRpdmUpKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbnVtYmVyIGlzIG91dCBvZiByYW5nZScpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKCgwLCBleHBvcnRzLmlzTmVnYXRpdmUpKHJlc3VsdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdudW1iZXIgaXMgb3V0IG9mIHJhbmdlJyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuZXhwb3J0cy5zaWduZWREZWNpbWFsVG9CaW5hcnkgPSBzaWduZWREZWNpbWFsVG9CaW5hcnk7XG4vKipcbiAqIENvbnZlcnQgYGJpZ251bWAgdG8gYW4gdW5zaWduZWQgZGVjaW1hbCBudW1iZXJcbiAqXG4gKiBAcGFyYW0gbWluRGlnaXRzIDAtcGFkIHJlc3VsdCB0byB0aGlzIG1hbnkgZGlnaXRzXG4gKi9cbnZhciBiaW5hcnlUb0RlY2ltYWwgPSBmdW5jdGlvbiAoYmlnbnVtLCBtaW5EaWdpdHMpIHtcbiAgICBpZiAobWluRGlnaXRzID09PSB2b2lkIDApIHsgbWluRGlnaXRzID0gMTsgfVxuICAgIHZhciByZXN1bHQgPSBBcnJheShtaW5EaWdpdHMpLmZpbGwoJzAnLmNoYXJDb2RlQXQoMCkpO1xuICAgIGZvciAodmFyIGkgPSBiaWdudW0ubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGNhcnJ5ID0gYmlnbnVtW2ldO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJlc3VsdC5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgdmFyIHggPSAoKHJlc3VsdFtqXSAtICcwJy5jaGFyQ29kZUF0KDApKSA8PCA4KSArIGNhcnJ5O1xuICAgICAgICAgICAgcmVzdWx0W2pdID0gJzAnLmNoYXJDb2RlQXQoMCkgKyB4ICUgMTA7XG4gICAgICAgICAgICBjYXJyeSA9ICh4IC8gMTApIHwgMDtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoY2FycnkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKCcwJy5jaGFyQ29kZUF0KDApICsgY2FycnkgJSAxMCk7XG4gICAgICAgICAgICBjYXJyeSA9IChjYXJyeSAvIDEwKSB8IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0LnJldmVyc2UoKTtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChyZXN1bHQpLCBmYWxzZSkpO1xufTtcbmV4cG9ydHMuYmluYXJ5VG9EZWNpbWFsID0gYmluYXJ5VG9EZWNpbWFsO1xuLyoqXG4gKiBDb252ZXJ0IGBiaWdudW1gIHRvIGEgc2lnbmVkIGRlY2ltYWwgbnVtYmVyXG4gKlxuICogQHBhcmFtIG1pbkRpZ2l0cyAwLXBhZCByZXN1bHQgdG8gdGhpcyBtYW55IGRpZ2l0c1xuICovXG52YXIgc2lnbmVkQmluYXJ5VG9EZWNpbWFsID0gZnVuY3Rpb24gKGJpZ251bSwgbWluRGlnaXRzKSB7XG4gICAgaWYgKG1pbkRpZ2l0cyA9PT0gdm9pZCAwKSB7IG1pbkRpZ2l0cyA9IDE7IH1cbiAgICBpZiAoKDAsIGV4cG9ydHMuaXNOZWdhdGl2ZSkoYmlnbnVtKSkge1xuICAgICAgICB2YXIgeCA9IGJpZ251bS5zbGljZSgpO1xuICAgICAgICAoMCwgZXhwb3J0cy5uZWdhdGUpKHgpO1xuICAgICAgICByZXR1cm4gJy0nICsgKDAsIGV4cG9ydHMuYmluYXJ5VG9EZWNpbWFsKSh4LCBtaW5EaWdpdHMpO1xuICAgIH1cbiAgICByZXR1cm4gKDAsIGV4cG9ydHMuYmluYXJ5VG9EZWNpbWFsKShiaWdudW0sIG1pbkRpZ2l0cyk7XG59O1xuZXhwb3J0cy5zaWduZWRCaW5hcnlUb0RlY2ltYWwgPSBzaWduZWRCaW5hcnlUb0RlY2ltYWw7XG52YXIgYmFzZTU4VG9CaW5hcnlWYXJTaXplID0gZnVuY3Rpb24gKHMpIHtcbiAgICB2YXIgZV8xLCBfYTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBjYXJyeSA9IGJhc2U1OE1hcFtzLmNoYXJDb2RlQXQoaSldO1xuICAgICAgICBpZiAoY2FycnkgPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgYmFzZS01OCB2YWx1ZScpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcmVzdWx0Lmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHJlc3VsdFtqXSAqIDU4ICsgY2Fycnk7XG4gICAgICAgICAgICByZXN1bHRbal0gPSB4ICYgMHhmZjtcbiAgICAgICAgICAgIGNhcnJ5ID0geCA+PiA4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYXJyeSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goY2FycnkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIHNfMSA9IF9fdmFsdWVzKHMpLCBzXzFfMSA9IHNfMS5uZXh0KCk7ICFzXzFfMS5kb25lOyBzXzFfMSA9IHNfMS5uZXh0KCkpIHtcbiAgICAgICAgICAgIHZhciBjaCA9IHNfMV8xLnZhbHVlO1xuICAgICAgICAgICAgaWYgKGNoID09PSAnMScpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoc18xXzEgJiYgIXNfMV8xLmRvbmUgJiYgKF9hID0gc18xLnJldHVybikpIF9hLmNhbGwoc18xKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XG4gICAgfVxuICAgIHJlc3VsdC5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHJlc3VsdCk7XG59O1xuLyoqXG4gKiBDb252ZXJ0IGFuIHVuc2lnbmVkIGJhc2UtNTggbnVtYmVyIGluIGBzYCB0byBhIGJpZ251bVxuICpcbiAqIEBwYXJhbSBzaXplIGJpZ251bSBzaXplIChieXRlcylcbiAqL1xudmFyIGJhc2U1OFRvQmluYXJ5ID0gZnVuY3Rpb24gKHNpemUsIHMpIHtcbiAgICBpZiAoIXNpemUpIHtcbiAgICAgICAgcmV0dXJuIGJhc2U1OFRvQmluYXJ5VmFyU2l6ZShzKTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgY2FycnkgPSBiYXNlNThNYXBbcy5jaGFyQ29kZUF0KGkpXTtcbiAgICAgICAgaWYgKGNhcnJ5IDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGJhc2UtNTggdmFsdWUnKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNpemU7ICsraikge1xuICAgICAgICAgICAgdmFyIHggPSByZXN1bHRbal0gKiA1OCArIGNhcnJ5O1xuICAgICAgICAgICAgcmVzdWx0W2pdID0geDtcbiAgICAgICAgICAgIGNhcnJ5ID0geCA+PiA4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYXJyeSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdiYXNlLTU4IHZhbHVlIGlzIG91dCBvZiByYW5nZScpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5leHBvcnRzLmJhc2U1OFRvQmluYXJ5ID0gYmFzZTU4VG9CaW5hcnk7XG4vKipcbiAqIENvbnZlcnQgYGJpZ251bWAgdG8gYSBiYXNlLTU4IG51bWJlclxuICpcbiAqIEBwYXJhbSBtaW5EaWdpdHMgMC1wYWQgcmVzdWx0IHRvIHRoaXMgbWFueSBkaWdpdHNcbiAqL1xudmFyIGJpbmFyeVRvQmFzZTU4ID0gZnVuY3Rpb24gKGJpZ251bSwgbWluRGlnaXRzKSB7XG4gICAgdmFyIGVfMiwgX2EsIGVfMywgX2I7XG4gICAgaWYgKG1pbkRpZ2l0cyA9PT0gdm9pZCAwKSB7IG1pbkRpZ2l0cyA9IDE7IH1cbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgYmlnbnVtXzEgPSBfX3ZhbHVlcyhiaWdudW0pLCBiaWdudW1fMV8xID0gYmlnbnVtXzEubmV4dCgpOyAhYmlnbnVtXzFfMS5kb25lOyBiaWdudW1fMV8xID0gYmlnbnVtXzEubmV4dCgpKSB7XG4gICAgICAgICAgICB2YXIgYnl0ZSA9IGJpZ251bV8xXzEudmFsdWU7XG4gICAgICAgICAgICB2YXIgY2FycnkgPSBieXRlO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByZXN1bHQubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgICAgICB2YXIgeCA9IChiYXNlNThNYXBbcmVzdWx0W2pdXSA8PCA4KSArIGNhcnJ5O1xuICAgICAgICAgICAgICAgIHJlc3VsdFtqXSA9IGJhc2U1OENoYXJzLmNoYXJDb2RlQXQoeCAlIDU4KTtcbiAgICAgICAgICAgICAgICBjYXJyeSA9ICh4IC8gNTgpIHwgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlIChjYXJyeSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGJhc2U1OENoYXJzLmNoYXJDb2RlQXQoY2FycnkgJSA1OCkpO1xuICAgICAgICAgICAgICAgIGNhcnJ5ID0gKGNhcnJ5IC8gNTgpIHwgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZV8yXzEpIHsgZV8yID0geyBlcnJvcjogZV8yXzEgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGJpZ251bV8xXzEgJiYgIWJpZ251bV8xXzEuZG9uZSAmJiAoX2EgPSBiaWdudW1fMS5yZXR1cm4pKSBfYS5jYWxsKGJpZ251bV8xKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yOyB9XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGJpZ251bV8yID0gX192YWx1ZXMoYmlnbnVtKSwgYmlnbnVtXzJfMSA9IGJpZ251bV8yLm5leHQoKTsgIWJpZ251bV8yXzEuZG9uZTsgYmlnbnVtXzJfMSA9IGJpZ251bV8yLm5leHQoKSkge1xuICAgICAgICAgICAgdmFyIGJ5dGUgPSBiaWdudW1fMl8xLnZhbHVlO1xuICAgICAgICAgICAgaWYgKGJ5dGUpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKCcxJy5jaGFyQ29kZUF0KDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZV8zXzEpIHsgZV8zID0geyBlcnJvcjogZV8zXzEgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGJpZ251bV8yXzEgJiYgIWJpZ251bV8yXzEuZG9uZSAmJiAoX2IgPSBiaWdudW1fMi5yZXR1cm4pKSBfYi5jYWxsKGJpZ251bV8yKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yOyB9XG4gICAgfVxuICAgIHJlc3VsdC5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQocmVzdWx0KSwgZmFsc2UpKTtcbn07XG5leHBvcnRzLmJpbmFyeVRvQmFzZTU4ID0gYmluYXJ5VG9CYXNlNTg7XG4vKiogQ29udmVydCBhbiB1bnNpZ25lZCBiYXNlLTY0IG51bWJlciBpbiBgc2AgdG8gYSBiaWdudW0gKi9cbnZhciBiYXNlNjRUb0JpbmFyeSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgdmFyIGxlbiA9IHMubGVuZ3RoO1xuICAgIGlmICgobGVuICYgMykgPT09IDEgJiYgc1tsZW4gLSAxXSA9PT0gJz0nKSB7XG4gICAgICAgIGxlbiAtPSAxO1xuICAgIH0gLy8gZmMgYXBwZW5kcyBhbiBleHRyYSAnPSdcbiAgICBpZiAoKGxlbiAmIDMpICE9PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYmFzZS02NCB2YWx1ZSBpcyBub3QgcGFkZGVkIGNvcnJlY3RseScpO1xuICAgIH1cbiAgICB2YXIgZ3JvdXBzID0gbGVuID4+IDI7XG4gICAgdmFyIGJ5dGVzID0gZ3JvdXBzICogMztcbiAgICBpZiAobGVuID4gMCAmJiBzW2xlbiAtIDFdID09PSAnPScpIHtcbiAgICAgICAgaWYgKHNbbGVuIC0gMl0gPT09ICc9Jykge1xuICAgICAgICAgICAgYnl0ZXMgLT0gMjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGJ5dGVzIC09IDE7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBVaW50OEFycmF5KGJ5dGVzKTtcbiAgICBmb3IgKHZhciBncm91cCA9IDA7IGdyb3VwIDwgZ3JvdXBzOyArK2dyb3VwKSB7XG4gICAgICAgIHZhciBkaWdpdDAgPSBiYXNlNjRNYXBbcy5jaGFyQ29kZUF0KGdyb3VwICogNCArIDApXTtcbiAgICAgICAgdmFyIGRpZ2l0MSA9IGJhc2U2NE1hcFtzLmNoYXJDb2RlQXQoZ3JvdXAgKiA0ICsgMSldO1xuICAgICAgICB2YXIgZGlnaXQyID0gYmFzZTY0TWFwW3MuY2hhckNvZGVBdChncm91cCAqIDQgKyAyKV07XG4gICAgICAgIHZhciBkaWdpdDMgPSBiYXNlNjRNYXBbcy5jaGFyQ29kZUF0KGdyb3VwICogNCArIDMpXTtcbiAgICAgICAgcmVzdWx0W2dyb3VwICogMyArIDBdID0gKGRpZ2l0MCA8PCAyKSB8IChkaWdpdDEgPj4gNCk7XG4gICAgICAgIGlmIChncm91cCAqIDMgKyAxIDwgYnl0ZXMpIHtcbiAgICAgICAgICAgIHJlc3VsdFtncm91cCAqIDMgKyAxXSA9ICgoZGlnaXQxICYgMTUpIDw8IDQpIHwgKGRpZ2l0MiA+PiAyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ3JvdXAgKiAzICsgMiA8IGJ5dGVzKSB7XG4gICAgICAgICAgICByZXN1bHRbZ3JvdXAgKiAzICsgMl0gPSAoKGRpZ2l0MiAmIDMpIDw8IDYpIHwgZGlnaXQzO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuZXhwb3J0cy5iYXNlNjRUb0JpbmFyeSA9IGJhc2U2NFRvQmluYXJ5O1xuLyoqIEtleSB0eXBlcyB0aGlzIGxpYnJhcnkgc3VwcG9ydHMgKi9cbnZhciBLZXlUeXBlO1xuKGZ1bmN0aW9uIChLZXlUeXBlKSB7XG4gICAgS2V5VHlwZVtLZXlUeXBlW1wiazFcIl0gPSAwXSA9IFwiazFcIjtcbiAgICBLZXlUeXBlW0tleVR5cGVbXCJyMVwiXSA9IDFdID0gXCJyMVwiO1xuICAgIEtleVR5cGVbS2V5VHlwZVtcIndhXCJdID0gMl0gPSBcIndhXCI7XG59KShLZXlUeXBlID0gZXhwb3J0cy5LZXlUeXBlIHx8IChleHBvcnRzLktleVR5cGUgPSB7fSkpO1xuLyoqIFB1YmxpYyBrZXkgZGF0YSBzaXplLCBleGNsdWRpbmcgdHlwZSBmaWVsZCAqL1xuZXhwb3J0cy5wdWJsaWNLZXlEYXRhU2l6ZSA9IDMzO1xuLyoqIFByaXZhdGUga2V5IGRhdGEgc2l6ZSwgZXhjbHVkaW5nIHR5cGUgZmllbGQgKi9cbmV4cG9ydHMucHJpdmF0ZUtleURhdGFTaXplID0gMzI7XG4vKiogU2lnbmF0dXJlIGRhdGEgc2l6ZSwgZXhjbHVkaW5nIHR5cGUgZmllbGQgKi9cbmV4cG9ydHMuc2lnbmF0dXJlRGF0YVNpemUgPSA2NTtcbnZhciBkaWdlc3RTdWZmaXhSaXBlbWQxNjAgPSBmdW5jdGlvbiAoZGF0YSwgc3VmZml4KSB7XG4gICAgdmFyIGQgPSBuZXcgVWludDhBcnJheShkYXRhLmxlbmd0aCArIHN1ZmZpeC5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7ICsraSkge1xuICAgICAgICBkW2ldID0gZGF0YVtpXTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWZmaXgubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZFtkYXRhLmxlbmd0aCArIGldID0gc3VmZml4LmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuICAgIHJldHVybiByaXBlbWQxNjAoZCk7XG59O1xudmFyIHN0cmluZ1RvS2V5ID0gZnVuY3Rpb24gKHMsIHR5cGUsIHNpemUsIHN1ZmZpeCkge1xuICAgIHZhciB3aG9sZSA9ICgwLCBleHBvcnRzLmJhc2U1OFRvQmluYXJ5KShzaXplID8gc2l6ZSArIDQgOiAwLCBzKTtcbiAgICB2YXIgcmVzdWx0ID0geyB0eXBlOiB0eXBlLCBkYXRhOiBuZXcgVWludDhBcnJheSh3aG9sZS5idWZmZXIsIDAsIHdob2xlLmxlbmd0aCAtIDQpIH07XG4gICAgdmFyIGRpZ2VzdCA9IG5ldyBVaW50OEFycmF5KGRpZ2VzdFN1ZmZpeFJpcGVtZDE2MChyZXN1bHQuZGF0YSwgc3VmZml4KSk7XG4gICAgaWYgKGRpZ2VzdFswXSAhPT0gd2hvbGVbd2hvbGUubGVuZ3RoIC0gNF0gfHwgZGlnZXN0WzFdICE9PSB3aG9sZVt3aG9sZS5sZW5ndGggLSAzXVxuICAgICAgICB8fCBkaWdlc3RbMl0gIT09IHdob2xlW3dob2xlLmxlbmd0aCAtIDJdIHx8IGRpZ2VzdFszXSAhPT0gd2hvbGVbd2hvbGUubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjaGVja3N1bSBkb2VzblxcJ3QgbWF0Y2gnKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIga2V5VG9TdHJpbmcgPSBmdW5jdGlvbiAoa2V5LCBzdWZmaXgsIHByZWZpeCkge1xuICAgIHZhciBkaWdlc3QgPSBuZXcgVWludDhBcnJheShkaWdlc3RTdWZmaXhSaXBlbWQxNjAoa2V5LmRhdGEsIHN1ZmZpeCkpO1xuICAgIHZhciB3aG9sZSA9IG5ldyBVaW50OEFycmF5KGtleS5kYXRhLmxlbmd0aCArIDQpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5LmRhdGEubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgd2hvbGVbaV0gPSBrZXkuZGF0YVtpXTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyArK2kpIHtcbiAgICAgICAgd2hvbGVbaSArIGtleS5kYXRhLmxlbmd0aF0gPSBkaWdlc3RbaV07XG4gICAgfVxuICAgIHJldHVybiBwcmVmaXggKyAoMCwgZXhwb3J0cy5iaW5hcnlUb0Jhc2U1OCkod2hvbGUpO1xufTtcbi8qKiBDb252ZXJ0IGtleSBpbiBgc2AgdG8gYmluYXJ5IGZvcm0gKi9cbnZhciBzdHJpbmdUb1B1YmxpY0tleSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgaWYgKHR5cGVvZiBzICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIHN0cmluZyBjb250YWluaW5nIHB1YmxpYyBrZXknKTtcbiAgICB9XG4gICAgaWYgKHMuc3Vic3RyKDAsIDMpID09PSAnRU9TJykge1xuICAgICAgICB2YXIgd2hvbGUgPSAoMCwgZXhwb3J0cy5iYXNlNThUb0JpbmFyeSkoZXhwb3J0cy5wdWJsaWNLZXlEYXRhU2l6ZSArIDQsIHMuc3Vic3RyKDMpKTtcbiAgICAgICAgdmFyIGtleSA9IHsgdHlwZTogS2V5VHlwZS5rMSwgZGF0YTogbmV3IFVpbnQ4QXJyYXkoZXhwb3J0cy5wdWJsaWNLZXlEYXRhU2l6ZSkgfTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHBvcnRzLnB1YmxpY0tleURhdGFTaXplOyArK2kpIHtcbiAgICAgICAgICAgIGtleS5kYXRhW2ldID0gd2hvbGVbaV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRpZ2VzdCA9IG5ldyBVaW50OEFycmF5KHJpcGVtZDE2MChrZXkuZGF0YSkpO1xuICAgICAgICBpZiAoZGlnZXN0WzBdICE9PSB3aG9sZVtleHBvcnRzLnB1YmxpY0tleURhdGFTaXplXSB8fCBkaWdlc3RbMV0gIT09IHdob2xlWzM0XVxuICAgICAgICAgICAgfHwgZGlnZXN0WzJdICE9PSB3aG9sZVszNV0gfHwgZGlnZXN0WzNdICE9PSB3aG9sZVszNl0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2hlY2tzdW0gZG9lc25cXCd0IG1hdGNoJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgZWxzZSBpZiAocy5zdWJzdHIoMCwgNykgPT09ICdQVUJfSzFfJykge1xuICAgICAgICByZXR1cm4gc3RyaW5nVG9LZXkocy5zdWJzdHIoNyksIEtleVR5cGUuazEsIGV4cG9ydHMucHVibGljS2V5RGF0YVNpemUsICdLMScpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzLnN1YnN0cigwLCA3KSA9PT0gJ1BVQl9SMV8nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdUb0tleShzLnN1YnN0cig3KSwgS2V5VHlwZS5yMSwgZXhwb3J0cy5wdWJsaWNLZXlEYXRhU2l6ZSwgJ1IxJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHMuc3Vic3RyKDAsIDcpID09PSAnUFVCX1dBXycpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZ1RvS2V5KHMuc3Vic3RyKDcpLCBLZXlUeXBlLndhLCAwLCAnV0EnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5yZWNvZ25pemVkIHB1YmxpYyBrZXkgZm9ybWF0Jyk7XG4gICAgfVxufTtcbmV4cG9ydHMuc3RyaW5nVG9QdWJsaWNLZXkgPSBzdHJpbmdUb1B1YmxpY0tleTtcbi8qKiBDb252ZXJ0IHB1YmxpYyBga2V5YCB0byBsZWdhY3kgc3RyaW5nIChiYXNlLTU4KSBmb3JtICovXG52YXIgcHVibGljS2V5VG9MZWdhY3lTdHJpbmcgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKGtleS50eXBlID09PSBLZXlUeXBlLmsxICYmIGtleS5kYXRhLmxlbmd0aCA9PT0gZXhwb3J0cy5wdWJsaWNLZXlEYXRhU2l6ZSkge1xuICAgICAgICByZXR1cm4ga2V5VG9TdHJpbmcoa2V5LCAnJywgJ0VPUycpO1xuICAgIH1cbiAgICBlbHNlIGlmIChrZXkudHlwZSA9PT0gS2V5VHlwZS5yMSB8fCBrZXkudHlwZSA9PT0gS2V5VHlwZS53YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tleSBmb3JtYXQgbm90IHN1cHBvcnRlZCBpbiBsZWdhY3kgY29udmVyc2lvbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnJlY29nbml6ZWQgcHVibGljIGtleSBmb3JtYXQnKTtcbiAgICB9XG59O1xuZXhwb3J0cy5wdWJsaWNLZXlUb0xlZ2FjeVN0cmluZyA9IHB1YmxpY0tleVRvTGVnYWN5U3RyaW5nO1xuLyoqIENvbnZlcnQgYGtleWAgdG8gc3RyaW5nIChiYXNlLTU4KSBmb3JtICovXG52YXIgcHVibGljS2V5VG9TdHJpbmcgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKGtleS50eXBlID09PSBLZXlUeXBlLmsxICYmIGtleS5kYXRhLmxlbmd0aCA9PT0gZXhwb3J0cy5wdWJsaWNLZXlEYXRhU2l6ZSkge1xuICAgICAgICByZXR1cm4ga2V5VG9TdHJpbmcoa2V5LCAnSzEnLCAnUFVCX0sxXycpO1xuICAgIH1cbiAgICBlbHNlIGlmIChrZXkudHlwZSA9PT0gS2V5VHlwZS5yMSAmJiBrZXkuZGF0YS5sZW5ndGggPT09IGV4cG9ydHMucHVibGljS2V5RGF0YVNpemUpIHtcbiAgICAgICAgcmV0dXJuIGtleVRvU3RyaW5nKGtleSwgJ1IxJywgJ1BVQl9SMV8nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoa2V5LnR5cGUgPT09IEtleVR5cGUud2EpIHtcbiAgICAgICAgcmV0dXJuIGtleVRvU3RyaW5nKGtleSwgJ1dBJywgJ1BVQl9XQV8nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5yZWNvZ25pemVkIHB1YmxpYyBrZXkgZm9ybWF0Jyk7XG4gICAgfVxufTtcbmV4cG9ydHMucHVibGljS2V5VG9TdHJpbmcgPSBwdWJsaWNLZXlUb1N0cmluZztcbi8qKiBJZiBhIGtleSBpcyBpbiB0aGUgbGVnYWN5IGZvcm1hdCAoYEVPU2AgcHJlZml4KSwgdGhlbiBjb252ZXJ0IGl0IHRvIHRoZSBuZXcgZm9ybWF0IChgUFVCX0sxX2ApLlxuICogTGVhdmVzIG90aGVyIGZvcm1hdHMgdW50b3VjaGVkXG4gKi9cbnZhciBjb252ZXJ0TGVnYWN5UHVibGljS2V5ID0gZnVuY3Rpb24gKHMpIHtcbiAgICBpZiAocy5zdWJzdHIoMCwgMykgPT09ICdFT1MnKSB7XG4gICAgICAgIHJldHVybiAoMCwgZXhwb3J0cy5wdWJsaWNLZXlUb1N0cmluZykoKDAsIGV4cG9ydHMuc3RyaW5nVG9QdWJsaWNLZXkpKHMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHM7XG59O1xuZXhwb3J0cy5jb252ZXJ0TGVnYWN5UHVibGljS2V5ID0gY29udmVydExlZ2FjeVB1YmxpY0tleTtcbi8qKiBJZiBhIGtleSBpcyBpbiB0aGUgbGVnYWN5IGZvcm1hdCAoYEVPU2AgcHJlZml4KSwgdGhlbiBjb252ZXJ0IGl0IHRvIHRoZSBuZXcgZm9ybWF0IChgUFVCX0sxX2ApLlxuICogTGVhdmVzIG90aGVyIGZvcm1hdHMgdW50b3VjaGVkXG4gKi9cbnZhciBjb252ZXJ0TGVnYWN5UHVibGljS2V5cyA9IGZ1bmN0aW9uIChrZXlzKSB7XG4gICAgcmV0dXJuIGtleXMubWFwKGV4cG9ydHMuY29udmVydExlZ2FjeVB1YmxpY0tleSk7XG59O1xuZXhwb3J0cy5jb252ZXJ0TGVnYWN5UHVibGljS2V5cyA9IGNvbnZlcnRMZWdhY3lQdWJsaWNLZXlzO1xuLyoqIENvbnZlcnQga2V5IGluIGBzYCB0byBiaW5hcnkgZm9ybSAqL1xudmFyIHN0cmluZ1RvUHJpdmF0ZUtleSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgaWYgKHR5cGVvZiBzICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIHN0cmluZyBjb250YWluaW5nIHByaXZhdGUga2V5Jyk7XG4gICAgfVxuICAgIGlmIChzLnN1YnN0cigwLCA3KSA9PT0gJ1BWVF9SMV8nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdUb0tleShzLnN1YnN0cig3KSwgS2V5VHlwZS5yMSwgZXhwb3J0cy5wcml2YXRlS2V5RGF0YVNpemUsICdSMScpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzLnN1YnN0cigwLCA3KSA9PT0gJ1BWVF9LMV8nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdUb0tleShzLnN1YnN0cig3KSwgS2V5VHlwZS5rMSwgZXhwb3J0cy5wcml2YXRlS2V5RGF0YVNpemUsICdLMScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gdG9kbzogVmVyaWZ5IGNoZWNrc3VtOiBzaGEyNTYoc2hhMjU2KGtleS5kYXRhKSkuXG4gICAgICAgIC8vICAgICAgIE5vdCBjcml0aWNhbCBzaW5jZSBhIGJhZCBrZXkgd2lsbCBmYWlsIHRvIHByb2R1Y2UgYVxuICAgICAgICAvLyAgICAgICB2YWxpZCBzaWduYXR1cmUgYW55d2F5LlxuICAgICAgICB2YXIgd2hvbGUgPSAoMCwgZXhwb3J0cy5iYXNlNThUb0JpbmFyeSkoZXhwb3J0cy5wcml2YXRlS2V5RGF0YVNpemUgKyA1LCBzKTtcbiAgICAgICAgdmFyIGtleSA9IHsgdHlwZTogS2V5VHlwZS5rMSwgZGF0YTogbmV3IFVpbnQ4QXJyYXkoZXhwb3J0cy5wcml2YXRlS2V5RGF0YVNpemUpIH07XG4gICAgICAgIGlmICh3aG9sZVswXSAhPT0gMHg4MCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnJlY29nbml6ZWQgcHJpdmF0ZSBrZXkgdHlwZScpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhwb3J0cy5wcml2YXRlS2V5RGF0YVNpemU7ICsraSkge1xuICAgICAgICAgICAga2V5LmRhdGFbaV0gPSB3aG9sZVtpICsgMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG59O1xuZXhwb3J0cy5zdHJpbmdUb1ByaXZhdGVLZXkgPSBzdHJpbmdUb1ByaXZhdGVLZXk7XG4vKiogQ29udmVydCBwcml2YXRlIGBrZXlgIHRvIGxlZ2FjeSBzdHJpbmcgKGJhc2UtNTgpIGZvcm0gKi9cbnZhciBwcml2YXRlS2V5VG9MZWdhY3lTdHJpbmcgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKGtleS50eXBlID09PSBLZXlUeXBlLmsxICYmIGtleS5kYXRhLmxlbmd0aCA9PT0gZXhwb3J0cy5wcml2YXRlS2V5RGF0YVNpemUpIHtcbiAgICAgICAgdmFyIHdob2xlXzEgPSBbXTtcbiAgICAgICAgd2hvbGVfMS5wdXNoKDEyOCk7XG4gICAgICAgIGtleS5kYXRhLmZvckVhY2goZnVuY3Rpb24gKGJ5dGUpIHsgcmV0dXJuIHdob2xlXzEucHVzaChieXRlKTsgfSk7XG4gICAgICAgIHZhciBkaWdlc3QgPSBuZXcgVWludDhBcnJheSgoMCwgaGFzaF9qc18xLnNoYTI1NikoKS51cGRhdGUoKDAsIGhhc2hfanNfMS5zaGEyNTYpKCkudXBkYXRlKHdob2xlXzEpLmRpZ2VzdCgpKS5kaWdlc3QoKSk7XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgVWludDhBcnJheShleHBvcnRzLnByaXZhdGVLZXlEYXRhU2l6ZSArIDUpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdob2xlXzEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IHdob2xlXzFbaV07XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdFtpICsgd2hvbGVfMS5sZW5ndGhdID0gZGlnZXN0W2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoMCwgZXhwb3J0cy5iaW5hcnlUb0Jhc2U1OCkocmVzdWx0KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoa2V5LnR5cGUgPT09IEtleVR5cGUucjEgfHwga2V5LnR5cGUgPT09IEtleVR5cGUud2EpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZXkgZm9ybWF0IG5vdCBzdXBwb3J0ZWQgaW4gbGVnYWN5IGNvbnZlcnNpb24nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5yZWNvZ25pemVkIHB1YmxpYyBrZXkgZm9ybWF0Jyk7XG4gICAgfVxufTtcbmV4cG9ydHMucHJpdmF0ZUtleVRvTGVnYWN5U3RyaW5nID0gcHJpdmF0ZUtleVRvTGVnYWN5U3RyaW5nO1xuLyoqIENvbnZlcnQgYGtleWAgdG8gc3RyaW5nIChiYXNlLTU4KSBmb3JtICovXG52YXIgcHJpdmF0ZUtleVRvU3RyaW5nID0gZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChrZXkudHlwZSA9PT0gS2V5VHlwZS5yMSkge1xuICAgICAgICByZXR1cm4ga2V5VG9TdHJpbmcoa2V5LCAnUjEnLCAnUFZUX1IxXycpO1xuICAgIH1cbiAgICBlbHNlIGlmIChrZXkudHlwZSA9PT0gS2V5VHlwZS5rMSkge1xuICAgICAgICByZXR1cm4ga2V5VG9TdHJpbmcoa2V5LCAnSzEnLCAnUFZUX0sxXycpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnJlY29nbml6ZWQgcHJpdmF0ZSBrZXkgZm9ybWF0Jyk7XG4gICAgfVxufTtcbmV4cG9ydHMucHJpdmF0ZUtleVRvU3RyaW5nID0gcHJpdmF0ZUtleVRvU3RyaW5nO1xuLyoqIENvbnZlcnQga2V5IGluIGBzYCB0byBiaW5hcnkgZm9ybSAqL1xudmFyIHN0cmluZ1RvU2lnbmF0dXJlID0gZnVuY3Rpb24gKHMpIHtcbiAgICBpZiAodHlwZW9mIHMgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZXhwZWN0ZWQgc3RyaW5nIGNvbnRhaW5pbmcgc2lnbmF0dXJlJyk7XG4gICAgfVxuICAgIGlmIChzLnN1YnN0cigwLCA3KSA9PT0gJ1NJR19LMV8nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdUb0tleShzLnN1YnN0cig3KSwgS2V5VHlwZS5rMSwgZXhwb3J0cy5zaWduYXR1cmVEYXRhU2l6ZSwgJ0sxJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHMuc3Vic3RyKDAsIDcpID09PSAnU0lHX1IxXycpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZ1RvS2V5KHMuc3Vic3RyKDcpLCBLZXlUeXBlLnIxLCBleHBvcnRzLnNpZ25hdHVyZURhdGFTaXplLCAnUjEnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocy5zdWJzdHIoMCwgNykgPT09ICdTSUdfV0FfJykge1xuICAgICAgICByZXR1cm4gc3RyaW5nVG9LZXkocy5zdWJzdHIoNyksIEtleVR5cGUud2EsIDAsICdXQScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnJlY29nbml6ZWQgc2lnbmF0dXJlIGZvcm1hdCcpO1xuICAgIH1cbn07XG5leHBvcnRzLnN0cmluZ1RvU2lnbmF0dXJlID0gc3RyaW5nVG9TaWduYXR1cmU7XG4vKiogQ29udmVydCBgc2lnbmF0dXJlYCB0byBzdHJpbmcgKGJhc2UtNTgpIGZvcm0gKi9cbnZhciBzaWduYXR1cmVUb1N0cmluZyA9IGZ1bmN0aW9uIChzaWduYXR1cmUpIHtcbiAgICBpZiAoc2lnbmF0dXJlLnR5cGUgPT09IEtleVR5cGUuazEpIHtcbiAgICAgICAgcmV0dXJuIGtleVRvU3RyaW5nKHNpZ25hdHVyZSwgJ0sxJywgJ1NJR19LMV8nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2lnbmF0dXJlLnR5cGUgPT09IEtleVR5cGUucjEpIHtcbiAgICAgICAgcmV0dXJuIGtleVRvU3RyaW5nKHNpZ25hdHVyZSwgJ1IxJywgJ1NJR19SMV8nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2lnbmF0dXJlLnR5cGUgPT09IEtleVR5cGUud2EpIHtcbiAgICAgICAgcmV0dXJuIGtleVRvU3RyaW5nKHNpZ25hdHVyZSwgJ1dBJywgJ1NJR19XQV8nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5yZWNvZ25pemVkIHNpZ25hdHVyZSBmb3JtYXQnKTtcbiAgICB9XG59O1xuZXhwb3J0cy5zaWduYXR1cmVUb1N0cmluZyA9IHNpZ25hdHVyZVRvU3RyaW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEBtb2R1bGUgU2VyaWFsaXplXG4gKi9cbi8vIGNvcHlyaWdodCBkZWZpbmVkIGluIGVvc2pzL0xJQ0VOU0UudHh0XG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtY2xhc3Nlcy1wZXItZmlsZSAqL1xuLyogZXNsaW50LWRpc2FibGUganNkb2MvY2hlY2staW5kZW50YXRpb24gKi9cbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19yZWFkID0gKHRoaXMgJiYgdGhpcy5fX3JlYWQpIHx8IGZ1bmN0aW9uIChvLCBuKSB7XG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xuICAgIGlmICghbSkgcmV0dXJuIG87XG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XG4gICAgdHJ5IHtcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XG4gICAgfVxuICAgIHJldHVybiBhcjtcbn07XG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG52YXIgX192YWx1ZXMgPSAodGhpcyAmJiB0aGlzLl9fdmFsdWVzKSB8fCBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnNlcmlhbGl6ZVF1ZXJ5ID0gZXhwb3J0cy5kZXNlcmlhbGl6ZUFueUFycmF5ID0gZXhwb3J0cy5zZXJpYWxpemVBbnlBcnJheSA9IGV4cG9ydHMuZGVzZXJpYWxpemVBbnlPYmplY3QgPSBleHBvcnRzLnNlcmlhbGl6ZUFueU9iamVjdCA9IGV4cG9ydHMuZGVzZXJpYWxpemVBbnl2YXJTaG9ydCA9IGV4cG9ydHMuZGVzZXJpYWxpemVBbnl2YXIgPSBleHBvcnRzLnNlcmlhbGl6ZUFueXZhciA9IGV4cG9ydHMuZGVzZXJpYWxpemVBY3Rpb24gPSBleHBvcnRzLmRlc2VyaWFsaXplQWN0aW9uRGF0YSA9IGV4cG9ydHMuc2VyaWFsaXplQWN0aW9uID0gZXhwb3J0cy5zZXJpYWxpemVBY3Rpb25EYXRhID0gZXhwb3J0cy50cmFuc2FjdGlvbkhlYWRlciA9IGV4cG9ydHMuZ2V0VHlwZXNGcm9tQWJpID0gZXhwb3J0cy5nZXRUeXBlID0gZXhwb3J0cy5jcmVhdGVUcmFuc2FjdGlvblR5cGVzID0gZXhwb3J0cy5jcmVhdGVUcmFuc2FjdGlvbkV4dGVuc2lvblR5cGVzID0gZXhwb3J0cy5jcmVhdGVBYmlUeXBlcyA9IGV4cG9ydHMuY3JlYXRlSW5pdGlhbFR5cGVzID0gZXhwb3J0cy5oZXhUb1VpbnQ4QXJyYXkgPSBleHBvcnRzLmFycmF5VG9IZXggPSBleHBvcnRzLnN5bWJvbFRvU3RyaW5nID0gZXhwb3J0cy5zdHJpbmdUb1N5bWJvbCA9IGV4cG9ydHMuYmxvY2tUaW1lc3RhbXBUb0RhdGUgPSBleHBvcnRzLmRhdGVUb0Jsb2NrVGltZXN0YW1wID0gZXhwb3J0cy50aW1lUG9pbnRTZWNUb0RhdGUgPSBleHBvcnRzLmRhdGVUb1RpbWVQb2ludFNlYyA9IGV4cG9ydHMudGltZVBvaW50VG9EYXRlID0gZXhwb3J0cy5kYXRlVG9UaW1lUG9pbnQgPSBleHBvcnRzLnN1cHBvcnRlZEFiaVZlcnNpb24gPSBleHBvcnRzLlNlcmlhbEJ1ZmZlciA9IGV4cG9ydHMuU2VyaWFsaXplclN0YXRlID0gdm9pZCAwO1xudmFyIG51bWVyaWMgPSByZXF1aXJlKFwiLi9lb3Nqcy1udW1lcmljXCIpO1xuLyoqIFN0YXRlIGZvciBzZXJpYWxpemUoKSBhbmQgZGVzZXJpYWxpemUoKSAqL1xudmFyIFNlcmlhbGl6ZXJTdGF0ZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTZXJpYWxpemVyU3RhdGUob3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgICAgICAvKiogSGF2ZSBhbnkgYmluYXJ5IGV4dGVuc2lvbnMgYmVlbiBza2lwcGVkPyAqL1xuICAgICAgICB0aGlzLnNraXBwZWRCaW5hcnlFeHRlbnNpb24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB9XG4gICAgcmV0dXJuIFNlcmlhbGl6ZXJTdGF0ZTtcbn0oKSk7XG5leHBvcnRzLlNlcmlhbGl6ZXJTdGF0ZSA9IFNlcmlhbGl6ZXJTdGF0ZTtcbi8qKiBTZXJpYWxpemUgYW5kIGRlc2VyaWFsaXplIGRhdGEgKi9cbnZhciBTZXJpYWxCdWZmZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIF9fbmFtZWRQYXJhbWV0ZXJzXG4gICAgICogYGFycmF5YDogYG51bGxgIGlmIHNlcmlhbGl6aW5nLCBvciBiaW5hcnkgZGF0YSB0byBkZXNlcmlhbGl6ZVxuICAgICAqIGB0ZXh0RW5jb2RlcmA6IGBUZXh0RW5jb2RlcmAgaW5zdGFuY2UgdG8gdXNlLiBQYXNzIGluIGBudWxsYCBpZiBydW5uaW5nIGluIGEgYnJvd3NlclxuICAgICAqIGB0ZXh0RGVjb2RlcmA6IGBUZXh0RGVjaWRlcmAgaW5zdGFuY2UgdG8gdXNlLiBQYXNzIGluIGBudWxsYCBpZiBydW5uaW5nIGluIGEgYnJvd3NlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFNlcmlhbEJ1ZmZlcihfYSkge1xuICAgICAgICB2YXIgX2IgPSBfYSA9PT0gdm9pZCAwID8ge30gOiBfYSwgdGV4dEVuY29kZXIgPSBfYi50ZXh0RW5jb2RlciwgdGV4dERlY29kZXIgPSBfYi50ZXh0RGVjb2RlciwgYXJyYXkgPSBfYi5hcnJheTtcbiAgICAgICAgLyoqIEN1cnJlbnQgcG9zaXRpb24gd2hpbGUgcmVhZGluZyAoZGVzZXJpYWxpemluZykgKi9cbiAgICAgICAgdGhpcy5yZWFkUG9zID0gMDtcbiAgICAgICAgdGhpcy5hcnJheSA9IGFycmF5IHx8IG5ldyBVaW50OEFycmF5KDEwMjQpO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgICAgICAgdGhpcy50ZXh0RW5jb2RlciA9IHRleHRFbmNvZGVyIHx8IG5ldyBUZXh0RW5jb2RlcigpO1xuICAgICAgICB0aGlzLnRleHREZWNvZGVyID0gdGV4dERlY29kZXIgfHwgbmV3IFRleHREZWNvZGVyKCd1dGYtOCcsIHsgZmF0YWw6IHRydWUgfSk7XG4gICAgfVxuICAgIC8qKiBSZXNpemUgYGFycmF5YCBpZiBuZWVkZWQgdG8gaGF2ZSBhdCBsZWFzdCBgc2l6ZWAgYnl0ZXMgZnJlZSAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucmVzZXJ2ZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCArIHNpemUgPD0gdGhpcy5hcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbCA9IHRoaXMuYXJyYXkubGVuZ3RoO1xuICAgICAgICB3aGlsZSAodGhpcy5sZW5ndGggKyBzaXplID4gbCkge1xuICAgICAgICAgICAgbCA9IE1hdGguY2VpbChsICogMS41KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmV3QXJyYXkgPSBuZXcgVWludDhBcnJheShsKTtcbiAgICAgICAgbmV3QXJyYXkuc2V0KHRoaXMuYXJyYXkpO1xuICAgICAgICB0aGlzLmFycmF5ID0gbmV3QXJyYXk7XG4gICAgfTtcbiAgICAvKiogSXMgdGhlcmUgZGF0YSBhdmFpbGFibGUgdG8gcmVhZD8gKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmhhdmVSZWFkRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhZFBvcyA8IHRoaXMubGVuZ3RoO1xuICAgIH07XG4gICAgLyoqIFJlc3RhcnQgcmVhZGluZyBmcm9tIHRoZSBiZWdpbm5pbmcgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnJlc3RhcnRSZWFkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJlYWRQb3MgPSAwO1xuICAgIH07XG4gICAgLyoqIFJldHVybiBkYXRhIHdpdGggZXhjZXNzIHN0b3JhZ2UgdHJpbW1lZCBhd2F5ICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5hc1VpbnQ4QXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheSh0aGlzLmFycmF5LmJ1ZmZlciwgdGhpcy5hcnJheS5ieXRlT2Zmc2V0LCB0aGlzLmxlbmd0aCk7XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGJ5dGVzICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5wdXNoQXJyYXkgPSBmdW5jdGlvbiAodikge1xuICAgICAgICB0aGlzLnJlc2VydmUodi5sZW5ndGgpO1xuICAgICAgICB0aGlzLmFycmF5LnNldCh2LCB0aGlzLmxlbmd0aCk7XG4gICAgICAgIHRoaXMubGVuZ3RoICs9IHYubGVuZ3RoO1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBieXRlcyAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHYgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnB1c2hBcnJheSh2KTtcbiAgICB9O1xuICAgIC8qKiBHZXQgYSBzaW5nbGUgYnl0ZSAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkUG9zIDwgdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFycmF5W3RoaXMucmVhZFBvcysrXTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlYWQgcGFzdCBlbmQgb2YgYnVmZmVyJyk7XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGJ5dGVzIGluIGB2YC4gVGhyb3dzIGlmIGBsZW5gIGRvZXNuJ3QgbWF0Y2ggYHYubGVuZ3RoYCAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaFVpbnQ4QXJyYXlDaGVja2VkID0gZnVuY3Rpb24gKHYsIGxlbikge1xuICAgICAgICBpZiAodi5sZW5ndGggIT09IGxlbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCaW5hcnkgZGF0YSBoYXMgaW5jb3JyZWN0IHNpemUnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnB1c2hBcnJheSh2KTtcbiAgICB9O1xuICAgIC8qKiBHZXQgYGxlbmAgYnl0ZXMgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldFVpbnQ4QXJyYXkgPSBmdW5jdGlvbiAobGVuKSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWRQb3MgKyBsZW4gPiB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWFkIHBhc3QgZW5kIG9mIGJ1ZmZlcicpO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgVWludDhBcnJheSh0aGlzLmFycmF5LmJ1ZmZlciwgdGhpcy5hcnJheS5ieXRlT2Zmc2V0ICsgdGhpcy5yZWFkUG9zLCBsZW4pO1xuICAgICAgICB0aGlzLnJlYWRQb3MgKz0gbGVuO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgLyoqIFNraXAgYGxlbmAgYnl0ZXMgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnNraXAgPSBmdW5jdGlvbiAobGVuKSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWRQb3MgKyBsZW4gPiB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWFkIHBhc3QgZW5kIG9mIGJ1ZmZlcicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVhZFBvcyArPSBsZW47XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGEgYHVpbnQxNmAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2hVaW50MTYgPSBmdW5jdGlvbiAodikge1xuICAgICAgICB0aGlzLnB1c2goKHYgPj4gMCkgJiAweGZmLCAodiA+PiA4KSAmIDB4ZmYpO1xuICAgIH07XG4gICAgLyoqIEdldCBhIGB1aW50MTZgICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5nZXRVaW50MTYgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2ID0gMDtcbiAgICAgICAgdiB8PSB0aGlzLmdldCgpIDw8IDA7XG4gICAgICAgIHYgfD0gdGhpcy5nZXQoKSA8PCA4O1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9O1xuICAgIC8qKiBBcHBlbmQgYSBgdWludDMyYCAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaFVpbnQzMiA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHRoaXMucHVzaCgodiA+PiAwKSAmIDB4ZmYsICh2ID4+IDgpICYgMHhmZiwgKHYgPj4gMTYpICYgMHhmZiwgKHYgPj4gMjQpICYgMHhmZik7XG4gICAgfTtcbiAgICAvKiogR2V0IGEgYHVpbnQzMmAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldFVpbnQzMiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHYgPSAwO1xuICAgICAgICB2IHw9IHRoaXMuZ2V0KCkgPDwgMDtcbiAgICAgICAgdiB8PSB0aGlzLmdldCgpIDw8IDg7XG4gICAgICAgIHYgfD0gdGhpcy5nZXQoKSA8PCAxNjtcbiAgICAgICAgdiB8PSB0aGlzLmdldCgpIDw8IDI0O1xuICAgICAgICByZXR1cm4gdiA+Pj4gMDtcbiAgICB9O1xuICAgIC8qKiBBcHBlbmQgYSBgdWludDY0YC4gKkNhdXRpb24qOiBgbnVtYmVyYCBvbmx5IGhhcyA1MyBiaXRzIG9mIHByZWNpc2lvbiAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaE51bWJlckFzVWludDY0ID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdGhpcy5wdXNoVWludDMyKHYgPj4+IDApO1xuICAgICAgICB0aGlzLnB1c2hVaW50MzIoTWF0aC5mbG9vcih2IC8gNDI5NDk2NzI5NikgPj4+IDApO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IGEgYHVpbnQ2NGAgYXMgYSBgbnVtYmVyYC4gKkNhdXRpb24qOiBgbnVtYmVyYCBvbmx5IGhhcyA1MyBiaXRzIG9mIHByZWNpc2lvbjsgc29tZSB2YWx1ZXMgd2lsbCBjaGFuZ2UuXG4gICAgICogYG51bWVyaWMuYmluYXJ5VG9EZWNpbWFsKHNlcmlhbEJ1ZmZlci5nZXRVaW50OEFycmF5KDgpKWAgcmVjb21tZW5kZWQgaW5zdGVhZFxuICAgICAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUuZ2V0VWludDY0QXNOdW1iZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsb3cgPSB0aGlzLmdldFVpbnQzMigpO1xuICAgICAgICB2YXIgaGlnaCA9IHRoaXMuZ2V0VWludDMyKCk7XG4gICAgICAgIHJldHVybiAoaGlnaCA+Pj4gMCkgKiA0Mjk0OTY3Mjk2ICsgKGxvdyA+Pj4gMCk7XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGEgYHZhcnVpbnQzMmAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2hWYXJ1aW50MzIgPSBmdW5jdGlvbiAodikge1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHYgPj4+IDcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnB1c2goMHg4MCB8ICh2ICYgMHg3ZikpO1xuICAgICAgICAgICAgICAgIHYgPSB2ID4+PiA3O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoKHYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICAvKiogR2V0IGEgYHZhcnVpbnQzMmAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldFZhcnVpbnQzMiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHYgPSAwO1xuICAgICAgICB2YXIgYml0ID0gMDtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHZhciBiID0gdGhpcy5nZXQoKTtcbiAgICAgICAgICAgIHYgfD0gKGIgJiAweDdmKSA8PCBiaXQ7XG4gICAgICAgICAgICBiaXQgKz0gNztcbiAgICAgICAgICAgIGlmICghKGIgJiAweDgwKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2ID4+PiAwO1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBhIGB2YXJpbnQzMmAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2hWYXJpbnQzMiA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHRoaXMucHVzaFZhcnVpbnQzMigodiA8PCAxKSBeICh2ID4+IDMxKSk7XG4gICAgfTtcbiAgICAvKiogR2V0IGEgYHZhcmludDMyYCAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUuZ2V0VmFyaW50MzIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2ID0gdGhpcy5nZXRWYXJ1aW50MzIoKTtcbiAgICAgICAgaWYgKHYgJiAxKSB7XG4gICAgICAgICAgICByZXR1cm4gKCh+dikgPj4gMSkgfCAyMTQ3NDgzNjQ4O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHYgPj4+IDE7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKiBBcHBlbmQgYSBgZmxvYXQzMmAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2hGbG9hdDMyID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdGhpcy5wdXNoQXJyYXkobmV3IFVpbnQ4QXJyYXkoKG5ldyBGbG9hdDMyQXJyYXkoW3ZdKSkuYnVmZmVyKSk7XG4gICAgfTtcbiAgICAvKiogR2V0IGEgYGZsb2F0MzJgICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5nZXRGbG9hdDMyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmdldFVpbnQ4QXJyYXkoNCkuc2xpY2UoKS5idWZmZXIpWzBdO1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBhIGBmbG9hdDY0YCAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaEZsb2F0NjQgPSBmdW5jdGlvbiAodikge1xuICAgICAgICB0aGlzLnB1c2hBcnJheShuZXcgVWludDhBcnJheSgobmV3IEZsb2F0NjRBcnJheShbdl0pKS5idWZmZXIpKTtcbiAgICB9O1xuICAgIC8qKiBHZXQgYSBgZmxvYXQ2NGAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldEZsb2F0NjQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQ2NEFycmF5KHRoaXMuZ2V0VWludDhBcnJheSg4KS5zbGljZSgpLmJ1ZmZlcilbMF07XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGEgYG5hbWVgICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5wdXNoTmFtZSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgc3RyaW5nIGNvbnRhaW5pbmcgbmFtZScpO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoL15bLjEtNWEtel17MCwxMn1bLjEtNWEtal0/JC8pO1xuICAgICAgICBpZiAoIXJlZ2V4LnRlc3QocykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTmFtZSBzaG91bGQgYmUgbGVzcyB0aGFuIDEzIGNoYXJhY3RlcnMsIG9yIGxlc3MgdGhhbiAxNCBpZiBsYXN0IGNoYXJhY3RlciBpcyBiZXR3ZWVuIDEtNSBvciBhLWosIGFuZCBvbmx5IGNvbnRhaW4gdGhlIGZvbGxvd2luZyBzeW1ib2xzIC4xMjM0NWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Jyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2hhclRvU3ltYm9sID0gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgIGlmIChjID49ICdhJy5jaGFyQ29kZUF0KDApICYmIGMgPD0gJ3onLmNoYXJDb2RlQXQoMCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGMgLSAnYScuY2hhckNvZGVBdCgwKSkgKyA2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGMgPj0gJzEnLmNoYXJDb2RlQXQoMCkgJiYgYyA8PSAnNScuY2hhckNvZGVBdCgwKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoYyAtICcxJy5jaGFyQ29kZUF0KDApKSArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGEgPSBuZXcgVWludDhBcnJheSg4KTtcbiAgICAgICAgdmFyIGJpdCA9IDYzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBjID0gY2hhclRvU3ltYm9sKHMuY2hhckNvZGVBdChpKSk7XG4gICAgICAgICAgICBpZiAoYml0IDwgNSkge1xuICAgICAgICAgICAgICAgIGMgPSBjIDw8IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gNDsgaiA+PSAwOyAtLWopIHtcbiAgICAgICAgICAgICAgICBpZiAoYml0ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYVtNYXRoLmZsb29yKGJpdCAvIDgpXSB8PSAoKGMgPj4gaikgJiAxKSA8PCAoYml0ICUgOCk7XG4gICAgICAgICAgICAgICAgICAgIC0tYml0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnB1c2hBcnJheShhKTtcbiAgICB9O1xuICAgIC8qKiBHZXQgYSBgbmFtZWAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldE5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhID0gdGhpcy5nZXRVaW50OEFycmF5KDgpO1xuICAgICAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgICAgIGZvciAodmFyIGJpdCA9IDYzOyBiaXQgPj0gMDspIHtcbiAgICAgICAgICAgIHZhciBjID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNTsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJpdCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGMgPSAoYyA8PCAxKSB8ICgoYVtNYXRoLmZsb29yKGJpdCAvIDgpXSA+PiAoYml0ICUgOCkpICYgMSk7XG4gICAgICAgICAgICAgICAgICAgIC0tYml0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjID49IDYpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjICsgJ2EnLmNoYXJDb2RlQXQoMCkgLSA2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGMgPj0gMSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMgKyAnMScuY2hhckNvZGVBdCgwKSAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9ICcuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAocmVzdWx0LmVuZHNXaXRoKCcuJykpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5zdWJzdHIoMCwgcmVzdWx0Lmxlbmd0aCAtIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGxlbmd0aC1wcmVmaXhlZCBiaW5hcnkgZGF0YSAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaEJ5dGVzID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdGhpcy5wdXNoVmFydWludDMyKHYubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5wdXNoQXJyYXkodik7XG4gICAgfTtcbiAgICAvKiogR2V0IGxlbmd0aC1wcmVmaXhlZCBiaW5hcnkgZGF0YSAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUuZ2V0Qnl0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFVpbnQ4QXJyYXkodGhpcy5nZXRWYXJ1aW50MzIoKSk7XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGEgc3RyaW5nICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5wdXNoU3RyaW5nID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdGhpcy5wdXNoQnl0ZXModGhpcy50ZXh0RW5jb2Rlci5lbmNvZGUodikpO1xuICAgIH07XG4gICAgLyoqIEdldCBhIHN0cmluZyAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUuZ2V0U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0RGVjb2Rlci5kZWNvZGUodGhpcy5nZXRCeXRlcygpKTtcbiAgICB9O1xuICAgIC8qKiBBcHBlbmQgYSBgc3ltYm9sX2NvZGVgLiBVbmxpa2UgYHN5bWJvbGAsIGBzeW1ib2xfY29kZWAgZG9lc24ndCBpbmNsdWRlIGEgcHJlY2lzaW9uLiAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaFN5bWJvbENvZGUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHN0cmluZyBjb250YWluaW5nIHN5bWJvbF9jb2RlJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGEgPSBbXTtcbiAgICAgICAgYS5wdXNoLmFwcGx5KGEsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZCh0aGlzLnRleHRFbmNvZGVyLmVuY29kZShuYW1lKSksIGZhbHNlKSk7XG4gICAgICAgIHdoaWxlIChhLmxlbmd0aCA8IDgpIHtcbiAgICAgICAgICAgIGEucHVzaCgwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnB1c2hBcnJheShhLnNsaWNlKDAsIDgpKTtcbiAgICB9O1xuICAgIC8qKiBHZXQgYSBgc3ltYm9sX2NvZGVgLiBVbmxpa2UgYHN5bWJvbGAsIGBzeW1ib2xfY29kZWAgZG9lc24ndCBpbmNsdWRlIGEgcHJlY2lzaW9uLiAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUuZ2V0U3ltYm9sQ29kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGEgPSB0aGlzLmdldFVpbnQ4QXJyYXkoOCk7XG4gICAgICAgIHZhciBsZW47XG4gICAgICAgIGZvciAobGVuID0gMDsgbGVuIDwgYS5sZW5ndGg7ICsrbGVuKSB7XG4gICAgICAgICAgICBpZiAoIWFbbGVuXSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBuYW1lID0gdGhpcy50ZXh0RGVjb2Rlci5kZWNvZGUobmV3IFVpbnQ4QXJyYXkoYS5idWZmZXIsIGEuYnl0ZU9mZnNldCwgbGVuKSk7XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBhIGBzeW1ib2xgICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5wdXNoU3ltYm9sID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBuYW1lID0gX2EubmFtZSwgcHJlY2lzaW9uID0gX2EucHJlY2lzaW9uO1xuICAgICAgICBpZiAoIS9eW0EtWl17MSw3fSQvLnRlc3QobmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgc3ltYm9sIHRvIGJlIEEtWiBhbmQgYmV0d2VlbiBvbmUgYW5kIHNldmVuIGNoYXJhY3RlcnMnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYSA9IFtwcmVjaXNpb24gJiAweGZmXTtcbiAgICAgICAgYS5wdXNoLmFwcGx5KGEsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZCh0aGlzLnRleHRFbmNvZGVyLmVuY29kZShuYW1lKSksIGZhbHNlKSk7XG4gICAgICAgIHdoaWxlIChhLmxlbmd0aCA8IDgpIHtcbiAgICAgICAgICAgIGEucHVzaCgwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnB1c2hBcnJheShhLnNsaWNlKDAsIDgpKTtcbiAgICB9O1xuICAgIC8qKiBHZXQgYSBgc3ltYm9sYCAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUuZ2V0U3ltYm9sID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcHJlY2lzaW9uID0gdGhpcy5nZXQoKTtcbiAgICAgICAgdmFyIGEgPSB0aGlzLmdldFVpbnQ4QXJyYXkoNyk7XG4gICAgICAgIHZhciBsZW47XG4gICAgICAgIGZvciAobGVuID0gMDsgbGVuIDwgYS5sZW5ndGg7ICsrbGVuKSB7XG4gICAgICAgICAgICBpZiAoIWFbbGVuXSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBuYW1lID0gdGhpcy50ZXh0RGVjb2Rlci5kZWNvZGUobmV3IFVpbnQ4QXJyYXkoYS5idWZmZXIsIGEuYnl0ZU9mZnNldCwgbGVuKSk7XG4gICAgICAgIHJldHVybiB7IG5hbWU6IG5hbWUsIHByZWNpc2lvbjogcHJlY2lzaW9uIH07XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGFuIGFzc2V0ICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5wdXNoQXNzZXQgPSBmdW5jdGlvbiAocykge1xuICAgICAgICBpZiAodHlwZW9mIHMgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHN0cmluZyBjb250YWluaW5nIGFzc2V0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgcyA9IHMudHJpbSgpO1xuICAgICAgICB2YXIgcG9zID0gMDtcbiAgICAgICAgdmFyIGFtb3VudCA9ICcnO1xuICAgICAgICB2YXIgcHJlY2lzaW9uID0gMDtcbiAgICAgICAgaWYgKHNbcG9zXSA9PT0gJy0nKSB7XG4gICAgICAgICAgICBhbW91bnQgKz0gJy0nO1xuICAgICAgICAgICAgKytwb3M7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZvdW5kRGlnaXQgPSBmYWxzZTtcbiAgICAgICAgd2hpbGUgKHBvcyA8IHMubGVuZ3RoICYmIHMuY2hhckNvZGVBdChwb3MpID49ICcwJy5jaGFyQ29kZUF0KDApICYmIHMuY2hhckNvZGVBdChwb3MpIDw9ICc5Jy5jaGFyQ29kZUF0KDApKSB7XG4gICAgICAgICAgICBmb3VuZERpZ2l0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGFtb3VudCArPSBzW3Bvc107XG4gICAgICAgICAgICArK3BvcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWZvdW5kRGlnaXQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXNzZXQgbXVzdCBiZWdpbiB3aXRoIGEgbnVtYmVyJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNbcG9zXSA9PT0gJy4nKSB7XG4gICAgICAgICAgICArK3BvcztcbiAgICAgICAgICAgIHdoaWxlIChwb3MgPCBzLmxlbmd0aCAmJiBzLmNoYXJDb2RlQXQocG9zKSA+PSAnMCcuY2hhckNvZGVBdCgwKSAmJiBzLmNoYXJDb2RlQXQocG9zKSA8PSAnOScuY2hhckNvZGVBdCgwKSkge1xuICAgICAgICAgICAgICAgIGFtb3VudCArPSBzW3Bvc107XG4gICAgICAgICAgICAgICAgKytwcmVjaXNpb247XG4gICAgICAgICAgICAgICAgKytwb3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5hbWUgPSBzLnN1YnN0cihwb3MpLnRyaW0oKTtcbiAgICAgICAgdGhpcy5wdXNoQXJyYXkobnVtZXJpYy5zaWduZWREZWNpbWFsVG9CaW5hcnkoOCwgYW1vdW50KSk7XG4gICAgICAgIHRoaXMucHVzaFN5bWJvbCh7IG5hbWU6IG5hbWUsIHByZWNpc2lvbjogcHJlY2lzaW9uIH0pO1xuICAgIH07XG4gICAgLyoqIEdldCBhbiBhc3NldCAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUuZ2V0QXNzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhbW91bnQgPSB0aGlzLmdldFVpbnQ4QXJyYXkoOCk7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuZ2V0U3ltYm9sKCksIG5hbWUgPSBfYS5uYW1lLCBwcmVjaXNpb24gPSBfYS5wcmVjaXNpb247XG4gICAgICAgIHZhciBzID0gbnVtZXJpYy5zaWduZWRCaW5hcnlUb0RlY2ltYWwoYW1vdW50LCBwcmVjaXNpb24gKyAxKTtcbiAgICAgICAgaWYgKHByZWNpc2lvbikge1xuICAgICAgICAgICAgcyA9IHMuc3Vic3RyKDAsIHMubGVuZ3RoIC0gcHJlY2lzaW9uKSArICcuJyArIHMuc3Vic3RyKHMubGVuZ3RoIC0gcHJlY2lzaW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcyArICcgJyArIG5hbWU7XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGEgcHVibGljIGtleSAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaFB1YmxpY0tleSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHZhciBrZXkgPSBudW1lcmljLnN0cmluZ1RvUHVibGljS2V5KHMpO1xuICAgICAgICB0aGlzLnB1c2goa2V5LnR5cGUpO1xuICAgICAgICB0aGlzLnB1c2hBcnJheShrZXkuZGF0YSk7XG4gICAgfTtcbiAgICAvKiogR2V0IGEgcHVibGljIGtleSAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUuZ2V0UHVibGljS2V5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdHlwZSA9IHRoaXMuZ2V0KCk7XG4gICAgICAgIHZhciBkYXRhO1xuICAgICAgICBpZiAodHlwZSA9PT0gbnVtZXJpYy5LZXlUeXBlLndhKSB7XG4gICAgICAgICAgICB2YXIgYmVnaW4gPSB0aGlzLnJlYWRQb3M7XG4gICAgICAgICAgICB0aGlzLnNraXAoMzQpO1xuICAgICAgICAgICAgdGhpcy5za2lwKHRoaXMuZ2V0VmFydWludDMyKCkpO1xuICAgICAgICAgICAgZGF0YSA9IG5ldyBVaW50OEFycmF5KHRoaXMuYXJyYXkuYnVmZmVyLCB0aGlzLmFycmF5LmJ5dGVPZmZzZXQgKyBiZWdpbiwgdGhpcy5yZWFkUG9zIC0gYmVnaW4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGF0YSA9IHRoaXMuZ2V0VWludDhBcnJheShudW1lcmljLnB1YmxpY0tleURhdGFTaXplKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVtZXJpYy5wdWJsaWNLZXlUb1N0cmluZyh7IHR5cGU6IHR5cGUsIGRhdGE6IGRhdGEgfSk7XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGEgcHJpdmF0ZSBrZXkgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2hQcml2YXRlS2V5ID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgdmFyIGtleSA9IG51bWVyaWMuc3RyaW5nVG9Qcml2YXRlS2V5KHMpO1xuICAgICAgICB0aGlzLnB1c2goa2V5LnR5cGUpO1xuICAgICAgICB0aGlzLnB1c2hBcnJheShrZXkuZGF0YSk7XG4gICAgfTtcbiAgICAvKiogR2V0IGEgcHJpdmF0ZSBrZXkgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldFByaXZhdGVLZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0eXBlID0gdGhpcy5nZXQoKTtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldFVpbnQ4QXJyYXkobnVtZXJpYy5wcml2YXRlS2V5RGF0YVNpemUpO1xuICAgICAgICByZXR1cm4gbnVtZXJpYy5wcml2YXRlS2V5VG9TdHJpbmcoeyB0eXBlOiB0eXBlLCBkYXRhOiBkYXRhIH0pO1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBhIHNpZ25hdHVyZSAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaFNpZ25hdHVyZSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHZhciBrZXkgPSBudW1lcmljLnN0cmluZ1RvU2lnbmF0dXJlKHMpO1xuICAgICAgICB0aGlzLnB1c2goa2V5LnR5cGUpO1xuICAgICAgICB0aGlzLnB1c2hBcnJheShrZXkuZGF0YSk7XG4gICAgfTtcbiAgICAvKiogR2V0IGEgc2lnbmF0dXJlICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5nZXRTaWduYXR1cmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0eXBlID0gdGhpcy5nZXQoKTtcbiAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgIGlmICh0eXBlID09PSBudW1lcmljLktleVR5cGUud2EpIHtcbiAgICAgICAgICAgIHZhciBiZWdpbiA9IHRoaXMucmVhZFBvcztcbiAgICAgICAgICAgIHRoaXMuc2tpcCg2NSk7XG4gICAgICAgICAgICB0aGlzLnNraXAodGhpcy5nZXRWYXJ1aW50MzIoKSk7XG4gICAgICAgICAgICB0aGlzLnNraXAodGhpcy5nZXRWYXJ1aW50MzIoKSk7XG4gICAgICAgICAgICBkYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5hcnJheS5idWZmZXIsIHRoaXMuYXJyYXkuYnl0ZU9mZnNldCArIGJlZ2luLCB0aGlzLnJlYWRQb3MgLSBiZWdpbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkYXRhID0gdGhpcy5nZXRVaW50OEFycmF5KG51bWVyaWMuc2lnbmF0dXJlRGF0YVNpemUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudW1lcmljLnNpZ25hdHVyZVRvU3RyaW5nKHsgdHlwZTogdHlwZSwgZGF0YTogZGF0YSB9KTtcbiAgICB9O1xuICAgIHJldHVybiBTZXJpYWxCdWZmZXI7XG59KCkpOyAvLyBTZXJpYWxCdWZmZXJcbmV4cG9ydHMuU2VyaWFsQnVmZmVyID0gU2VyaWFsQnVmZmVyO1xuLyoqIElzIHRoaXMgYSBzdXBwb3J0ZWQgQUJJIHZlcnNpb24/ICovXG52YXIgc3VwcG9ydGVkQWJpVmVyc2lvbiA9IGZ1bmN0aW9uICh2ZXJzaW9uKSB7XG4gICAgcmV0dXJuIHZlcnNpb24uc3RhcnRzV2l0aCgnZW9zaW86OmFiaS8xLicpO1xufTtcbmV4cG9ydHMuc3VwcG9ydGVkQWJpVmVyc2lvbiA9IHN1cHBvcnRlZEFiaVZlcnNpb247XG52YXIgY2hlY2tEYXRlUGFyc2UgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBEYXRlLnBhcnNlKGRhdGUpO1xuICAgIGlmIChOdW1iZXIuaXNOYU4ocmVzdWx0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdGltZSBmb3JtYXQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG4vKiogQ29udmVydCBkYXRlIGluIElTTyBmb3JtYXQgdG8gYHRpbWVfcG9pbnRgIChtaWxpc2Vjb25kcyBzaW5jZSBlcG9jaCkgKi9cbnZhciBkYXRlVG9UaW1lUG9pbnQgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKGNoZWNrRGF0ZVBhcnNlKGRhdGUgKyAnWicpICogMTAwMCk7XG59O1xuZXhwb3J0cy5kYXRlVG9UaW1lUG9pbnQgPSBkYXRlVG9UaW1lUG9pbnQ7XG4vKiogQ29udmVydCBgdGltZV9wb2ludGAgKG1pbGlzZWNvbmRzIHNpbmNlIGVwb2NoKSB0byBkYXRlIGluIElTTyBmb3JtYXQgKi9cbnZhciB0aW1lUG9pbnRUb0RhdGUgPSBmdW5jdGlvbiAodXMpIHtcbiAgICB2YXIgcyA9IChuZXcgRGF0ZSh1cyAvIDEwMDApKS50b0lTT1N0cmluZygpO1xuICAgIHJldHVybiBzLnN1YnN0cigwLCBzLmxlbmd0aCAtIDEpO1xufTtcbmV4cG9ydHMudGltZVBvaW50VG9EYXRlID0gdGltZVBvaW50VG9EYXRlO1xuLyoqIENvbnZlcnQgZGF0ZSBpbiBJU08gZm9ybWF0IHRvIGB0aW1lX3BvaW50X3NlY2AgKHNlY29uZHMgc2luY2UgZXBvY2gpICovXG52YXIgZGF0ZVRvVGltZVBvaW50U2VjID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChjaGVja0RhdGVQYXJzZShkYXRlICsgJ1onKSAvIDEwMDApO1xufTtcbmV4cG9ydHMuZGF0ZVRvVGltZVBvaW50U2VjID0gZGF0ZVRvVGltZVBvaW50U2VjO1xuLyoqIENvbnZlcnQgYHRpbWVfcG9pbnRfc2VjYCAoc2Vjb25kcyBzaW5jZSBlcG9jaCkgdG8gdG8gZGF0ZSBpbiBJU08gZm9ybWF0ICovXG52YXIgdGltZVBvaW50U2VjVG9EYXRlID0gZnVuY3Rpb24gKHNlYykge1xuICAgIHZhciBzID0gKG5ldyBEYXRlKHNlYyAqIDEwMDApKS50b0lTT1N0cmluZygpO1xuICAgIHJldHVybiBzLnN1YnN0cigwLCBzLmxlbmd0aCAtIDEpO1xufTtcbmV4cG9ydHMudGltZVBvaW50U2VjVG9EYXRlID0gdGltZVBvaW50U2VjVG9EYXRlO1xuLyoqIENvbnZlcnQgZGF0ZSBpbiBJU08gZm9ybWF0IHRvIGBibG9ja190aW1lc3RhbXBfdHlwZWAgKGhhbGYtc2Vjb25kcyBzaW5jZSBhIGRpZmZlcmVudCBlcG9jaCkgKi9cbnZhciBkYXRlVG9CbG9ja1RpbWVzdGFtcCA9IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoKGNoZWNrRGF0ZVBhcnNlKGRhdGUgKyAnWicpIC0gOTQ2Njg0ODAwMDAwKSAvIDUwMCk7XG59O1xuZXhwb3J0cy5kYXRlVG9CbG9ja1RpbWVzdGFtcCA9IGRhdGVUb0Jsb2NrVGltZXN0YW1wO1xuLyoqIENvbnZlcnQgYGJsb2NrX3RpbWVzdGFtcF90eXBlYCAoaGFsZi1zZWNvbmRzIHNpbmNlIGEgZGlmZmVyZW50IGVwb2NoKSB0byB0byBkYXRlIGluIElTTyBmb3JtYXQgKi9cbnZhciBibG9ja1RpbWVzdGFtcFRvRGF0ZSA9IGZ1bmN0aW9uIChzbG90KSB7XG4gICAgdmFyIHMgPSAobmV3IERhdGUoc2xvdCAqIDUwMCArIDk0NjY4NDgwMDAwMCkpLnRvSVNPU3RyaW5nKCk7XG4gICAgcmV0dXJuIHMuc3Vic3RyKDAsIHMubGVuZ3RoIC0gMSk7XG59O1xuZXhwb3J0cy5ibG9ja1RpbWVzdGFtcFRvRGF0ZSA9IGJsb2NrVGltZXN0YW1wVG9EYXRlO1xuLyoqIENvbnZlcnQgYHN0cmluZ2AgdG8gYFN5bWJvbGAuIGZvcm1hdDogYHByZWNpc2lvbixOQU1FYC4gKi9cbnZhciBzdHJpbmdUb1N5bWJvbCA9IGZ1bmN0aW9uIChzKSB7XG4gICAgaWYgKHR5cGVvZiBzICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHN0cmluZyBjb250YWluaW5nIHN5bWJvbCcpO1xuICAgIH1cbiAgICB2YXIgbSA9IHMubWF0Y2goL14oWzAtOV0rKSwoW0EtWl0rKSQvKTtcbiAgICBpZiAoIW0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN5bWJvbCcpO1xuICAgIH1cbiAgICByZXR1cm4geyBuYW1lOiBtWzJdLCBwcmVjaXNpb246ICttWzFdIH07XG59O1xuZXhwb3J0cy5zdHJpbmdUb1N5bWJvbCA9IHN0cmluZ1RvU3ltYm9sO1xuLyoqIENvbnZlcnQgYFN5bWJvbGAgdG8gYHN0cmluZ2AuIGZvcm1hdDogYHByZWNpc2lvbixOQU1FYC4gKi9cbnZhciBzeW1ib2xUb1N0cmluZyA9IGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBuYW1lID0gX2EubmFtZSwgcHJlY2lzaW9uID0gX2EucHJlY2lzaW9uO1xuICAgIHJldHVybiBwcmVjaXNpb24gKyAnLCcgKyBuYW1lO1xufTtcbmV4cG9ydHMuc3ltYm9sVG9TdHJpbmcgPSBzeW1ib2xUb1N0cmluZztcbi8qKiBDb252ZXJ0IGJpbmFyeSBkYXRhIHRvIGhleCAqL1xudmFyIGFycmF5VG9IZXggPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBlXzEsIF9hO1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBkYXRhXzEgPSBfX3ZhbHVlcyhkYXRhKSwgZGF0YV8xXzEgPSBkYXRhXzEubmV4dCgpOyAhZGF0YV8xXzEuZG9uZTsgZGF0YV8xXzEgPSBkYXRhXzEubmV4dCgpKSB7XG4gICAgICAgICAgICB2YXIgeCA9IGRhdGFfMV8xLnZhbHVlO1xuICAgICAgICAgICAgcmVzdWx0ICs9ICgnMDAnICsgeC50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGRhdGFfMV8xICYmICFkYXRhXzFfMS5kb25lICYmIChfYSA9IGRhdGFfMS5yZXR1cm4pKSBfYS5jYWxsKGRhdGFfMSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0LnRvVXBwZXJDYXNlKCk7XG59O1xuZXhwb3J0cy5hcnJheVRvSGV4ID0gYXJyYXlUb0hleDtcbi8qKiBDb252ZXJ0IGhleCB0byBiaW5hcnkgZGF0YSAqL1xudmFyIGhleFRvVWludDhBcnJheSA9IGZ1bmN0aW9uIChoZXgpIHtcbiAgICBpZiAodHlwZW9mIGhleCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBzdHJpbmcgY29udGFpbmluZyBoZXggZGlnaXRzJyk7XG4gICAgfVxuICAgIGlmIChoZXgubGVuZ3RoICUgMikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09kZCBudW1iZXIgb2YgaGV4IGRpZ2l0cycpO1xuICAgIH1cbiAgICB2YXIgbCA9IGhleC5sZW5ndGggLyAyO1xuICAgIHZhciByZXN1bHQgPSBuZXcgVWludDhBcnJheShsKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7ICsraSkge1xuICAgICAgICB2YXIgeCA9IHBhcnNlSW50KGhleC5zdWJzdHIoaSAqIDIsIDIpLCAxNik7XG4gICAgICAgIGlmIChOdW1iZXIuaXNOYU4oeCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgaGV4IHN0cmluZycpO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdFtpXSA9IHg7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuZXhwb3J0cy5oZXhUb1VpbnQ4QXJyYXkgPSBoZXhUb1VpbnQ4QXJyYXk7XG5mdW5jdGlvbiBzZXJpYWxpemVVbmtub3duKGJ1ZmZlciwgZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRG9uXFwndCBrbm93IGhvdyB0byBzZXJpYWxpemUgJyArIHRoaXMubmFtZSk7XG59XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVVua25vd24oYnVmZmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdEb25cXCd0IGtub3cgaG93IHRvIGRlc2VyaWFsaXplICcgKyB0aGlzLm5hbWUpO1xufVxuZnVuY3Rpb24gc2VyaWFsaXplU3RydWN0KGJ1ZmZlciwgZGF0YSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucykge1xuICAgIHZhciBlXzIsIF9hO1xuICAgIGlmIChzdGF0ZSA9PT0gdm9pZCAwKSB7IHN0YXRlID0gbmV3IFNlcmlhbGl6ZXJTdGF0ZSgpOyB9XG4gICAgaWYgKGFsbG93RXh0ZW5zaW9ucyA9PT0gdm9pZCAwKSB7IGFsbG93RXh0ZW5zaW9ucyA9IHRydWU7IH1cbiAgICBpZiAodHlwZW9mIGRhdGEgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZXhwZWN0ZWQgb2JqZWN0IGNvbnRhaW5pbmcgZGF0YTogJyArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYmFzZSkge1xuICAgICAgICB0aGlzLmJhc2Uuc2VyaWFsaXplKGJ1ZmZlciwgZGF0YSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXModGhpcy5maWVsZHMpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgICAgICB2YXIgZmllbGQgPSBfYy52YWx1ZTtcbiAgICAgICAgICAgIGlmIChmaWVsZC5uYW1lIGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUuc2tpcHBlZEJpbmFyeUV4dGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuZXhwZWN0ZWQgJyArIHRoaXMubmFtZSArICcuJyArIGZpZWxkLm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlLnNlcmlhbGl6ZShidWZmZXIsIGRhdGFbZmllbGQubmFtZV0sIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMgJiYgZmllbGQgPT09IHRoaXMuZmllbGRzW3RoaXMuZmllbGRzLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChhbGxvd0V4dGVuc2lvbnMgJiYgZmllbGQudHlwZS5leHRlbnNpb25PZikge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5za2lwcGVkQmluYXJ5RXh0ZW5zaW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbWlzc2luZyAnICsgdGhpcy5uYW1lICsgJy4nICsgZmllbGQubmFtZSArICcgKHR5cGU9JyArIGZpZWxkLnR5cGUubmFtZSArICcpJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlXzJfMSkgeyBlXzIgPSB7IGVycm9yOiBlXzJfMSB9OyB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjsgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGRlc2VyaWFsaXplU3RydWN0KGJ1ZmZlciwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucykge1xuICAgIHZhciBlXzMsIF9hO1xuICAgIGlmIChzdGF0ZSA9PT0gdm9pZCAwKSB7IHN0YXRlID0gbmV3IFNlcmlhbGl6ZXJTdGF0ZSgpOyB9XG4gICAgaWYgKGFsbG93RXh0ZW5zaW9ucyA9PT0gdm9pZCAwKSB7IGFsbG93RXh0ZW5zaW9ucyA9IHRydWU7IH1cbiAgICB2YXIgcmVzdWx0O1xuICAgIGlmICh0aGlzLmJhc2UpIHtcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5iYXNlLmRlc2VyaWFsaXplKGJ1ZmZlciwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQgPSB7fTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyh0aGlzLmZpZWxkcyksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgICAgIHZhciBmaWVsZCA9IF9jLnZhbHVlO1xuICAgICAgICAgICAgaWYgKGFsbG93RXh0ZW5zaW9ucyAmJiBmaWVsZC50eXBlLmV4dGVuc2lvbk9mICYmICFidWZmZXIuaGF2ZVJlYWREYXRhKCkpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5za2lwcGVkQmluYXJ5RXh0ZW5zaW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtmaWVsZC5uYW1lXSA9IGZpZWxkLnR5cGUuZGVzZXJpYWxpemUoYnVmZmVyLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZV8zXzEpIHsgZV8zID0geyBlcnJvcjogZV8zXzEgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZV8zKSB0aHJvdyBlXzMuZXJyb3I7IH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIHNlcmlhbGl6ZVZhcmlhbnQoYnVmZmVyLCBkYXRhLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpIHx8IGRhdGEubGVuZ3RoICE9PSAyIHx8IHR5cGVvZiBkYXRhWzBdICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIHZhcmlhbnQ6IFtcInR5cGVcIiwgdmFsdWVdJyk7XG4gICAgfVxuICAgIHZhciBpID0gdGhpcy5maWVsZHMuZmluZEluZGV4KGZ1bmN0aW9uIChmaWVsZCkgeyByZXR1cm4gZmllbGQubmFtZSA9PT0gZGF0YVswXTsgfSk7XG4gICAgaWYgKGkgPCAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInR5cGUgXFxcIlwiICsgZGF0YVswXSArIFwiXFxcIiBpcyBub3QgdmFsaWQgZm9yIHZhcmlhbnRcIik7XG4gICAgfVxuICAgIGJ1ZmZlci5wdXNoVmFydWludDMyKGkpO1xuICAgIHRoaXMuZmllbGRzW2ldLnR5cGUuc2VyaWFsaXplKGJ1ZmZlciwgZGF0YVsxXSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG59XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVZhcmlhbnQoYnVmZmVyLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKSB7XG4gICAgdmFyIGkgPSBidWZmZXIuZ2V0VmFydWludDMyKCk7XG4gICAgaWYgKGkgPj0gdGhpcy5maWVsZHMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInR5cGUgaW5kZXggXCIgKyBpICsgXCIgaXMgbm90IHZhbGlkIGZvciB2YXJpYW50XCIpO1xuICAgIH1cbiAgICB2YXIgZmllbGQgPSB0aGlzLmZpZWxkc1tpXTtcbiAgICByZXR1cm4gW2ZpZWxkLm5hbWUsIGZpZWxkLnR5cGUuZGVzZXJpYWxpemUoYnVmZmVyLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKV07XG59XG5mdW5jdGlvbiBzZXJpYWxpemVBcnJheShidWZmZXIsIGRhdGEsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpIHtcbiAgICB2YXIgZV80LCBfYTtcbiAgICBidWZmZXIucHVzaFZhcnVpbnQzMihkYXRhLmxlbmd0aCk7XG4gICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgZGF0YV8yID0gX192YWx1ZXMoZGF0YSksIGRhdGFfMl8xID0gZGF0YV8yLm5leHQoKTsgIWRhdGFfMl8xLmRvbmU7IGRhdGFfMl8xID0gZGF0YV8yLm5leHQoKSkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBkYXRhXzJfMS52YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuYXJyYXlPZi5zZXJpYWxpemUoYnVmZmVyLCBpdGVtLCBzdGF0ZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlXzRfMSkgeyBlXzQgPSB7IGVycm9yOiBlXzRfMSB9OyB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoZGF0YV8yXzEgJiYgIWRhdGFfMl8xLmRvbmUgJiYgKF9hID0gZGF0YV8yLnJldHVybikpIF9hLmNhbGwoZGF0YV8yKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHsgaWYgKGVfNCkgdGhyb3cgZV80LmVycm9yOyB9XG4gICAgfVxufVxuZnVuY3Rpb24gZGVzZXJpYWxpemVBcnJheShidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpIHtcbiAgICB2YXIgbGVuID0gYnVmZmVyLmdldFZhcnVpbnQzMigpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuYXJyYXlPZi5kZXNlcmlhbGl6ZShidWZmZXIsIHN0YXRlLCBmYWxzZSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gc2VyaWFsaXplT3B0aW9uYWwoYnVmZmVyLCBkYXRhLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKSB7XG4gICAgaWYgKGRhdGEgPT09IG51bGwgfHwgZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoKDApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYnVmZmVyLnB1c2goMSk7XG4gICAgICAgIHRoaXMub3B0aW9uYWxPZi5zZXJpYWxpemUoYnVmZmVyLCBkYXRhLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZU9wdGlvbmFsKGJ1ZmZlciwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucykge1xuICAgIGlmIChidWZmZXIuZ2V0KCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWxPZi5kZXNlcmlhbGl6ZShidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuZnVuY3Rpb24gc2VyaWFsaXplRXh0ZW5zaW9uKGJ1ZmZlciwgZGF0YSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucykge1xuICAgIHRoaXMuZXh0ZW5zaW9uT2Yuc2VyaWFsaXplKGJ1ZmZlciwgZGF0YSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG59XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZUV4dGVuc2lvbihidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5leHRlbnNpb25PZi5kZXNlcmlhbGl6ZShidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpO1xufVxuZnVuY3Rpb24gc2VyaWFsaXplT2JqZWN0KGJ1ZmZlciwgZGF0YSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucykge1xuICAgIHZhciBlXzUsIF9hO1xuICAgIHZhciBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMoZGF0YSk7XG4gICAgYnVmZmVyLnB1c2hWYXJ1aW50MzIoZW50cmllcy5sZW5ndGgpO1xuICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGVudHJpZXNfMSA9IF9fdmFsdWVzKGVudHJpZXMpLCBlbnRyaWVzXzFfMSA9IGVudHJpZXNfMS5uZXh0KCk7ICFlbnRyaWVzXzFfMS5kb25lOyBlbnRyaWVzXzFfMSA9IGVudHJpZXNfMS5uZXh0KCkpIHtcbiAgICAgICAgICAgIHZhciBfYiA9IF9fcmVhZChlbnRyaWVzXzFfMS52YWx1ZSwgMiksIGtleSA9IF9iWzBdLCB2YWx1ZSA9IF9iWzFdO1xuICAgICAgICAgICAgdmFyIGtleVR5cGUgPSB0aGlzLmZpZWxkc1swXS50eXBlO1xuICAgICAgICAgICAgdmFyIGRhdGFUeXBlID0gdGhpcy5maWVsZHNbMV0udHlwZTtcbiAgICAgICAgICAgIGtleVR5cGUuc2VyaWFsaXplKGJ1ZmZlciwga2V5LCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKTtcbiAgICAgICAgICAgIGRhdGFUeXBlLnNlcmlhbGl6ZShidWZmZXIsIHZhbHVlLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZV81XzEpIHsgZV81ID0geyBlcnJvcjogZV81XzEgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGVudHJpZXNfMV8xICYmICFlbnRyaWVzXzFfMS5kb25lICYmIChfYSA9IGVudHJpZXNfMS5yZXR1cm4pKSBfYS5jYWxsKGVudHJpZXNfMSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlXzUpIHRocm93IGVfNS5lcnJvcjsgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGRlc2VyaWFsaXplT2JqZWN0KGJ1ZmZlciwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucykge1xuICAgIHZhciBsZW4gPSBidWZmZXIuZ2V0VmFydWludDMyKCk7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdmFyIGtleVR5cGUgPSB0aGlzLmZpZWxkc1swXS50eXBlO1xuICAgICAgICB2YXIgZGF0YVR5cGUgPSB0aGlzLmZpZWxkc1sxXS50eXBlO1xuICAgICAgICB2YXIga2V5ID0ga2V5VHlwZS5kZXNlcmlhbGl6ZShidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpO1xuICAgICAgICByZXN1bHRba2V5XSA9IGRhdGFUeXBlLmRlc2VyaWFsaXplKGJ1ZmZlciwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBzZXJpYWxpemVQYWlyKGJ1ZmZlciwgZGF0YSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgYnVmZmVyLnB1c2hWYXJ1aW50MzIoZGF0YS5sZW5ndGgpO1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBfdGhpcy5maWVsZHNbMF0udHlwZS5zZXJpYWxpemUoYnVmZmVyLCBpdGVtWzBdLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKTtcbiAgICAgICAgX3RoaXMuZmllbGRzWzFdLnR5cGUuc2VyaWFsaXplKGJ1ZmZlciwgaXRlbVsxXSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVBhaXIoYnVmZmVyLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBsZW4gPSBidWZmZXIuZ2V0VmFydWludDMyKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmZpZWxkc1swXS50eXBlLmRlc2VyaWFsaXplKGJ1ZmZlciwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucykpO1xuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmZpZWxkc1sxXS50eXBlLmRlc2VyaWFsaXplKGJ1ZmZlciwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucykpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxudmFyIGNyZWF0ZVR5cGUgPSBmdW5jdGlvbiAoYXR0cnMpIHtcbiAgICByZXR1cm4gX19hc3NpZ24oeyBuYW1lOiAnPG1pc3NpbmcgbmFtZT4nLCBhbGlhc09mTmFtZTogJycsIGFycmF5T2Y6IG51bGwsIG9wdGlvbmFsT2Y6IG51bGwsIGV4dGVuc2lvbk9mOiBudWxsLCBiYXNlTmFtZTogJycsIGJhc2U6IG51bGwsIGZpZWxkczogW10sIHNlcmlhbGl6ZTogc2VyaWFsaXplVW5rbm93biwgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplVW5rbm93biB9LCBhdHRycyk7XG59O1xudmFyIGNoZWNrUmFuZ2UgPSBmdW5jdGlvbiAob3JpZywgY29udmVydGVkKSB7XG4gICAgaWYgKE51bWJlci5pc05hTigrb3JpZykgfHwgTnVtYmVyLmlzTmFOKCtjb252ZXJ0ZWQpIHx8ICh0eXBlb2Ygb3JpZyAhPT0gJ251bWJlcicgJiYgdHlwZW9mIG9yaWcgIT09ICdzdHJpbmcnKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIG51bWJlcicpO1xuICAgIH1cbiAgICBpZiAoK29yaWcgIT09ICtjb252ZXJ0ZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOdW1iZXIgaXMgb3V0IG9mIHJhbmdlJyk7XG4gICAgfVxuICAgIHJldHVybiArb3JpZztcbn07XG4vKiogQ3JlYXRlIHRoZSBzZXQgb2YgdHlwZXMgYnVpbHQtaW4gdG8gdGhlIGFiaSBmb3JtYXQgKi9cbnZhciBjcmVhdGVJbml0aWFsVHlwZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoe1xuICAgICAgICBib29sOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdib29sJyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmICghKHR5cGVvZiBkYXRhID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIGRhdGEgPT09ICdudW1iZXInICYmIChkYXRhID09PSAxIHx8IGRhdGEgPT09IDApKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGJvb2xlYW4gb3IgbnVtYmVyIGVxdWFsIHRvIDEgb3IgMCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBidWZmZXIucHVzaChkYXRhID8gMSA6IDApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiAhIWJ1ZmZlci5nZXQoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHVpbnQ4OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICd1aW50OCcsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2goY2hlY2tSYW5nZShkYXRhLCBkYXRhICYgMHhmZikpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXQoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGludDg6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ2ludDgnLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7IGJ1ZmZlci5wdXNoKGNoZWNrUmFuZ2UoZGF0YSwgZGF0YSA8PCAyNCA+PiAyNCkpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXQoKSA8PCAyNCA+PiAyNDsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHVpbnQxNjogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAndWludDE2JyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFVpbnQxNihjaGVja1JhbmdlKGRhdGEsIGRhdGEgJiAweGZmZmYpKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0VWludDE2KCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBpbnQxNjogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAnaW50MTYnLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7IGJ1ZmZlci5wdXNoVWludDE2KGNoZWNrUmFuZ2UoZGF0YSwgZGF0YSA8PCAxNiA+PiAxNikpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRVaW50MTYoKSA8PCAxNiA+PiAxNjsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHVpbnQzMjogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAndWludDMyJyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFVpbnQzMihjaGVja1JhbmdlKGRhdGEsIGRhdGEgPj4+IDApKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0VWludDMyKCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICB1aW50NjQ6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ3VpbnQ2NCcsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBidWZmZXIucHVzaEFycmF5KG51bWVyaWMuZGVjaW1hbFRvQmluYXJ5KDgsICcnICsgZGF0YSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBudW1lcmljLmJpbmFyeVRvRGVjaW1hbChidWZmZXIuZ2V0VWludDhBcnJheSg4KSk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBpbnQ2NDogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAnaW50NjQnLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2hBcnJheShudW1lcmljLnNpZ25lZERlY2ltYWxUb0JpbmFyeSg4LCAnJyArIGRhdGEpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gbnVtZXJpYy5zaWduZWRCaW5hcnlUb0RlY2ltYWwoYnVmZmVyLmdldFVpbnQ4QXJyYXkoOCkpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgaW50MzI6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ2ludDMyJyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFVpbnQzMihjaGVja1JhbmdlKGRhdGEsIGRhdGEgfCAwKSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldFVpbnQzMigpIHwgMDsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHZhcnVpbnQzMjogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAndmFydWludDMyJyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFZhcnVpbnQzMihjaGVja1JhbmdlKGRhdGEsIGRhdGEgPj4+IDApKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0VmFydWludDMyKCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICB2YXJpbnQzMjogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAndmFyaW50MzInLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7IGJ1ZmZlci5wdXNoVmFyaW50MzIoY2hlY2tSYW5nZShkYXRhLCBkYXRhIHwgMCkpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRWYXJpbnQzMigpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgdWludDEyODogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAndWludDEyOCcsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hBcnJheShudW1lcmljLmRlY2ltYWxUb0JpbmFyeSgxNiwgJycgKyBkYXRhKSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gbnVtZXJpYy5iaW5hcnlUb0RlY2ltYWwoYnVmZmVyLmdldFVpbnQ4QXJyYXkoMTYpKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGludDEyODogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAnaW50MTI4JyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkge1xuICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoQXJyYXkobnVtZXJpYy5zaWduZWREZWNpbWFsVG9CaW5hcnkoMTYsICcnICsgZGF0YSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBudW1lcmljLnNpZ25lZEJpbmFyeVRvRGVjaW1hbChidWZmZXIuZ2V0VWludDhBcnJheSgxNikpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgZmxvYXQzMjogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAnZmxvYXQzMicsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hGbG9hdDMyKGRhdGEpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRGbG9hdDMyKCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBmbG9hdDY0OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdmbG9hdDY0JyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaEZsb2F0NjQoZGF0YSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldEZsb2F0NjQoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGZsb2F0MTI4OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdmbG9hdDEyOCcsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hVaW50OEFycmF5Q2hlY2tlZCgoMCwgZXhwb3J0cy5oZXhUb1VpbnQ4QXJyYXkpKGRhdGEpLCAxNik7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gKDAsIGV4cG9ydHMuYXJyYXlUb0hleCkoYnVmZmVyLmdldFVpbnQ4QXJyYXkoMTYpKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGJ5dGVzOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdieXRlcycsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkgfHwgQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBidWZmZXIucHVzaEJ5dGVzKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLnB1c2hCeXRlcygoMCwgZXhwb3J0cy5oZXhUb1VpbnQ4QXJyYXkpKGRhdGEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlICYmIHN0YXRlLm9wdGlvbnMuYnl0ZXNBc1VpbnQ4QXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlci5nZXRCeXRlcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBleHBvcnRzLmFycmF5VG9IZXgpKGJ1ZmZlci5nZXRCeXRlcygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgICAgc3RyaW5nOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7IGJ1ZmZlci5wdXNoU3RyaW5nKGRhdGEpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRTdHJpbmcoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIG5hbWU6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7IGJ1ZmZlci5wdXNoTmFtZShkYXRhKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0TmFtZSgpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgdGltZV9wb2ludDogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAndGltZV9wb2ludCcsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hOdW1iZXJBc1VpbnQ2NCgoMCwgZXhwb3J0cy5kYXRlVG9UaW1lUG9pbnQpKGRhdGEpKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiAoMCwgZXhwb3J0cy50aW1lUG9pbnRUb0RhdGUpKGJ1ZmZlci5nZXRVaW50NjRBc051bWJlcigpKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHRpbWVfcG9pbnRfc2VjOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICd0aW1lX3BvaW50X3NlYycsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hVaW50MzIoKDAsIGV4cG9ydHMuZGF0ZVRvVGltZVBvaW50U2VjKShkYXRhKSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gKDAsIGV4cG9ydHMudGltZVBvaW50U2VjVG9EYXRlKShidWZmZXIuZ2V0VWludDMyKCkpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgYmxvY2tfdGltZXN0YW1wX3R5cGU6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ2Jsb2NrX3RpbWVzdGFtcF90eXBlJyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFVpbnQzMigoMCwgZXhwb3J0cy5kYXRlVG9CbG9ja1RpbWVzdGFtcCkoZGF0YSkpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuICgwLCBleHBvcnRzLmJsb2NrVGltZXN0YW1wVG9EYXRlKShidWZmZXIuZ2V0VWludDMyKCkpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgc3ltYm9sX2NvZGU6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ3N5bWJvbF9jb2RlJyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFN5bWJvbENvZGUoZGF0YSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldFN5bWJvbENvZGUoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHN5bWJvbDogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAnc3ltYm9sJyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFN5bWJvbCgoMCwgZXhwb3J0cy5zdHJpbmdUb1N5bWJvbCkoZGF0YSkpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuICgwLCBleHBvcnRzLnN5bWJvbFRvU3RyaW5nKShidWZmZXIuZ2V0U3ltYm9sKCkpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgYXNzZXQ6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ2Fzc2V0JyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaEFzc2V0KGRhdGEpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRBc3NldCgpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgY2hlY2tzdW0xNjA6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ2NoZWNrc3VtMTYwJyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFVpbnQ4QXJyYXlDaGVja2VkKCgwLCBleHBvcnRzLmhleFRvVWludDhBcnJheSkoZGF0YSksIDIwKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiAoMCwgZXhwb3J0cy5hcnJheVRvSGV4KShidWZmZXIuZ2V0VWludDhBcnJheSgyMCkpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgY2hlY2tzdW0yNTY6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ2NoZWNrc3VtMjU2JyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFVpbnQ4QXJyYXlDaGVja2VkKCgwLCBleHBvcnRzLmhleFRvVWludDhBcnJheSkoZGF0YSksIDMyKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiAoMCwgZXhwb3J0cy5hcnJheVRvSGV4KShidWZmZXIuZ2V0VWludDhBcnJheSgzMikpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgY2hlY2tzdW01MTI6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ2NoZWNrc3VtNTEyJyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFVpbnQ4QXJyYXlDaGVja2VkKCgwLCBleHBvcnRzLmhleFRvVWludDhBcnJheSkoZGF0YSksIDY0KTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiAoMCwgZXhwb3J0cy5hcnJheVRvSGV4KShidWZmZXIuZ2V0VWludDhBcnJheSg2NCkpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgcHVibGljX2tleTogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAncHVibGljX2tleScsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hQdWJsaWNLZXkoZGF0YSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldFB1YmxpY0tleSgpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgcHJpdmF0ZV9rZXk6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ3ByaXZhdGVfa2V5JyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFByaXZhdGVLZXkoZGF0YSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldFByaXZhdGVLZXkoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHNpZ25hdHVyZTogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAnc2lnbmF0dXJlJyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFNpZ25hdHVyZShkYXRhKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0U2lnbmF0dXJlKCk7IH0sXG4gICAgICAgIH0pLFxuICAgIH0pKTtcbiAgICByZXN1bHQuc2V0KCdleHRlbmRlZF9hc3NldCcsIGNyZWF0ZVR5cGUoe1xuICAgICAgICBuYW1lOiAnZXh0ZW5kZWRfYXNzZXQnLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAncXVhbnRpdHknLCB0eXBlTmFtZTogJ2Fzc2V0JywgdHlwZTogcmVzdWx0LmdldCgnYXNzZXQnKSB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnY29udHJhY3QnLCB0eXBlTmFtZTogJ25hbWUnLCB0eXBlOiByZXN1bHQuZ2V0KCduYW1lJykgfSxcbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07IC8vIGNyZWF0ZUluaXRpYWxUeXBlcygpXG5leHBvcnRzLmNyZWF0ZUluaXRpYWxUeXBlcyA9IGNyZWF0ZUluaXRpYWxUeXBlcztcbnZhciBjcmVhdGVBYmlUeXBlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5pdGlhbFR5cGVzID0gKDAsIGV4cG9ydHMuY3JlYXRlSW5pdGlhbFR5cGVzKSgpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ2V4dGVuc2lvbnNfZW50cnknLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ2V4dGVuc2lvbnNfZW50cnknLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAndGFnJywgdHlwZU5hbWU6ICd1aW50MTYnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICd2YWx1ZScsIHR5cGVOYW1lOiAnYnl0ZXMnLCB0eXBlOiBudWxsIH1cbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgndHlwZV9kZWYnLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ3R5cGVfZGVmJyxcbiAgICAgICAgYmFzZU5hbWU6ICcnLFxuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ25ld190eXBlX25hbWUnLCB0eXBlTmFtZTogJ3N0cmluZycsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3R5cGUnLCB0eXBlTmFtZTogJ3N0cmluZycsIHR5cGU6IG51bGwgfVxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdmaWVsZF9kZWYnLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ2ZpZWxkX2RlZicsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICduYW1lJywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICd0eXBlJywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH1cbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgnc3RydWN0X2RlZicsIGNyZWF0ZVR5cGUoe1xuICAgICAgICBuYW1lOiAnc3RydWN0X2RlZicsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICduYW1lJywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdiYXNlJywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdmaWVsZHMnLCB0eXBlTmFtZTogJ2ZpZWxkX2RlZltdJywgdHlwZTogbnVsbCB9XG4gICAgICAgIF0sXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplU3RydWN0LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVTdHJ1Y3QsXG4gICAgfSkpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ2FjdGlvbl9kZWYnLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ2FjdGlvbl9kZWYnLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAnbmFtZScsIHR5cGVOYW1lOiAnbmFtZScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3R5cGUnLCB0eXBlTmFtZTogJ3N0cmluZycsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3JpY2FyZGlhbl9jb250cmFjdCcsIHR5cGVOYW1lOiAnc3RyaW5nJywgdHlwZTogbnVsbCB9XG4gICAgICAgIF0sXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplU3RydWN0LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVTdHJ1Y3QsXG4gICAgfSkpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ3RhYmxlX2RlZicsIGNyZWF0ZVR5cGUoe1xuICAgICAgICBuYW1lOiAndGFibGVfZGVmJyxcbiAgICAgICAgYmFzZU5hbWU6ICcnLFxuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ25hbWUnLCB0eXBlTmFtZTogJ25hbWUnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdpbmRleF90eXBlJywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdrZXlfbmFtZXMnLCB0eXBlTmFtZTogJ3N0cmluZ1tdJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAna2V5X3R5cGVzJywgdHlwZU5hbWU6ICdzdHJpbmdbXScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3R5cGUnLCB0eXBlTmFtZTogJ3N0cmluZycsIHR5cGU6IG51bGwgfVxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdjbGF1c2VfcGFpcicsIGNyZWF0ZVR5cGUoe1xuICAgICAgICBuYW1lOiAnY2xhdXNlX3BhaXInLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAnaWQnLCB0eXBlTmFtZTogJ3N0cmluZycsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2JvZHknLCB0eXBlTmFtZTogJ3N0cmluZycsIHR5cGU6IG51bGwgfVxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdlcnJvcl9tZXNzYWdlJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdlcnJvcl9tZXNzYWdlJyxcbiAgICAgICAgYmFzZU5hbWU6ICcnLFxuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ2Vycm9yX2NvZGUnLCB0eXBlTmFtZTogJ3VpbnQ2NCcsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2Vycm9yX21zZycsIHR5cGVOYW1lOiAnc3RyaW5nJywgdHlwZTogbnVsbCB9XG4gICAgICAgIF0sXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplU3RydWN0LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVTdHJ1Y3QsXG4gICAgfSkpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ3ZhcmlhbnRfZGVmJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICd2YXJpYW50X2RlZicsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICduYW1lJywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICd0eXBlcycsIHR5cGVOYW1lOiAnc3RyaW5nW10nLCB0eXBlOiBudWxsIH1cbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgnYWN0aW9uX3Jlc3VsdCcsIGNyZWF0ZVR5cGUoe1xuICAgICAgICBuYW1lOiAnYWN0aW9uX3Jlc3VsdCcsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICduYW1lJywgdHlwZU5hbWU6ICduYW1lJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAncmVzdWx0X3R5cGUnLCB0eXBlTmFtZTogJ3N0cmluZycsIHR5cGU6IG51bGwgfVxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdwcmltYXJ5X2tleV9pbmRleF9kZWYnLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ3ByaW1hcnlfa2V5X2luZGV4X2RlZicsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICduYW1lJywgdHlwZU5hbWU6ICduYW1lJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAndHlwZScsIHR5cGVOYW1lOiAnc3RyaW5nJywgdHlwZTogbnVsbCB9XG4gICAgICAgIF0sXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplU3RydWN0LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVTdHJ1Y3QsXG4gICAgfSkpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ3NlY29uZGFyeV9pbmRleF9kZWYnLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ3NlY29uZGFyeV9pbmRleF9kZWYnLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAndHlwZScsIHR5cGVOYW1lOiAnc3RyaW5nJywgdHlwZTogbnVsbCB9LFxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdzZWNvbmRhcnlfaW5kaWNlcycsIGNyZWF0ZVR5cGUoe1xuICAgICAgICBuYW1lOiAnc2Vjb25kYXJ5X2luZGljZXMnLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAnbmFtZScsIHR5cGVOYW1lOiAnbmFtZScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3NlY29uZGFyeV9pbmRleF9kZWYnLCB0eXBlTmFtZTogJ3NlY29uZGFyeV9pbmRleF9kZWYnLCB0eXBlOiBudWxsIH1cbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVPYmplY3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZU9iamVjdCxcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgna3ZfdGFibGVfZW50cnlfZGVmJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdrdl90YWJsZV9lbnRyeV9kZWYnLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAndHlwZScsIHR5cGVOYW1lOiAnc3RyaW5nJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAncHJpbWFyeV9pbmRleCcsIHR5cGVOYW1lOiAncHJpbWFyeV9rZXlfaW5kZXhfZGVmJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnc2Vjb25kYXJ5X2luZGljZXMnLCB0eXBlTmFtZTogJ3NlY29uZGFyeV9pbmRpY2VzJywgdHlwZTogbnVsbCB9XG4gICAgICAgIF0sXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplU3RydWN0LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVTdHJ1Y3QsXG4gICAgfSkpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ2t2X3RhYmxlJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdrdl90YWJsZScsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICduYW1lJywgdHlwZU5hbWU6ICduYW1lJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAna3ZfdGFibGVfZW50cnlfZGVmJywgdHlwZU5hbWU6ICdrdl90YWJsZV9lbnRyeV9kZWYnLCB0eXBlOiBudWxsIH1cbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVPYmplY3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZU9iamVjdFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdhYmlfZGVmJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdhYmlfZGVmJyxcbiAgICAgICAgYmFzZU5hbWU6ICcnLFxuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ3ZlcnNpb24nLCB0eXBlTmFtZTogJ3N0cmluZycsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3R5cGVzJywgdHlwZU5hbWU6ICd0eXBlX2RlZltdJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnc3RydWN0cycsIHR5cGVOYW1lOiAnc3RydWN0X2RlZltdJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnYWN0aW9ucycsIHR5cGVOYW1lOiAnYWN0aW9uX2RlZltdJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAndGFibGVzJywgdHlwZU5hbWU6ICd0YWJsZV9kZWZbXScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3JpY2FyZGlhbl9jbGF1c2VzJywgdHlwZU5hbWU6ICdjbGF1c2VfcGFpcltdJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnZXJyb3JfbWVzc2FnZXMnLCB0eXBlTmFtZTogJ2Vycm9yX21lc3NhZ2VbXScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2FiaV9leHRlbnNpb25zJywgdHlwZU5hbWU6ICdleHRlbnNpb25zX2VudHJ5W10nLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICd2YXJpYW50cycsIHR5cGVOYW1lOiAndmFyaWFudF9kZWZbXSQnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdhY3Rpb25fcmVzdWx0cycsIHR5cGVOYW1lOiAnYWN0aW9uX3Jlc3VsdFtdJCcsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2t2X3RhYmxlcycsIHR5cGVOYW1lOiAna3ZfdGFibGUkJywgdHlwZTogbnVsbCB9LFxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICByZXR1cm4gaW5pdGlhbFR5cGVzO1xufTtcbmV4cG9ydHMuY3JlYXRlQWJpVHlwZXMgPSBjcmVhdGVBYmlUeXBlcztcbnZhciBjcmVhdGVUcmFuc2FjdGlvbkV4dGVuc2lvblR5cGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbml0aWFsVHlwZXMgPSAoMCwgZXhwb3J0cy5jcmVhdGVJbml0aWFsVHlwZXMpKCk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgncmVzb3VyY2VfcGF5ZXInLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ3Jlc291cmNlX3BheWVyJyxcbiAgICAgICAgYmFzZU5hbWU6ICcnLFxuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ3BheWVyJywgdHlwZU5hbWU6ICduYW1lJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnbWF4X25ldF9ieXRlcycsIHR5cGVOYW1lOiAndWludDY0JywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnbWF4X2NwdV91cycsIHR5cGVOYW1lOiAndWludDY0JywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnbWF4X21lbW9yeV9ieXRlcycsIHR5cGVOYW1lOiAndWludDY0JywgdHlwZTogbnVsbCB9LFxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICByZXR1cm4gaW5pdGlhbFR5cGVzO1xufTtcbmV4cG9ydHMuY3JlYXRlVHJhbnNhY3Rpb25FeHRlbnNpb25UeXBlcyA9IGNyZWF0ZVRyYW5zYWN0aW9uRXh0ZW5zaW9uVHlwZXM7XG52YXIgY3JlYXRlVHJhbnNhY3Rpb25UeXBlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5pdGlhbFR5cGVzID0gKDAsIGV4cG9ydHMuY3JlYXRlSW5pdGlhbFR5cGVzKSgpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ3Blcm1pc3Npb25fbGV2ZWwnLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ3Blcm1pc3Npb25fbGV2ZWwnLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAnYWN0b3InLCB0eXBlTmFtZTogJ25hbWUnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdwZXJtaXNzaW9uJywgdHlwZU5hbWU6ICduYW1lJywgdHlwZTogbnVsbCB9LFxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdhY3Rpb24nLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ2FjdGlvbicsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICdhY2NvdW50JywgdHlwZU5hbWU6ICduYW1lJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnbmFtZScsIHR5cGVOYW1lOiAnbmFtZScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2F1dGhvcml6YXRpb24nLCB0eXBlTmFtZTogJ3Blcm1pc3Npb25fbGV2ZWxbXScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2RhdGEnLCB0eXBlTmFtZTogJ2J5dGVzJywgdHlwZTogbnVsbCB9LFxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdleHRlbnNpb24nLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ2V4dGVuc2lvbicsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICd0eXBlJywgdHlwZU5hbWU6ICd1aW50MTYnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdkYXRhJywgdHlwZU5hbWU6ICdieXRlcycsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVQYWlyLFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVQYWlyLFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCd0cmFuc2FjdGlvbl9oZWFkZXInLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ3RyYW5zYWN0aW9uX2hlYWRlcicsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICdleHBpcmF0aW9uJywgdHlwZU5hbWU6ICd0aW1lX3BvaW50X3NlYycsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3JlZl9ibG9ja19udW0nLCB0eXBlTmFtZTogJ3VpbnQxNicsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3JlZl9ibG9ja19wcmVmaXgnLCB0eXBlTmFtZTogJ3VpbnQzMicsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ21heF9uZXRfdXNhZ2Vfd29yZHMnLCB0eXBlTmFtZTogJ3ZhcnVpbnQzMicsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ21heF9jcHVfdXNhZ2VfbXMnLCB0eXBlTmFtZTogJ3VpbnQ4JywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnZGVsYXlfc2VjJywgdHlwZU5hbWU6ICd2YXJ1aW50MzInLCB0eXBlOiBudWxsIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplU3RydWN0LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVTdHJ1Y3QsXG4gICAgfSkpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ3RyYW5zYWN0aW9uJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICd0cmFuc2FjdGlvbicsXG4gICAgICAgIGJhc2VOYW1lOiAndHJhbnNhY3Rpb25faGVhZGVyJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICdjb250ZXh0X2ZyZWVfYWN0aW9ucycsIHR5cGVOYW1lOiAnYWN0aW9uW10nLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdhY3Rpb25zJywgdHlwZU5hbWU6ICdhY3Rpb25bXScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3RyYW5zYWN0aW9uX2V4dGVuc2lvbnMnLCB0eXBlTmFtZTogJ2V4dGVuc2lvbicsIHR5cGU6IG51bGwgfVxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICByZXR1cm4gaW5pdGlhbFR5cGVzO1xufTtcbmV4cG9ydHMuY3JlYXRlVHJhbnNhY3Rpb25UeXBlcyA9IGNyZWF0ZVRyYW5zYWN0aW9uVHlwZXM7XG4vKiogR2V0IHR5cGUgZnJvbSBgdHlwZXNgICovXG52YXIgZ2V0VHlwZSA9IGZ1bmN0aW9uICh0eXBlcywgbmFtZSkge1xuICAgIHZhciB0eXBlID0gdHlwZXMuZ2V0KG5hbWUpO1xuICAgIGlmICh0eXBlICYmIHR5cGUuYWxpYXNPZk5hbWUpIHtcbiAgICAgICAgcmV0dXJuICgwLCBleHBvcnRzLmdldFR5cGUpKHR5cGVzLCB0eXBlLmFsaWFzT2ZOYW1lKTtcbiAgICB9XG4gICAgaWYgKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICAgIGlmIChuYW1lLmVuZHNXaXRoKCdbXScpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICBhcnJheU9mOiAoMCwgZXhwb3J0cy5nZXRUeXBlKSh0eXBlcywgbmFtZS5zdWJzdHIoMCwgbmFtZS5sZW5ndGggLSAyKSksXG4gICAgICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZUFycmF5LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplQXJyYXksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAobmFtZS5lbmRzV2l0aCgnPycpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICBvcHRpb25hbE9mOiAoMCwgZXhwb3J0cy5nZXRUeXBlKSh0eXBlcywgbmFtZS5zdWJzdHIoMCwgbmFtZS5sZW5ndGggLSAxKSksXG4gICAgICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZU9wdGlvbmFsLFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplT3B0aW9uYWwsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAobmFtZS5lbmRzV2l0aCgnJCcpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICBleHRlbnNpb25PZjogKDAsIGV4cG9ydHMuZ2V0VHlwZSkodHlwZXMsIG5hbWUuc3Vic3RyKDAsIG5hbWUubGVuZ3RoIC0gMSkpLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVFeHRlbnNpb24sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVFeHRlbnNpb24sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gdHlwZTogJyArIG5hbWUpO1xufTtcbmV4cG9ydHMuZ2V0VHlwZSA9IGdldFR5cGU7XG4vKipcbiAqIEdldCB0eXBlcyBmcm9tIGFiaVxuICpcbiAqIEBwYXJhbSBpbml0aWFsVHlwZXMgU2V0IG9mIHR5cGVzIHRvIGJ1aWxkIG9uLlxuICogSW4gbW9zdCBjYXNlcywgaXQncyBiZXN0IHRvIGZpbGwgdGhpcyBmcm9tIGEgZnJlc2ggY2FsbCB0byBgZ2V0VHlwZXNGcm9tQWJpKClgLlxuICovXG52YXIgZ2V0VHlwZXNGcm9tQWJpID0gZnVuY3Rpb24gKGluaXRpYWxUeXBlcywgYWJpKSB7XG4gICAgdmFyIGVfNiwgX2EsIGVfNywgX2IsIGVfOCwgX2MsIGVfOSwgX2QsIGVfMTAsIF9lO1xuICAgIHZhciB0eXBlcyA9IG5ldyBNYXAoaW5pdGlhbFR5cGVzKTtcbiAgICBpZiAoYWJpICYmIGFiaS50eXBlcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2YgPSBfX3ZhbHVlcyhhYmkudHlwZXMpLCBfZyA9IF9mLm5leHQoKTsgIV9nLmRvbmU7IF9nID0gX2YubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9oID0gX2cudmFsdWUsIG5ld190eXBlX25hbWUgPSBfaC5uZXdfdHlwZV9uYW1lLCB0eXBlID0gX2gudHlwZTtcbiAgICAgICAgICAgICAgICB0eXBlcy5zZXQobmV3X3R5cGVfbmFtZSwgY3JlYXRlVHlwZSh7IG5hbWU6IG5ld190eXBlX25hbWUsIGFsaWFzT2ZOYW1lOiB0eXBlIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV82XzEpIHsgZV82ID0geyBlcnJvcjogZV82XzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKF9nICYmICFfZy5kb25lICYmIChfYSA9IF9mLnJldHVybikpIF9hLmNhbGwoX2YpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzYpIHRocm93IGVfNi5lcnJvcjsgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChhYmkgJiYgYWJpLnN0cnVjdHMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIF9qID0gX192YWx1ZXMoYWJpLnN0cnVjdHMpLCBfayA9IF9qLm5leHQoKTsgIV9rLmRvbmU7IF9rID0gX2oubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9sID0gX2sudmFsdWUsIG5hbWVfMSA9IF9sLm5hbWUsIGJhc2UgPSBfbC5iYXNlLCBmaWVsZHMgPSBfbC5maWVsZHM7XG4gICAgICAgICAgICAgICAgdHlwZXMuc2V0KG5hbWVfMSwgY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVfMSxcbiAgICAgICAgICAgICAgICAgICAgYmFzZU5hbWU6IGJhc2UsXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkczogZmllbGRzLm1hcChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gX2EubmFtZSwgdHlwZSA9IF9hLnR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHsgbmFtZTogbiwgdHlwZU5hbWU6IHR5cGUsIHR5cGU6IG51bGwgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgICAgICAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV83XzEpIHsgZV83ID0geyBlcnJvcjogZV83XzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKF9rICYmICFfay5kb25lICYmIChfYiA9IF9qLnJldHVybikpIF9iLmNhbGwoX2opO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzcpIHRocm93IGVfNy5lcnJvcjsgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChhYmkgJiYgYWJpLnZhcmlhbnRzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfbSA9IF9fdmFsdWVzKGFiaS52YXJpYW50cyksIF9vID0gX20ubmV4dCgpOyAhX28uZG9uZTsgX28gPSBfbS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3AgPSBfby52YWx1ZSwgbmFtZV8yID0gX3AubmFtZSwgdCA9IF9wLnR5cGVzO1xuICAgICAgICAgICAgICAgIHR5cGVzLnNldChuYW1lXzIsIGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lXzIsXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkczogdC5tYXAoZnVuY3Rpb24gKHMpIHsgcmV0dXJuICh7IG5hbWU6IHMsIHR5cGVOYW1lOiBzLCB0eXBlOiBudWxsIH0pOyB9KSxcbiAgICAgICAgICAgICAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVWYXJpYW50LFxuICAgICAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVWYXJpYW50LFxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV84XzEpIHsgZV84ID0geyBlcnJvcjogZV84XzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKF9vICYmICFfby5kb25lICYmIChfYyA9IF9tLnJldHVybikpIF9jLmNhbGwoX20pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzgpIHRocm93IGVfOC5lcnJvcjsgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIHR5cGVzXzEgPSBfX3ZhbHVlcyh0eXBlcyksIHR5cGVzXzFfMSA9IHR5cGVzXzEubmV4dCgpOyAhdHlwZXNfMV8xLmRvbmU7IHR5cGVzXzFfMSA9IHR5cGVzXzEubmV4dCgpKSB7XG4gICAgICAgICAgICB2YXIgX3EgPSBfX3JlYWQodHlwZXNfMV8xLnZhbHVlLCAyKSwgbmFtZV8zID0gX3FbMF0sIHR5cGUgPSBfcVsxXTtcbiAgICAgICAgICAgIGlmICh0eXBlLmJhc2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgdHlwZS5iYXNlID0gKDAsIGV4cG9ydHMuZ2V0VHlwZSkodHlwZXMsIHR5cGUuYmFzZU5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfciA9IChlXzEwID0gdm9pZCAwLCBfX3ZhbHVlcyh0eXBlLmZpZWxkcykpLCBfcyA9IF9yLm5leHQoKTsgIV9zLmRvbmU7IF9zID0gX3IubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IF9zLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBmaWVsZC50eXBlID0gKDAsIGV4cG9ydHMuZ2V0VHlwZSkodHlwZXMsIGZpZWxkLnR5cGVOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZV8xMF8xKSB7IGVfMTAgPSB7IGVycm9yOiBlXzEwXzEgfTsgfVxuICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9zICYmICFfcy5kb25lICYmIChfZSA9IF9yLnJldHVybikpIF9lLmNhbGwoX3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMTApIHRocm93IGVfMTAuZXJyb3I7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZV85XzEpIHsgZV85ID0geyBlcnJvcjogZV85XzEgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHR5cGVzXzFfMSAmJiAhdHlwZXNfMV8xLmRvbmUgJiYgKF9kID0gdHlwZXNfMS5yZXR1cm4pKSBfZC5jYWxsKHR5cGVzXzEpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZV85KSB0aHJvdyBlXzkuZXJyb3I7IH1cbiAgICB9XG4gICAgcmV0dXJuIHR5cGVzO1xufTsgLy8gZ2V0VHlwZXNGcm9tQWJpXG5leHBvcnRzLmdldFR5cGVzRnJvbUFiaSA9IGdldFR5cGVzRnJvbUFiaTtcbnZhciByZXZlcnNlSGV4ID0gZnVuY3Rpb24gKGgpIHtcbiAgICByZXR1cm4gaC5zdWJzdHIoNiwgMikgKyBoLnN1YnN0cig0LCAyKSArIGguc3Vic3RyKDIsIDIpICsgaC5zdWJzdHIoMCwgMik7XG59O1xuLyoqIFRBUG9TOiBSZXR1cm4gdHJhbnNhY3Rpb24gZmllbGRzIHdoaWNoIHJlZmVyZW5jZSBgcmVmQmxvY2tgIGFuZCBleHBpcmUgYGV4cGlyZVNlY29uZHNgIGFmdGVyIGB0aW1lc3RhbXBgICovXG52YXIgdHJhbnNhY3Rpb25IZWFkZXIgPSBmdW5jdGlvbiAocmVmQmxvY2ssIGV4cGlyZVNlY29uZHMpIHtcbiAgICB2YXIgdGltZXN0YW1wID0gcmVmQmxvY2suaGVhZGVyID8gcmVmQmxvY2suaGVhZGVyLnRpbWVzdGFtcCA6IHJlZkJsb2NrLnRpbWVzdGFtcDtcbiAgICB2YXIgcHJlZml4ID0gcGFyc2VJbnQocmV2ZXJzZUhleChyZWZCbG9jay5pZC5zdWJzdHIoMTYsIDgpKSwgMTYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGV4cGlyYXRpb246ICgwLCBleHBvcnRzLnRpbWVQb2ludFNlY1RvRGF0ZSkoKDAsIGV4cG9ydHMuZGF0ZVRvVGltZVBvaW50U2VjKSh0aW1lc3RhbXApICsgZXhwaXJlU2Vjb25kcyksXG4gICAgICAgIHJlZl9ibG9ja19udW06IHJlZkJsb2NrLmJsb2NrX251bSAmIDB4ZmZmZixcbiAgICAgICAgcmVmX2Jsb2NrX3ByZWZpeDogcHJlZml4LFxuICAgIH07XG59O1xuZXhwb3J0cy50cmFuc2FjdGlvbkhlYWRlciA9IHRyYW5zYWN0aW9uSGVhZGVyO1xuLyoqIENvbnZlcnQgYWN0aW9uIGRhdGEgdG8gc2VyaWFsaXplZCBmb3JtIChoZXgpICovXG52YXIgc2VyaWFsaXplQWN0aW9uRGF0YSA9IGZ1bmN0aW9uIChjb250cmFjdCwgYWNjb3VudCwgbmFtZSwgZGF0YSwgdGV4dEVuY29kZXIsIHRleHREZWNvZGVyKSB7XG4gICAgdmFyIGFjdGlvbiA9IGNvbnRyYWN0LmFjdGlvbnMuZ2V0KG5hbWUpO1xuICAgIGlmICghYWN0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gYWN0aW9uIFwiICsgbmFtZSArIFwiIGluIGNvbnRyYWN0IFwiICsgYWNjb3VudCk7XG4gICAgfVxuICAgIHZhciBidWZmZXIgPSBuZXcgU2VyaWFsQnVmZmVyKHsgdGV4dEVuY29kZXI6IHRleHRFbmNvZGVyLCB0ZXh0RGVjb2RlcjogdGV4dERlY29kZXIgfSk7XG4gICAgYWN0aW9uLnNlcmlhbGl6ZShidWZmZXIsIGRhdGEpO1xuICAgIHJldHVybiAoMCwgZXhwb3J0cy5hcnJheVRvSGV4KShidWZmZXIuYXNVaW50OEFycmF5KCkpO1xufTtcbmV4cG9ydHMuc2VyaWFsaXplQWN0aW9uRGF0YSA9IHNlcmlhbGl6ZUFjdGlvbkRhdGE7XG4vKiogUmV0dXJuIGFjdGlvbiBpbiBzZXJpYWxpemVkIGZvcm0gKi9cbnZhciBzZXJpYWxpemVBY3Rpb24gPSBmdW5jdGlvbiAoY29udHJhY3QsIGFjY291bnQsIG5hbWUsIGF1dGhvcml6YXRpb24sIGRhdGEsIHRleHRFbmNvZGVyLCB0ZXh0RGVjb2Rlcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFjY291bnQ6IGFjY291bnQsXG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIGF1dGhvcml6YXRpb246IGF1dGhvcml6YXRpb24sXG4gICAgICAgIGRhdGE6ICgwLCBleHBvcnRzLnNlcmlhbGl6ZUFjdGlvbkRhdGEpKGNvbnRyYWN0LCBhY2NvdW50LCBuYW1lLCBkYXRhLCB0ZXh0RW5jb2RlciwgdGV4dERlY29kZXIpLFxuICAgIH07XG59O1xuZXhwb3J0cy5zZXJpYWxpemVBY3Rpb24gPSBzZXJpYWxpemVBY3Rpb247XG4vKiogRGVzZXJpYWxpemUgYWN0aW9uIGRhdGEuIElmIGBkYXRhYCBpcyBhIGBzdHJpbmdgLCB0aGVuIGl0J3MgYXNzdW1lZCB0byBiZSBpbiBoZXguICovXG52YXIgZGVzZXJpYWxpemVBY3Rpb25EYXRhID0gZnVuY3Rpb24gKGNvbnRyYWN0LCBhY2NvdW50LCBuYW1lLCBkYXRhLCB0ZXh0RW5jb2RlciwgdGV4dERlY29kZXIpIHtcbiAgICB2YXIgYWN0aW9uID0gY29udHJhY3QuYWN0aW9ucy5nZXQobmFtZSk7XG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICBkYXRhID0gKDAsIGV4cG9ydHMuaGV4VG9VaW50OEFycmF5KShkYXRhKTtcbiAgICB9XG4gICAgaWYgKCFhY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBhY3Rpb24gXCIgKyBuYW1lICsgXCIgaW4gY29udHJhY3QgXCIgKyBhY2NvdW50KTtcbiAgICB9XG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBTZXJpYWxCdWZmZXIoeyB0ZXh0RGVjb2RlcjogdGV4dERlY29kZXIsIHRleHRFbmNvZGVyOiB0ZXh0RW5jb2RlciB9KTtcbiAgICBidWZmZXIucHVzaEFycmF5KGRhdGEpO1xuICAgIHJldHVybiBhY3Rpb24uZGVzZXJpYWxpemUoYnVmZmVyKTtcbn07XG5leHBvcnRzLmRlc2VyaWFsaXplQWN0aW9uRGF0YSA9IGRlc2VyaWFsaXplQWN0aW9uRGF0YTtcbi8qKiBEZXNlcmlhbGl6ZSBhY3Rpb24uIElmIGBkYXRhYCBpcyBhIGBzdHJpbmdgLCB0aGVuIGl0J3MgYXNzdW1lZCB0byBiZSBpbiBoZXguICovXG52YXIgZGVzZXJpYWxpemVBY3Rpb24gPSBmdW5jdGlvbiAoY29udHJhY3QsIGFjY291bnQsIG5hbWUsIGF1dGhvcml6YXRpb24sIGRhdGEsIHRleHRFbmNvZGVyLCB0ZXh0RGVjb2Rlcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFjY291bnQ6IGFjY291bnQsXG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIGF1dGhvcml6YXRpb246IGF1dGhvcml6YXRpb24sXG4gICAgICAgIGRhdGE6ICgwLCBleHBvcnRzLmRlc2VyaWFsaXplQWN0aW9uRGF0YSkoY29udHJhY3QsIGFjY291bnQsIG5hbWUsIGRhdGEsIHRleHRFbmNvZGVyLCB0ZXh0RGVjb2RlciksXG4gICAgfTtcbn07XG5leHBvcnRzLmRlc2VyaWFsaXplQWN0aW9uID0gZGVzZXJpYWxpemVBY3Rpb247XG52YXIgc2VyaWFsaXplQW55dmFyID0gZnVuY3Rpb24gKGJ1ZmZlciwgYW55dmFyKSB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nO1xuICAgIHZhciBkZWY7XG4gICAgdmFyIHZhbHVlO1xuICAgIGlmIChhbnl2YXIgPT09IG51bGwpIHtcbiAgICAgICAgX2EgPSBfX3JlYWQoW2FueXZhckRlZnMubnVsbF90LCBhbnl2YXJdLCAyKSwgZGVmID0gX2FbMF0sIHZhbHVlID0gX2FbMV07XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBhbnl2YXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIF9iID0gX19yZWFkKFthbnl2YXJEZWZzLnN0cmluZywgYW55dmFyXSwgMiksIGRlZiA9IF9iWzBdLCB2YWx1ZSA9IF9iWzFdO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgYW55dmFyID09PSAnbnVtYmVyJykge1xuICAgICAgICBfYyA9IF9fcmVhZChbYW55dmFyRGVmcy5pbnQzMiwgYW55dmFyXSwgMiksIGRlZiA9IF9jWzBdLCB2YWx1ZSA9IF9jWzFdO1xuICAgIH1cbiAgICBlbHNlIGlmIChhbnl2YXIgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgIF9kID0gX19yZWFkKFthbnl2YXJEZWZzLmJ5dGVzLCBhbnl2YXJdLCAyKSwgZGVmID0gX2RbMF0sIHZhbHVlID0gX2RbMV07XG4gICAgfVxuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYW55dmFyKSkge1xuICAgICAgICBfZSA9IF9fcmVhZChbYW55dmFyRGVmcy5hbnlfYXJyYXksIGFueXZhcl0sIDIpLCBkZWYgPSBfZVswXSwgdmFsdWUgPSBfZVsxXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoT2JqZWN0LmtleXMoYW55dmFyKS5sZW5ndGggPT09IDIgJiYgYW55dmFyLmhhc093blByb3BlcnR5KCd0eXBlJykgJiYgYW55dmFyLmhhc093blByb3BlcnR5KCd2YWx1ZScpKSB7XG4gICAgICAgIF9mID0gX19yZWFkKFthbnl2YXJEZWZzW2FueXZhci50eXBlXSwgYW55dmFyLnZhbHVlXSwgMiksIGRlZiA9IF9mWzBdLCB2YWx1ZSA9IF9mWzFdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgX2cgPSBfX3JlYWQoW2FueXZhckRlZnMuYW55X29iamVjdCwgYW55dmFyXSwgMiksIGRlZiA9IF9nWzBdLCB2YWx1ZSA9IF9nWzFdO1xuICAgIH1cbiAgICBidWZmZXIucHVzaFZhcnVpbnQzMihkZWYuaW5kZXgpO1xuICAgIGRlZi50eXBlLnNlcmlhbGl6ZShidWZmZXIsIHZhbHVlKTtcbn07XG5leHBvcnRzLnNlcmlhbGl6ZUFueXZhciA9IHNlcmlhbGl6ZUFueXZhcjtcbnZhciBkZXNlcmlhbGl6ZUFueXZhciA9IGZ1bmN0aW9uIChidWZmZXIsIHN0YXRlKSB7XG4gICAgdmFyIGRlZkluZGV4ID0gYnVmZmVyLmdldFZhcnVpbnQzMigpO1xuICAgIGlmIChkZWZJbmRleCA+PSBhbnl2YXJEZWZzQnlJbmRleC5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmllZCB0byBkZXNlcmlhbGl6ZSB1bmtub3duIGFueXZhciB0eXBlJyk7XG4gICAgfVxuICAgIHZhciBkZWYgPSBhbnl2YXJEZWZzQnlJbmRleFtkZWZJbmRleF07XG4gICAgdmFyIHZhbHVlID0gZGVmLnR5cGUuZGVzZXJpYWxpemUoYnVmZmVyLCBzdGF0ZSk7XG4gICAgaWYgKHN0YXRlICYmIHN0YXRlLm9wdGlvbnMudXNlU2hvcnRGb3JtIHx8IGRlZi51c2VTaG9ydEZvcm0pIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogZGVmLnR5cGUubmFtZSwgdmFsdWU6IHZhbHVlIH07XG4gICAgfVxufTtcbmV4cG9ydHMuZGVzZXJpYWxpemVBbnl2YXIgPSBkZXNlcmlhbGl6ZUFueXZhcjtcbnZhciBkZXNlcmlhbGl6ZUFueXZhclNob3J0ID0gZnVuY3Rpb24gKGJ1ZmZlcikge1xuICAgIHJldHVybiAoMCwgZXhwb3J0cy5kZXNlcmlhbGl6ZUFueXZhcikoYnVmZmVyLCBuZXcgU2VyaWFsaXplclN0YXRlKHsgdXNlU2hvcnRGb3JtOiB0cnVlIH0pKTtcbn07XG5leHBvcnRzLmRlc2VyaWFsaXplQW55dmFyU2hvcnQgPSBkZXNlcmlhbGl6ZUFueXZhclNob3J0O1xudmFyIHNlcmlhbGl6ZUFueU9iamVjdCA9IGZ1bmN0aW9uIChidWZmZXIsIG9iaikge1xuICAgIHZhciBlXzExLCBfYTtcbiAgICB2YXIgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG9iaik7XG4gICAgYnVmZmVyLnB1c2hWYXJ1aW50MzIoZW50cmllcy5sZW5ndGgpO1xuICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGVudHJpZXNfMiA9IF9fdmFsdWVzKGVudHJpZXMpLCBlbnRyaWVzXzJfMSA9IGVudHJpZXNfMi5uZXh0KCk7ICFlbnRyaWVzXzJfMS5kb25lOyBlbnRyaWVzXzJfMSA9IGVudHJpZXNfMi5uZXh0KCkpIHtcbiAgICAgICAgICAgIHZhciBfYiA9IF9fcmVhZChlbnRyaWVzXzJfMS52YWx1ZSwgMiksIGtleSA9IF9iWzBdLCB2YWx1ZSA9IF9iWzFdO1xuICAgICAgICAgICAgYnVmZmVyLnB1c2hTdHJpbmcoa2V5KTtcbiAgICAgICAgICAgICgwLCBleHBvcnRzLnNlcmlhbGl6ZUFueXZhcikoYnVmZmVyLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVfMTFfMSkgeyBlXzExID0geyBlcnJvcjogZV8xMV8xIH07IH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChlbnRyaWVzXzJfMSAmJiAhZW50cmllc18yXzEuZG9uZSAmJiAoX2EgPSBlbnRyaWVzXzIucmV0dXJuKSkgX2EuY2FsbChlbnRyaWVzXzIpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xMSkgdGhyb3cgZV8xMS5lcnJvcjsgfVxuICAgIH1cbn07XG5leHBvcnRzLnNlcmlhbGl6ZUFueU9iamVjdCA9IHNlcmlhbGl6ZUFueU9iamVjdDtcbnZhciBkZXNlcmlhbGl6ZUFueU9iamVjdCA9IGZ1bmN0aW9uIChidWZmZXIsIHN0YXRlKSB7XG4gICAgdmFyIGxlbiA9IGJ1ZmZlci5nZXRWYXJ1aW50MzIoKTtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICB2YXIga2V5ID0gYnVmZmVyLmdldFN0cmluZygpO1xuICAgICAgICBpZiAoa2V5IGluIHJlc3VsdCkge1xuICAgICAgICAgICAgdmFyIGogPSAxO1xuICAgICAgICAgICAgd2hpbGUgKGtleSArICdfJyArIGogaW4gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgKytqO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5ID0ga2V5ICsgJ18nICsgajtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRba2V5XSA9ICgwLCBleHBvcnRzLmRlc2VyaWFsaXplQW55dmFyKShidWZmZXIsIHN0YXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5leHBvcnRzLmRlc2VyaWFsaXplQW55T2JqZWN0ID0gZGVzZXJpYWxpemVBbnlPYmplY3Q7XG52YXIgc2VyaWFsaXplQW55QXJyYXkgPSBmdW5jdGlvbiAoYnVmZmVyLCBhcnIpIHtcbiAgICB2YXIgZV8xMiwgX2E7XG4gICAgYnVmZmVyLnB1c2hWYXJ1aW50MzIoYXJyLmxlbmd0aCk7XG4gICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgYXJyXzEgPSBfX3ZhbHVlcyhhcnIpLCBhcnJfMV8xID0gYXJyXzEubmV4dCgpOyAhYXJyXzFfMS5kb25lOyBhcnJfMV8xID0gYXJyXzEubmV4dCgpKSB7XG4gICAgICAgICAgICB2YXIgeCA9IGFycl8xXzEudmFsdWU7XG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5zZXJpYWxpemVBbnl2YXIpKGJ1ZmZlciwgeCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVfMTJfMSkgeyBlXzEyID0geyBlcnJvcjogZV8xMl8xIH07IH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChhcnJfMV8xICYmICFhcnJfMV8xLmRvbmUgJiYgKF9hID0gYXJyXzEucmV0dXJuKSkgX2EuY2FsbChhcnJfMSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlXzEyKSB0aHJvdyBlXzEyLmVycm9yOyB9XG4gICAgfVxufTtcbmV4cG9ydHMuc2VyaWFsaXplQW55QXJyYXkgPSBzZXJpYWxpemVBbnlBcnJheTtcbnZhciBkZXNlcmlhbGl6ZUFueUFycmF5ID0gZnVuY3Rpb24gKGJ1ZmZlciwgc3RhdGUpIHtcbiAgICB2YXIgbGVuID0gYnVmZmVyLmdldFZhcnVpbnQzMigpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKCgwLCBleHBvcnRzLmRlc2VyaWFsaXplQW55dmFyKShidWZmZXIsIHN0YXRlKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuZXhwb3J0cy5kZXNlcmlhbGl6ZUFueUFycmF5ID0gZGVzZXJpYWxpemVBbnlBcnJheTtcbnZhciBhZGRBZGRpdGlvbmFsVHlwZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGluaXRpYWxUeXBlcyA9ICgwLCBleHBvcnRzLmNyZWF0ZUluaXRpYWxUeXBlcykoKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdudWxsX3QnLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ251bGxfdCcsXG4gICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgYW55dmFyKSB7IH0sXG4gICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBzdGF0ZSkgeyB9XG4gICAgfSkpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ2FueV9vYmplY3QnLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ2FueV9vYmplY3QnLFxuICAgICAgICBzZXJpYWxpemU6IGV4cG9ydHMuc2VyaWFsaXplQW55T2JqZWN0LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZXhwb3J0cy5kZXNlcmlhbGl6ZUFueU9iamVjdFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdhbnlfYXJyYXknLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ2FueV9hcnJheScsXG4gICAgICAgIHNlcmlhbGl6ZTogZXhwb3J0cy5zZXJpYWxpemVBbnlBcnJheSxcbiAgICAgICAgZGVzZXJpYWxpemU6IGV4cG9ydHMuZGVzZXJpYWxpemVBbnlBcnJheVxuICAgIH0pKTtcbiAgICByZXR1cm4gaW5pdGlhbFR5cGVzO1xufTtcbnZhciBhZGRpdGlvbmFsVHlwZXMgPSBhZGRBZGRpdGlvbmFsVHlwZXMoKTtcbnZhciBhbnl2YXJEZWZzID0ge1xuICAgIG51bGxfdDogeyBpbmRleDogMCwgdXNlU2hvcnRGb3JtOiB0cnVlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCdudWxsX3QnKSB9LFxuICAgIGludDY0OiB7IGluZGV4OiAxLCB1c2VTaG9ydEZvcm06IGZhbHNlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCdpbnQ2NCcpIH0sXG4gICAgdWludDY0OiB7IGluZGV4OiAyLCB1c2VTaG9ydEZvcm06IGZhbHNlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCd1aW50NjQnKSB9LFxuICAgIGludDMyOiB7IGluZGV4OiAzLCB1c2VTaG9ydEZvcm06IHRydWUsIHR5cGU6IGFkZGl0aW9uYWxUeXBlcy5nZXQoJ2ludDMyJykgfSxcbiAgICB1aW50MzI6IHsgaW5kZXg6IDQsIHVzZVNob3J0Rm9ybTogZmFsc2UsIHR5cGU6IGFkZGl0aW9uYWxUeXBlcy5nZXQoJ3VpbnQzMicpIH0sXG4gICAgaW50MTY6IHsgaW5kZXg6IDUsIHVzZVNob3J0Rm9ybTogZmFsc2UsIHR5cGU6IGFkZGl0aW9uYWxUeXBlcy5nZXQoJ2ludDE2JykgfSxcbiAgICB1aW50MTY6IHsgaW5kZXg6IDYsIHVzZVNob3J0Rm9ybTogZmFsc2UsIHR5cGU6IGFkZGl0aW9uYWxUeXBlcy5nZXQoJ3VpbnQxNicpIH0sXG4gICAgaW50ODogeyBpbmRleDogNywgdXNlU2hvcnRGb3JtOiBmYWxzZSwgdHlwZTogYWRkaXRpb25hbFR5cGVzLmdldCgnaW50OCcpIH0sXG4gICAgdWludDg6IHsgaW5kZXg6IDgsIHVzZVNob3J0Rm9ybTogZmFsc2UsIHR5cGU6IGFkZGl0aW9uYWxUeXBlcy5nZXQoJ3VpbnQ4JykgfSxcbiAgICB0aW1lX3BvaW50OiB7IGluZGV4OiA5LCB1c2VTaG9ydEZvcm06IGZhbHNlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCd0aW1lX3BvaW50JykgfSxcbiAgICBjaGVja3N1bTI1NjogeyBpbmRleDogMTAsIHVzZVNob3J0Rm9ybTogZmFsc2UsIHR5cGU6IGFkZGl0aW9uYWxUeXBlcy5nZXQoJ2NoZWNrc3VtMjU2JykgfSxcbiAgICBmbG9hdDY0OiB7IGluZGV4OiAxMSwgdXNlU2hvcnRGb3JtOiBmYWxzZSwgdHlwZTogYWRkaXRpb25hbFR5cGVzLmdldCgnZmxvYXQ2NCcpIH0sXG4gICAgc3RyaW5nOiB7IGluZGV4OiAxMiwgdXNlU2hvcnRGb3JtOiB0cnVlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCdzdHJpbmcnKSB9LFxuICAgIGFueV9vYmplY3Q6IHsgaW5kZXg6IDEzLCB1c2VTaG9ydEZvcm06IHRydWUsIHR5cGU6IGFkZGl0aW9uYWxUeXBlcy5nZXQoJ2FueV9vYmplY3QnKSB9LFxuICAgIGFueV9hcnJheTogeyBpbmRleDogMTQsIHVzZVNob3J0Rm9ybTogdHJ1ZSwgdHlwZTogYWRkaXRpb25hbFR5cGVzLmdldCgnYW55X2FycmF5JykgfSxcbiAgICBieXRlczogeyBpbmRleDogMTUsIHVzZVNob3J0Rm9ybTogZmFsc2UsIHR5cGU6IGFkZGl0aW9uYWxUeXBlcy5nZXQoJ2J5dGVzJykgfSxcbiAgICBzeW1ib2w6IHsgaW5kZXg6IDE2LCB1c2VTaG9ydEZvcm06IGZhbHNlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCdzeW1ib2wnKSB9LFxuICAgIHN5bWJvbF9jb2RlOiB7IGluZGV4OiAxNywgdXNlU2hvcnRGb3JtOiBmYWxzZSwgdHlwZTogYWRkaXRpb25hbFR5cGVzLmdldCgnc3ltYm9sX2NvZGUnKSB9LFxuICAgIGFzc2V0OiB7IGluZGV4OiAxOCwgdXNlU2hvcnRGb3JtOiBmYWxzZSwgdHlwZTogYWRkaXRpb25hbFR5cGVzLmdldCgnYXNzZXQnKSB9LFxufTtcbnZhciBhbnl2YXJEZWZzQnlJbmRleCA9IFtcbiAgICBhbnl2YXJEZWZzLm51bGxfdCxcbiAgICBhbnl2YXJEZWZzLmludDY0LFxuICAgIGFueXZhckRlZnMudWludDY0LFxuICAgIGFueXZhckRlZnMuaW50MzIsXG4gICAgYW55dmFyRGVmcy51aW50MzIsXG4gICAgYW55dmFyRGVmcy5pbnQxNixcbiAgICBhbnl2YXJEZWZzLnVpbnQxNixcbiAgICBhbnl2YXJEZWZzLmludDgsXG4gICAgYW55dmFyRGVmcy51aW50OCxcbiAgICBhbnl2YXJEZWZzLnRpbWVfcG9pbnQsXG4gICAgYW55dmFyRGVmcy5jaGVja3N1bTI1NixcbiAgICBhbnl2YXJEZWZzLmZsb2F0NjQsXG4gICAgYW55dmFyRGVmcy5zdHJpbmcsXG4gICAgYW55dmFyRGVmcy5hbnlfb2JqZWN0LFxuICAgIGFueXZhckRlZnMuYW55X2FycmF5LFxuICAgIGFueXZhckRlZnMuYnl0ZXMsXG4gICAgYW55dmFyRGVmcy5zeW1ib2wsXG4gICAgYW55dmFyRGVmcy5zeW1ib2xfY29kZSxcbiAgICBhbnl2YXJEZWZzLmFzc2V0LFxuXTtcbnZhciBzZXJpYWxpemVRdWVyeSA9IGZ1bmN0aW9uIChidWZmZXIsIHF1ZXJ5KSB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIGVfMTMsIF9kO1xuICAgIHZhciBtZXRob2Q7XG4gICAgdmFyIGFyZztcbiAgICB2YXIgZmlsdGVyO1xuICAgIGlmICh0eXBlb2YgcXVlcnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG1ldGhvZCA9IHF1ZXJ5O1xuICAgIH1cbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHF1ZXJ5KSAmJiBxdWVyeS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgX2EgPSBfX3JlYWQocXVlcnksIDIpLCBtZXRob2QgPSBfYVswXSwgZmlsdGVyID0gX2FbMV07XG4gICAgfVxuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocXVlcnkpICYmIHF1ZXJ5Lmxlbmd0aCA9PT0gMykge1xuICAgICAgICBfYiA9IF9fcmVhZChxdWVyeSwgMyksIG1ldGhvZCA9IF9iWzBdLCBhcmcgPSBfYlsxXSwgZmlsdGVyID0gX2JbMl07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBfYyA9IF9fcmVhZChbcXVlcnkubWV0aG9kLCBxdWVyeS5hcmcsIHF1ZXJ5LmZpbHRlcl0sIDMpLCBtZXRob2QgPSBfY1swXSwgYXJnID0gX2NbMV0sIGZpbHRlciA9IF9jWzJdO1xuICAgIH1cbiAgICBidWZmZXIucHVzaFN0cmluZyhtZXRob2QpO1xuICAgIGlmIChhcmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBidWZmZXIucHVzaCgwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoKDEpO1xuICAgICAgICAoMCwgZXhwb3J0cy5zZXJpYWxpemVBbnl2YXIpKGJ1ZmZlciwgYXJnKTtcbiAgICB9XG4gICAgaWYgKGZpbHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoKDApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYnVmZmVyLnB1c2hWYXJ1aW50MzIoZmlsdGVyLmxlbmd0aCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBmaWx0ZXJfMSA9IF9fdmFsdWVzKGZpbHRlciksIGZpbHRlcl8xXzEgPSBmaWx0ZXJfMS5uZXh0KCk7ICFmaWx0ZXJfMV8xLmRvbmU7IGZpbHRlcl8xXzEgPSBmaWx0ZXJfMS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcSA9IGZpbHRlcl8xXzEudmFsdWU7XG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuc2VyaWFsaXplUXVlcnkpKGJ1ZmZlciwgcSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVfMTNfMSkgeyBlXzEzID0geyBlcnJvcjogZV8xM18xIH07IH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJfMV8xICYmICFmaWx0ZXJfMV8xLmRvbmUgJiYgKF9kID0gZmlsdGVyXzEucmV0dXJuKSkgX2QuY2FsbChmaWx0ZXJfMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMTMpIHRocm93IGVfMTMuZXJyb3I7IH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnRzLnNlcmlhbGl6ZVF1ZXJ5ID0gc2VyaWFsaXplUXVlcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQG1vZHVsZSBXZWJBdXRobi1TaWdcbiAqL1xuLy8gY29weXJpZ2h0IGRlZmluZWQgaW4gZW9zanMvTElDRU5TRS50eHRcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG52YXIgX192YWx1ZXMgPSAodGhpcyAmJiB0aGlzLl9fdmFsdWVzKSB8fCBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLldlYkF1dGhuU2lnbmF0dXJlUHJvdmlkZXIgPSB2b2lkIDA7XG52YXIgc2VyID0gcmVxdWlyZShcIi4vZW9zanMtc2VyaWFsaXplXCIpO1xudmFyIG51bWVyaWMgPSByZXF1aXJlKFwiLi9lb3Nqcy1udW1lcmljXCIpO1xudmFyIGVsbGlwdGljXzEgPSByZXF1aXJlKFwiZWxsaXB0aWNcIik7XG4vKiogU2lnbnMgdHJhbnNhY3Rpb25zIHVzaW5nIFdlYkF1dGhuICovXG52YXIgV2ViQXV0aG5TaWduYXR1cmVQcm92aWRlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBXZWJBdXRoblNpZ25hdHVyZVByb3ZpZGVyKCkge1xuICAgICAgICAvKiogTWFwIHB1YmxpYyBrZXkgdG8gY3JlZGVudGlhbCBJRCAoaGV4KS4gVXNlciBtdXN0IHBvcHVsYXRlIHRoaXMuICovXG4gICAgICAgIHRoaXMua2V5cyA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgLyoqIFB1YmxpYyBrZXlzIHRoYXQgdGhlIGBTaWduYXR1cmVQcm92aWRlcmAgaG9sZHMgKi9cbiAgICBXZWJBdXRoblNpZ25hdHVyZVByb3ZpZGVyLnByb3RvdHlwZS5nZXRBdmFpbGFibGVLZXlzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIEFycmF5LmZyb20odGhpcy5rZXlzLmtleXMoKSldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqIFNpZ24gYSB0cmFuc2FjdGlvbiAqL1xuICAgIFdlYkF1dGhuU2lnbmF0dXJlUHJvdmlkZXIucHJvdG90eXBlLnNpZ24gPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGNoYWluSWQgPSBfYS5jaGFpbklkLCByZXF1aXJlZEtleXMgPSBfYS5yZXF1aXJlZEtleXMsIHNlcmlhbGl6ZWRUcmFuc2FjdGlvbiA9IF9hLnNlcmlhbGl6ZWRUcmFuc2FjdGlvbiwgc2VyaWFsaXplZENvbnRleHRGcmVlRGF0YSA9IF9hLnNlcmlhbGl6ZWRDb250ZXh0RnJlZURhdGE7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzaWduQnVmLCBfYiwgX2MsIF9kLCBkaWdlc3QsIF9lLCBzaWduYXR1cmVzLCByZXF1aXJlZEtleXNfMSwgcmVxdWlyZWRLZXlzXzFfMSwga2V5LCBpZCwgYXNzZXJ0aW9uLCBlLCBwdWJLZXksIGZpeHVwLCBkZXIsIHIsIHMsIHdoYXRJdFJlYWxseVNpZ25lZCwgX2YsIF9nLCBfaCwgaGFzaF8xLCBfaiwgcmVjaWQsIHNpZ0RhdGEsIHNpZywgZV8xXzE7XG4gICAgICAgICAgICB2YXIgZV8xLCBfaztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2wpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9sLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25CdWYgPSBuZXcgc2VyLlNlcmlhbEJ1ZmZlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbkJ1Zi5wdXNoQXJyYXkoc2VyLmhleFRvVWludDhBcnJheShjaGFpbklkKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduQnVmLnB1c2hBcnJheShzZXJpYWxpemVkVHJhbnNhY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZXJpYWxpemVkQ29udGV4dEZyZWVEYXRhKSByZXR1cm4gWzMgLypicmVhayovLCAyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jID0gKF9iID0gc2lnbkJ1ZikucHVzaEFycmF5O1xuICAgICAgICAgICAgICAgICAgICAgICAgX2QgPSBVaW50OEFycmF5LmJpbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBjcnlwdG8uc3VidGxlLmRpZ2VzdCgnU0hBLTI1NicsIHNlcmlhbGl6ZWRDb250ZXh0RnJlZURhdGEuYnVmZmVyKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jLmFwcGx5KF9iLCBbbmV3IChfZC5hcHBseShVaW50OEFycmF5LCBbdm9pZCAwLCBfbC5zZW50KCldKSkoKV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgM107XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25CdWYucHVzaEFycmF5KG5ldyBVaW50OEFycmF5KDMyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfbC5sYWJlbCA9IDM7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9lID0gVWludDhBcnJheS5iaW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgY3J5cHRvLnN1YnRsZS5kaWdlc3QoJ1NIQS0yNTYnLCBzaWduQnVmLmFzVWludDhBcnJheSgpLnNsaWNlKCkuYnVmZmVyKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZ2VzdCA9IG5ldyAoX2UuYXBwbHkoVWludDhBcnJheSwgW3ZvaWQgMCwgX2wuc2VudCgpXSkpKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduYXR1cmVzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBfbC5sYWJlbCA9IDU7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9sLnRyeXMucHVzaChbNSwgMTIsIDEzLCAxNF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRLZXlzXzEgPSBfX3ZhbHVlcyhyZXF1aXJlZEtleXMpLCByZXF1aXJlZEtleXNfMV8xID0gcmVxdWlyZWRLZXlzXzEubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2wubGFiZWwgPSA2O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISFyZXF1aXJlZEtleXNfMV8xLmRvbmUpIHJldHVybiBbMyAvKmJyZWFrKi8sIDExXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IHJlcXVpcmVkS2V5c18xXzEudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA9IHNlci5oZXhUb1VpbnQ4QXJyYXkodGhpcy5rZXlzLmdldChrZXkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIG5hdmlnYXRvci5jcmVkZW50aWFscy5nZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdWJsaWNLZXk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDYwMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlclZlcmlmaWNhdGlvbjogJ3JlcXVpcmVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG93Q3JlZGVudGlhbHM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3B1YmxpYy1rZXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnRzOiBbJ2ludGVybmFsJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFsbGVuZ2U6IGRpZ2VzdC5idWZmZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NlcnRpb24gPSBfbC5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlID0gbmV3IGVsbGlwdGljXzEuZWMoJ3AyNTYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YktleSA9IGUua2V5RnJvbVB1YmxpYyhudW1lcmljLnN0cmluZ1RvUHVibGljS2V5KGtleSkuZGF0YS5zdWJhcnJheSgwLCAzMykpLmdldFB1YmxpYygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZml4dXAgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhID0gQXJyYXkuZnJvbSh4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoYS5sZW5ndGggPCAzMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhLnVuc2hpZnQoMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChhLmxlbmd0aCA+IDMyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhLnNoaWZ0KCkgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2lnbmF0dXJlIGhhcyBhbiByIG9yIHMgdGhhdCBpcyB0b28gYmlnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlciA9IG5ldyBzZXIuU2VyaWFsQnVmZmVyKHsgYXJyYXk6IG5ldyBVaW50OEFycmF5KGFzc2VydGlvbi5yZXNwb25zZS5zaWduYXR1cmUpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlci5nZXQoKSAhPT0gMHgzMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2lnbmF0dXJlIG1pc3NpbmcgREVSIHByZWZpeCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlci5nZXQoKSAhPT0gZGVyLmFycmF5Lmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NpZ25hdHVyZSBoYXMgYmFkIGxlbmd0aCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlci5nZXQoKSAhPT0gMHgwMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2lnbmF0dXJlIGhhcyBiYWQgciBtYXJrZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBmaXh1cChkZXIuZ2V0VWludDhBcnJheShkZXIuZ2V0KCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXIuZ2V0KCkgIT09IDB4MDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NpZ25hdHVyZSBoYXMgYmFkIHMgbWFya2VyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzID0gZml4dXAoZGVyLmdldFVpbnQ4QXJyYXkoZGVyLmdldCgpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGF0SXRSZWFsbHlTaWduZWQgPSBuZXcgc2VyLlNlcmlhbEJ1ZmZlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hhdEl0UmVhbGx5U2lnbmVkLnB1c2hBcnJheShuZXcgVWludDhBcnJheShhc3NlcnRpb24ucmVzcG9uc2UuYXV0aGVudGljYXRvckRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9nID0gKF9mID0gd2hhdEl0UmVhbGx5U2lnbmVkKS5wdXNoQXJyYXk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaCA9IFVpbnQ4QXJyYXkuYmluZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGNyeXB0by5zdWJ0bGUuZGlnZXN0KCdTSEEtMjU2JywgYXNzZXJ0aW9uLnJlc3BvbnNlLmNsaWVudERhdGFKU09OKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9nLmFwcGx5KF9mLCBbbmV3IChfaC5hcHBseShVaW50OEFycmF5LCBbdm9pZCAwLCBfbC5zZW50KCldKSkoKV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2ogPSBVaW50OEFycmF5LmJpbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBjcnlwdG8uc3VidGxlLmRpZ2VzdCgnU0hBLTI1NicsIHdoYXRJdFJlYWxseVNpZ25lZC5hc1VpbnQ4QXJyYXkoKS5zbGljZSgpKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hfMSA9IG5ldyAoX2ouYXBwbHkoVWludDhBcnJheSwgW3ZvaWQgMCwgX2wuc2VudCgpXSkpKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWNpZCA9IGUuZ2V0S2V5UmVjb3ZlcnlQYXJhbShoYXNoXzEsIG5ldyBVaW50OEFycmF5KGFzc2VydGlvbi5yZXNwb25zZS5zaWduYXR1cmUpLCBwdWJLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnRGF0YSA9IG5ldyBzZXIuU2VyaWFsQnVmZmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWdEYXRhLnB1c2gocmVjaWQgKyAyNyArIDQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnRGF0YS5wdXNoQXJyYXkocik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWdEYXRhLnB1c2hBcnJheShzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ0RhdGEucHVzaEJ5dGVzKG5ldyBVaW50OEFycmF5KGFzc2VydGlvbi5yZXNwb25zZS5hdXRoZW50aWNhdG9yRGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnRGF0YS5wdXNoQnl0ZXMobmV3IFVpbnQ4QXJyYXkoYXNzZXJ0aW9uLnJlc3BvbnNlLmNsaWVudERhdGFKU09OKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWcgPSBudW1lcmljLnNpZ25hdHVyZVRvU3RyaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBudW1lcmljLktleVR5cGUud2EsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogc2lnRGF0YS5hc1VpbnQ4QXJyYXkoKS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduYXR1cmVzLnB1c2goc2lnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9sLmxhYmVsID0gMTA7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZEtleXNfMV8xID0gcmVxdWlyZWRLZXlzXzEubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNl07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTE6IHJldHVybiBbMyAvKmJyZWFrKi8sIDE0XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVfMV8xID0gX2wuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZV8xID0geyBlcnJvcjogZV8xXzEgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDE0XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVpcmVkS2V5c18xXzEgJiYgIXJlcXVpcmVkS2V5c18xXzEuZG9uZSAmJiAoX2sgPSByZXF1aXJlZEtleXNfMS5yZXR1cm4pKSBfay5jYWxsKHJlcXVpcmVkS2V5c18xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNyAvKmVuZGZpbmFsbHkqL107XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTQ6IHJldHVybiBbMiAvKnJldHVybiovLCB7IHNpZ25hdHVyZXM6IHNpZ25hdHVyZXMsIHNlcmlhbGl6ZWRUcmFuc2FjdGlvbjogc2VyaWFsaXplZFRyYW5zYWN0aW9uLCBzZXJpYWxpemVkQ29udGV4dEZyZWVEYXRhOiBzZXJpYWxpemVkQ29udGV4dEZyZWVEYXRhIH1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBXZWJBdXRoblNpZ25hdHVyZVByb3ZpZGVyO1xufSgpKTtcbmV4cG9ydHMuV2ViQXV0aG5TaWduYXR1cmVQcm92aWRlciA9IFdlYkF1dGhuU2lnbmF0dXJlUHJvdmlkZXI7XG4iLCIvLyBodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3dsemxhMDAwL2JhYzgzZGY2ZDNjNTE5MTZjNGRkMGJjOTQ3ZTQ2OTQ3L3Jhdy83ZWUzNDYyYjA5NWFiMjI1ODBkZGFmMTkxZjQ0YTU5MGRhNmZlMzNiL1JJUEVNRC0xNjAuanNcblxuLypcblx0UklQRU1ELTE2MC5qc1xuXG5cdFx0ZGV2ZWxvcGVkXG5cdFx0XHRieSBLLiAoaHR0cHM6Ly9naXRodWIuY29tL3dsemxhMDAwKVxuXHRcdFx0b24gRGVjZW1iZXIgMjctMjksIDIwMTcsXG5cblx0XHRsaWNlbnNlZCB1bmRlclxuXG5cblx0XHR0aGUgTUlUIGxpY2Vuc2VcblxuXHRcdENvcHlyaWdodCAoYykgMjAxNyBLLlxuXG5cdFx0IFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG5cdFx0b2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cblx0XHRmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXRcblx0XHRyZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSxcblx0XHRjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Jcblx0XHRzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZVxuXHRcdFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG5cdFx0Y29uZGl0aW9uczpcblxuXHRcdCBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuXHRcdGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5cdFx0IFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG5cdFx0RVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG5cdFx0T0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcblx0XHROT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVFxuXHRcdEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLFxuXHRcdFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuXHRcdEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1Jcblx0XHRPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4qL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNsYXNzIFJJUEVNRDE2MFxue1xuICAgIGNvbnN0cnVjdG9yKClcbiAgICB7XG4gICAgICAgIC8vIGh0dHBzOi8vd2ViY2FjaGUuZ29vZ2xldXNlcmNvbnRlbnQuY29tL3NlYXJjaD9xPWNhY2hlOkNuTE9nb2xUSFlFSjpodHRwczovL3d3dy5jb3NpYy5lc2F0Lmt1bGV1dmVuLmJlL3B1YmxpY2F0aW9ucy9hcnRpY2xlLTMxNy5wZGZcbiAgICAgICAgLy8gaHR0cDovL3Nob2RoZ2FuZ2EuaW5mbGlibmV0LmFjLmluL2JpdHN0cmVhbS8xMDYwMy8yMjk3OC8xMy8xM19hcHBlbmRpeC5wZGZcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0X25fcGFkX2J5dGVzKG1lc3NhZ2Vfc2l6ZSAvKiBpbiBieXRlcywgMSBieXRlIGlzIDggYml0cy4gKi8pXG4gICAge1xuICAgICAgICAvLyAgT2J0YWluIHRoZSBudW1iZXIgb2YgYnl0ZXMgbmVlZGVkIHRvIHBhZCB0aGUgbWVzc2FnZS5cbiAgICAgICAgLy8gSXQgZG9lcyBub3QgY29udGFpbiB0aGUgc2l6ZSBvZiB0aGUgbWVzc2FnZSBzaXplIGluZm9ybWF0aW9uLlxuICAgICAgICAvKlxuXHRcdFx0aHR0cHM6Ly93ZWJjYWNoZS5nb29nbGV1c2VyY29udGVudC5jb20vc2VhcmNoP3E9Y2FjaGU6Q25MT2dvbFRIWUVKOmh0dHBzOi8vd3d3LmNvc2ljLmVzYXQua3VsZXV2ZW4uYmUvcHVibGljYXRpb25zL2FydGljbGUtMzE3LnBkZlxuXG5cdFx0XHRUaGUgQ3J5cHRvZ3JhcGhpYyBIYXNoIEZ1bmN0aW9uIFJJUEVNRC0xNjBcblxuXHRcdFx0d3JpdHRlbiBieVxuXHRcdFx0XHRCYXJ0IFByZW5lZWwsXG5cdFx0XHRcdEhhbnMgRG9iYmVydGluLFxuXHRcdFx0XHRBbnRvb24gQm9zc2VsYWVyc1xuXHRcdFx0aW5cblx0XHRcdFx0MTk5Ny5cblxuXHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdFx0wqc1ICAgICBEZXNjcmlwdGlvbiBvZiBSSVBFTUQtMTYwXG5cblx0XHRcdC4uLi4uLlxuXG5cdFx0XHQgSW4gb3JkZXIgdG8gZ3VhcmFudGVlIHRoYXQgdGhlIHRvdGFsIGlucHV0IHNpemUgaXMgYVxuXHRcdFx0bXVsdGlwbGUgb2YgNTEyIGJpdHMsIHRoZSBpbnB1dCBpcyBwYWRkZWQgaW4gdGhlIHNhbWVcblx0XHRcdHdheSBhcyBmb3IgYWxsIHRoZSBtZW1iZXJzIG9mIHRoZSBNRDQtZmFtaWx5OiBvbmVcblx0XHRcdGFwcGVuZHMgYSBzaW5nbGUgMSBmb2xsb3dlZCBieSBhIHN0cmluZyBvZiAwcyAodGhlXG5cdFx0XHRudW1iZXIgb2YgMHMgbGllcyBiZXR3ZWVuIDAgYW5kIDUxMSk7IHRoZSBsYXN0IDY0IGJpdHNcblx0XHRcdG9mIHRoZSBleHRlbmRlZCBpbnB1dCBjb250YWluIHRoZSBiaW5hcnkgcmVwcmVzZW50YXRpb25cblx0XHRcdG9mIHRoZSBpbnB1dCBzaXplIGluIGJpdHMsIGxlYXN0IHNpZ25pZmljYW50IGJ5dGUgZmlyc3QuXG5cdFx0Ki9cbiAgICAgICAgLypcblx0XHRcdGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvcmZjL3JmYzExODYudHh0XG5cblx0XHRcdFJGQyAxMTg2OiBNRDQgTWVzc2FnZSBEaWdlc3QgQWxnb3JpdGhtLlxuXG5cdFx0XHR3cml0dGVuIGJ5XG5cdFx0XHRcdFJvbmFsZCBMaW5uIFJpdmVzdFxuXHRcdFx0aW5cblx0XHRcdFx0T2N0b2JlciAxOTkwLlxuXG5cdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0XHTCpzMgICAgIE1ENCBBbGdvcml0aG0gRGVzY3JpcHRpb25cblxuXHRcdFx0Li4uLi4uXG5cblx0XHRcdFN0ZXAgMS4gQXBwZW5kIHBhZGRpbmcgYml0c1xuXG5cdFx0XHQgVGhlIG1lc3NhZ2UgaXMgXCJwYWRkZWRcIiAoZXh0ZW5kZWQpIHNvIHRoYXQgaXRzIGxlbmd0aFxuXHRcdFx0KGluIGJpdHMpIGlzIGNvbmdydWVudCB0byA0NDgsIG1vZHVsbyA1MTIuIFRoYXQgaXMsIHRoZVxuXHRcdFx0bWVzc2FnZSBpcyBleHRlbmRlZCBzbyB0aGF0IGl0IGlzIGp1c3QgNjQgYml0cyBzaHkgb2Zcblx0XHRcdGJlaW5nIGEgbXVsdGlwbGUgb2YgNTEyIGJpdHMgbG9uZy4gUGFkZGluZyBpcyBhbHdheXNcblx0XHRcdHBlcmZvcm1lZCwgZXZlbiBpZiB0aGUgbGVuZ3RoIG9mIHRoZSBtZXNzYWdlIGlzIGFscmVhZHlcblx0XHRcdGNvbmdydWVudCB0byA0NDgsIG1vZHVsbyA1MTIgKGluIHdoaWNoIGNhc2UgNTEyIGJpdHMgb2Zcblx0XHRcdHBhZGRpbmcgYXJlIGFkZGVkKS5cblxuXHRcdFx0IFBhZGRpbmcgaXMgcGVyZm9ybWVkIGFzIGZvbGxvd3M6IGEgc2luZ2xlIFwiMVwiIGJpdCBpc1xuXHRcdFx0YXBwZW5kZWQgdG8gdGhlIG1lc3NhZ2UsIGFuZCB0aGVuIGVub3VnaCB6ZXJvIGJpdHMgYXJlXG5cdFx0XHRhcHBlbmRlZCBzbyB0aGF0IHRoZSBsZW5ndGggaW4gYml0cyBvZiB0aGUgcGFkZGVkXG5cdFx0XHRtZXNzYWdlIGJlY29tZXMgY29uZ3J1ZW50IHRvIDQ0OCwgbW9kdWxvIDUxMi5cblxuXHRcdFx0U3RlcCAyLiBBcHBlbmQgbGVuZ3RoXG5cblx0XHRcdCBBIDY0LWJpdCByZXByZXNlbnRhdGlvbiBvZiBiICh0aGUgbGVuZ3RoIG9mIHRoZSBtZXNzYWdlXG5cdFx0XHRiZWZvcmUgdGhlIHBhZGRpbmcgYml0cyB3ZXJlIGFkZGVkKSBpcyBhcHBlbmRlZCB0byB0aGVcblx0XHRcdHJlc3VsdCBvZiB0aGUgcHJldmlvdXMgc3RlcC4gSW4gdGhlIHVubGlrZWx5IGV2ZW50IHRoYXRcblx0XHRcdGIgaXMgZ3JlYXRlciB0aGFuIDJeNjQsIHRoZW4gb25seSB0aGUgbG93LW9yZGVyIDY0IGJpdHNcblx0XHRcdG9mIGIgYXJlIHVzZWQuIChUaGVzZSBiaXRzIGFyZSBhcHBlbmRlZCBhcyB0d28gMzItYml0XG5cdFx0XHR3b3JkcyBhbmQgYXBwZW5kZWQgbG93LW9yZGVyIHdvcmQgZmlyc3QgaW4gYWNjb3JkYW5jZVxuXHRcdFx0d2l0aCB0aGUgcHJldmlvdXMgY29udmVudGlvbnMuKVxuXG5cdFx0XHQgQXQgdGhpcyBwb2ludCB0aGUgcmVzdWx0aW5nIG1lc3NhZ2UgKGFmdGVyIHBhZGRpbmcgd2l0aFxuXHRcdFx0Yml0cyBhbmQgd2l0aCBiKSBoYXMgYSBsZW5ndGggdGhhdCBpcyBhbiBleGFjdCBtdWx0aXBsZVxuXHRcdFx0b2YgNTEyIGJpdHMuIEVxdWl2YWxlbnRseSwgdGhpcyBtZXNzYWdlIGhhcyBhIGxlbmd0aFxuXHRcdFx0dGhhdCBpcyBhbiBleGFjdCBtdWx0aXBsZSBvZiAxNiAoMzItYml0KSB3b3Jkcy4gTGV0XG5cdFx0XHRNWzAgLi4uIE4tMV0gZGVub3RlIHRoZSB3b3JkcyBvZiB0aGUgcmVzdWx0aW5nIG1lc3NhZ2UsXG5cdFx0XHR3aGVyZSBOIGlzIGEgbXVsdGlwbGUgb2YgMTYuXG5cdFx0Ki9cbiAgICAgICAgLy8gaHR0cHM6Ly9jcnlwdG8uc3RhY2tleGNoYW5nZS5jb20vYS8zMjQwNy81NDU2OFxuICAgICAgICAvKlxuXHRcdFx0RXhhbXBsZSBjYXNlICAjIDFcblx0XHRcdFx0WzAgYml0OiBtZXNzYWdlLl1cblx0XHRcdFx0WzEgYml0OiAxLl1cblx0XHRcdFx0WzQ0NyBiaXRzOiAwLl1cblx0XHRcdFx0WzY0IGJpdHM6IG1lc3NhZ2Ugc2l6ZSBpbmZvcm1hdGlvbi5dXG5cblx0XHRcdEV4YW1wbGUgY2FzZSAgIyAyXG5cdFx0XHRcdFs1MTItYml0czogbWVzc2FnZV1cblx0XHRcdFx0WzEgYml0OiAxLl1cblx0XHRcdFx0WzQ0NyBiaXRzOiAwLl1cblx0XHRcdFx0WzY0IGJpdHM6IG1lc3NhZ2Ugc2l6ZSBpbmZvcm1hdGlvbi5dXG5cblx0XHRcdEV4YW1wbGUgY2FzZSAgIyAzXG5cdFx0XHRcdFsoNTEyIC0gNjQgPSA0NDgpIGJpdHM6IG1lc3NhZ2UuXVxuXHRcdFx0XHRbMSBiaXQ6IDEuXVxuXHRcdFx0XHRbNTExIGJpdHM6IDAuXVxuXHRcdFx0XHRbNjQgYml0czogbWVzc2FnZSBzaXplIGluZm9ybWF0aW9uLl1cblxuXHRcdFx0RXhhbXBsZSBjYXNlICAjIDRcblx0XHRcdFx0Wyg1MTIgLSA2NSA9IDQ0NykgYml0czogbWVzc2FnZS5dXG5cdFx0XHRcdFsxIGJpdDogMS5dXG5cdFx0XHRcdFswIGJpdDogMC5dXG5cdFx0XHRcdFs2NCBiaXRzOiBtZXNzYWdlIHNpemUgaW5mb3JtYXRpb24uXVxuXHRcdCovXG4gICAgICAgIC8vIFRoZSBudW1iZXIgb2YgcGFkZGluZyB6ZXJvIGJpdHM6XG4gICAgICAgIC8vICAgICAgNTExIC0gW3sobWVzc2FnZSBzaXplIGluIGJpdHMpICsgNjR9IChtb2QgNTEyKV1cbiAgICAgICAgcmV0dXJuIDY0IC0gKChtZXNzYWdlX3NpemUgKyA4KSAmIDBiMDAxMTExMTEgLyogNjMgKi8pO1xuICAgIH1cbiAgICBzdGF0aWMgcGFkKG1lc3NhZ2UgLyogQW4gQXJyYXlCdWZmZXIuICovKVxuICAgIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZV9zaXplID0gbWVzc2FnZS5ieXRlTGVuZ3RoO1xuICAgICAgICBjb25zdCBuX3BhZCA9IFJJUEVNRDE2MC5nZXRfbl9wYWRfYnl0ZXMobWVzc2FnZV9zaXplKTtcblxuICAgICAgICAvLyAgYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYCBpcyAoKDIgKiogNTMpIC0gMSkgYW5kXG4gICAgICAgIC8vIGJpdHdpc2Ugb3BlcmF0aW9uIGluIEphdmFzY3JpcHQgaXMgZG9uZSBvbiAzMi1iaXRzIG9wZXJhbmRzLlxuICAgICAgICBjb25zdCBkaXZtb2QgPSAoZGl2aWRlbmQsIGRpdmlzb3IpID0+IFtcbiAgICAgICAgICAgIE1hdGguZmxvb3IoZGl2aWRlbmQgLyBkaXZpc29yKSxcbiAgICAgICAgICAgIGRpdmlkZW5kICUgZGl2aXNvclxuICAgICAgICBdO1xuICAgICAgICAvKlxuVG8gc2hpZnRcblxuICAgMDAwMDAwMDAgMDAwPz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0IG9cbiAgIDAwMDAwMDAwID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/MDAwXG5cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbk1ldGhvZCAjMVxuXG4gICAgMDAwMDAwMDAgMDAwPz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/XG4gICBbMDAwMDAwMDAgMDAwQUFBQUEgQUFBQUFBQUEgQUFBQUFBQUFdICg8QT4gY2FwdHVyZWQpXG4gICBbMDAwMDAwMDAgQUFBQUFBQUEgQUFBQUFBQUEgQUFBQUEwMDBdICg8QT4gc2hpZnRlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAoPEI+IGNhcHR1cmVkKSBbQkJCQkJCQkIgQkJCQkJCQkIgQkJCQkJCQkIgQkJCQkJCQkJdXG4gICAgICAgICAgICAgICAgICAgICAoPEI+IHNoaWZ0ZWQpIFtCQkJdW0JCQkJCQkJCIEJCQkJCQkJCIEJCQkJCQkJCIEJCQkJCMDAwXVxuICAgWzAwMDAwMDAwIEFBQUFBQUFBIEFBQUFBQUFBIEFBQUFBQkJCXSAoPEE+ICYgPEJfMj4gbWVyZ2VkKVxuICAgWzAwMDAwMDAwIEFBQUFBQUFBIEFBQUFBQUFBIEFBQUFBQkJCXVtCQkJCQkJCQiBCQkJCQkJCQiBCQkJCQkJCQiBCQkJCQjAwMF1cbiAgICAwMDAwMDAwMCA/Pz8/Pz8/PyA/Pz8/Pz8/PyA/Pz8/Pz8/PyAgPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8wMDBcblxuXHRcdGNvbnN0IHVpbnQzMl9tYXhfcGx1c18xID0gMHgxMDAwMDAwMDA7IC8vICgyICoqIDMyKVxuXHRcdGNvbnN0IFtcblx0XHRcdG1zZ19ieXRlX3NpemVfbW9zdCwgLy8gVmFsdWUgcmFuZ2UgWzAsICgyICoqIDIxKSAtIDFdLlxuXHRcdFx0bXNnX2J5dGVfc2l6ZV9sZWFzdCAvLyBWYWx1ZSByYW5nZSBbMCwgKDIgKiogMzIpIC0gMV0uXG5cdFx0XSA9IGRpdm1vZChtZXNzYWdlX3NpemUsIHVpbnQzMl9tYXhfcGx1c18xKTtcblx0XHRjb25zdCBbXG5cdFx0XHRjYXJyeSwgLy8gVmFsdWUgcmFuZ2UgWzAsIDddLlxuXHRcdFx0bXNnX2JpdF9zaXplX2xlYXN0IC8vIFZhbHVlIHJhbmdlIFswLCAoMiAqKiAzMikgLSA4XS5cblx0XHRdID0gZGl2bW9kKG1lc3NhZ2VfYnl0ZV9zaXplX2xlYXN0ICogOCwgdWludDMyX21heF9wbHVzXzEpO1xuXHRcdGNvbnN0IG1lc3NhZ2VfYml0X3NpemVfbW9zdCA9IG1lc3NhZ2VfYnl0ZV9zaXplX21vc3QgKiA4XG5cdFx0XHQrIGNhcnJ5OyAvLyBWYWx1ZSByYW5nZSBbMCwgKDIgKiogMjQpIC0gMV0uXG5cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbk1ldGhvZCAjMlxuICAgIDAwMDAwMDAwIDAwMD8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ICA/Pz8/Pz8/PyA/Pz8/Pz8/PyA/Pz8/Pz8/PyA/Pz8/Pz8/P1xuICAgICAgWzAwMDAwIDAwMEFBQUFBIEFBQUFBQUFBIEFBQUFBQUFBICBBQUFdICg8QT4gY2FwdHVyZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKDxCPiBjYXB0dXJlZCkgWzAwMEJCQkJCIEJCQkJCQkJCIEJCQkJCQkJCIEJCQkJCQkJCXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAoPEI+IHNoaWZ0ZWQpIFtCQkJCQkJCQiBCQkJCQkJCQiBCQkJCQkJCQiBCQkJCQjAwMF1cbiAgIFswMDAwMDAwMCBBQUFBQUFBQSBBQUFBQUFBQSBBQUFBQUFBQV1bQkJCQkJCQkIgQkJCQkJCQkIgQkJCQkJCQkIgQkJCQkIwMDBdXG4gICAgMDAwMDAwMDAgPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/MDAwXG5cblx0XHQqL1xuICAgICAgICBjb25zdCBbXG4gICAgICAgICAgICBtc2dfYml0X3NpemVfbW9zdCxcbiAgICAgICAgICAgIG1zZ19iaXRfc2l6ZV9sZWFzdFxuICAgICAgICBdID0gZGl2bW9kKG1lc3NhZ2Vfc2l6ZSwgNTM2ODcwOTEyIC8qICgyICoqIDI5KSAqLylcbiAgICAgICAgICAgIC5tYXAoKHgsIGluZGV4KSA9PiAoaW5kZXggPyAoeCAqIDgpIDogeCkpO1xuXG4gICAgICAgIC8vIGBBcnJheUJ1ZmZlci50cmFuc2ZlcigpYCBpcyBub3Qgc3VwcG9ydGVkLlxuICAgICAgICBjb25zdCBwYWRkZWQgPSBuZXcgVWludDhBcnJheShtZXNzYWdlX3NpemUgKyBuX3BhZCArIDgpO1xuICAgICAgICBwYWRkZWQuc2V0KG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCAwKTtcbiAgICAgICAgY29uc3QgZGF0YV92aWV3ID0gbmV3IERhdGFWaWV3KHBhZGRlZC5idWZmZXIpO1xuICAgICAgICBkYXRhX3ZpZXcuc2V0VWludDgobWVzc2FnZV9zaXplLCAwYjEwMDAwMDAwKTtcbiAgICAgICAgZGF0YV92aWV3LnNldFVpbnQzMihcbiAgICAgICAgICAgIG1lc3NhZ2Vfc2l6ZSArIG5fcGFkLFxuICAgICAgICAgICAgbXNnX2JpdF9zaXplX2xlYXN0LFxuICAgICAgICAgICAgdHJ1ZSAvLyBMaXR0bGUtZW5kaWFuXG4gICAgICAgICk7XG4gICAgICAgIGRhdGFfdmlldy5zZXRVaW50MzIoXG4gICAgICAgICAgICBtZXNzYWdlX3NpemUgKyBuX3BhZCArIDQsXG4gICAgICAgICAgICBtc2dfYml0X3NpemVfbW9zdCxcbiAgICAgICAgICAgIHRydWUgLy8gTGl0dGxlLWVuZGlhblxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBwYWRkZWQuYnVmZmVyO1xuICAgIH1cblxuICAgIHN0YXRpYyBmKGosIHgsIHksIHopXG4gICAge1xuICAgICAgICBpZigwIDw9IGogJiYgaiA8PSAxNSlcbiAgICAgICAgeyAvLyBFeGNsdXNpdmUtT1JcbiAgICAgICAgICAgIHJldHVybiB4IF4geSBeIHo7XG4gICAgICAgIH1cbiAgICAgICAgaWYoMTYgPD0gaiAmJiBqIDw9IDMxKVxuICAgICAgICB7IC8vIE11bHRpcGxleGluZyAobXV4aW5nKVxuICAgICAgICAgICAgcmV0dXJuICh4ICYgeSkgfCAofnggJiB6KTtcbiAgICAgICAgfVxuICAgICAgICBpZigzMiA8PSBqICYmIGogPD0gNDcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAoeCB8IH55KSBeIHo7XG4gICAgICAgIH1cbiAgICAgICAgaWYoNDggPD0gaiAmJiBqIDw9IDYzKVxuICAgICAgICB7IC8vIE11bHRpcGxleGluZyAobXV4aW5nKVxuICAgICAgICAgICAgcmV0dXJuICh4ICYgeikgfCAoeSAmIH56KTtcbiAgICAgICAgfVxuICAgICAgICBpZig2NCA8PSBqICYmIGogPD0gNzkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB4IF4gKHkgfCB+eik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIEsoailcbiAgICB7XG4gICAgICAgIGlmKDAgPD0gaiAmJiBqIDw9IDE1KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gMHgwMDAwMDAwMDtcbiAgICAgICAgfVxuICAgICAgICBpZigxNiA8PSBqICYmIGogPD0gMzEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIE1hdGguZmxvb3IoKDIgKiogMzApICogTWF0aC5TUVJUMilcbiAgICAgICAgICAgIHJldHVybiAweDVBODI3OTk5O1xuICAgICAgICB9XG4gICAgICAgIGlmKDMyIDw9IGogJiYgaiA8PSA0NylcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gTWF0aC5mbG9vcigoMiAqKiAzMCkgKiBNYXRoLnNxcnQoMykpXG4gICAgICAgICAgICByZXR1cm4gMHg2RUQ5RUJBMTtcbiAgICAgICAgfVxuICAgICAgICBpZig0OCA8PSBqICYmIGogPD0gNjMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIE1hdGguZmxvb3IoKDIgKiogMzApICogTWF0aC5zcXJ0KDUpKVxuICAgICAgICAgICAgcmV0dXJuIDB4OEYxQkJDREM7XG4gICAgICAgIH1cbiAgICAgICAgaWYoNjQgPD0gaiAmJiBqIDw9IDc5KVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBNYXRoLmZsb29yKCgyICoqIDMwKSAqIE1hdGguc3FydCg3KSlcbiAgICAgICAgICAgIHJldHVybiAweEE5NTNGRDRFO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBLUChqKSAvLyBLJ1xuICAgIHtcbiAgICAgICAgaWYoMCA8PSBqICYmIGogPD0gMTUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIE1hdGguZmxvb3IoKDIgKiogMzApICogTWF0aC5jYnJ0KDIpKVxuICAgICAgICAgICAgcmV0dXJuIDB4NTBBMjhCRTY7XG4gICAgICAgIH1cbiAgICAgICAgaWYoMTYgPD0gaiAmJiBqIDw9IDMxKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBNYXRoLmZsb29yKCgyICoqIDMwKSAqIE1hdGguY2JydCgzKSlcbiAgICAgICAgICAgIHJldHVybiAweDVDNEREMTI0O1xuICAgICAgICB9XG4gICAgICAgIGlmKDMyIDw9IGogJiYgaiA8PSA0NylcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gTWF0aC5mbG9vcigoMiAqKiAzMCkgKiBNYXRoLmNicnQoNSkpXG4gICAgICAgICAgICByZXR1cm4gMHg2RDcwM0VGMztcbiAgICAgICAgfVxuICAgICAgICBpZig0OCA8PSBqICYmIGogPD0gNjMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIE1hdGguZmxvb3IoKDIgKiogMzApICogTWF0aC5jYnJ0KDcpKVxuICAgICAgICAgICAgcmV0dXJuIDB4N0E2RDc2RTk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoNjQgPD0gaiAmJiBqIDw9IDc5KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gMHgwMDAwMDAwMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgYWRkX21vZHVsbzMyKC8qIC4uLi4uLiAqLylcbiAgICB7XG4gICAgICAgIC8vIDEuICBNb2R1bG8gYWRkaXRpb24gKGFkZGl0aW9uIG1vZHVsbykgaXMgYXNzb2NpYXRpdmUuXG4gICAgICAgIC8vICAgIGh0dHBzOi8vcHJvb2Z3aWtpLm9yZy93aWtpL01vZHVsb19BZGRpdGlvbl9pc19Bc3NvY2lhdGl2ZVxuIFx0XHQvLyAyLiAgQml0d2lzZSBvcGVyYXRpb24gaW4gSmF2YXNjcmlwdFxuICAgICAgICAvLyAgICBpcyBkb25lIG9uIDMyLWJpdHMgb3BlcmFuZHNcbiAgICAgICAgLy8gICAgYW5kIHJlc3VsdHMgaW4gYSAzMi1iaXRzIHZhbHVlLlxuICAgICAgICByZXR1cm4gQXJyYXlcbiAgICAgICAgICAgIC5mcm9tKGFyZ3VtZW50cylcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IChhICsgYiksIDApIHwgMDtcbiAgICB9XG4gICAgc3RhdGljIHJvbDMyKHZhbHVlLCBjb3VudClcbiAgICB7IC8vIEN5Y2xpYyBsZWZ0IHNoaWZ0IChyb3RhdGUpIG9uIDMyLWJpdHMgdmFsdWUuXG4gICAgICAgIHJldHVybiAodmFsdWUgPDwgY291bnQpIHwgKHZhbHVlID4+PiAoMzIgLSBjb3VudCkpO1xuICAgIH1cbiAgICBzdGF0aWMgaGFzaChtZXNzYWdlIC8qIEFuIEFycmF5QnVmZmVyLiAqLylcbiAgICB7XG4gICAgICAgIC8vIC8vLy8vLy8vICAgICAgIFBhZGRpbmcgICAgICAgLy8vLy8vLy8vL1xuXG4gICAgICAgIC8vIFRoZSBwYWRkZWQgbWVzc2FnZS5cbiAgICAgICAgY29uc3QgcGFkZGVkID0gUklQRU1EMTYwLnBhZChtZXNzYWdlKTtcblxuICAgICAgICAvLyAvLy8vLy8vLyAgICAgQ29tcHJlc3Npb24gICAgIC8vLy8vLy8vLy9cblxuICAgICAgICAvLyBNZXNzYWdlIHdvcmQgc2VsZWN0b3JzLlxuICAgICAgICBjb25zdCByID0gW1xuICAgICAgICAgICAgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSxcbiAgICAgICAgICAgIDcsIDQsIDEzLCAxLCAxMCwgNiwgMTUsIDMsIDEyLCAwLCA5LCA1LCAyLCAxNCwgMTEsIDgsXG4gICAgICAgICAgICAzLCAxMCwgMTQsIDQsIDksIDE1LCA4LCAxLCAyLCA3LCAwLCA2LCAxMywgMTEsIDUsIDEyLFxuICAgICAgICAgICAgMSwgOSwgMTEsIDEwLCAwLCA4LCAxMiwgNCwgMTMsIDMsIDcsIDE1LCAxNCwgNSwgNiwgMixcbiAgICAgICAgICAgIDQsIDAsIDUsIDksIDcsIDEyLCAyLCAxMCwgMTQsIDEsIDMsIDgsIDExLCA2LCAxNSwgMTNcbiAgICAgICAgXTtcbiAgICAgICAgY29uc3QgclAgPSBbIC8vIHInXG4gICAgICAgICAgICA1LCAxNCwgNywgMCwgOSwgMiwgMTEsIDQsIDEzLCA2LCAxNSwgOCwgMSwgMTAsIDMsIDEyLFxuICAgICAgICAgICAgNiwgMTEsIDMsIDcsIDAsIDEzLCA1LCAxMCwgMTQsIDE1LCA4LCAxMiwgNCwgOSwgMSwgMixcbiAgICAgICAgICAgIDE1LCA1LCAxLCAzLCA3LCAxNCwgNiwgOSwgMTEsIDgsIDEyLCAyLCAxMCwgMCwgNCwgMTMsXG4gICAgICAgICAgICA4LCA2LCA0LCAxLCAzLCAxMSwgMTUsIDAsIDUsIDEyLCAyLCAxMywgOSwgNywgMTAsIDE0LFxuICAgICAgICAgICAgMTIsIDE1LCAxMCwgNCwgMSwgNSwgOCwgNywgNiwgMiwgMTMsIDE0LCAwLCAzLCA5LCAxMVxuICAgICAgICBdO1xuXG4gICAgICAgIC8vIEFtb3VudHMgZm9yICdyb3RhdGUgbGVmdCcgb3BlcmF0aW9uLlxuICAgICAgICBjb25zdCBzID0gW1xuICAgICAgICAgICAgMTEsIDE0LCAxNSwgMTIsIDUsIDgsIDcsIDksIDExLCAxMywgMTQsIDE1LCA2LCA3LCA5LCA4LFxuICAgICAgICAgICAgNywgNiwgOCwgMTMsIDExLCA5LCA3LCAxNSwgNywgMTIsIDE1LCA5LCAxMSwgNywgMTMsIDEyLFxuICAgICAgICAgICAgMTEsIDEzLCA2LCA3LCAxNCwgOSwgMTMsIDE1LCAxNCwgOCwgMTMsIDYsIDUsIDEyLCA3LCA1LFxuICAgICAgICAgICAgMTEsIDEyLCAxNCwgMTUsIDE0LCAxNSwgOSwgOCwgOSwgMTQsIDUsIDYsIDgsIDYsIDUsIDEyLFxuICAgICAgICAgICAgOSwgMTUsIDUsIDExLCA2LCA4LCAxMywgMTIsIDUsIDEyLCAxMywgMTQsIDExLCA4LCA1LCA2XG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IHNQID0gWyAvLyBzJ1xuICAgICAgICAgICAgOCwgOSwgOSwgMTEsIDEzLCAxNSwgMTUsIDUsIDcsIDcsIDgsIDExLCAxNCwgMTQsIDEyLCA2LFxuICAgICAgICAgICAgOSwgMTMsIDE1LCA3LCAxMiwgOCwgOSwgMTEsIDcsIDcsIDEyLCA3LCA2LCAxNSwgMTMsIDExLFxuICAgICAgICAgICAgOSwgNywgMTUsIDExLCA4LCA2LCA2LCAxNCwgMTIsIDEzLCA1LCAxNCwgMTMsIDEzLCA3LCA1LFxuICAgICAgICAgICAgMTUsIDUsIDgsIDExLCAxNCwgMTQsIDYsIDE0LCA2LCA5LCAxMiwgOSwgMTIsIDUsIDE1LCA4LFxuICAgICAgICAgICAgOCwgNSwgMTIsIDksIDEyLCA1LCAxNCwgNiwgOCwgMTMsIDYsIDUsIDE1LCAxMywgMTEsIDExXG4gICAgICAgIF07XG5cbiAgICAgICAgLy8gVGhlIHNpemUsIGluIGJ5dGVzLCBvZiBhIHdvcmQuXG4gICAgICAgIGNvbnN0IHdvcmRfc2l6ZSA9IDQ7XG5cbiAgICAgICAgLy8gVGhlIHNpemUsIGluIGJ5dGVzLCBvZiBhIDE2LXdvcmRzIGJsb2NrLlxuICAgICAgICBjb25zdCBibG9ja19zaXplID0gNjQ7XG5cbiAgICAgICAgLy8gVGhlIG51bWJlciBvZiB0aGUgMTYtd29yZHMgYmxvY2tzLlxuICAgICAgICBjb25zdCB0ID0gcGFkZGVkLmJ5dGVMZW5ndGggLyBibG9ja19zaXplO1xuXG4gICAgICAgIC8vICBUaGUgbWVzc2FnZSBhZnRlciBwYWRkaW5nIGNvbnNpc3RzIG9mIHQgMTYtd29yZCBibG9ja3MgdGhhdFxuICAgICAgICAvLyBhcmUgZGVub3RlZCB3aXRoIFhfaVtqXSwgd2l0aCAw4omkaeKJpCh0IOKIkiAxKSBhbmQgMOKJpGriiaQxNS5cbiAgICAgICAgY29uc3QgWCA9IChuZXcgQXJyYXkodCkpXG4gICAgICAgICAgICAuZmlsbCh1bmRlZmluZWQpXG4gICAgICAgICAgICAubWFwKChfLCBpKSA9PiBqID0+IChcbiAgICAgICAgICAgICAgICBuZXcgRGF0YVZpZXcoXG4gICAgICAgICAgICAgICAgICAgIHBhZGRlZCwgaSAqIGJsb2NrX3NpemUsIGJsb2NrX3NpemVcbiAgICAgICAgICAgICAgICApLmdldFVpbnQzMihcbiAgICAgICAgICAgICAgICAgICAgaiAqIHdvcmRfc2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgdHJ1ZSAvLyBMaXR0bGUtZW5kaWFuXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSk7XG5cbiAgICAgICAgLy8gIFRoZSByZXN1bHQgb2YgUklQRU1ELTE2MCBpcyBjb250YWluZWQgaW4gZml2ZSAzMi1iaXQgd29yZHMsXG4gICAgICAgIC8vIHdoaWNoIGZvcm0gdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBhbGdvcml0aG0uIFRoZSBmaW5hbFxuICAgICAgICAvLyBjb250ZW50IG9mIHRoZXNlIGZpdmUgMzItYml0IHdvcmRzIGlzIGNvbnZlcnRlZCB0byBhIDE2MC1iaXRcbiAgICAgICAgLy8gc3RyaW5nLCBhZ2FpbiB1c2luZyB0aGUgbGl0dGxlLWVuZGlhbiBjb252ZW50aW9uLlxuICAgICAgICBjb25zdCBoID0gW1xuICAgICAgICAgICAgMHg2NzQ1MjMwMSwgLy8gaF8wXG4gICAgICAgICAgICAweEVGQ0RBQjg5LCAvLyBoXzFcbiAgICAgICAgICAgIDB4OThCQURDRkUsIC8vIGhfMlxuICAgICAgICAgICAgMHgxMDMyNTQ3NiwgLy8gaF8zXG4gICAgICAgICAgICAweEMzRDJFMUYwICAvLyBoXzRcbiAgICAgICAgXTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdDsgKytpKVxuICAgICAgICB7XG4gICAgICAgICAgICBsZXQgQSA9IGhbMF07IGxldCBCID0gaFsxXTsgbGV0IEMgPSBoWzJdOyBsZXQgRCA9IGhbM107IGxldCBFID0gaFs0XTtcbiAgICAgICAgICAgIGxldCBBUCA9IEE7IGxldCBCUCA9IEI7IGxldCBDUCA9IEM7IGxldCBEUCA9IEQ7IGxldCBFUCA9IEU7XG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgODA7ICsrailcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBMZWZ0IHJvdW5kc1xuICAgICAgICAgICAgICAgIGxldCBUID0gUklQRU1EMTYwLmFkZF9tb2R1bG8zMiggLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zaGFkb3dcbiAgICAgICAgICAgICAgICAgICAgUklQRU1EMTYwLnJvbDMyKFxuICAgICAgICAgICAgICAgICAgICAgICAgUklQRU1EMTYwLmFkZF9tb2R1bG8zMihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJJUEVNRDE2MC5mKGosIEIsIEMsIEQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFhbaV0ocltqXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUklQRU1EMTYwLksoailcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBzW2pdXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIEVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIEEgPSBFO1xuICAgICAgICAgICAgICAgIEUgPSBEO1xuICAgICAgICAgICAgICAgIEQgPSBSSVBFTUQxNjAucm9sMzIoQywgMTApO1xuICAgICAgICAgICAgICAgIEMgPSBCO1xuICAgICAgICAgICAgICAgIEIgPSBUO1xuXG4gICAgICAgICAgICAgICAgLy8gUmlnaHQgcm91bmRzXG4gICAgICAgICAgICAgICAgVCA9IFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoXG4gICAgICAgICAgICAgICAgICAgIFJJUEVNRDE2MC5yb2wzMihcbiAgICAgICAgICAgICAgICAgICAgICAgIFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQVAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUklQRU1EMTYwLmYoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDc5IC0gaixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQlAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENQLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEUFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWFtpXShyUFtqXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUklQRU1EMTYwLktQKGopXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgc1Bbal1cbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgRVBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIEFQID0gRVA7XG4gICAgICAgICAgICAgICAgRVAgPSBEUDtcbiAgICAgICAgICAgICAgICBEUCA9IFJJUEVNRDE2MC5yb2wzMihDUCwgMTApO1xuICAgICAgICAgICAgICAgIENQID0gQlA7XG4gICAgICAgICAgICAgICAgQlAgPSBUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgVCA9IFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoaFsxXSwgQywgRFApO1xuICAgICAgICAgICAgaFsxXSA9IFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoaFsyXSwgRCwgRVApO1xuICAgICAgICAgICAgaFsyXSA9IFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoaFszXSwgRSwgQVApO1xuICAgICAgICAgICAgaFszXSA9IFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoaFs0XSwgQSwgQlApO1xuICAgICAgICAgICAgaFs0XSA9IFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoaFswXSwgQiwgQ1ApO1xuICAgICAgICAgICAgaFswXSA9IFQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAgVGhlIGZpbmFsIG91dHB1dCBzdHJpbmcgdGhlbiBjb25zaXN0cyBvZiB0aGUgY29uY2F0ZW5hdGF0aW9uXG4gICAgICAgIC8vIG9mIGhfMCwgaF8xLCBoXzIsIGhfMywgYW5kIGhfNCBhZnRlciBjb252ZXJ0aW5nIGVhY2ggaF9pIHRvIGFcbiAgICAgICAgLy8gNC1ieXRlIHN0cmluZyB1c2luZyB0aGUgbGl0dGxlLWVuZGlhbiBjb252ZW50aW9uLlxuICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgICAgICBjb25zdCBkYXRhX3ZpZXcgPSBuZXcgRGF0YVZpZXcocmVzdWx0KTtcbiAgICAgICAgaC5mb3JFYWNoKChoX2ksIGkpID0+IGRhdGFfdmlldy5zZXRVaW50MzIoaSAqIDQsIGhfaSwgdHJ1ZSkpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgUklQRU1EMTYwXG59O1xuIiwiLyogKGlnbm9yZWQpICovIiwiLyogKGlnbm9yZWQpICovIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiZW9zanNfd2FzaWdcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua19uYW1lX1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtfbmFtZV9cIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcImV4dGVybmFsc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9lb3Nqcy13ZWJhdXRobi1zaWcudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==