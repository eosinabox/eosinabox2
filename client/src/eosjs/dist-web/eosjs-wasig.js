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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLEtBQUs7QUFDaEQ7QUFDQSx5TUFBeU07QUFDek07QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGNBQWM7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsUUFBUTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsU0FBUztBQUNwQztBQUNBLDRCQUE0QixPQUFPO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsZ0JBQWdCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLElBQUk7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDZCQUE2QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBLDBCQUEwQixjQUFjLGNBQWMsY0FBYztBQUNwRSx3QkFBd0IsWUFBWSxZQUFZLFlBQVk7QUFDNUQsMkJBQTJCLFFBQVE7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN2ZEE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDNUJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vW25hbWVdLy4vc3JjL2Vvc2pzLW51bWVyaWMudHMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vc3JjL2Vvc2pzLXNlcmlhbGl6ZS50cyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9zcmMvZW9zanMtd2ViYXV0aG4tc2lnLnRzIiwid2VicGFjazovL1tuYW1lXS8uL3NyYy9yaXBlbWQuanMiLCJ3ZWJwYWNrOi8vW25hbWVdL2lnbm9yZWR8L2hvbWUvYW1pL2Rldi93b3JrL2Vvc2luYWJveC9lb3Nqcy9ub2RlX21vZHVsZXMvYnJvcmFuZHxjcnlwdG8iLCJ3ZWJwYWNrOi8vW25hbWVdL2lnbm9yZWR8L2hvbWUvYW1pL2Rldi93b3JrL2Vvc2luYWJveC9lb3Nqcy9ub2RlX21vZHVsZXMvZWxsaXB0aWMvbm9kZV9tb2R1bGVzL2JuLmpzL2xpYnxidWZmZXIiLCJ3ZWJwYWNrOi8vW25hbWVdL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1tuYW1lXS93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL1tuYW1lXS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1tuYW1lXS93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL1tuYW1lXS93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9bbmFtZV0vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9bbmFtZV0vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL1tuYW1lXS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19yZWFkID0gKHRoaXMgJiYgdGhpcy5fX3JlYWQpIHx8IGZ1bmN0aW9uIChvLCBuKSB7XG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xuICAgIGlmICghbSkgcmV0dXJuIG87XG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XG4gICAgdHJ5IHtcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XG4gICAgfVxuICAgIHJldHVybiBhcjtcbn07XG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG52YXIgX192YWx1ZXMgPSAodGhpcyAmJiB0aGlzLl9fdmFsdWVzKSB8fCBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnNpZ25hdHVyZVRvU3RyaW5nID0gZXhwb3J0cy5zdHJpbmdUb1NpZ25hdHVyZSA9IGV4cG9ydHMucHJpdmF0ZUtleVRvU3RyaW5nID0gZXhwb3J0cy5wcml2YXRlS2V5VG9MZWdhY3lTdHJpbmcgPSBleHBvcnRzLnN0cmluZ1RvUHJpdmF0ZUtleSA9IGV4cG9ydHMuY29udmVydExlZ2FjeVB1YmxpY0tleXMgPSBleHBvcnRzLmNvbnZlcnRMZWdhY3lQdWJsaWNLZXkgPSBleHBvcnRzLnB1YmxpY0tleVRvU3RyaW5nID0gZXhwb3J0cy5wdWJsaWNLZXlUb0xlZ2FjeVN0cmluZyA9IGV4cG9ydHMuc3RyaW5nVG9QdWJsaWNLZXkgPSBleHBvcnRzLnNpZ25hdHVyZURhdGFTaXplID0gZXhwb3J0cy5wcml2YXRlS2V5RGF0YVNpemUgPSBleHBvcnRzLnB1YmxpY0tleURhdGFTaXplID0gZXhwb3J0cy5LZXlUeXBlID0gZXhwb3J0cy5iYXNlNjRUb0JpbmFyeSA9IGV4cG9ydHMuYmluYXJ5VG9CYXNlNTggPSBleHBvcnRzLmJhc2U1OFRvQmluYXJ5ID0gZXhwb3J0cy5zaWduZWRCaW5hcnlUb0RlY2ltYWwgPSBleHBvcnRzLmJpbmFyeVRvRGVjaW1hbCA9IGV4cG9ydHMuc2lnbmVkRGVjaW1hbFRvQmluYXJ5ID0gZXhwb3J0cy5kZWNpbWFsVG9CaW5hcnkgPSBleHBvcnRzLm5lZ2F0ZSA9IGV4cG9ydHMuaXNOZWdhdGl2ZSA9IHZvaWQgMDtcbi8qKlxuICogQG1vZHVsZSBOdW1lcmljXG4gKi9cbnZhciBoYXNoX2pzXzEgPSByZXF1aXJlKFwiaGFzaC5qc1wiKTtcbi8vIGNvcHlyaWdodCBkZWZpbmVkIGluIGVvc2pzL0xJQ0VOU0UudHh0XG52YXIgcmlwZW1kMTYwID0gcmVxdWlyZSgnLi9yaXBlbWQnKS5SSVBFTUQxNjAuaGFzaDtcbnZhciBiYXNlNThDaGFycyA9ICcxMjM0NTY3ODlBQkNERUZHSEpLTE1OUFFSU1RVVldYWVphYmNkZWZnaGlqa21ub3BxcnN0dXZ3eHl6JztcbnZhciBiYXNlNjRDaGFycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcbnZhciBjcmVhdGVfYmFzZTU4X21hcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYmFzZTU4TSA9IEFycmF5KDI1NikuZmlsbCgtMSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiYXNlNThDaGFycy5sZW5ndGg7ICsraSkge1xuICAgICAgICBiYXNlNThNW2Jhc2U1OENoYXJzLmNoYXJDb2RlQXQoaSldID0gaTtcbiAgICB9XG4gICAgcmV0dXJuIGJhc2U1OE07XG59O1xudmFyIGJhc2U1OE1hcCA9IGNyZWF0ZV9iYXNlNThfbWFwKCk7XG52YXIgY3JlYXRlX2Jhc2U2NF9tYXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJhc2U2NE0gPSBBcnJheSgyNTYpLmZpbGwoLTEpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmFzZTY0Q2hhcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgYmFzZTY0TVtiYXNlNjRDaGFycy5jaGFyQ29kZUF0KGkpXSA9IGk7XG4gICAgfVxuICAgIGJhc2U2NE1bJz0nLmNoYXJDb2RlQXQoMCldID0gMDtcbiAgICByZXR1cm4gYmFzZTY0TTtcbn07XG52YXIgYmFzZTY0TWFwID0gY3JlYXRlX2Jhc2U2NF9tYXAoKTtcbi8qKiBJcyBgYmlnbnVtYCBhIG5lZ2F0aXZlIG51bWJlcj8gKi9cbnZhciBpc05lZ2F0aXZlID0gZnVuY3Rpb24gKGJpZ251bSkge1xuICAgIHJldHVybiAoYmlnbnVtW2JpZ251bS5sZW5ndGggLSAxXSAmIDB4ODApICE9PSAwO1xufTtcbmV4cG9ydHMuaXNOZWdhdGl2ZSA9IGlzTmVnYXRpdmU7XG4vKiogTmVnYXRlIGBiaWdudW1gICovXG52YXIgbmVnYXRlID0gZnVuY3Rpb24gKGJpZ251bSkge1xuICAgIHZhciBjYXJyeSA9IDE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiaWdudW0ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIHggPSAofmJpZ251bVtpXSAmIDB4ZmYpICsgY2Fycnk7XG4gICAgICAgIGJpZ251bVtpXSA9IHg7XG4gICAgICAgIGNhcnJ5ID0geCA+PiA4O1xuICAgIH1cbn07XG5leHBvcnRzLm5lZ2F0ZSA9IG5lZ2F0ZTtcbi8qKlxuICogQ29udmVydCBhbiB1bnNpZ25lZCBkZWNpbWFsIG51bWJlciBpbiBgc2AgdG8gYSBiaWdudW1cbiAqXG4gKiBAcGFyYW0gc2l6ZSBiaWdudW0gc2l6ZSAoYnl0ZXMpXG4gKi9cbnZhciBkZWNpbWFsVG9CaW5hcnkgPSBmdW5jdGlvbiAoc2l6ZSwgcykge1xuICAgIHZhciByZXN1bHQgPSBuZXcgVWludDhBcnJheShzaXplKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIHNyY0RpZ2l0ID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoc3JjRGlnaXQgPCAnMCcuY2hhckNvZGVBdCgwKSB8fCBzcmNEaWdpdCA+ICc5Jy5jaGFyQ29kZUF0KDApKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgbnVtYmVyJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNhcnJ5ID0gc3JjRGlnaXQgLSAnMCcuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyArK2opIHtcbiAgICAgICAgICAgIHZhciB4ID0gcmVzdWx0W2pdICogMTAgKyBjYXJyeTtcbiAgICAgICAgICAgIHJlc3VsdFtqXSA9IHg7XG4gICAgICAgICAgICBjYXJyeSA9IHggPj4gODtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FycnkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbnVtYmVyIGlzIG91dCBvZiByYW5nZScpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuZXhwb3J0cy5kZWNpbWFsVG9CaW5hcnkgPSBkZWNpbWFsVG9CaW5hcnk7XG4vKipcbiAqIENvbnZlcnQgYSBzaWduZWQgZGVjaW1hbCBudW1iZXIgaW4gYHNgIHRvIGEgYmlnbnVtXG4gKlxuICogQHBhcmFtIHNpemUgYmlnbnVtIHNpemUgKGJ5dGVzKVxuICovXG52YXIgc2lnbmVkRGVjaW1hbFRvQmluYXJ5ID0gZnVuY3Rpb24gKHNpemUsIHMpIHtcbiAgICB2YXIgbmVnYXRpdmUgPSBzWzBdID09PSAnLSc7XG4gICAgaWYgKG5lZ2F0aXZlKSB7XG4gICAgICAgIHMgPSBzLnN1YnN0cigxKTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9ICgwLCBleHBvcnRzLmRlY2ltYWxUb0JpbmFyeSkoc2l6ZSwgcyk7XG4gICAgaWYgKG5lZ2F0aXZlKSB7XG4gICAgICAgICgwLCBleHBvcnRzLm5lZ2F0ZSkocmVzdWx0KTtcbiAgICAgICAgaWYgKCEoMCwgZXhwb3J0cy5pc05lZ2F0aXZlKShyZXN1bHQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ251bWJlciBpcyBvdXQgb2YgcmFuZ2UnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgoMCwgZXhwb3J0cy5pc05lZ2F0aXZlKShyZXN1bHQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbnVtYmVyIGlzIG91dCBvZiByYW5nZScpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbmV4cG9ydHMuc2lnbmVkRGVjaW1hbFRvQmluYXJ5ID0gc2lnbmVkRGVjaW1hbFRvQmluYXJ5O1xuLyoqXG4gKiBDb252ZXJ0IGBiaWdudW1gIHRvIGFuIHVuc2lnbmVkIGRlY2ltYWwgbnVtYmVyXG4gKlxuICogQHBhcmFtIG1pbkRpZ2l0cyAwLXBhZCByZXN1bHQgdG8gdGhpcyBtYW55IGRpZ2l0c1xuICovXG52YXIgYmluYXJ5VG9EZWNpbWFsID0gZnVuY3Rpb24gKGJpZ251bSwgbWluRGlnaXRzKSB7XG4gICAgaWYgKG1pbkRpZ2l0cyA9PT0gdm9pZCAwKSB7IG1pbkRpZ2l0cyA9IDE7IH1cbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkobWluRGlnaXRzKS5maWxsKCcwJy5jaGFyQ29kZUF0KDApKTtcbiAgICBmb3IgKHZhciBpID0gYmlnbnVtLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBjYXJyeSA9IGJpZ251bVtpXTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByZXN1bHQubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIHZhciB4ID0gKChyZXN1bHRbal0gLSAnMCcuY2hhckNvZGVBdCgwKSkgPDwgOCkgKyBjYXJyeTtcbiAgICAgICAgICAgIHJlc3VsdFtqXSA9ICcwJy5jaGFyQ29kZUF0KDApICsgeCAlIDEwO1xuICAgICAgICAgICAgY2FycnkgPSAoeCAvIDEwKSB8IDA7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGNhcnJ5KSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCgnMCcuY2hhckNvZGVBdCgwKSArIGNhcnJ5ICUgMTApO1xuICAgICAgICAgICAgY2FycnkgPSAoY2FycnkgLyAxMCkgfCAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQocmVzdWx0KSwgZmFsc2UpKTtcbn07XG5leHBvcnRzLmJpbmFyeVRvRGVjaW1hbCA9IGJpbmFyeVRvRGVjaW1hbDtcbi8qKlxuICogQ29udmVydCBgYmlnbnVtYCB0byBhIHNpZ25lZCBkZWNpbWFsIG51bWJlclxuICpcbiAqIEBwYXJhbSBtaW5EaWdpdHMgMC1wYWQgcmVzdWx0IHRvIHRoaXMgbWFueSBkaWdpdHNcbiAqL1xudmFyIHNpZ25lZEJpbmFyeVRvRGVjaW1hbCA9IGZ1bmN0aW9uIChiaWdudW0sIG1pbkRpZ2l0cykge1xuICAgIGlmIChtaW5EaWdpdHMgPT09IHZvaWQgMCkgeyBtaW5EaWdpdHMgPSAxOyB9XG4gICAgaWYgKCgwLCBleHBvcnRzLmlzTmVnYXRpdmUpKGJpZ251bSkpIHtcbiAgICAgICAgdmFyIHggPSBiaWdudW0uc2xpY2UoKTtcbiAgICAgICAgKDAsIGV4cG9ydHMubmVnYXRlKSh4KTtcbiAgICAgICAgcmV0dXJuICctJyArICgwLCBleHBvcnRzLmJpbmFyeVRvRGVjaW1hbCkoeCwgbWluRGlnaXRzKTtcbiAgICB9XG4gICAgcmV0dXJuICgwLCBleHBvcnRzLmJpbmFyeVRvRGVjaW1hbCkoYmlnbnVtLCBtaW5EaWdpdHMpO1xufTtcbmV4cG9ydHMuc2lnbmVkQmluYXJ5VG9EZWNpbWFsID0gc2lnbmVkQmluYXJ5VG9EZWNpbWFsO1xudmFyIGJhc2U1OFRvQmluYXJ5VmFyU2l6ZSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgdmFyIGVfMSwgX2E7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgY2FycnkgPSBiYXNlNThNYXBbcy5jaGFyQ29kZUF0KGkpXTtcbiAgICAgICAgaWYgKGNhcnJ5IDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGJhc2UtNTggdmFsdWUnKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJlc3VsdC5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgdmFyIHggPSByZXN1bHRbal0gKiA1OCArIGNhcnJ5O1xuICAgICAgICAgICAgcmVzdWx0W2pdID0geCAmIDB4ZmY7XG4gICAgICAgICAgICBjYXJyeSA9IHggPj4gODtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FycnkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNhcnJ5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBzXzEgPSBfX3ZhbHVlcyhzKSwgc18xXzEgPSBzXzEubmV4dCgpOyAhc18xXzEuZG9uZTsgc18xXzEgPSBzXzEubmV4dCgpKSB7XG4gICAgICAgICAgICB2YXIgY2ggPSBzXzFfMS52YWx1ZTtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJzEnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHNfMV8xICYmICFzXzFfMS5kb25lICYmIChfYSA9IHNfMS5yZXR1cm4pKSBfYS5jYWxsKHNfMSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxuICAgIH1cbiAgICByZXN1bHQucmV2ZXJzZSgpO1xuICAgIHJldHVybiBuZXcgVWludDhBcnJheShyZXN1bHQpO1xufTtcbi8qKlxuICogQ29udmVydCBhbiB1bnNpZ25lZCBiYXNlLTU4IG51bWJlciBpbiBgc2AgdG8gYSBiaWdudW1cbiAqXG4gKiBAcGFyYW0gc2l6ZSBiaWdudW0gc2l6ZSAoYnl0ZXMpXG4gKi9cbnZhciBiYXNlNThUb0JpbmFyeSA9IGZ1bmN0aW9uIChzaXplLCBzKSB7XG4gICAgaWYgKCFzaXplKSB7XG4gICAgICAgIHJldHVybiBiYXNlNThUb0JpbmFyeVZhclNpemUocyk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBuZXcgVWludDhBcnJheShzaXplKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGNhcnJ5ID0gYmFzZTU4TWFwW3MuY2hhckNvZGVBdChpKV07XG4gICAgICAgIGlmIChjYXJyeSA8IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBiYXNlLTU4IHZhbHVlJyk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyArK2opIHtcbiAgICAgICAgICAgIHZhciB4ID0gcmVzdWx0W2pdICogNTggKyBjYXJyeTtcbiAgICAgICAgICAgIHJlc3VsdFtqXSA9IHg7XG4gICAgICAgICAgICBjYXJyeSA9IHggPj4gODtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FycnkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYmFzZS01OCB2YWx1ZSBpcyBvdXQgb2YgcmFuZ2UnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQucmV2ZXJzZSgpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuZXhwb3J0cy5iYXNlNThUb0JpbmFyeSA9IGJhc2U1OFRvQmluYXJ5O1xuLyoqXG4gKiBDb252ZXJ0IGBiaWdudW1gIHRvIGEgYmFzZS01OCBudW1iZXJcbiAqXG4gKiBAcGFyYW0gbWluRGlnaXRzIDAtcGFkIHJlc3VsdCB0byB0aGlzIG1hbnkgZGlnaXRzXG4gKi9cbnZhciBiaW5hcnlUb0Jhc2U1OCA9IGZ1bmN0aW9uIChiaWdudW0sIG1pbkRpZ2l0cykge1xuICAgIHZhciBlXzIsIF9hLCBlXzMsIF9iO1xuICAgIGlmIChtaW5EaWdpdHMgPT09IHZvaWQgMCkgeyBtaW5EaWdpdHMgPSAxOyB9XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGJpZ251bV8xID0gX192YWx1ZXMoYmlnbnVtKSwgYmlnbnVtXzFfMSA9IGJpZ251bV8xLm5leHQoKTsgIWJpZ251bV8xXzEuZG9uZTsgYmlnbnVtXzFfMSA9IGJpZ251bV8xLm5leHQoKSkge1xuICAgICAgICAgICAgdmFyIGJ5dGUgPSBiaWdudW1fMV8xLnZhbHVlO1xuICAgICAgICAgICAgdmFyIGNhcnJ5ID0gYnl0ZTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcmVzdWx0Lmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgdmFyIHggPSAoYmFzZTU4TWFwW3Jlc3VsdFtqXV0gPDwgOCkgKyBjYXJyeTtcbiAgICAgICAgICAgICAgICByZXN1bHRbal0gPSBiYXNlNThDaGFycy5jaGFyQ29kZUF0KHggJSA1OCk7XG4gICAgICAgICAgICAgICAgY2FycnkgPSAoeCAvIDU4KSB8IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAoY2FycnkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChiYXNlNThDaGFycy5jaGFyQ29kZUF0KGNhcnJ5ICUgNTgpKTtcbiAgICAgICAgICAgICAgICBjYXJyeSA9IChjYXJyeSAvIDU4KSB8IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVfMl8xKSB7IGVfMiA9IHsgZXJyb3I6IGVfMl8xIH07IH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChiaWdudW1fMV8xICYmICFiaWdudW1fMV8xLmRvbmUgJiYgKF9hID0gYmlnbnVtXzEucmV0dXJuKSkgX2EuY2FsbChiaWdudW1fMSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjsgfVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBiaWdudW1fMiA9IF9fdmFsdWVzKGJpZ251bSksIGJpZ251bV8yXzEgPSBiaWdudW1fMi5uZXh0KCk7ICFiaWdudW1fMl8xLmRvbmU7IGJpZ251bV8yXzEgPSBiaWdudW1fMi5uZXh0KCkpIHtcbiAgICAgICAgICAgIHZhciBieXRlID0gYmlnbnVtXzJfMS52YWx1ZTtcbiAgICAgICAgICAgIGlmIChieXRlKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCgnMScuY2hhckNvZGVBdCgwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVfM18xKSB7IGVfMyA9IHsgZXJyb3I6IGVfM18xIH07IH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChiaWdudW1fMl8xICYmICFiaWdudW1fMl8xLmRvbmUgJiYgKF9iID0gYmlnbnVtXzIucmV0dXJuKSkgX2IuY2FsbChiaWdudW1fMik7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlXzMpIHRocm93IGVfMy5lcnJvcjsgfVxuICAgIH1cbiAgICByZXN1bHQucmV2ZXJzZSgpO1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHJlc3VsdCksIGZhbHNlKSk7XG59O1xuZXhwb3J0cy5iaW5hcnlUb0Jhc2U1OCA9IGJpbmFyeVRvQmFzZTU4O1xuLyoqIENvbnZlcnQgYW4gdW5zaWduZWQgYmFzZS02NCBudW1iZXIgaW4gYHNgIHRvIGEgYmlnbnVtICovXG52YXIgYmFzZTY0VG9CaW5hcnkgPSBmdW5jdGlvbiAocykge1xuICAgIHZhciBsZW4gPSBzLmxlbmd0aDtcbiAgICBpZiAoKGxlbiAmIDMpID09PSAxICYmIHNbbGVuIC0gMV0gPT09ICc9Jykge1xuICAgICAgICBsZW4gLT0gMTtcbiAgICB9IC8vIGZjIGFwcGVuZHMgYW4gZXh0cmEgJz0nXG4gICAgaWYgKChsZW4gJiAzKSAhPT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Jhc2UtNjQgdmFsdWUgaXMgbm90IHBhZGRlZCBjb3JyZWN0bHknKTtcbiAgICB9XG4gICAgdmFyIGdyb3VwcyA9IGxlbiA+PiAyO1xuICAgIHZhciBieXRlcyA9IGdyb3VwcyAqIDM7XG4gICAgaWYgKGxlbiA+IDAgJiYgc1tsZW4gLSAxXSA9PT0gJz0nKSB7XG4gICAgICAgIGlmIChzW2xlbiAtIDJdID09PSAnPScpIHtcbiAgICAgICAgICAgIGJ5dGVzIC09IDI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBieXRlcyAtPSAxO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBuZXcgVWludDhBcnJheShieXRlcyk7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSAwOyBncm91cCA8IGdyb3VwczsgKytncm91cCkge1xuICAgICAgICB2YXIgZGlnaXQwID0gYmFzZTY0TWFwW3MuY2hhckNvZGVBdChncm91cCAqIDQgKyAwKV07XG4gICAgICAgIHZhciBkaWdpdDEgPSBiYXNlNjRNYXBbcy5jaGFyQ29kZUF0KGdyb3VwICogNCArIDEpXTtcbiAgICAgICAgdmFyIGRpZ2l0MiA9IGJhc2U2NE1hcFtzLmNoYXJDb2RlQXQoZ3JvdXAgKiA0ICsgMildO1xuICAgICAgICB2YXIgZGlnaXQzID0gYmFzZTY0TWFwW3MuY2hhckNvZGVBdChncm91cCAqIDQgKyAzKV07XG4gICAgICAgIHJlc3VsdFtncm91cCAqIDMgKyAwXSA9IChkaWdpdDAgPDwgMikgfCAoZGlnaXQxID4+IDQpO1xuICAgICAgICBpZiAoZ3JvdXAgKiAzICsgMSA8IGJ5dGVzKSB7XG4gICAgICAgICAgICByZXN1bHRbZ3JvdXAgKiAzICsgMV0gPSAoKGRpZ2l0MSAmIDE1KSA8PCA0KSB8IChkaWdpdDIgPj4gMik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdyb3VwICogMyArIDIgPCBieXRlcykge1xuICAgICAgICAgICAgcmVzdWx0W2dyb3VwICogMyArIDJdID0gKChkaWdpdDIgJiAzKSA8PCA2KSB8IGRpZ2l0MztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbmV4cG9ydHMuYmFzZTY0VG9CaW5hcnkgPSBiYXNlNjRUb0JpbmFyeTtcbi8qKiBLZXkgdHlwZXMgdGhpcyBsaWJyYXJ5IHN1cHBvcnRzICovXG52YXIgS2V5VHlwZTtcbihmdW5jdGlvbiAoS2V5VHlwZSkge1xuICAgIEtleVR5cGVbS2V5VHlwZVtcImsxXCJdID0gMF0gPSBcImsxXCI7XG4gICAgS2V5VHlwZVtLZXlUeXBlW1wicjFcIl0gPSAxXSA9IFwicjFcIjtcbiAgICBLZXlUeXBlW0tleVR5cGVbXCJ3YVwiXSA9IDJdID0gXCJ3YVwiO1xufSkoS2V5VHlwZSA9IGV4cG9ydHMuS2V5VHlwZSB8fCAoZXhwb3J0cy5LZXlUeXBlID0ge30pKTtcbi8qKiBQdWJsaWMga2V5IGRhdGEgc2l6ZSwgZXhjbHVkaW5nIHR5cGUgZmllbGQgKi9cbmV4cG9ydHMucHVibGljS2V5RGF0YVNpemUgPSAzMztcbi8qKiBQcml2YXRlIGtleSBkYXRhIHNpemUsIGV4Y2x1ZGluZyB0eXBlIGZpZWxkICovXG5leHBvcnRzLnByaXZhdGVLZXlEYXRhU2l6ZSA9IDMyO1xuLyoqIFNpZ25hdHVyZSBkYXRhIHNpemUsIGV4Y2x1ZGluZyB0eXBlIGZpZWxkICovXG5leHBvcnRzLnNpZ25hdHVyZURhdGFTaXplID0gNjU7XG52YXIgZGlnZXN0U3VmZml4UmlwZW1kMTYwID0gZnVuY3Rpb24gKGRhdGEsIHN1ZmZpeCkge1xuICAgIHZhciBkID0gbmV3IFVpbnQ4QXJyYXkoZGF0YS5sZW5ndGggKyBzdWZmaXgubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZFtpXSA9IGRhdGFbaV07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3VmZml4Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGRbZGF0YS5sZW5ndGggKyBpXSA9IHN1ZmZpeC5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgICByZXR1cm4gcmlwZW1kMTYwKGQpO1xufTtcbnZhciBzdHJpbmdUb0tleSA9IGZ1bmN0aW9uIChzLCB0eXBlLCBzaXplLCBzdWZmaXgpIHtcbiAgICB2YXIgd2hvbGUgPSAoMCwgZXhwb3J0cy5iYXNlNThUb0JpbmFyeSkoc2l6ZSA/IHNpemUgKyA0IDogMCwgcyk7XG4gICAgdmFyIHJlc3VsdCA9IHsgdHlwZTogdHlwZSwgZGF0YTogbmV3IFVpbnQ4QXJyYXkod2hvbGUuYnVmZmVyLCAwLCB3aG9sZS5sZW5ndGggLSA0KSB9O1xuICAgIHZhciBkaWdlc3QgPSBuZXcgVWludDhBcnJheShkaWdlc3RTdWZmaXhSaXBlbWQxNjAocmVzdWx0LmRhdGEsIHN1ZmZpeCkpO1xuICAgIGlmIChkaWdlc3RbMF0gIT09IHdob2xlW3dob2xlLmxlbmd0aCAtIDRdIHx8IGRpZ2VzdFsxXSAhPT0gd2hvbGVbd2hvbGUubGVuZ3RoIC0gM11cbiAgICAgICAgfHwgZGlnZXN0WzJdICE9PSB3aG9sZVt3aG9sZS5sZW5ndGggLSAyXSB8fCBkaWdlc3RbM10gIT09IHdob2xlW3dob2xlLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY2hlY2tzdW0gZG9lc25cXCd0IG1hdGNoJyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xudmFyIGtleVRvU3RyaW5nID0gZnVuY3Rpb24gKGtleSwgc3VmZml4LCBwcmVmaXgpIHtcbiAgICB2YXIgZGlnZXN0ID0gbmV3IFVpbnQ4QXJyYXkoZGlnZXN0U3VmZml4UmlwZW1kMTYwKGtleS5kYXRhLCBzdWZmaXgpKTtcbiAgICB2YXIgd2hvbGUgPSBuZXcgVWludDhBcnJheShrZXkuZGF0YS5sZW5ndGggKyA0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleS5kYXRhLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHdob2xlW2ldID0ga2V5LmRhdGFbaV07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgKytpKSB7XG4gICAgICAgIHdob2xlW2kgKyBrZXkuZGF0YS5sZW5ndGhdID0gZGlnZXN0W2ldO1xuICAgIH1cbiAgICByZXR1cm4gcHJlZml4ICsgKDAsIGV4cG9ydHMuYmluYXJ5VG9CYXNlNTgpKHdob2xlKTtcbn07XG4vKiogQ29udmVydCBrZXkgaW4gYHNgIHRvIGJpbmFyeSBmb3JtICovXG52YXIgc3RyaW5nVG9QdWJsaWNLZXkgPSBmdW5jdGlvbiAocykge1xuICAgIGlmICh0eXBlb2YgcyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdleHBlY3RlZCBzdHJpbmcgY29udGFpbmluZyBwdWJsaWMga2V5Jyk7XG4gICAgfVxuICAgIGlmIChzLnN1YnN0cigwLCAzKSA9PT0gJ0VPUycpIHtcbiAgICAgICAgdmFyIHdob2xlID0gKDAsIGV4cG9ydHMuYmFzZTU4VG9CaW5hcnkpKGV4cG9ydHMucHVibGljS2V5RGF0YVNpemUgKyA0LCBzLnN1YnN0cigzKSk7XG4gICAgICAgIHZhciBrZXkgPSB7IHR5cGU6IEtleVR5cGUuazEsIGRhdGE6IG5ldyBVaW50OEFycmF5KGV4cG9ydHMucHVibGljS2V5RGF0YVNpemUpIH07XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhwb3J0cy5wdWJsaWNLZXlEYXRhU2l6ZTsgKytpKSB7XG4gICAgICAgICAgICBrZXkuZGF0YVtpXSA9IHdob2xlW2ldO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkaWdlc3QgPSBuZXcgVWludDhBcnJheShyaXBlbWQxNjAoa2V5LmRhdGEpKTtcbiAgICAgICAgaWYgKGRpZ2VzdFswXSAhPT0gd2hvbGVbZXhwb3J0cy5wdWJsaWNLZXlEYXRhU2l6ZV0gfHwgZGlnZXN0WzFdICE9PSB3aG9sZVszNF1cbiAgICAgICAgICAgIHx8IGRpZ2VzdFsyXSAhPT0gd2hvbGVbMzVdIHx8IGRpZ2VzdFszXSAhPT0gd2hvbGVbMzZdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NoZWNrc3VtIGRvZXNuXFwndCBtYXRjaCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHMuc3Vic3RyKDAsIDcpID09PSAnUFVCX0sxXycpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZ1RvS2V5KHMuc3Vic3RyKDcpLCBLZXlUeXBlLmsxLCBleHBvcnRzLnB1YmxpY0tleURhdGFTaXplLCAnSzEnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocy5zdWJzdHIoMCwgNykgPT09ICdQVUJfUjFfJykge1xuICAgICAgICByZXR1cm4gc3RyaW5nVG9LZXkocy5zdWJzdHIoNyksIEtleVR5cGUucjEsIGV4cG9ydHMucHVibGljS2V5RGF0YVNpemUsICdSMScpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzLnN1YnN0cigwLCA3KSA9PT0gJ1BVQl9XQV8nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdUb0tleShzLnN1YnN0cig3KSwgS2V5VHlwZS53YSwgMCwgJ1dBJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VucmVjb2duaXplZCBwdWJsaWMga2V5IGZvcm1hdCcpO1xuICAgIH1cbn07XG5leHBvcnRzLnN0cmluZ1RvUHVibGljS2V5ID0gc3RyaW5nVG9QdWJsaWNLZXk7XG4vKiogQ29udmVydCBwdWJsaWMgYGtleWAgdG8gbGVnYWN5IHN0cmluZyAoYmFzZS01OCkgZm9ybSAqL1xudmFyIHB1YmxpY0tleVRvTGVnYWN5U3RyaW5nID0gZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChrZXkudHlwZSA9PT0gS2V5VHlwZS5rMSAmJiBrZXkuZGF0YS5sZW5ndGggPT09IGV4cG9ydHMucHVibGljS2V5RGF0YVNpemUpIHtcbiAgICAgICAgcmV0dXJuIGtleVRvU3RyaW5nKGtleSwgJycsICdFT1MnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoa2V5LnR5cGUgPT09IEtleVR5cGUucjEgfHwga2V5LnR5cGUgPT09IEtleVR5cGUud2EpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZXkgZm9ybWF0IG5vdCBzdXBwb3J0ZWQgaW4gbGVnYWN5IGNvbnZlcnNpb24nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5yZWNvZ25pemVkIHB1YmxpYyBrZXkgZm9ybWF0Jyk7XG4gICAgfVxufTtcbmV4cG9ydHMucHVibGljS2V5VG9MZWdhY3lTdHJpbmcgPSBwdWJsaWNLZXlUb0xlZ2FjeVN0cmluZztcbi8qKiBDb252ZXJ0IGBrZXlgIHRvIHN0cmluZyAoYmFzZS01OCkgZm9ybSAqL1xudmFyIHB1YmxpY0tleVRvU3RyaW5nID0gZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChrZXkudHlwZSA9PT0gS2V5VHlwZS5rMSAmJiBrZXkuZGF0YS5sZW5ndGggPT09IGV4cG9ydHMucHVibGljS2V5RGF0YVNpemUpIHtcbiAgICAgICAgcmV0dXJuIGtleVRvU3RyaW5nKGtleSwgJ0sxJywgJ1BVQl9LMV8nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoa2V5LnR5cGUgPT09IEtleVR5cGUucjEgJiYga2V5LmRhdGEubGVuZ3RoID09PSBleHBvcnRzLnB1YmxpY0tleURhdGFTaXplKSB7XG4gICAgICAgIHJldHVybiBrZXlUb1N0cmluZyhrZXksICdSMScsICdQVUJfUjFfJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGtleS50eXBlID09PSBLZXlUeXBlLndhKSB7XG4gICAgICAgIHJldHVybiBrZXlUb1N0cmluZyhrZXksICdXQScsICdQVUJfV0FfJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VucmVjb2duaXplZCBwdWJsaWMga2V5IGZvcm1hdCcpO1xuICAgIH1cbn07XG5leHBvcnRzLnB1YmxpY0tleVRvU3RyaW5nID0gcHVibGljS2V5VG9TdHJpbmc7XG4vKiogSWYgYSBrZXkgaXMgaW4gdGhlIGxlZ2FjeSBmb3JtYXQgKGBFT1NgIHByZWZpeCksIHRoZW4gY29udmVydCBpdCB0byB0aGUgbmV3IGZvcm1hdCAoYFBVQl9LMV9gKS5cbiAqIExlYXZlcyBvdGhlciBmb3JtYXRzIHVudG91Y2hlZFxuICovXG52YXIgY29udmVydExlZ2FjeVB1YmxpY0tleSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgaWYgKHMuc3Vic3RyKDAsIDMpID09PSAnRU9TJykge1xuICAgICAgICByZXR1cm4gKDAsIGV4cG9ydHMucHVibGljS2V5VG9TdHJpbmcpKCgwLCBleHBvcnRzLnN0cmluZ1RvUHVibGljS2V5KShzKSk7XG4gICAgfVxuICAgIHJldHVybiBzO1xufTtcbmV4cG9ydHMuY29udmVydExlZ2FjeVB1YmxpY0tleSA9IGNvbnZlcnRMZWdhY3lQdWJsaWNLZXk7XG4vKiogSWYgYSBrZXkgaXMgaW4gdGhlIGxlZ2FjeSBmb3JtYXQgKGBFT1NgIHByZWZpeCksIHRoZW4gY29udmVydCBpdCB0byB0aGUgbmV3IGZvcm1hdCAoYFBVQl9LMV9gKS5cbiAqIExlYXZlcyBvdGhlciBmb3JtYXRzIHVudG91Y2hlZFxuICovXG52YXIgY29udmVydExlZ2FjeVB1YmxpY0tleXMgPSBmdW5jdGlvbiAoa2V5cykge1xuICAgIHJldHVybiBrZXlzLm1hcChleHBvcnRzLmNvbnZlcnRMZWdhY3lQdWJsaWNLZXkpO1xufTtcbmV4cG9ydHMuY29udmVydExlZ2FjeVB1YmxpY0tleXMgPSBjb252ZXJ0TGVnYWN5UHVibGljS2V5cztcbi8qKiBDb252ZXJ0IGtleSBpbiBgc2AgdG8gYmluYXJ5IGZvcm0gKi9cbnZhciBzdHJpbmdUb1ByaXZhdGVLZXkgPSBmdW5jdGlvbiAocykge1xuICAgIGlmICh0eXBlb2YgcyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdleHBlY3RlZCBzdHJpbmcgY29udGFpbmluZyBwcml2YXRlIGtleScpO1xuICAgIH1cbiAgICBpZiAocy5zdWJzdHIoMCwgNykgPT09ICdQVlRfUjFfJykge1xuICAgICAgICByZXR1cm4gc3RyaW5nVG9LZXkocy5zdWJzdHIoNyksIEtleVR5cGUucjEsIGV4cG9ydHMucHJpdmF0ZUtleURhdGFTaXplLCAnUjEnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocy5zdWJzdHIoMCwgNykgPT09ICdQVlRfSzFfJykge1xuICAgICAgICByZXR1cm4gc3RyaW5nVG9LZXkocy5zdWJzdHIoNyksIEtleVR5cGUuazEsIGV4cG9ydHMucHJpdmF0ZUtleURhdGFTaXplLCAnSzEnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIHRvZG86IFZlcmlmeSBjaGVja3N1bTogc2hhMjU2KHNoYTI1NihrZXkuZGF0YSkpLlxuICAgICAgICAvLyAgICAgICBOb3QgY3JpdGljYWwgc2luY2UgYSBiYWQga2V5IHdpbGwgZmFpbCB0byBwcm9kdWNlIGFcbiAgICAgICAgLy8gICAgICAgdmFsaWQgc2lnbmF0dXJlIGFueXdheS5cbiAgICAgICAgdmFyIHdob2xlID0gKDAsIGV4cG9ydHMuYmFzZTU4VG9CaW5hcnkpKGV4cG9ydHMucHJpdmF0ZUtleURhdGFTaXplICsgNSwgcyk7XG4gICAgICAgIHZhciBrZXkgPSB7IHR5cGU6IEtleVR5cGUuazEsIGRhdGE6IG5ldyBVaW50OEFycmF5KGV4cG9ydHMucHJpdmF0ZUtleURhdGFTaXplKSB9O1xuICAgICAgICBpZiAod2hvbGVbMF0gIT09IDB4ODApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndW5yZWNvZ25pemVkIHByaXZhdGUga2V5IHR5cGUnKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cG9ydHMucHJpdmF0ZUtleURhdGFTaXplOyArK2kpIHtcbiAgICAgICAgICAgIGtleS5kYXRhW2ldID0gd2hvbGVbaSArIDFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxufTtcbmV4cG9ydHMuc3RyaW5nVG9Qcml2YXRlS2V5ID0gc3RyaW5nVG9Qcml2YXRlS2V5O1xuLyoqIENvbnZlcnQgcHJpdmF0ZSBga2V5YCB0byBsZWdhY3kgc3RyaW5nIChiYXNlLTU4KSBmb3JtICovXG52YXIgcHJpdmF0ZUtleVRvTGVnYWN5U3RyaW5nID0gZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChrZXkudHlwZSA9PT0gS2V5VHlwZS5rMSAmJiBrZXkuZGF0YS5sZW5ndGggPT09IGV4cG9ydHMucHJpdmF0ZUtleURhdGFTaXplKSB7XG4gICAgICAgIHZhciB3aG9sZV8xID0gW107XG4gICAgICAgIHdob2xlXzEucHVzaCgxMjgpO1xuICAgICAgICBrZXkuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChieXRlKSB7IHJldHVybiB3aG9sZV8xLnB1c2goYnl0ZSk7IH0pO1xuICAgICAgICB2YXIgZGlnZXN0ID0gbmV3IFVpbnQ4QXJyYXkoKDAsIGhhc2hfanNfMS5zaGEyNTYpKCkudXBkYXRlKCgwLCBoYXNoX2pzXzEuc2hhMjU2KSgpLnVwZGF0ZSh3aG9sZV8xKS5kaWdlc3QoKSkuZGlnZXN0KCkpO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkoZXhwb3J0cy5wcml2YXRlS2V5RGF0YVNpemUgKyA1KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3aG9sZV8xLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHRbaV0gPSB3aG9sZV8xW2ldO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHRbaSArIHdob2xlXzEubGVuZ3RoXSA9IGRpZ2VzdFtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKDAsIGV4cG9ydHMuYmluYXJ5VG9CYXNlNTgpKHJlc3VsdCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGtleS50eXBlID09PSBLZXlUeXBlLnIxIHx8IGtleS50eXBlID09PSBLZXlUeXBlLndhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignS2V5IGZvcm1hdCBub3Qgc3VwcG9ydGVkIGluIGxlZ2FjeSBjb252ZXJzaW9uJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VucmVjb2duaXplZCBwdWJsaWMga2V5IGZvcm1hdCcpO1xuICAgIH1cbn07XG5leHBvcnRzLnByaXZhdGVLZXlUb0xlZ2FjeVN0cmluZyA9IHByaXZhdGVLZXlUb0xlZ2FjeVN0cmluZztcbi8qKiBDb252ZXJ0IGBrZXlgIHRvIHN0cmluZyAoYmFzZS01OCkgZm9ybSAqL1xudmFyIHByaXZhdGVLZXlUb1N0cmluZyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoa2V5LnR5cGUgPT09IEtleVR5cGUucjEpIHtcbiAgICAgICAgcmV0dXJuIGtleVRvU3RyaW5nKGtleSwgJ1IxJywgJ1BWVF9SMV8nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoa2V5LnR5cGUgPT09IEtleVR5cGUuazEpIHtcbiAgICAgICAgcmV0dXJuIGtleVRvU3RyaW5nKGtleSwgJ0sxJywgJ1BWVF9LMV8nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5yZWNvZ25pemVkIHByaXZhdGUga2V5IGZvcm1hdCcpO1xuICAgIH1cbn07XG5leHBvcnRzLnByaXZhdGVLZXlUb1N0cmluZyA9IHByaXZhdGVLZXlUb1N0cmluZztcbi8qKiBDb252ZXJ0IGtleSBpbiBgc2AgdG8gYmluYXJ5IGZvcm0gKi9cbnZhciBzdHJpbmdUb1NpZ25hdHVyZSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgaWYgKHR5cGVvZiBzICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIHN0cmluZyBjb250YWluaW5nIHNpZ25hdHVyZScpO1xuICAgIH1cbiAgICBpZiAocy5zdWJzdHIoMCwgNykgPT09ICdTSUdfSzFfJykge1xuICAgICAgICByZXR1cm4gc3RyaW5nVG9LZXkocy5zdWJzdHIoNyksIEtleVR5cGUuazEsIGV4cG9ydHMuc2lnbmF0dXJlRGF0YVNpemUsICdLMScpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzLnN1YnN0cigwLCA3KSA9PT0gJ1NJR19SMV8nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdUb0tleShzLnN1YnN0cig3KSwgS2V5VHlwZS5yMSwgZXhwb3J0cy5zaWduYXR1cmVEYXRhU2l6ZSwgJ1IxJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHMuc3Vic3RyKDAsIDcpID09PSAnU0lHX1dBXycpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZ1RvS2V5KHMuc3Vic3RyKDcpLCBLZXlUeXBlLndhLCAwLCAnV0EnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5yZWNvZ25pemVkIHNpZ25hdHVyZSBmb3JtYXQnKTtcbiAgICB9XG59O1xuZXhwb3J0cy5zdHJpbmdUb1NpZ25hdHVyZSA9IHN0cmluZ1RvU2lnbmF0dXJlO1xuLyoqIENvbnZlcnQgYHNpZ25hdHVyZWAgdG8gc3RyaW5nIChiYXNlLTU4KSBmb3JtICovXG52YXIgc2lnbmF0dXJlVG9TdHJpbmcgPSBmdW5jdGlvbiAoc2lnbmF0dXJlKSB7XG4gICAgaWYgKHNpZ25hdHVyZS50eXBlID09PSBLZXlUeXBlLmsxKSB7XG4gICAgICAgIHJldHVybiBrZXlUb1N0cmluZyhzaWduYXR1cmUsICdLMScsICdTSUdfSzFfJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNpZ25hdHVyZS50eXBlID09PSBLZXlUeXBlLnIxKSB7XG4gICAgICAgIHJldHVybiBrZXlUb1N0cmluZyhzaWduYXR1cmUsICdSMScsICdTSUdfUjFfJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNpZ25hdHVyZS50eXBlID09PSBLZXlUeXBlLndhKSB7XG4gICAgICAgIHJldHVybiBrZXlUb1N0cmluZyhzaWduYXR1cmUsICdXQScsICdTSUdfV0FfJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VucmVjb2duaXplZCBzaWduYXR1cmUgZm9ybWF0Jyk7XG4gICAgfVxufTtcbmV4cG9ydHMuc2lnbmF0dXJlVG9TdHJpbmcgPSBzaWduYXR1cmVUb1N0cmluZztcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBAbW9kdWxlIFNlcmlhbGl6ZVxuICovXG4vLyBjb3B5cmlnaHQgZGVmaW5lZCBpbiBlb3Nqcy9MSUNFTlNFLnR4dFxuLyogZXNsaW50LWRpc2FibGUgbWF4LWNsYXNzZXMtcGVyLWZpbGUgKi9cbi8qIGVzbGludC1kaXNhYmxlIGpzZG9jL2NoZWNrLWluZGVudGF0aW9uICovXG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fcmVhZCA9ICh0aGlzICYmIHRoaXMuX19yZWFkKSB8fCBmdW5jdGlvbiAobywgbikge1xuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcbiAgICBpZiAoIW0pIHJldHVybiBvO1xuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xuICAgIHRyeSB7XG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxuICAgIH1cbiAgICByZXR1cm4gYXI7XG59O1xudmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xudmFyIF9fdmFsdWVzID0gKHRoaXMgJiYgdGhpcy5fX3ZhbHVlcykgfHwgZnVuY3Rpb24obykge1xuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zZXJpYWxpemVRdWVyeSA9IGV4cG9ydHMuZGVzZXJpYWxpemVBbnlBcnJheSA9IGV4cG9ydHMuc2VyaWFsaXplQW55QXJyYXkgPSBleHBvcnRzLmRlc2VyaWFsaXplQW55T2JqZWN0ID0gZXhwb3J0cy5zZXJpYWxpemVBbnlPYmplY3QgPSBleHBvcnRzLmRlc2VyaWFsaXplQW55dmFyU2hvcnQgPSBleHBvcnRzLmRlc2VyaWFsaXplQW55dmFyID0gZXhwb3J0cy5zZXJpYWxpemVBbnl2YXIgPSBleHBvcnRzLmRlc2VyaWFsaXplQWN0aW9uID0gZXhwb3J0cy5kZXNlcmlhbGl6ZUFjdGlvbkRhdGEgPSBleHBvcnRzLnNlcmlhbGl6ZUFjdGlvbiA9IGV4cG9ydHMuc2VyaWFsaXplQWN0aW9uRGF0YSA9IGV4cG9ydHMudHJhbnNhY3Rpb25IZWFkZXIgPSBleHBvcnRzLmdldFR5cGVzRnJvbUFiaSA9IGV4cG9ydHMuZ2V0VHlwZSA9IGV4cG9ydHMuY3JlYXRlVHJhbnNhY3Rpb25UeXBlcyA9IGV4cG9ydHMuY3JlYXRlVHJhbnNhY3Rpb25FeHRlbnNpb25UeXBlcyA9IGV4cG9ydHMuY3JlYXRlQWJpVHlwZXMgPSBleHBvcnRzLmNyZWF0ZUluaXRpYWxUeXBlcyA9IGV4cG9ydHMuaGV4VG9VaW50OEFycmF5ID0gZXhwb3J0cy5hcnJheVRvSGV4ID0gZXhwb3J0cy5zeW1ib2xUb1N0cmluZyA9IGV4cG9ydHMuc3RyaW5nVG9TeW1ib2wgPSBleHBvcnRzLmJsb2NrVGltZXN0YW1wVG9EYXRlID0gZXhwb3J0cy5kYXRlVG9CbG9ja1RpbWVzdGFtcCA9IGV4cG9ydHMudGltZVBvaW50U2VjVG9EYXRlID0gZXhwb3J0cy5kYXRlVG9UaW1lUG9pbnRTZWMgPSBleHBvcnRzLnRpbWVQb2ludFRvRGF0ZSA9IGV4cG9ydHMuZGF0ZVRvVGltZVBvaW50ID0gZXhwb3J0cy5zdXBwb3J0ZWRBYmlWZXJzaW9uID0gZXhwb3J0cy5TZXJpYWxCdWZmZXIgPSBleHBvcnRzLlNlcmlhbGl6ZXJTdGF0ZSA9IHZvaWQgMDtcbnZhciBudW1lcmljID0gcmVxdWlyZShcIi4vZW9zanMtbnVtZXJpY1wiKTtcbi8qKiBTdGF0ZSBmb3Igc2VyaWFsaXplKCkgYW5kIGRlc2VyaWFsaXplKCkgKi9cbnZhciBTZXJpYWxpemVyU3RhdGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2VyaWFsaXplclN0YXRlKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICAgICAgLyoqIEhhdmUgYW55IGJpbmFyeSBleHRlbnNpb25zIGJlZW4gc2tpcHBlZD8gKi9cbiAgICAgICAgdGhpcy5za2lwcGVkQmluYXJ5RXh0ZW5zaW9uID0gZmFsc2U7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIHJldHVybiBTZXJpYWxpemVyU3RhdGU7XG59KCkpO1xuZXhwb3J0cy5TZXJpYWxpemVyU3RhdGUgPSBTZXJpYWxpemVyU3RhdGU7XG4vKiogU2VyaWFsaXplIGFuZCBkZXNlcmlhbGl6ZSBkYXRhICovXG52YXIgU2VyaWFsQnVmZmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBfX25hbWVkUGFyYW1ldGVyc1xuICAgICAqIGBhcnJheWA6IGBudWxsYCBpZiBzZXJpYWxpemluZywgb3IgYmluYXJ5IGRhdGEgdG8gZGVzZXJpYWxpemVcbiAgICAgKiBgdGV4dEVuY29kZXJgOiBgVGV4dEVuY29kZXJgIGluc3RhbmNlIHRvIHVzZS4gUGFzcyBpbiBgbnVsbGAgaWYgcnVubmluZyBpbiBhIGJyb3dzZXJcbiAgICAgKiBgdGV4dERlY29kZXJgOiBgVGV4dERlY2lkZXJgIGluc3RhbmNlIHRvIHVzZS4gUGFzcyBpbiBgbnVsbGAgaWYgcnVubmluZyBpbiBhIGJyb3dzZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBTZXJpYWxCdWZmZXIoX2EpIHtcbiAgICAgICAgdmFyIF9iID0gX2EgPT09IHZvaWQgMCA/IHt9IDogX2EsIHRleHRFbmNvZGVyID0gX2IudGV4dEVuY29kZXIsIHRleHREZWNvZGVyID0gX2IudGV4dERlY29kZXIsIGFycmF5ID0gX2IuYXJyYXk7XG4gICAgICAgIC8qKiBDdXJyZW50IHBvc2l0aW9uIHdoaWxlIHJlYWRpbmcgKGRlc2VyaWFsaXppbmcpICovXG4gICAgICAgIHRoaXMucmVhZFBvcyA9IDA7XG4gICAgICAgIHRoaXMuYXJyYXkgPSBhcnJheSB8fCBuZXcgVWludDhBcnJheSgxMDI0KTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gICAgICAgIHRoaXMudGV4dEVuY29kZXIgPSB0ZXh0RW5jb2RlciB8fCBuZXcgVGV4dEVuY29kZXIoKTtcbiAgICAgICAgdGhpcy50ZXh0RGVjb2RlciA9IHRleHREZWNvZGVyIHx8IG5ldyBUZXh0RGVjb2RlcigndXRmLTgnLCB7IGZhdGFsOiB0cnVlIH0pO1xuICAgIH1cbiAgICAvKiogUmVzaXplIGBhcnJheWAgaWYgbmVlZGVkIHRvIGhhdmUgYXQgbGVhc3QgYHNpemVgIGJ5dGVzIGZyZWUgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnJlc2VydmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICAgICAgICBpZiAodGhpcy5sZW5ndGggKyBzaXplIDw9IHRoaXMuYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGwgPSB0aGlzLmFycmF5Lmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKHRoaXMubGVuZ3RoICsgc2l6ZSA+IGwpIHtcbiAgICAgICAgICAgIGwgPSBNYXRoLmNlaWwobCAqIDEuNSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5ld0FycmF5ID0gbmV3IFVpbnQ4QXJyYXkobCk7XG4gICAgICAgIG5ld0FycmF5LnNldCh0aGlzLmFycmF5KTtcbiAgICAgICAgdGhpcy5hcnJheSA9IG5ld0FycmF5O1xuICAgIH07XG4gICAgLyoqIElzIHRoZXJlIGRhdGEgYXZhaWxhYmxlIHRvIHJlYWQ/ICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5oYXZlUmVhZERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWRQb3MgPCB0aGlzLmxlbmd0aDtcbiAgICB9O1xuICAgIC8qKiBSZXN0YXJ0IHJlYWRpbmcgZnJvbSB0aGUgYmVnaW5uaW5nICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5yZXN0YXJ0UmVhZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZWFkUG9zID0gMDtcbiAgICB9O1xuICAgIC8qKiBSZXR1cm4gZGF0YSB3aXRoIGV4Y2VzcyBzdG9yYWdlIHRyaW1tZWQgYXdheSAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUuYXNVaW50OEFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkodGhpcy5hcnJheS5idWZmZXIsIHRoaXMuYXJyYXkuYnl0ZU9mZnNldCwgdGhpcy5sZW5ndGgpO1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBieXRlcyAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaEFycmF5ID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdGhpcy5yZXNlcnZlKHYubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5hcnJheS5zZXQodiwgdGhpcy5sZW5ndGgpO1xuICAgICAgICB0aGlzLmxlbmd0aCArPSB2Lmxlbmd0aDtcbiAgICB9O1xuICAgIC8qKiBBcHBlbmQgYnl0ZXMgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2ID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2W19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wdXNoQXJyYXkodik7XG4gICAgfTtcbiAgICAvKiogR2V0IGEgc2luZ2xlIGJ5dGUgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZFBvcyA8IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcnJheVt0aGlzLnJlYWRQb3MrK107XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWFkIHBhc3QgZW5kIG9mIGJ1ZmZlcicpO1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBieXRlcyBpbiBgdmAuIFRocm93cyBpZiBgbGVuYCBkb2Vzbid0IG1hdGNoIGB2Lmxlbmd0aGAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2hVaW50OEFycmF5Q2hlY2tlZCA9IGZ1bmN0aW9uICh2LCBsZW4pIHtcbiAgICAgICAgaWYgKHYubGVuZ3RoICE9PSBsZW4pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmluYXJ5IGRhdGEgaGFzIGluY29ycmVjdCBzaXplJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wdXNoQXJyYXkodik7XG4gICAgfTtcbiAgICAvKiogR2V0IGBsZW5gIGJ5dGVzICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5nZXRVaW50OEFycmF5ID0gZnVuY3Rpb24gKGxlbikge1xuICAgICAgICBpZiAodGhpcy5yZWFkUG9zICsgbGVuID4gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVhZCBwYXN0IGVuZCBvZiBidWZmZXInKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5hcnJheS5idWZmZXIsIHRoaXMuYXJyYXkuYnl0ZU9mZnNldCArIHRoaXMucmVhZFBvcywgbGVuKTtcbiAgICAgICAgdGhpcy5yZWFkUG9zICs9IGxlbjtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIC8qKiBTa2lwIGBsZW5gIGJ5dGVzICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5za2lwID0gZnVuY3Rpb24gKGxlbikge1xuICAgICAgICBpZiAodGhpcy5yZWFkUG9zICsgbGVuID4gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVhZCBwYXN0IGVuZCBvZiBidWZmZXInKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlYWRQb3MgKz0gbGVuO1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBhIGB1aW50MTZgICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5wdXNoVWludDE2ID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdGhpcy5wdXNoKCh2ID4+IDApICYgMHhmZiwgKHYgPj4gOCkgJiAweGZmKTtcbiAgICB9O1xuICAgIC8qKiBHZXQgYSBgdWludDE2YCAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUuZ2V0VWludDE2ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdiA9IDA7XG4gICAgICAgIHYgfD0gdGhpcy5nZXQoKSA8PCAwO1xuICAgICAgICB2IHw9IHRoaXMuZ2V0KCkgPDwgODtcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGEgYHVpbnQzMmAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2hVaW50MzIgPSBmdW5jdGlvbiAodikge1xuICAgICAgICB0aGlzLnB1c2goKHYgPj4gMCkgJiAweGZmLCAodiA+PiA4KSAmIDB4ZmYsICh2ID4+IDE2KSAmIDB4ZmYsICh2ID4+IDI0KSAmIDB4ZmYpO1xuICAgIH07XG4gICAgLyoqIEdldCBhIGB1aW50MzJgICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5nZXRVaW50MzIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2ID0gMDtcbiAgICAgICAgdiB8PSB0aGlzLmdldCgpIDw8IDA7XG4gICAgICAgIHYgfD0gdGhpcy5nZXQoKSA8PCA4O1xuICAgICAgICB2IHw9IHRoaXMuZ2V0KCkgPDwgMTY7XG4gICAgICAgIHYgfD0gdGhpcy5nZXQoKSA8PCAyNDtcbiAgICAgICAgcmV0dXJuIHYgPj4+IDA7XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGEgYHVpbnQ2NGAuICpDYXV0aW9uKjogYG51bWJlcmAgb25seSBoYXMgNTMgYml0cyBvZiBwcmVjaXNpb24gKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2hOdW1iZXJBc1VpbnQ2NCA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHRoaXMucHVzaFVpbnQzMih2ID4+PiAwKTtcbiAgICAgICAgdGhpcy5wdXNoVWludDMyKE1hdGguZmxvb3IodiAvIDQyOTQ5NjcyOTYpID4+PiAwKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBhIGB1aW50NjRgIGFzIGEgYG51bWJlcmAuICpDYXV0aW9uKjogYG51bWJlcmAgb25seSBoYXMgNTMgYml0cyBvZiBwcmVjaXNpb247IHNvbWUgdmFsdWVzIHdpbGwgY2hhbmdlLlxuICAgICAqIGBudW1lcmljLmJpbmFyeVRvRGVjaW1hbChzZXJpYWxCdWZmZXIuZ2V0VWludDhBcnJheSg4KSlgIHJlY29tbWVuZGVkIGluc3RlYWRcbiAgICAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldFVpbnQ2NEFzTnVtYmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbG93ID0gdGhpcy5nZXRVaW50MzIoKTtcbiAgICAgICAgdmFyIGhpZ2ggPSB0aGlzLmdldFVpbnQzMigpO1xuICAgICAgICByZXR1cm4gKGhpZ2ggPj4+IDApICogNDI5NDk2NzI5NiArIChsb3cgPj4+IDApO1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBhIGB2YXJ1aW50MzJgICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5wdXNoVmFydWludDMyID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGlmICh2ID4+PiA3KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoKDB4ODAgfCAodiAmIDB4N2YpKTtcbiAgICAgICAgICAgICAgICB2ID0gdiA+Pj4gNztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucHVzaCh2KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqIEdldCBhIGB2YXJ1aW50MzJgICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5nZXRWYXJ1aW50MzIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2ID0gMDtcbiAgICAgICAgdmFyIGJpdCA9IDA7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB2YXIgYiA9IHRoaXMuZ2V0KCk7XG4gICAgICAgICAgICB2IHw9IChiICYgMHg3ZikgPDwgYml0O1xuICAgICAgICAgICAgYml0ICs9IDc7XG4gICAgICAgICAgICBpZiAoIShiICYgMHg4MCkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdiA+Pj4gMDtcbiAgICB9O1xuICAgIC8qKiBBcHBlbmQgYSBgdmFyaW50MzJgICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5wdXNoVmFyaW50MzIgPSBmdW5jdGlvbiAodikge1xuICAgICAgICB0aGlzLnB1c2hWYXJ1aW50MzIoKHYgPDwgMSkgXiAodiA+PiAzMSkpO1xuICAgIH07XG4gICAgLyoqIEdldCBhIGB2YXJpbnQzMmAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldFZhcmludDMyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdiA9IHRoaXMuZ2V0VmFydWludDMyKCk7XG4gICAgICAgIGlmICh2ICYgMSkge1xuICAgICAgICAgICAgcmV0dXJuICgofnYpID4+IDEpIHwgMjE0NzQ4MzY0ODtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2ID4+PiAxO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGEgYGZsb2F0MzJgICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5wdXNoRmxvYXQzMiA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHRoaXMucHVzaEFycmF5KG5ldyBVaW50OEFycmF5KChuZXcgRmxvYXQzMkFycmF5KFt2XSkpLmJ1ZmZlcikpO1xuICAgIH07XG4gICAgLyoqIEdldCBhIGBmbG9hdDMyYCAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUuZ2V0RmxvYXQzMiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkodGhpcy5nZXRVaW50OEFycmF5KDQpLnNsaWNlKCkuYnVmZmVyKVswXTtcbiAgICB9O1xuICAgIC8qKiBBcHBlbmQgYSBgZmxvYXQ2NGAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2hGbG9hdDY0ID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdGhpcy5wdXNoQXJyYXkobmV3IFVpbnQ4QXJyYXkoKG5ldyBGbG9hdDY0QXJyYXkoW3ZdKSkuYnVmZmVyKSk7XG4gICAgfTtcbiAgICAvKiogR2V0IGEgYGZsb2F0NjRgICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5nZXRGbG9hdDY0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0NjRBcnJheSh0aGlzLmdldFVpbnQ4QXJyYXkoOCkuc2xpY2UoKS5idWZmZXIpWzBdO1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBhIGBuYW1lYCAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaE5hbWUgPSBmdW5jdGlvbiAocykge1xuICAgICAgICBpZiAodHlwZW9mIHMgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHN0cmluZyBjb250YWluaW5nIG5hbWUnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKC9eWy4xLTVhLXpdezAsMTJ9Wy4xLTVhLWpdPyQvKTtcbiAgICAgICAgaWYgKCFyZWdleC50ZXN0KHMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05hbWUgc2hvdWxkIGJlIGxlc3MgdGhhbiAxMyBjaGFyYWN0ZXJzLCBvciBsZXNzIHRoYW4gMTQgaWYgbGFzdCBjaGFyYWN0ZXIgaXMgYmV0d2VlbiAxLTUgb3IgYS1qLCBhbmQgb25seSBjb250YWluIHRoZSBmb2xsb3dpbmcgc3ltYm9scyAuMTIzNDVhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNoYXJUb1N5bWJvbCA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICBpZiAoYyA+PSAnYScuY2hhckNvZGVBdCgwKSAmJiBjIDw9ICd6Jy5jaGFyQ29kZUF0KDApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChjIC0gJ2EnLmNoYXJDb2RlQXQoMCkpICsgNjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjID49ICcxJy5jaGFyQ29kZUF0KDApICYmIGMgPD0gJzUnLmNoYXJDb2RlQXQoMCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGMgLSAnMScuY2hhckNvZGVBdCgwKSkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBhID0gbmV3IFVpbnQ4QXJyYXkoOCk7XG4gICAgICAgIHZhciBiaXQgPSA2MztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB2YXIgYyA9IGNoYXJUb1N5bWJvbChzLmNoYXJDb2RlQXQoaSkpO1xuICAgICAgICAgICAgaWYgKGJpdCA8IDUpIHtcbiAgICAgICAgICAgICAgICBjID0gYyA8PCAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDQ7IGogPj0gMDsgLS1qKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJpdCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFbTWF0aC5mbG9vcihiaXQgLyA4KV0gfD0gKChjID4+IGopICYgMSkgPDwgKGJpdCAlIDgpO1xuICAgICAgICAgICAgICAgICAgICAtLWJpdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wdXNoQXJyYXkoYSk7XG4gICAgfTtcbiAgICAvKiogR2V0IGEgYG5hbWVgICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5nZXROYW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYSA9IHRoaXMuZ2V0VWludDhBcnJheSg4KTtcbiAgICAgICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgICAgICBmb3IgKHZhciBiaXQgPSA2MzsgYml0ID49IDA7KSB7XG4gICAgICAgICAgICB2YXIgYyA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDU7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChiaXQgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjID0gKGMgPDwgMSkgfCAoKGFbTWF0aC5mbG9vcihiaXQgLyA4KV0gPj4gKGJpdCAlIDgpKSAmIDEpO1xuICAgICAgICAgICAgICAgICAgICAtLWJpdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYyA+PSA2KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyArICdhJy5jaGFyQ29kZUF0KDApIC0gNik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjID49IDEpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjICsgJzEnLmNoYXJDb2RlQXQoMCkgLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnLic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHJlc3VsdC5lbmRzV2l0aCgnLicpKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuc3Vic3RyKDAsIHJlc3VsdC5sZW5ndGggLSAxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBsZW5ndGgtcHJlZml4ZWQgYmluYXJ5IGRhdGEgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2hCeXRlcyA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHRoaXMucHVzaFZhcnVpbnQzMih2Lmxlbmd0aCk7XG4gICAgICAgIHRoaXMucHVzaEFycmF5KHYpO1xuICAgIH07XG4gICAgLyoqIEdldCBsZW5ndGgtcHJlZml4ZWQgYmluYXJ5IGRhdGEgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldEJ5dGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRVaW50OEFycmF5KHRoaXMuZ2V0VmFydWludDMyKCkpO1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBhIHN0cmluZyAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaFN0cmluZyA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHRoaXMucHVzaEJ5dGVzKHRoaXMudGV4dEVuY29kZXIuZW5jb2RlKHYpKTtcbiAgICB9O1xuICAgIC8qKiBHZXQgYSBzdHJpbmcgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldFN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dERlY29kZXIuZGVjb2RlKHRoaXMuZ2V0Qnl0ZXMoKSk7XG4gICAgfTtcbiAgICAvKiogQXBwZW5kIGEgYHN5bWJvbF9jb2RlYC4gVW5saWtlIGBzeW1ib2xgLCBgc3ltYm9sX2NvZGVgIGRvZXNuJ3QgaW5jbHVkZSBhIHByZWNpc2lvbi4gKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2hTeW1ib2xDb2RlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBzdHJpbmcgY29udGFpbmluZyBzeW1ib2xfY29kZScpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhID0gW107XG4gICAgICAgIGEucHVzaC5hcHBseShhLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQodGhpcy50ZXh0RW5jb2Rlci5lbmNvZGUobmFtZSkpLCBmYWxzZSkpO1xuICAgICAgICB3aGlsZSAoYS5sZW5ndGggPCA4KSB7XG4gICAgICAgICAgICBhLnB1c2goMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wdXNoQXJyYXkoYS5zbGljZSgwLCA4KSk7XG4gICAgfTtcbiAgICAvKiogR2V0IGEgYHN5bWJvbF9jb2RlYC4gVW5saWtlIGBzeW1ib2xgLCBgc3ltYm9sX2NvZGVgIGRvZXNuJ3QgaW5jbHVkZSBhIHByZWNpc2lvbi4gKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldFN5bWJvbENvZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhID0gdGhpcy5nZXRVaW50OEFycmF5KDgpO1xuICAgICAgICB2YXIgbGVuO1xuICAgICAgICBmb3IgKGxlbiA9IDA7IGxlbiA8IGEubGVuZ3RoOyArK2xlbikge1xuICAgICAgICAgICAgaWYgKCFhW2xlbl0pIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgbmFtZSA9IHRoaXMudGV4dERlY29kZXIuZGVjb2RlKG5ldyBVaW50OEFycmF5KGEuYnVmZmVyLCBhLmJ5dGVPZmZzZXQsIGxlbikpO1xuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9O1xuICAgIC8qKiBBcHBlbmQgYSBgc3ltYm9sYCAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaFN5bWJvbCA9IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgbmFtZSA9IF9hLm5hbWUsIHByZWNpc2lvbiA9IF9hLnByZWNpc2lvbjtcbiAgICAgICAgaWYgKCEvXltBLVpdezEsN30kLy50ZXN0KG5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHN5bWJvbCB0byBiZSBBLVogYW5kIGJldHdlZW4gb25lIGFuZCBzZXZlbiBjaGFyYWN0ZXJzJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGEgPSBbcHJlY2lzaW9uICYgMHhmZl07XG4gICAgICAgIGEucHVzaC5hcHBseShhLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQodGhpcy50ZXh0RW5jb2Rlci5lbmNvZGUobmFtZSkpLCBmYWxzZSkpO1xuICAgICAgICB3aGlsZSAoYS5sZW5ndGggPCA4KSB7XG4gICAgICAgICAgICBhLnB1c2goMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wdXNoQXJyYXkoYS5zbGljZSgwLCA4KSk7XG4gICAgfTtcbiAgICAvKiogR2V0IGEgYHN5bWJvbGAgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldFN5bWJvbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByZWNpc2lvbiA9IHRoaXMuZ2V0KCk7XG4gICAgICAgIHZhciBhID0gdGhpcy5nZXRVaW50OEFycmF5KDcpO1xuICAgICAgICB2YXIgbGVuO1xuICAgICAgICBmb3IgKGxlbiA9IDA7IGxlbiA8IGEubGVuZ3RoOyArK2xlbikge1xuICAgICAgICAgICAgaWYgKCFhW2xlbl0pIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgbmFtZSA9IHRoaXMudGV4dERlY29kZXIuZGVjb2RlKG5ldyBVaW50OEFycmF5KGEuYnVmZmVyLCBhLmJ5dGVPZmZzZXQsIGxlbikpO1xuICAgICAgICByZXR1cm4geyBuYW1lOiBuYW1lLCBwcmVjaXNpb246IHByZWNpc2lvbiB9O1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBhbiBhc3NldCAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUucHVzaEFzc2V0ID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBzdHJpbmcgY29udGFpbmluZyBhc3NldCcpO1xuICAgICAgICB9XG4gICAgICAgIHMgPSBzLnRyaW0oKTtcbiAgICAgICAgdmFyIHBvcyA9IDA7XG4gICAgICAgIHZhciBhbW91bnQgPSAnJztcbiAgICAgICAgdmFyIHByZWNpc2lvbiA9IDA7XG4gICAgICAgIGlmIChzW3Bvc10gPT09ICctJykge1xuICAgICAgICAgICAgYW1vdW50ICs9ICctJztcbiAgICAgICAgICAgICsrcG9zO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmb3VuZERpZ2l0ID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChwb3MgPCBzLmxlbmd0aCAmJiBzLmNoYXJDb2RlQXQocG9zKSA+PSAnMCcuY2hhckNvZGVBdCgwKSAmJiBzLmNoYXJDb2RlQXQocG9zKSA8PSAnOScuY2hhckNvZGVBdCgwKSkge1xuICAgICAgICAgICAgZm91bmREaWdpdCA9IHRydWU7XG4gICAgICAgICAgICBhbW91bnQgKz0gc1twb3NdO1xuICAgICAgICAgICAgKytwb3M7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFmb3VuZERpZ2l0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Fzc2V0IG11c3QgYmVnaW4gd2l0aCBhIG51bWJlcicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzW3Bvc10gPT09ICcuJykge1xuICAgICAgICAgICAgKytwb3M7XG4gICAgICAgICAgICB3aGlsZSAocG9zIDwgcy5sZW5ndGggJiYgcy5jaGFyQ29kZUF0KHBvcykgPj0gJzAnLmNoYXJDb2RlQXQoMCkgJiYgcy5jaGFyQ29kZUF0KHBvcykgPD0gJzknLmNoYXJDb2RlQXQoMCkpIHtcbiAgICAgICAgICAgICAgICBhbW91bnQgKz0gc1twb3NdO1xuICAgICAgICAgICAgICAgICsrcHJlY2lzaW9uO1xuICAgICAgICAgICAgICAgICsrcG9zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBuYW1lID0gcy5zdWJzdHIocG9zKS50cmltKCk7XG4gICAgICAgIHRoaXMucHVzaEFycmF5KG51bWVyaWMuc2lnbmVkRGVjaW1hbFRvQmluYXJ5KDgsIGFtb3VudCkpO1xuICAgICAgICB0aGlzLnB1c2hTeW1ib2woeyBuYW1lOiBuYW1lLCBwcmVjaXNpb246IHByZWNpc2lvbiB9KTtcbiAgICB9O1xuICAgIC8qKiBHZXQgYW4gYXNzZXQgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldEFzc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYW1vdW50ID0gdGhpcy5nZXRVaW50OEFycmF5KDgpO1xuICAgICAgICB2YXIgX2EgPSB0aGlzLmdldFN5bWJvbCgpLCBuYW1lID0gX2EubmFtZSwgcHJlY2lzaW9uID0gX2EucHJlY2lzaW9uO1xuICAgICAgICB2YXIgcyA9IG51bWVyaWMuc2lnbmVkQmluYXJ5VG9EZWNpbWFsKGFtb3VudCwgcHJlY2lzaW9uICsgMSk7XG4gICAgICAgIGlmIChwcmVjaXNpb24pIHtcbiAgICAgICAgICAgIHMgPSBzLnN1YnN0cigwLCBzLmxlbmd0aCAtIHByZWNpc2lvbikgKyAnLicgKyBzLnN1YnN0cihzLmxlbmd0aCAtIHByZWNpc2lvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHMgKyAnICcgKyBuYW1lO1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBhIHB1YmxpYyBrZXkgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2hQdWJsaWNLZXkgPSBmdW5jdGlvbiAocykge1xuICAgICAgICB2YXIga2V5ID0gbnVtZXJpYy5zdHJpbmdUb1B1YmxpY0tleShzKTtcbiAgICAgICAgdGhpcy5wdXNoKGtleS50eXBlKTtcbiAgICAgICAgdGhpcy5wdXNoQXJyYXkoa2V5LmRhdGEpO1xuICAgIH07XG4gICAgLyoqIEdldCBhIHB1YmxpYyBrZXkgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLmdldFB1YmxpY0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0aGlzLmdldCgpO1xuICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgaWYgKHR5cGUgPT09IG51bWVyaWMuS2V5VHlwZS53YSkge1xuICAgICAgICAgICAgdmFyIGJlZ2luID0gdGhpcy5yZWFkUG9zO1xuICAgICAgICAgICAgdGhpcy5za2lwKDM0KTtcbiAgICAgICAgICAgIHRoaXMuc2tpcCh0aGlzLmdldFZhcnVpbnQzMigpKTtcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDhBcnJheSh0aGlzLmFycmF5LmJ1ZmZlciwgdGhpcy5hcnJheS5ieXRlT2Zmc2V0ICsgYmVnaW4sIHRoaXMucmVhZFBvcyAtIGJlZ2luKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLmdldFVpbnQ4QXJyYXkobnVtZXJpYy5wdWJsaWNLZXlEYXRhU2l6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bWVyaWMucHVibGljS2V5VG9TdHJpbmcoeyB0eXBlOiB0eXBlLCBkYXRhOiBkYXRhIH0pO1xuICAgIH07XG4gICAgLyoqIEFwcGVuZCBhIHByaXZhdGUga2V5ICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5wdXNoUHJpdmF0ZUtleSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHZhciBrZXkgPSBudW1lcmljLnN0cmluZ1RvUHJpdmF0ZUtleShzKTtcbiAgICAgICAgdGhpcy5wdXNoKGtleS50eXBlKTtcbiAgICAgICAgdGhpcy5wdXNoQXJyYXkoa2V5LmRhdGEpO1xuICAgIH07XG4gICAgLyoqIEdldCBhIHByaXZhdGUga2V5ICovXG4gICAgU2VyaWFsQnVmZmVyLnByb3RvdHlwZS5nZXRQcml2YXRlS2V5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdHlwZSA9IHRoaXMuZ2V0KCk7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXRVaW50OEFycmF5KG51bWVyaWMucHJpdmF0ZUtleURhdGFTaXplKTtcbiAgICAgICAgcmV0dXJuIG51bWVyaWMucHJpdmF0ZUtleVRvU3RyaW5nKHsgdHlwZTogdHlwZSwgZGF0YTogZGF0YSB9KTtcbiAgICB9O1xuICAgIC8qKiBBcHBlbmQgYSBzaWduYXR1cmUgKi9cbiAgICBTZXJpYWxCdWZmZXIucHJvdG90eXBlLnB1c2hTaWduYXR1cmUgPSBmdW5jdGlvbiAocykge1xuICAgICAgICB2YXIga2V5ID0gbnVtZXJpYy5zdHJpbmdUb1NpZ25hdHVyZShzKTtcbiAgICAgICAgdGhpcy5wdXNoKGtleS50eXBlKTtcbiAgICAgICAgdGhpcy5wdXNoQXJyYXkoa2V5LmRhdGEpO1xuICAgIH07XG4gICAgLyoqIEdldCBhIHNpZ25hdHVyZSAqL1xuICAgIFNlcmlhbEJ1ZmZlci5wcm90b3R5cGUuZ2V0U2lnbmF0dXJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdHlwZSA9IHRoaXMuZ2V0KCk7XG4gICAgICAgIHZhciBkYXRhO1xuICAgICAgICBpZiAodHlwZSA9PT0gbnVtZXJpYy5LZXlUeXBlLndhKSB7XG4gICAgICAgICAgICB2YXIgYmVnaW4gPSB0aGlzLnJlYWRQb3M7XG4gICAgICAgICAgICB0aGlzLnNraXAoNjUpO1xuICAgICAgICAgICAgdGhpcy5za2lwKHRoaXMuZ2V0VmFydWludDMyKCkpO1xuICAgICAgICAgICAgdGhpcy5za2lwKHRoaXMuZ2V0VmFydWludDMyKCkpO1xuICAgICAgICAgICAgZGF0YSA9IG5ldyBVaW50OEFycmF5KHRoaXMuYXJyYXkuYnVmZmVyLCB0aGlzLmFycmF5LmJ5dGVPZmZzZXQgKyBiZWdpbiwgdGhpcy5yZWFkUG9zIC0gYmVnaW4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGF0YSA9IHRoaXMuZ2V0VWludDhBcnJheShudW1lcmljLnNpZ25hdHVyZURhdGFTaXplKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVtZXJpYy5zaWduYXR1cmVUb1N0cmluZyh7IHR5cGU6IHR5cGUsIGRhdGE6IGRhdGEgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gU2VyaWFsQnVmZmVyO1xufSgpKTsgLy8gU2VyaWFsQnVmZmVyXG5leHBvcnRzLlNlcmlhbEJ1ZmZlciA9IFNlcmlhbEJ1ZmZlcjtcbi8qKiBJcyB0aGlzIGEgc3VwcG9ydGVkIEFCSSB2ZXJzaW9uPyAqL1xudmFyIHN1cHBvcnRlZEFiaVZlcnNpb24gPSBmdW5jdGlvbiAodmVyc2lvbikge1xuICAgIHJldHVybiB2ZXJzaW9uLnN0YXJ0c1dpdGgoJ2Vvc2lvOjphYmkvMS4nKTtcbn07XG5leHBvcnRzLnN1cHBvcnRlZEFiaVZlcnNpb24gPSBzdXBwb3J0ZWRBYmlWZXJzaW9uO1xudmFyIGNoZWNrRGF0ZVBhcnNlID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gRGF0ZS5wYXJzZShkYXRlKTtcbiAgICBpZiAoTnVtYmVyLmlzTmFOKHJlc3VsdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRpbWUgZm9ybWF0Jyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuLyoqIENvbnZlcnQgZGF0ZSBpbiBJU08gZm9ybWF0IHRvIGB0aW1lX3BvaW50YCAobWlsaXNlY29uZHMgc2luY2UgZXBvY2gpICovXG52YXIgZGF0ZVRvVGltZVBvaW50ID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChjaGVja0RhdGVQYXJzZShkYXRlICsgJ1onKSAqIDEwMDApO1xufTtcbmV4cG9ydHMuZGF0ZVRvVGltZVBvaW50ID0gZGF0ZVRvVGltZVBvaW50O1xuLyoqIENvbnZlcnQgYHRpbWVfcG9pbnRgIChtaWxpc2Vjb25kcyBzaW5jZSBlcG9jaCkgdG8gZGF0ZSBpbiBJU08gZm9ybWF0ICovXG52YXIgdGltZVBvaW50VG9EYXRlID0gZnVuY3Rpb24gKHVzKSB7XG4gICAgdmFyIHMgPSAobmV3IERhdGUodXMgLyAxMDAwKSkudG9JU09TdHJpbmcoKTtcbiAgICByZXR1cm4gcy5zdWJzdHIoMCwgcy5sZW5ndGggLSAxKTtcbn07XG5leHBvcnRzLnRpbWVQb2ludFRvRGF0ZSA9IHRpbWVQb2ludFRvRGF0ZTtcbi8qKiBDb252ZXJ0IGRhdGUgaW4gSVNPIGZvcm1hdCB0byBgdGltZV9wb2ludF9zZWNgIChzZWNvbmRzIHNpbmNlIGVwb2NoKSAqL1xudmFyIGRhdGVUb1RpbWVQb2ludFNlYyA9IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoY2hlY2tEYXRlUGFyc2UoZGF0ZSArICdaJykgLyAxMDAwKTtcbn07XG5leHBvcnRzLmRhdGVUb1RpbWVQb2ludFNlYyA9IGRhdGVUb1RpbWVQb2ludFNlYztcbi8qKiBDb252ZXJ0IGB0aW1lX3BvaW50X3NlY2AgKHNlY29uZHMgc2luY2UgZXBvY2gpIHRvIHRvIGRhdGUgaW4gSVNPIGZvcm1hdCAqL1xudmFyIHRpbWVQb2ludFNlY1RvRGF0ZSA9IGZ1bmN0aW9uIChzZWMpIHtcbiAgICB2YXIgcyA9IChuZXcgRGF0ZShzZWMgKiAxMDAwKSkudG9JU09TdHJpbmcoKTtcbiAgICByZXR1cm4gcy5zdWJzdHIoMCwgcy5sZW5ndGggLSAxKTtcbn07XG5leHBvcnRzLnRpbWVQb2ludFNlY1RvRGF0ZSA9IHRpbWVQb2ludFNlY1RvRGF0ZTtcbi8qKiBDb252ZXJ0IGRhdGUgaW4gSVNPIGZvcm1hdCB0byBgYmxvY2tfdGltZXN0YW1wX3R5cGVgIChoYWxmLXNlY29uZHMgc2luY2UgYSBkaWZmZXJlbnQgZXBvY2gpICovXG52YXIgZGF0ZVRvQmxvY2tUaW1lc3RhbXAgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKChjaGVja0RhdGVQYXJzZShkYXRlICsgJ1onKSAtIDk0NjY4NDgwMDAwMCkgLyA1MDApO1xufTtcbmV4cG9ydHMuZGF0ZVRvQmxvY2tUaW1lc3RhbXAgPSBkYXRlVG9CbG9ja1RpbWVzdGFtcDtcbi8qKiBDb252ZXJ0IGBibG9ja190aW1lc3RhbXBfdHlwZWAgKGhhbGYtc2Vjb25kcyBzaW5jZSBhIGRpZmZlcmVudCBlcG9jaCkgdG8gdG8gZGF0ZSBpbiBJU08gZm9ybWF0ICovXG52YXIgYmxvY2tUaW1lc3RhbXBUb0RhdGUgPSBmdW5jdGlvbiAoc2xvdCkge1xuICAgIHZhciBzID0gKG5ldyBEYXRlKHNsb3QgKiA1MDAgKyA5NDY2ODQ4MDAwMDApKS50b0lTT1N0cmluZygpO1xuICAgIHJldHVybiBzLnN1YnN0cigwLCBzLmxlbmd0aCAtIDEpO1xufTtcbmV4cG9ydHMuYmxvY2tUaW1lc3RhbXBUb0RhdGUgPSBibG9ja1RpbWVzdGFtcFRvRGF0ZTtcbi8qKiBDb252ZXJ0IGBzdHJpbmdgIHRvIGBTeW1ib2xgLiBmb3JtYXQ6IGBwcmVjaXNpb24sTkFNRWAuICovXG52YXIgc3RyaW5nVG9TeW1ib2wgPSBmdW5jdGlvbiAocykge1xuICAgIGlmICh0eXBlb2YgcyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBzdHJpbmcgY29udGFpbmluZyBzeW1ib2wnKTtcbiAgICB9XG4gICAgdmFyIG0gPSBzLm1hdGNoKC9eKFswLTldKyksKFtBLVpdKykkLyk7XG4gICAgaWYgKCFtKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzeW1ib2wnKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgbmFtZTogbVsyXSwgcHJlY2lzaW9uOiArbVsxXSB9O1xufTtcbmV4cG9ydHMuc3RyaW5nVG9TeW1ib2wgPSBzdHJpbmdUb1N5bWJvbDtcbi8qKiBDb252ZXJ0IGBTeW1ib2xgIHRvIGBzdHJpbmdgLiBmb3JtYXQ6IGBwcmVjaXNpb24sTkFNRWAuICovXG52YXIgc3ltYm9sVG9TdHJpbmcgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICB2YXIgbmFtZSA9IF9hLm5hbWUsIHByZWNpc2lvbiA9IF9hLnByZWNpc2lvbjtcbiAgICByZXR1cm4gcHJlY2lzaW9uICsgJywnICsgbmFtZTtcbn07XG5leHBvcnRzLnN5bWJvbFRvU3RyaW5nID0gc3ltYm9sVG9TdHJpbmc7XG4vKiogQ29udmVydCBiaW5hcnkgZGF0YSB0byBoZXggKi9cbnZhciBhcnJheVRvSGV4ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgZV8xLCBfYTtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgZGF0YV8xID0gX192YWx1ZXMoZGF0YSksIGRhdGFfMV8xID0gZGF0YV8xLm5leHQoKTsgIWRhdGFfMV8xLmRvbmU7IGRhdGFfMV8xID0gZGF0YV8xLm5leHQoKSkge1xuICAgICAgICAgICAgdmFyIHggPSBkYXRhXzFfMS52YWx1ZTtcbiAgICAgICAgICAgIHJlc3VsdCArPSAoJzAwJyArIHgudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChkYXRhXzFfMSAmJiAhZGF0YV8xXzEuZG9uZSAmJiAoX2EgPSBkYXRhXzEucmV0dXJuKSkgX2EuY2FsbChkYXRhXzEpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdC50b1VwcGVyQ2FzZSgpO1xufTtcbmV4cG9ydHMuYXJyYXlUb0hleCA9IGFycmF5VG9IZXg7XG4vKiogQ29udmVydCBoZXggdG8gYmluYXJ5IGRhdGEgKi9cbnZhciBoZXhUb1VpbnQ4QXJyYXkgPSBmdW5jdGlvbiAoaGV4KSB7XG4gICAgaWYgKHR5cGVvZiBoZXggIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgc3RyaW5nIGNvbnRhaW5pbmcgaGV4IGRpZ2l0cycpO1xuICAgIH1cbiAgICBpZiAoaGV4Lmxlbmd0aCAlIDIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPZGQgbnVtYmVyIG9mIGhleCBkaWdpdHMnKTtcbiAgICB9XG4gICAgdmFyIGwgPSBoZXgubGVuZ3RoIC8gMjtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkobCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgdmFyIHggPSBwYXJzZUludChoZXguc3Vic3RyKGkgKiAyLCAyKSwgMTYpO1xuICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKHgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGhleCBzdHJpbmcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRbaV0gPSB4O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbmV4cG9ydHMuaGV4VG9VaW50OEFycmF5ID0gaGV4VG9VaW50OEFycmF5O1xuZnVuY3Rpb24gc2VyaWFsaXplVW5rbm93bihidWZmZXIsIGRhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0RvblxcJ3Qga25vdyBob3cgdG8gc2VyaWFsaXplICcgKyB0aGlzLm5hbWUpO1xufVxuZnVuY3Rpb24gZGVzZXJpYWxpemVVbmtub3duKGJ1ZmZlcikge1xuICAgIHRocm93IG5ldyBFcnJvcignRG9uXFwndCBrbm93IGhvdyB0byBkZXNlcmlhbGl6ZSAnICsgdGhpcy5uYW1lKTtcbn1cbmZ1bmN0aW9uIHNlcmlhbGl6ZVN0cnVjdChidWZmZXIsIGRhdGEsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpIHtcbiAgICB2YXIgZV8yLCBfYTtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkgeyBzdGF0ZSA9IG5ldyBTZXJpYWxpemVyU3RhdGUoKTsgfVxuICAgIGlmIChhbGxvd0V4dGVuc2lvbnMgPT09IHZvaWQgMCkgeyBhbGxvd0V4dGVuc2lvbnMgPSB0cnVlOyB9XG4gICAgaWYgKHR5cGVvZiBkYXRhICE9PSAnb2JqZWN0Jykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIG9iamVjdCBjb250YWluaW5nIGRhdGE6ICcgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmJhc2UpIHtcbiAgICAgICAgdGhpcy5iYXNlLnNlcmlhbGl6ZShidWZmZXIsIGRhdGEsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKHRoaXMuZmllbGRzKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICAgICAgdmFyIGZpZWxkID0gX2MudmFsdWU7XG4gICAgICAgICAgICBpZiAoZmllbGQubmFtZSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLnNraXBwZWRCaW5hcnlFeHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmV4cGVjdGVkICcgKyB0aGlzLm5hbWUgKyAnLicgKyBmaWVsZC5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmllbGQudHlwZS5zZXJpYWxpemUoYnVmZmVyLCBkYXRhW2ZpZWxkLm5hbWVdLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zICYmIGZpZWxkID09PSB0aGlzLmZpZWxkc1t0aGlzLmZpZWxkcy5sZW5ndGggLSAxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYWxsb3dFeHRlbnNpb25zICYmIGZpZWxkLnR5cGUuZXh0ZW5zaW9uT2YpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuc2tpcHBlZEJpbmFyeUV4dGVuc2lvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21pc3NpbmcgJyArIHRoaXMubmFtZSArICcuJyArIGZpZWxkLm5hbWUgKyAnICh0eXBlPScgKyBmaWVsZC50eXBlLm5hbWUgKyAnKScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZV8yXzEpIHsgZV8yID0geyBlcnJvcjogZV8yXzEgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7IH1cbiAgICB9XG59XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVN0cnVjdChidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpIHtcbiAgICB2YXIgZV8zLCBfYTtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkgeyBzdGF0ZSA9IG5ldyBTZXJpYWxpemVyU3RhdGUoKTsgfVxuICAgIGlmIChhbGxvd0V4dGVuc2lvbnMgPT09IHZvaWQgMCkgeyBhbGxvd0V4dGVuc2lvbnMgPSB0cnVlOyB9XG4gICAgdmFyIHJlc3VsdDtcbiAgICBpZiAodGhpcy5iYXNlKSB7XG4gICAgICAgIHJlc3VsdCA9IHRoaXMuYmFzZS5kZXNlcmlhbGl6ZShidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0ge307XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXModGhpcy5maWVsZHMpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgICAgICB2YXIgZmllbGQgPSBfYy52YWx1ZTtcbiAgICAgICAgICAgIGlmIChhbGxvd0V4dGVuc2lvbnMgJiYgZmllbGQudHlwZS5leHRlbnNpb25PZiAmJiAhYnVmZmVyLmhhdmVSZWFkRGF0YSgpKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuc2tpcHBlZEJpbmFyeUV4dGVuc2lvbiA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbZmllbGQubmFtZV0gPSBmaWVsZC50eXBlLmRlc2VyaWFsaXplKGJ1ZmZlciwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVfM18xKSB7IGVfMyA9IHsgZXJyb3I6IGVfM18xIH07IH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yOyB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBzZXJpYWxpemVWYXJpYW50KGJ1ZmZlciwgZGF0YSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSB8fCBkYXRhLmxlbmd0aCAhPT0gMiB8fCB0eXBlb2YgZGF0YVswXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdleHBlY3RlZCB2YXJpYW50OiBbXCJ0eXBlXCIsIHZhbHVlXScpO1xuICAgIH1cbiAgICB2YXIgaSA9IHRoaXMuZmllbGRzLmZpbmRJbmRleChmdW5jdGlvbiAoZmllbGQpIHsgcmV0dXJuIGZpZWxkLm5hbWUgPT09IGRhdGFbMF07IH0pO1xuICAgIGlmIChpIDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0eXBlIFxcXCJcIiArIGRhdGFbMF0gKyBcIlxcXCIgaXMgbm90IHZhbGlkIGZvciB2YXJpYW50XCIpO1xuICAgIH1cbiAgICBidWZmZXIucHVzaFZhcnVpbnQzMihpKTtcbiAgICB0aGlzLmZpZWxkc1tpXS50eXBlLnNlcmlhbGl6ZShidWZmZXIsIGRhdGFbMV0sIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpO1xufVxuZnVuY3Rpb24gZGVzZXJpYWxpemVWYXJpYW50KGJ1ZmZlciwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucykge1xuICAgIHZhciBpID0gYnVmZmVyLmdldFZhcnVpbnQzMigpO1xuICAgIGlmIChpID49IHRoaXMuZmllbGRzLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0eXBlIGluZGV4IFwiICsgaSArIFwiIGlzIG5vdCB2YWxpZCBmb3IgdmFyaWFudFwiKTtcbiAgICB9XG4gICAgdmFyIGZpZWxkID0gdGhpcy5maWVsZHNbaV07XG4gICAgcmV0dXJuIFtmaWVsZC5uYW1lLCBmaWVsZC50eXBlLmRlc2VyaWFsaXplKGJ1ZmZlciwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyldO1xufVxuZnVuY3Rpb24gc2VyaWFsaXplQXJyYXkoYnVmZmVyLCBkYXRhLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKSB7XG4gICAgdmFyIGVfNCwgX2E7XG4gICAgYnVmZmVyLnB1c2hWYXJ1aW50MzIoZGF0YS5sZW5ndGgpO1xuICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGRhdGFfMiA9IF9fdmFsdWVzKGRhdGEpLCBkYXRhXzJfMSA9IGRhdGFfMi5uZXh0KCk7ICFkYXRhXzJfMS5kb25lOyBkYXRhXzJfMSA9IGRhdGFfMi5uZXh0KCkpIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gZGF0YV8yXzEudmFsdWU7XG4gICAgICAgICAgICB0aGlzLmFycmF5T2Yuc2VyaWFsaXplKGJ1ZmZlciwgaXRlbSwgc3RhdGUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZV80XzEpIHsgZV80ID0geyBlcnJvcjogZV80XzEgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGRhdGFfMl8xICYmICFkYXRhXzJfMS5kb25lICYmIChfYSA9IGRhdGFfMi5yZXR1cm4pKSBfYS5jYWxsKGRhdGFfMik7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlXzQpIHRocm93IGVfNC5lcnJvcjsgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGRlc2VyaWFsaXplQXJyYXkoYnVmZmVyLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKSB7XG4gICAgdmFyIGxlbiA9IGJ1ZmZlci5nZXRWYXJ1aW50MzIoKTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmFycmF5T2YuZGVzZXJpYWxpemUoYnVmZmVyLCBzdGF0ZSwgZmFsc2UpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIHNlcmlhbGl6ZU9wdGlvbmFsKGJ1ZmZlciwgZGF0YSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucykge1xuICAgIGlmIChkYXRhID09PSBudWxsIHx8IGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBidWZmZXIucHVzaCgwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoKDEpO1xuICAgICAgICB0aGlzLm9wdGlvbmFsT2Yuc2VyaWFsaXplKGJ1ZmZlciwgZGF0YSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGVzZXJpYWxpemVPcHRpb25hbChidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpIHtcbiAgICBpZiAoYnVmZmVyLmdldCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsT2YuZGVzZXJpYWxpemUoYnVmZmVyLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNlcmlhbGl6ZUV4dGVuc2lvbihidWZmZXIsIGRhdGEsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpIHtcbiAgICB0aGlzLmV4dGVuc2lvbk9mLnNlcmlhbGl6ZShidWZmZXIsIGRhdGEsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpO1xufVxuZnVuY3Rpb24gZGVzZXJpYWxpemVFeHRlbnNpb24oYnVmZmVyLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuZXh0ZW5zaW9uT2YuZGVzZXJpYWxpemUoYnVmZmVyLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKTtcbn1cbmZ1bmN0aW9uIHNlcmlhbGl6ZU9iamVjdChidWZmZXIsIGRhdGEsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpIHtcbiAgICB2YXIgZV81LCBfYTtcbiAgICB2YXIgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKGRhdGEpO1xuICAgIGJ1ZmZlci5wdXNoVmFydWludDMyKGVudHJpZXMubGVuZ3RoKTtcbiAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBlbnRyaWVzXzEgPSBfX3ZhbHVlcyhlbnRyaWVzKSwgZW50cmllc18xXzEgPSBlbnRyaWVzXzEubmV4dCgpOyAhZW50cmllc18xXzEuZG9uZTsgZW50cmllc18xXzEgPSBlbnRyaWVzXzEubmV4dCgpKSB7XG4gICAgICAgICAgICB2YXIgX2IgPSBfX3JlYWQoZW50cmllc18xXzEudmFsdWUsIDIpLCBrZXkgPSBfYlswXSwgdmFsdWUgPSBfYlsxXTtcbiAgICAgICAgICAgIHZhciBrZXlUeXBlID0gdGhpcy5maWVsZHNbMF0udHlwZTtcbiAgICAgICAgICAgIHZhciBkYXRhVHlwZSA9IHRoaXMuZmllbGRzWzFdLnR5cGU7XG4gICAgICAgICAgICBrZXlUeXBlLnNlcmlhbGl6ZShidWZmZXIsIGtleSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG4gICAgICAgICAgICBkYXRhVHlwZS5zZXJpYWxpemUoYnVmZmVyLCB2YWx1ZSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVfNV8xKSB7IGVfNSA9IHsgZXJyb3I6IGVfNV8xIH07IH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChlbnRyaWVzXzFfMSAmJiAhZW50cmllc18xXzEuZG9uZSAmJiAoX2EgPSBlbnRyaWVzXzEucmV0dXJuKSkgX2EuY2FsbChlbnRyaWVzXzEpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZV81KSB0aHJvdyBlXzUuZXJyb3I7IH1cbiAgICB9XG59XG5mdW5jdGlvbiBkZXNlcmlhbGl6ZU9iamVjdChidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpIHtcbiAgICB2YXIgbGVuID0gYnVmZmVyLmdldFZhcnVpbnQzMigpO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIHZhciBrZXlUeXBlID0gdGhpcy5maWVsZHNbMF0udHlwZTtcbiAgICAgICAgdmFyIGRhdGFUeXBlID0gdGhpcy5maWVsZHNbMV0udHlwZTtcbiAgICAgICAgdmFyIGtleSA9IGtleVR5cGUuZGVzZXJpYWxpemUoYnVmZmVyLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKTtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBkYXRhVHlwZS5kZXNlcmlhbGl6ZShidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gc2VyaWFsaXplUGFpcihidWZmZXIsIGRhdGEsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIGJ1ZmZlci5wdXNoVmFydWludDMyKGRhdGEubGVuZ3RoKTtcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgX3RoaXMuZmllbGRzWzBdLnR5cGUuc2VyaWFsaXplKGJ1ZmZlciwgaXRlbVswXSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG4gICAgICAgIF90aGlzLmZpZWxkc1sxXS50eXBlLnNlcmlhbGl6ZShidWZmZXIsIGl0ZW1bMV0sIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZGVzZXJpYWxpemVQYWlyKGJ1ZmZlciwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucykge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgbGVuID0gYnVmZmVyLmdldFZhcnVpbnQzMigpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godGhpcy5maWVsZHNbMF0udHlwZS5kZXNlcmlhbGl6ZShidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpKTtcbiAgICAgICAgcmVzdWx0LnB1c2godGhpcy5maWVsZHNbMV0udHlwZS5kZXNlcmlhbGl6ZShidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbnZhciBjcmVhdGVUeXBlID0gZnVuY3Rpb24gKGF0dHJzKSB7XG4gICAgcmV0dXJuIF9fYXNzaWduKHsgbmFtZTogJzxtaXNzaW5nIG5hbWU+JywgYWxpYXNPZk5hbWU6ICcnLCBhcnJheU9mOiBudWxsLCBvcHRpb25hbE9mOiBudWxsLCBleHRlbnNpb25PZjogbnVsbCwgYmFzZU5hbWU6ICcnLCBiYXNlOiBudWxsLCBmaWVsZHM6IFtdLCBzZXJpYWxpemU6IHNlcmlhbGl6ZVVua25vd24sIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVVua25vd24gfSwgYXR0cnMpO1xufTtcbnZhciBjaGVja1JhbmdlID0gZnVuY3Rpb24gKG9yaWcsIGNvbnZlcnRlZCkge1xuICAgIGlmIChOdW1iZXIuaXNOYU4oK29yaWcpIHx8IE51bWJlci5pc05hTigrY29udmVydGVkKSB8fCAodHlwZW9mIG9yaWcgIT09ICdudW1iZXInICYmIHR5cGVvZiBvcmlnICE9PSAnc3RyaW5nJykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBudW1iZXInKTtcbiAgICB9XG4gICAgaWYgKCtvcmlnICE9PSArY29udmVydGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTnVtYmVyIGlzIG91dCBvZiByYW5nZScpO1xuICAgIH1cbiAgICByZXR1cm4gK29yaWc7XG59O1xuLyoqIENyZWF0ZSB0aGUgc2V0IG9mIHR5cGVzIGJ1aWx0LWluIHRvIHRoZSBhYmkgZm9ybWF0ICovXG52YXIgY3JlYXRlSW5pdGlhbFR5cGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKHtcbiAgICAgICAgYm9vbDogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAnYm9vbCcsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoISh0eXBlb2YgZGF0YSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBkYXRhID09PSAnbnVtYmVyJyAmJiAoZGF0YSA9PT0gMSB8fCBkYXRhID09PSAwKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBib29sZWFuIG9yIG51bWJlciBlcXVhbCB0byAxIG9yIDAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2goZGF0YSA/IDEgOiAwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gISFidWZmZXIuZ2V0KCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICB1aW50ODogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAndWludDgnLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7IGJ1ZmZlci5wdXNoKGNoZWNrUmFuZ2UoZGF0YSwgZGF0YSAmIDB4ZmYpKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0KCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBpbnQ4OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdpbnQ4JyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaChjaGVja1JhbmdlKGRhdGEsIGRhdGEgPDwgMjQgPj4gMjQpKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0KCkgPDwgMjQgPj4gMjQ7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICB1aW50MTY6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ3VpbnQxNicsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hVaW50MTYoY2hlY2tSYW5nZShkYXRhLCBkYXRhICYgMHhmZmZmKSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldFVpbnQxNigpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgaW50MTY6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ2ludDE2JyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFVpbnQxNihjaGVja1JhbmdlKGRhdGEsIGRhdGEgPDwgMTYgPj4gMTYpKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0VWludDE2KCkgPDwgMTYgPj4gMTY7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICB1aW50MzI6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ3VpbnQzMicsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hVaW50MzIoY2hlY2tSYW5nZShkYXRhLCBkYXRhID4+PiAwKSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldFVpbnQzMigpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgdWludDY0OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICd1aW50NjQnLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2hBcnJheShudW1lcmljLmRlY2ltYWxUb0JpbmFyeSg4LCAnJyArIGRhdGEpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gbnVtZXJpYy5iaW5hcnlUb0RlY2ltYWwoYnVmZmVyLmdldFVpbnQ4QXJyYXkoOCkpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgaW50NjQ6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ2ludDY0JyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkge1xuICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoQXJyYXkobnVtZXJpYy5zaWduZWREZWNpbWFsVG9CaW5hcnkoOCwgJycgKyBkYXRhKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIG51bWVyaWMuc2lnbmVkQmluYXJ5VG9EZWNpbWFsKGJ1ZmZlci5nZXRVaW50OEFycmF5KDgpKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGludDMyOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdpbnQzMicsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hVaW50MzIoY2hlY2tSYW5nZShkYXRhLCBkYXRhIHwgMCkpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRVaW50MzIoKSB8IDA7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICB2YXJ1aW50MzI6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ3ZhcnVpbnQzMicsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hWYXJ1aW50MzIoY2hlY2tSYW5nZShkYXRhLCBkYXRhID4+PiAwKSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldFZhcnVpbnQzMigpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgdmFyaW50MzI6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ3ZhcmludDMyJyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFZhcmludDMyKGNoZWNrUmFuZ2UoZGF0YSwgZGF0YSB8IDApKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0VmFyaW50MzIoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHVpbnQxMjg6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ3VpbnQxMjgnLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7IGJ1ZmZlci5wdXNoQXJyYXkobnVtZXJpYy5kZWNpbWFsVG9CaW5hcnkoMTYsICcnICsgZGF0YSkpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIG51bWVyaWMuYmluYXJ5VG9EZWNpbWFsKGJ1ZmZlci5nZXRVaW50OEFycmF5KDE2KSk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBpbnQxMjg6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ2ludDEyOCcsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBidWZmZXIucHVzaEFycmF5KG51bWVyaWMuc2lnbmVkRGVjaW1hbFRvQmluYXJ5KDE2LCAnJyArIGRhdGEpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gbnVtZXJpYy5zaWduZWRCaW5hcnlUb0RlY2ltYWwoYnVmZmVyLmdldFVpbnQ4QXJyYXkoMTYpKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGZsb2F0MzI6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ2Zsb2F0MzInLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7IGJ1ZmZlci5wdXNoRmxvYXQzMihkYXRhKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0RmxvYXQzMigpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgZmxvYXQ2NDogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAnZmxvYXQ2NCcsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hGbG9hdDY0KGRhdGEpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRGbG9hdDY0KCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBmbG9hdDEyODogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAnZmxvYXQxMjgnLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7IGJ1ZmZlci5wdXNoVWludDhBcnJheUNoZWNrZWQoKDAsIGV4cG9ydHMuaGV4VG9VaW50OEFycmF5KShkYXRhKSwgMTYpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuICgwLCBleHBvcnRzLmFycmF5VG9IZXgpKGJ1ZmZlci5nZXRVaW50OEFycmF5KDE2KSk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBieXRlczogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAnYnl0ZXMnLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBVaW50OEFycmF5IHx8IEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLnB1c2hCeXRlcyhkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoQnl0ZXMoKDAsIGV4cG9ydHMuaGV4VG9VaW50OEFycmF5KShkYXRhKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBzdGF0ZSkge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5vcHRpb25zLmJ5dGVzQXNVaW50OEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXIuZ2V0Qnl0ZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgZXhwb3J0cy5hcnJheVRvSGV4KShidWZmZXIuZ2V0Qnl0ZXMoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHN0cmluZzogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaFN0cmluZyhkYXRhKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0U3RyaW5nKCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBuYW1lOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgZGF0YSkgeyBidWZmZXIucHVzaE5hbWUoZGF0YSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldE5hbWUoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHRpbWVfcG9pbnQ6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ3RpbWVfcG9pbnQnLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7IGJ1ZmZlci5wdXNoTnVtYmVyQXNVaW50NjQoKDAsIGV4cG9ydHMuZGF0ZVRvVGltZVBvaW50KShkYXRhKSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gKDAsIGV4cG9ydHMudGltZVBvaW50VG9EYXRlKShidWZmZXIuZ2V0VWludDY0QXNOdW1iZXIoKSk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICB0aW1lX3BvaW50X3NlYzogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiAndGltZV9wb2ludF9zZWMnLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7IGJ1ZmZlci5wdXNoVWludDMyKCgwLCBleHBvcnRzLmRhdGVUb1RpbWVQb2ludFNlYykoZGF0YSkpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuICgwLCBleHBvcnRzLnRpbWVQb2ludFNlY1RvRGF0ZSkoYnVmZmVyLmdldFVpbnQzMigpKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGJsb2NrX3RpbWVzdGFtcF90eXBlOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdibG9ja190aW1lc3RhbXBfdHlwZScsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hVaW50MzIoKDAsIGV4cG9ydHMuZGF0ZVRvQmxvY2tUaW1lc3RhbXApKGRhdGEpKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiAoMCwgZXhwb3J0cy5ibG9ja1RpbWVzdGFtcFRvRGF0ZSkoYnVmZmVyLmdldFVpbnQzMigpKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHN5bWJvbF9jb2RlOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdzeW1ib2xfY29kZScsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hTeW1ib2xDb2RlKGRhdGEpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRTeW1ib2xDb2RlKCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBzeW1ib2w6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ3N5bWJvbCcsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hTeW1ib2woKDAsIGV4cG9ydHMuc3RyaW5nVG9TeW1ib2wpKGRhdGEpKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiAoMCwgZXhwb3J0cy5zeW1ib2xUb1N0cmluZykoYnVmZmVyLmdldFN5bWJvbCgpKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGFzc2V0OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdhc3NldCcsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hBc3NldChkYXRhKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0QXNzZXQoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGNoZWNrc3VtMTYwOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdjaGVja3N1bTE2MCcsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hVaW50OEFycmF5Q2hlY2tlZCgoMCwgZXhwb3J0cy5oZXhUb1VpbnQ4QXJyYXkpKGRhdGEpLCAyMCk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gKDAsIGV4cG9ydHMuYXJyYXlUb0hleCkoYnVmZmVyLmdldFVpbnQ4QXJyYXkoMjApKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGNoZWNrc3VtMjU2OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdjaGVja3N1bTI1NicsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hVaW50OEFycmF5Q2hlY2tlZCgoMCwgZXhwb3J0cy5oZXhUb1VpbnQ4QXJyYXkpKGRhdGEpLCAzMik7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gKDAsIGV4cG9ydHMuYXJyYXlUb0hleCkoYnVmZmVyLmdldFVpbnQ4QXJyYXkoMzIpKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGNoZWNrc3VtNTEyOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdjaGVja3N1bTUxMicsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hVaW50OEFycmF5Q2hlY2tlZCgoMCwgZXhwb3J0cy5oZXhUb1VpbnQ4QXJyYXkpKGRhdGEpLCA2NCk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gKDAsIGV4cG9ydHMuYXJyYXlUb0hleCkoYnVmZmVyLmdldFVpbnQ4QXJyYXkoNjQpKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHB1YmxpY19rZXk6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ3B1YmxpY19rZXknLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoYnVmZmVyLCBkYXRhKSB7IGJ1ZmZlci5wdXNoUHVibGljS2V5KGRhdGEpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRQdWJsaWNLZXkoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHByaXZhdGVfa2V5OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6ICdwcml2YXRlX2tleScsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hQcml2YXRlS2V5KGRhdGEpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRQcml2YXRlS2V5KCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBzaWduYXR1cmU6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogJ3NpZ25hdHVyZScsXG4gICAgICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGRhdGEpIHsgYnVmZmVyLnB1c2hTaWduYXR1cmUoZGF0YSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldFNpZ25hdHVyZSgpOyB9LFxuICAgICAgICB9KSxcbiAgICB9KSk7XG4gICAgcmVzdWx0LnNldCgnZXh0ZW5kZWRfYXNzZXQnLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ2V4dGVuZGVkX2Fzc2V0JyxcbiAgICAgICAgYmFzZU5hbWU6ICcnLFxuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ3F1YW50aXR5JywgdHlwZU5hbWU6ICdhc3NldCcsIHR5cGU6IHJlc3VsdC5nZXQoJ2Fzc2V0JykgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2NvbnRyYWN0JywgdHlwZU5hbWU6ICduYW1lJywgdHlwZTogcmVzdWx0LmdldCgnbmFtZScpIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplU3RydWN0LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVTdHJ1Y3QsXG4gICAgfSkpO1xuICAgIHJldHVybiByZXN1bHQ7XG59OyAvLyBjcmVhdGVJbml0aWFsVHlwZXMoKVxuZXhwb3J0cy5jcmVhdGVJbml0aWFsVHlwZXMgPSBjcmVhdGVJbml0aWFsVHlwZXM7XG52YXIgY3JlYXRlQWJpVHlwZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGluaXRpYWxUeXBlcyA9ICgwLCBleHBvcnRzLmNyZWF0ZUluaXRpYWxUeXBlcykoKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdleHRlbnNpb25zX2VudHJ5JywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdleHRlbnNpb25zX2VudHJ5JyxcbiAgICAgICAgYmFzZU5hbWU6ICcnLFxuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ3RhZycsIHR5cGVOYW1lOiAndWludDE2JywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAndmFsdWUnLCB0eXBlTmFtZTogJ2J5dGVzJywgdHlwZTogbnVsbCB9XG4gICAgICAgIF0sXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplU3RydWN0LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVTdHJ1Y3QsXG4gICAgfSkpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ3R5cGVfZGVmJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICd0eXBlX2RlZicsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICduZXdfdHlwZV9uYW1lJywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICd0eXBlJywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH1cbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgnZmllbGRfZGVmJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdmaWVsZF9kZWYnLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAnbmFtZScsIHR5cGVOYW1lOiAnc3RyaW5nJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAndHlwZScsIHR5cGVOYW1lOiAnc3RyaW5nJywgdHlwZTogbnVsbCB9XG4gICAgICAgIF0sXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplU3RydWN0LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVTdHJ1Y3QsXG4gICAgfSkpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ3N0cnVjdF9kZWYnLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ3N0cnVjdF9kZWYnLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAnbmFtZScsIHR5cGVOYW1lOiAnc3RyaW5nJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnYmFzZScsIHR5cGVOYW1lOiAnc3RyaW5nJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnZmllbGRzJywgdHlwZU5hbWU6ICdmaWVsZF9kZWZbXScsIHR5cGU6IG51bGwgfVxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdhY3Rpb25fZGVmJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdhY3Rpb25fZGVmJyxcbiAgICAgICAgYmFzZU5hbWU6ICcnLFxuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ25hbWUnLCB0eXBlTmFtZTogJ25hbWUnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICd0eXBlJywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdyaWNhcmRpYW5fY29udHJhY3QnLCB0eXBlTmFtZTogJ3N0cmluZycsIHR5cGU6IG51bGwgfVxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCd0YWJsZV9kZWYnLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ3RhYmxlX2RlZicsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICduYW1lJywgdHlwZU5hbWU6ICduYW1lJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnaW5kZXhfdHlwZScsIHR5cGVOYW1lOiAnc3RyaW5nJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAna2V5X25hbWVzJywgdHlwZU5hbWU6ICdzdHJpbmdbXScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2tleV90eXBlcycsIHR5cGVOYW1lOiAnc3RyaW5nW10nLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICd0eXBlJywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH1cbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgnY2xhdXNlX3BhaXInLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ2NsYXVzZV9wYWlyJyxcbiAgICAgICAgYmFzZU5hbWU6ICcnLFxuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ2lkJywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdib2R5JywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH1cbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgnZXJyb3JfbWVzc2FnZScsIGNyZWF0ZVR5cGUoe1xuICAgICAgICBuYW1lOiAnZXJyb3JfbWVzc2FnZScsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICdlcnJvcl9jb2RlJywgdHlwZU5hbWU6ICd1aW50NjQnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdlcnJvcl9tc2cnLCB0eXBlTmFtZTogJ3N0cmluZycsIHR5cGU6IG51bGwgfVxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCd2YXJpYW50X2RlZicsIGNyZWF0ZVR5cGUoe1xuICAgICAgICBuYW1lOiAndmFyaWFudF9kZWYnLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAnbmFtZScsIHR5cGVOYW1lOiAnc3RyaW5nJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAndHlwZXMnLCB0eXBlTmFtZTogJ3N0cmluZ1tdJywgdHlwZTogbnVsbCB9XG4gICAgICAgIF0sXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplU3RydWN0LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVTdHJ1Y3QsXG4gICAgfSkpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ2FjdGlvbl9yZXN1bHQnLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ2FjdGlvbl9yZXN1bHQnLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAnbmFtZScsIHR5cGVOYW1lOiAnbmFtZScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3Jlc3VsdF90eXBlJywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH1cbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgncHJpbWFyeV9rZXlfaW5kZXhfZGVmJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdwcmltYXJ5X2tleV9pbmRleF9kZWYnLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAnbmFtZScsIHR5cGVOYW1lOiAnbmFtZScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3R5cGUnLCB0eXBlTmFtZTogJ3N0cmluZycsIHR5cGU6IG51bGwgfVxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdzZWNvbmRhcnlfaW5kZXhfZGVmJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdzZWNvbmRhcnlfaW5kZXhfZGVmJyxcbiAgICAgICAgYmFzZU5hbWU6ICcnLFxuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ3R5cGUnLCB0eXBlTmFtZTogJ3N0cmluZycsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgnc2Vjb25kYXJ5X2luZGljZXMnLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogJ3NlY29uZGFyeV9pbmRpY2VzJyxcbiAgICAgICAgYmFzZU5hbWU6ICcnLFxuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ25hbWUnLCB0eXBlTmFtZTogJ25hbWUnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdzZWNvbmRhcnlfaW5kZXhfZGVmJywgdHlwZU5hbWU6ICdzZWNvbmRhcnlfaW5kZXhfZGVmJywgdHlwZTogbnVsbCB9XG4gICAgICAgIF0sXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplT2JqZWN0LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVPYmplY3QsXG4gICAgfSkpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ2t2X3RhYmxlX2VudHJ5X2RlZicsIGNyZWF0ZVR5cGUoe1xuICAgICAgICBuYW1lOiAna3ZfdGFibGVfZW50cnlfZGVmJyxcbiAgICAgICAgYmFzZU5hbWU6ICcnLFxuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ3R5cGUnLCB0eXBlTmFtZTogJ3N0cmluZycsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3ByaW1hcnlfaW5kZXgnLCB0eXBlTmFtZTogJ3ByaW1hcnlfa2V5X2luZGV4X2RlZicsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3NlY29uZGFyeV9pbmRpY2VzJywgdHlwZU5hbWU6ICdzZWNvbmRhcnlfaW5kaWNlcycsIHR5cGU6IG51bGwgfVxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdrdl90YWJsZScsIGNyZWF0ZVR5cGUoe1xuICAgICAgICBuYW1lOiAna3ZfdGFibGUnLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAnbmFtZScsIHR5cGVOYW1lOiAnbmFtZScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2t2X3RhYmxlX2VudHJ5X2RlZicsIHR5cGVOYW1lOiAna3ZfdGFibGVfZW50cnlfZGVmJywgdHlwZTogbnVsbCB9XG4gICAgICAgIF0sXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplT2JqZWN0LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVPYmplY3RcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgnYWJpX2RlZicsIGNyZWF0ZVR5cGUoe1xuICAgICAgICBuYW1lOiAnYWJpX2RlZicsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICd2ZXJzaW9uJywgdHlwZU5hbWU6ICdzdHJpbmcnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICd0eXBlcycsIHR5cGVOYW1lOiAndHlwZV9kZWZbXScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3N0cnVjdHMnLCB0eXBlTmFtZTogJ3N0cnVjdF9kZWZbXScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2FjdGlvbnMnLCB0eXBlTmFtZTogJ2FjdGlvbl9kZWZbXScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3RhYmxlcycsIHR5cGVOYW1lOiAndGFibGVfZGVmW10nLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdyaWNhcmRpYW5fY2xhdXNlcycsIHR5cGVOYW1lOiAnY2xhdXNlX3BhaXJbXScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2Vycm9yX21lc3NhZ2VzJywgdHlwZU5hbWU6ICdlcnJvcl9tZXNzYWdlW10nLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdhYmlfZXh0ZW5zaW9ucycsIHR5cGVOYW1lOiAnZXh0ZW5zaW9uc19lbnRyeVtdJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAndmFyaWFudHMnLCB0eXBlTmFtZTogJ3ZhcmlhbnRfZGVmW10kJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnYWN0aW9uX3Jlc3VsdHMnLCB0eXBlTmFtZTogJ2FjdGlvbl9yZXN1bHRbXSQnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdrdl90YWJsZXMnLCB0eXBlTmFtZTogJ2t2X3RhYmxlJCcsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgcmV0dXJuIGluaXRpYWxUeXBlcztcbn07XG5leHBvcnRzLmNyZWF0ZUFiaVR5cGVzID0gY3JlYXRlQWJpVHlwZXM7XG52YXIgY3JlYXRlVHJhbnNhY3Rpb25FeHRlbnNpb25UeXBlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5pdGlhbFR5cGVzID0gKDAsIGV4cG9ydHMuY3JlYXRlSW5pdGlhbFR5cGVzKSgpO1xuICAgIGluaXRpYWxUeXBlcy5zZXQoJ3Jlc291cmNlX3BheWVyJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdyZXNvdXJjZV9wYXllcicsXG4gICAgICAgIGJhc2VOYW1lOiAnJyxcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICdwYXllcicsIHR5cGVOYW1lOiAnbmFtZScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ21heF9uZXRfYnl0ZXMnLCB0eXBlTmFtZTogJ3VpbnQ2NCcsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ21heF9jcHVfdXMnLCB0eXBlTmFtZTogJ3VpbnQ2NCcsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ21heF9tZW1vcnlfYnl0ZXMnLCB0eXBlTmFtZTogJ3VpbnQ2NCcsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgcmV0dXJuIGluaXRpYWxUeXBlcztcbn07XG5leHBvcnRzLmNyZWF0ZVRyYW5zYWN0aW9uRXh0ZW5zaW9uVHlwZXMgPSBjcmVhdGVUcmFuc2FjdGlvbkV4dGVuc2lvblR5cGVzO1xudmFyIGNyZWF0ZVRyYW5zYWN0aW9uVHlwZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGluaXRpYWxUeXBlcyA9ICgwLCBleHBvcnRzLmNyZWF0ZUluaXRpYWxUeXBlcykoKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdwZXJtaXNzaW9uX2xldmVsJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdwZXJtaXNzaW9uX2xldmVsJyxcbiAgICAgICAgYmFzZU5hbWU6ICcnLFxuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ2FjdG9yJywgdHlwZU5hbWU6ICduYW1lJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAncGVybWlzc2lvbicsIHR5cGVOYW1lOiAnbmFtZScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgnYWN0aW9uJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdhY3Rpb24nLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAnYWNjb3VudCcsIHR5cGVOYW1lOiAnbmFtZScsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ25hbWUnLCB0eXBlTmFtZTogJ25hbWUnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdhdXRob3JpemF0aW9uJywgdHlwZU5hbWU6ICdwZXJtaXNzaW9uX2xldmVsW10nLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdkYXRhJywgdHlwZU5hbWU6ICdieXRlcycsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgnZXh0ZW5zaW9uJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdleHRlbnNpb24nLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAndHlwZScsIHR5cGVOYW1lOiAndWludDE2JywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnZGF0YScsIHR5cGVOYW1lOiAnYnl0ZXMnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplUGFpcixcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplUGFpcixcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgndHJhbnNhY3Rpb25faGVhZGVyJywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICd0cmFuc2FjdGlvbl9oZWFkZXInLFxuICAgICAgICBiYXNlTmFtZTogJycsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAnZXhwaXJhdGlvbicsIHR5cGVOYW1lOiAndGltZV9wb2ludF9zZWMnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdyZWZfYmxvY2tfbnVtJywgdHlwZU5hbWU6ICd1aW50MTYnLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdyZWZfYmxvY2tfcHJlZml4JywgdHlwZU5hbWU6ICd1aW50MzInLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdtYXhfbmV0X3VzYWdlX3dvcmRzJywgdHlwZU5hbWU6ICd2YXJ1aW50MzInLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdtYXhfY3B1X3VzYWdlX21zJywgdHlwZU5hbWU6ICd1aW50OCcsIHR5cGU6IG51bGwgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2RlbGF5X3NlYycsIHR5cGVOYW1lOiAndmFydWludDMyJywgdHlwZTogbnVsbCB9LFxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCd0cmFuc2FjdGlvbicsIGNyZWF0ZVR5cGUoe1xuICAgICAgICBuYW1lOiAndHJhbnNhY3Rpb24nLFxuICAgICAgICBiYXNlTmFtZTogJ3RyYW5zYWN0aW9uX2hlYWRlcicsXG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgeyBuYW1lOiAnY29udGV4dF9mcmVlX2FjdGlvbnMnLCB0eXBlTmFtZTogJ2FjdGlvbltdJywgdHlwZTogbnVsbCB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnYWN0aW9ucycsIHR5cGVOYW1lOiAnYWN0aW9uW10nLCB0eXBlOiBudWxsIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICd0cmFuc2FjdGlvbl9leHRlbnNpb25zJywgdHlwZU5hbWU6ICdleHRlbnNpb24nLCB0eXBlOiBudWxsIH1cbiAgICAgICAgXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICB9KSk7XG4gICAgcmV0dXJuIGluaXRpYWxUeXBlcztcbn07XG5leHBvcnRzLmNyZWF0ZVRyYW5zYWN0aW9uVHlwZXMgPSBjcmVhdGVUcmFuc2FjdGlvblR5cGVzO1xuLyoqIEdldCB0eXBlIGZyb20gYHR5cGVzYCAqL1xudmFyIGdldFR5cGUgPSBmdW5jdGlvbiAodHlwZXMsIG5hbWUpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVzLmdldChuYW1lKTtcbiAgICBpZiAodHlwZSAmJiB0eXBlLmFsaWFzT2ZOYW1lKSB7XG4gICAgICAgIHJldHVybiAoMCwgZXhwb3J0cy5nZXRUeXBlKSh0eXBlcywgdHlwZS5hbGlhc09mTmFtZSk7XG4gICAgfVxuICAgIGlmICh0eXBlKSB7XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cbiAgICBpZiAobmFtZS5lbmRzV2l0aCgnW10nKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgYXJyYXlPZjogKDAsIGV4cG9ydHMuZ2V0VHlwZSkodHlwZXMsIG5hbWUuc3Vic3RyKDAsIG5hbWUubGVuZ3RoIC0gMikpLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVBcnJheSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUFycmF5LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG5hbWUuZW5kc1dpdGgoJz8nKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgb3B0aW9uYWxPZjogKDAsIGV4cG9ydHMuZ2V0VHlwZSkodHlwZXMsIG5hbWUuc3Vic3RyKDAsIG5hbWUubGVuZ3RoIC0gMSkpLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVPcHRpb25hbCxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZU9wdGlvbmFsLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG5hbWUuZW5kc1dpdGgoJyQnKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgZXh0ZW5zaW9uT2Y6ICgwLCBleHBvcnRzLmdldFR5cGUpKHR5cGVzLCBuYW1lLnN1YnN0cigwLCBuYW1lLmxlbmd0aCAtIDEpKSxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplRXh0ZW5zaW9uLFxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplRXh0ZW5zaW9uLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHR5cGU6ICcgKyBuYW1lKTtcbn07XG5leHBvcnRzLmdldFR5cGUgPSBnZXRUeXBlO1xuLyoqXG4gKiBHZXQgdHlwZXMgZnJvbSBhYmlcbiAqXG4gKiBAcGFyYW0gaW5pdGlhbFR5cGVzIFNldCBvZiB0eXBlcyB0byBidWlsZCBvbi5cbiAqIEluIG1vc3QgY2FzZXMsIGl0J3MgYmVzdCB0byBmaWxsIHRoaXMgZnJvbSBhIGZyZXNoIGNhbGwgdG8gYGdldFR5cGVzRnJvbUFiaSgpYC5cbiAqL1xudmFyIGdldFR5cGVzRnJvbUFiaSA9IGZ1bmN0aW9uIChpbml0aWFsVHlwZXMsIGFiaSkge1xuICAgIHZhciBlXzYsIF9hLCBlXzcsIF9iLCBlXzgsIF9jLCBlXzksIF9kLCBlXzEwLCBfZTtcbiAgICB2YXIgdHlwZXMgPSBuZXcgTWFwKGluaXRpYWxUeXBlcyk7XG4gICAgaWYgKGFiaSAmJiBhYmkudHlwZXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIF9mID0gX192YWx1ZXMoYWJpLnR5cGVzKSwgX2cgPSBfZi5uZXh0KCk7ICFfZy5kb25lOyBfZyA9IF9mLm5leHQoKSkge1xuICAgICAgICAgICAgICAgIHZhciBfaCA9IF9nLnZhbHVlLCBuZXdfdHlwZV9uYW1lID0gX2gubmV3X3R5cGVfbmFtZSwgdHlwZSA9IF9oLnR5cGU7XG4gICAgICAgICAgICAgICAgdHlwZXMuc2V0KG5ld190eXBlX25hbWUsIGNyZWF0ZVR5cGUoeyBuYW1lOiBuZXdfdHlwZV9uYW1lLCBhbGlhc09mTmFtZTogdHlwZSB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVfNl8xKSB7IGVfNiA9IHsgZXJyb3I6IGVfNl8xIH07IH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChfZyAmJiAhX2cuZG9uZSAmJiAoX2EgPSBfZi5yZXR1cm4pKSBfYS5jYWxsKF9mKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV82KSB0aHJvdyBlXzYuZXJyb3I7IH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoYWJpICYmIGFiaS5zdHJ1Y3RzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaiA9IF9fdmFsdWVzKGFiaS5zdHJ1Y3RzKSwgX2sgPSBfai5uZXh0KCk7ICFfay5kb25lOyBfayA9IF9qLm5leHQoKSkge1xuICAgICAgICAgICAgICAgIHZhciBfbCA9IF9rLnZhbHVlLCBuYW1lXzEgPSBfbC5uYW1lLCBiYXNlID0gX2wuYmFzZSwgZmllbGRzID0gX2wuZmllbGRzO1xuICAgICAgICAgICAgICAgIHR5cGVzLnNldChuYW1lXzEsIGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lXzEsXG4gICAgICAgICAgICAgICAgICAgIGJhc2VOYW1lOiBiYXNlLFxuICAgICAgICAgICAgICAgICAgICBmaWVsZHM6IGZpZWxkcy5tYXAoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbiA9IF9hLm5hbWUsIHR5cGUgPSBfYS50eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh7IG5hbWU6IG4sIHR5cGVOYW1lOiB0eXBlLCB0eXBlOiBudWxsIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgICAgICAgICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVfN18xKSB7IGVfNyA9IHsgZXJyb3I6IGVfN18xIH07IH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChfayAmJiAhX2suZG9uZSAmJiAoX2IgPSBfai5yZXR1cm4pKSBfYi5jYWxsKF9qKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV83KSB0aHJvdyBlXzcuZXJyb3I7IH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoYWJpICYmIGFiaS52YXJpYW50cykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX20gPSBfX3ZhbHVlcyhhYmkudmFyaWFudHMpLCBfbyA9IF9tLm5leHQoKTsgIV9vLmRvbmU7IF9vID0gX20ubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9wID0gX28udmFsdWUsIG5hbWVfMiA9IF9wLm5hbWUsIHQgPSBfcC50eXBlcztcbiAgICAgICAgICAgICAgICB0eXBlcy5zZXQobmFtZV8yLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZV8yLFxuICAgICAgICAgICAgICAgICAgICBmaWVsZHM6IHQubWFwKGZ1bmN0aW9uIChzKSB7IHJldHVybiAoeyBuYW1lOiBzLCB0eXBlTmFtZTogcywgdHlwZTogbnVsbCB9KTsgfSksXG4gICAgICAgICAgICAgICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplVmFyaWFudCxcbiAgICAgICAgICAgICAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplVmFyaWFudCxcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVfOF8xKSB7IGVfOCA9IHsgZXJyb3I6IGVfOF8xIH07IH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChfbyAmJiAhX28uZG9uZSAmJiAoX2MgPSBfbS5yZXR1cm4pKSBfYy5jYWxsKF9tKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV84KSB0aHJvdyBlXzguZXJyb3I7IH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciB0eXBlc18xID0gX192YWx1ZXModHlwZXMpLCB0eXBlc18xXzEgPSB0eXBlc18xLm5leHQoKTsgIXR5cGVzXzFfMS5kb25lOyB0eXBlc18xXzEgPSB0eXBlc18xLm5leHQoKSkge1xuICAgICAgICAgICAgdmFyIF9xID0gX19yZWFkKHR5cGVzXzFfMS52YWx1ZSwgMiksIG5hbWVfMyA9IF9xWzBdLCB0eXBlID0gX3FbMV07XG4gICAgICAgICAgICBpZiAodHlwZS5iYXNlTmFtZSkge1xuICAgICAgICAgICAgICAgIHR5cGUuYmFzZSA9ICgwLCBleHBvcnRzLmdldFR5cGUpKHR5cGVzLCB0eXBlLmJhc2VOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX3IgPSAoZV8xMCA9IHZvaWQgMCwgX192YWx1ZXModHlwZS5maWVsZHMpKSwgX3MgPSBfci5uZXh0KCk7ICFfcy5kb25lOyBfcyA9IF9yLm5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBfcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQudHlwZSA9ICgwLCBleHBvcnRzLmdldFR5cGUpKHR5cGVzLCBmaWVsZC50eXBlTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVfMTBfMSkgeyBlXzEwID0geyBlcnJvcjogZV8xMF8xIH07IH1cbiAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfcyAmJiAhX3MuZG9uZSAmJiAoX2UgPSBfci5yZXR1cm4pKSBfZS5jYWxsKF9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEwKSB0aHJvdyBlXzEwLmVycm9yOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVfOV8xKSB7IGVfOSA9IHsgZXJyb3I6IGVfOV8xIH07IH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0eXBlc18xXzEgJiYgIXR5cGVzXzFfMS5kb25lICYmIChfZCA9IHR5cGVzXzEucmV0dXJuKSkgX2QuY2FsbCh0eXBlc18xKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHsgaWYgKGVfOSkgdGhyb3cgZV85LmVycm9yOyB9XG4gICAgfVxuICAgIHJldHVybiB0eXBlcztcbn07IC8vIGdldFR5cGVzRnJvbUFiaVxuZXhwb3J0cy5nZXRUeXBlc0Zyb21BYmkgPSBnZXRUeXBlc0Zyb21BYmk7XG52YXIgcmV2ZXJzZUhleCA9IGZ1bmN0aW9uIChoKSB7XG4gICAgcmV0dXJuIGguc3Vic3RyKDYsIDIpICsgaC5zdWJzdHIoNCwgMikgKyBoLnN1YnN0cigyLCAyKSArIGguc3Vic3RyKDAsIDIpO1xufTtcbi8qKiBUQVBvUzogUmV0dXJuIHRyYW5zYWN0aW9uIGZpZWxkcyB3aGljaCByZWZlcmVuY2UgYHJlZkJsb2NrYCBhbmQgZXhwaXJlIGBleHBpcmVTZWNvbmRzYCBhZnRlciBgdGltZXN0YW1wYCAqL1xudmFyIHRyYW5zYWN0aW9uSGVhZGVyID0gZnVuY3Rpb24gKHJlZkJsb2NrLCBleHBpcmVTZWNvbmRzKSB7XG4gICAgdmFyIHRpbWVzdGFtcCA9IHJlZkJsb2NrLmhlYWRlciA/IHJlZkJsb2NrLmhlYWRlci50aW1lc3RhbXAgOiByZWZCbG9jay50aW1lc3RhbXA7XG4gICAgdmFyIHByZWZpeCA9IHBhcnNlSW50KHJldmVyc2VIZXgocmVmQmxvY2suaWQuc3Vic3RyKDE2LCA4KSksIDE2KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBleHBpcmF0aW9uOiAoMCwgZXhwb3J0cy50aW1lUG9pbnRTZWNUb0RhdGUpKCgwLCBleHBvcnRzLmRhdGVUb1RpbWVQb2ludFNlYykodGltZXN0YW1wKSArIGV4cGlyZVNlY29uZHMpLFxuICAgICAgICByZWZfYmxvY2tfbnVtOiByZWZCbG9jay5ibG9ja19udW0gJiAweGZmZmYsXG4gICAgICAgIHJlZl9ibG9ja19wcmVmaXg6IHByZWZpeCxcbiAgICB9O1xufTtcbmV4cG9ydHMudHJhbnNhY3Rpb25IZWFkZXIgPSB0cmFuc2FjdGlvbkhlYWRlcjtcbi8qKiBDb252ZXJ0IGFjdGlvbiBkYXRhIHRvIHNlcmlhbGl6ZWQgZm9ybSAoaGV4KSAqL1xudmFyIHNlcmlhbGl6ZUFjdGlvbkRhdGEgPSBmdW5jdGlvbiAoY29udHJhY3QsIGFjY291bnQsIG5hbWUsIGRhdGEsIHRleHRFbmNvZGVyLCB0ZXh0RGVjb2Rlcikge1xuICAgIHZhciBhY3Rpb24gPSBjb250cmFjdC5hY3Rpb25zLmdldChuYW1lKTtcbiAgICBpZiAoIWFjdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGFjdGlvbiBcIiArIG5hbWUgKyBcIiBpbiBjb250cmFjdCBcIiArIGFjY291bnQpO1xuICAgIH1cbiAgICB2YXIgYnVmZmVyID0gbmV3IFNlcmlhbEJ1ZmZlcih7IHRleHRFbmNvZGVyOiB0ZXh0RW5jb2RlciwgdGV4dERlY29kZXI6IHRleHREZWNvZGVyIH0pO1xuICAgIGFjdGlvbi5zZXJpYWxpemUoYnVmZmVyLCBkYXRhKTtcbiAgICByZXR1cm4gKDAsIGV4cG9ydHMuYXJyYXlUb0hleCkoYnVmZmVyLmFzVWludDhBcnJheSgpKTtcbn07XG5leHBvcnRzLnNlcmlhbGl6ZUFjdGlvbkRhdGEgPSBzZXJpYWxpemVBY3Rpb25EYXRhO1xuLyoqIFJldHVybiBhY3Rpb24gaW4gc2VyaWFsaXplZCBmb3JtICovXG52YXIgc2VyaWFsaXplQWN0aW9uID0gZnVuY3Rpb24gKGNvbnRyYWN0LCBhY2NvdW50LCBuYW1lLCBhdXRob3JpemF0aW9uLCBkYXRhLCB0ZXh0RW5jb2RlciwgdGV4dERlY29kZXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhY2NvdW50OiBhY2NvdW50LFxuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBhdXRob3JpemF0aW9uOiBhdXRob3JpemF0aW9uLFxuICAgICAgICBkYXRhOiAoMCwgZXhwb3J0cy5zZXJpYWxpemVBY3Rpb25EYXRhKShjb250cmFjdCwgYWNjb3VudCwgbmFtZSwgZGF0YSwgdGV4dEVuY29kZXIsIHRleHREZWNvZGVyKSxcbiAgICB9O1xufTtcbmV4cG9ydHMuc2VyaWFsaXplQWN0aW9uID0gc2VyaWFsaXplQWN0aW9uO1xuLyoqIERlc2VyaWFsaXplIGFjdGlvbiBkYXRhLiBJZiBgZGF0YWAgaXMgYSBgc3RyaW5nYCwgdGhlbiBpdCdzIGFzc3VtZWQgdG8gYmUgaW4gaGV4LiAqL1xudmFyIGRlc2VyaWFsaXplQWN0aW9uRGF0YSA9IGZ1bmN0aW9uIChjb250cmFjdCwgYWNjb3VudCwgbmFtZSwgZGF0YSwgdGV4dEVuY29kZXIsIHRleHREZWNvZGVyKSB7XG4gICAgdmFyIGFjdGlvbiA9IGNvbnRyYWN0LmFjdGlvbnMuZ2V0KG5hbWUpO1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZGF0YSA9ICgwLCBleHBvcnRzLmhleFRvVWludDhBcnJheSkoZGF0YSk7XG4gICAgfVxuICAgIGlmICghYWN0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gYWN0aW9uIFwiICsgbmFtZSArIFwiIGluIGNvbnRyYWN0IFwiICsgYWNjb3VudCk7XG4gICAgfVxuICAgIHZhciBidWZmZXIgPSBuZXcgU2VyaWFsQnVmZmVyKHsgdGV4dERlY29kZXI6IHRleHREZWNvZGVyLCB0ZXh0RW5jb2RlcjogdGV4dEVuY29kZXIgfSk7XG4gICAgYnVmZmVyLnB1c2hBcnJheShkYXRhKTtcbiAgICByZXR1cm4gYWN0aW9uLmRlc2VyaWFsaXplKGJ1ZmZlcik7XG59O1xuZXhwb3J0cy5kZXNlcmlhbGl6ZUFjdGlvbkRhdGEgPSBkZXNlcmlhbGl6ZUFjdGlvbkRhdGE7XG4vKiogRGVzZXJpYWxpemUgYWN0aW9uLiBJZiBgZGF0YWAgaXMgYSBgc3RyaW5nYCwgdGhlbiBpdCdzIGFzc3VtZWQgdG8gYmUgaW4gaGV4LiAqL1xudmFyIGRlc2VyaWFsaXplQWN0aW9uID0gZnVuY3Rpb24gKGNvbnRyYWN0LCBhY2NvdW50LCBuYW1lLCBhdXRob3JpemF0aW9uLCBkYXRhLCB0ZXh0RW5jb2RlciwgdGV4dERlY29kZXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhY2NvdW50OiBhY2NvdW50LFxuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBhdXRob3JpemF0aW9uOiBhdXRob3JpemF0aW9uLFxuICAgICAgICBkYXRhOiAoMCwgZXhwb3J0cy5kZXNlcmlhbGl6ZUFjdGlvbkRhdGEpKGNvbnRyYWN0LCBhY2NvdW50LCBuYW1lLCBkYXRhLCB0ZXh0RW5jb2RlciwgdGV4dERlY29kZXIpLFxuICAgIH07XG59O1xuZXhwb3J0cy5kZXNlcmlhbGl6ZUFjdGlvbiA9IGRlc2VyaWFsaXplQWN0aW9uO1xudmFyIHNlcmlhbGl6ZUFueXZhciA9IGZ1bmN0aW9uIChidWZmZXIsIGFueXZhcikge1xuICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mLCBfZztcbiAgICB2YXIgZGVmO1xuICAgIHZhciB2YWx1ZTtcbiAgICBpZiAoYW55dmFyID09PSBudWxsKSB7XG4gICAgICAgIF9hID0gX19yZWFkKFthbnl2YXJEZWZzLm51bGxfdCwgYW55dmFyXSwgMiksIGRlZiA9IF9hWzBdLCB2YWx1ZSA9IF9hWzFdO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgYW55dmFyID09PSAnc3RyaW5nJykge1xuICAgICAgICBfYiA9IF9fcmVhZChbYW55dmFyRGVmcy5zdHJpbmcsIGFueXZhcl0sIDIpLCBkZWYgPSBfYlswXSwgdmFsdWUgPSBfYlsxXTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGFueXZhciA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgX2MgPSBfX3JlYWQoW2FueXZhckRlZnMuaW50MzIsIGFueXZhcl0sIDIpLCBkZWYgPSBfY1swXSwgdmFsdWUgPSBfY1sxXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoYW55dmFyIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICBfZCA9IF9fcmVhZChbYW55dmFyRGVmcy5ieXRlcywgYW55dmFyXSwgMiksIGRlZiA9IF9kWzBdLCB2YWx1ZSA9IF9kWzFdO1xuICAgIH1cbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFueXZhcikpIHtcbiAgICAgICAgX2UgPSBfX3JlYWQoW2FueXZhckRlZnMuYW55X2FycmF5LCBhbnl2YXJdLCAyKSwgZGVmID0gX2VbMF0sIHZhbHVlID0gX2VbMV07XG4gICAgfVxuICAgIGVsc2UgaWYgKE9iamVjdC5rZXlzKGFueXZhcikubGVuZ3RoID09PSAyICYmIGFueXZhci5oYXNPd25Qcm9wZXJ0eSgndHlwZScpICYmIGFueXZhci5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xuICAgICAgICBfZiA9IF9fcmVhZChbYW55dmFyRGVmc1thbnl2YXIudHlwZV0sIGFueXZhci52YWx1ZV0sIDIpLCBkZWYgPSBfZlswXSwgdmFsdWUgPSBfZlsxXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIF9nID0gX19yZWFkKFthbnl2YXJEZWZzLmFueV9vYmplY3QsIGFueXZhcl0sIDIpLCBkZWYgPSBfZ1swXSwgdmFsdWUgPSBfZ1sxXTtcbiAgICB9XG4gICAgYnVmZmVyLnB1c2hWYXJ1aW50MzIoZGVmLmluZGV4KTtcbiAgICBkZWYudHlwZS5zZXJpYWxpemUoYnVmZmVyLCB2YWx1ZSk7XG59O1xuZXhwb3J0cy5zZXJpYWxpemVBbnl2YXIgPSBzZXJpYWxpemVBbnl2YXI7XG52YXIgZGVzZXJpYWxpemVBbnl2YXIgPSBmdW5jdGlvbiAoYnVmZmVyLCBzdGF0ZSkge1xuICAgIHZhciBkZWZJbmRleCA9IGJ1ZmZlci5nZXRWYXJ1aW50MzIoKTtcbiAgICBpZiAoZGVmSW5kZXggPj0gYW55dmFyRGVmc0J5SW5kZXgubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVHJpZWQgdG8gZGVzZXJpYWxpemUgdW5rbm93biBhbnl2YXIgdHlwZScpO1xuICAgIH1cbiAgICB2YXIgZGVmID0gYW55dmFyRGVmc0J5SW5kZXhbZGVmSW5kZXhdO1xuICAgIHZhciB2YWx1ZSA9IGRlZi50eXBlLmRlc2VyaWFsaXplKGJ1ZmZlciwgc3RhdGUpO1xuICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5vcHRpb25zLnVzZVNob3J0Rm9ybSB8fCBkZWYudXNlU2hvcnRGb3JtKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7IHR5cGU6IGRlZi50eXBlLm5hbWUsIHZhbHVlOiB2YWx1ZSB9O1xuICAgIH1cbn07XG5leHBvcnRzLmRlc2VyaWFsaXplQW55dmFyID0gZGVzZXJpYWxpemVBbnl2YXI7XG52YXIgZGVzZXJpYWxpemVBbnl2YXJTaG9ydCA9IGZ1bmN0aW9uIChidWZmZXIpIHtcbiAgICByZXR1cm4gKDAsIGV4cG9ydHMuZGVzZXJpYWxpemVBbnl2YXIpKGJ1ZmZlciwgbmV3IFNlcmlhbGl6ZXJTdGF0ZSh7IHVzZVNob3J0Rm9ybTogdHJ1ZSB9KSk7XG59O1xuZXhwb3J0cy5kZXNlcmlhbGl6ZUFueXZhclNob3J0ID0gZGVzZXJpYWxpemVBbnl2YXJTaG9ydDtcbnZhciBzZXJpYWxpemVBbnlPYmplY3QgPSBmdW5jdGlvbiAoYnVmZmVyLCBvYmopIHtcbiAgICB2YXIgZV8xMSwgX2E7XG4gICAgdmFyIGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhvYmopO1xuICAgIGJ1ZmZlci5wdXNoVmFydWludDMyKGVudHJpZXMubGVuZ3RoKTtcbiAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBlbnRyaWVzXzIgPSBfX3ZhbHVlcyhlbnRyaWVzKSwgZW50cmllc18yXzEgPSBlbnRyaWVzXzIubmV4dCgpOyAhZW50cmllc18yXzEuZG9uZTsgZW50cmllc18yXzEgPSBlbnRyaWVzXzIubmV4dCgpKSB7XG4gICAgICAgICAgICB2YXIgX2IgPSBfX3JlYWQoZW50cmllc18yXzEudmFsdWUsIDIpLCBrZXkgPSBfYlswXSwgdmFsdWUgPSBfYlsxXTtcbiAgICAgICAgICAgIGJ1ZmZlci5wdXNoU3RyaW5nKGtleSk7XG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5zZXJpYWxpemVBbnl2YXIpKGJ1ZmZlciwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlXzExXzEpIHsgZV8xMSA9IHsgZXJyb3I6IGVfMTFfMSB9OyB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoZW50cmllc18yXzEgJiYgIWVudHJpZXNfMl8xLmRvbmUgJiYgKF9hID0gZW50cmllc18yLnJldHVybikpIF9hLmNhbGwoZW50cmllc18yKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMTEpIHRocm93IGVfMTEuZXJyb3I7IH1cbiAgICB9XG59O1xuZXhwb3J0cy5zZXJpYWxpemVBbnlPYmplY3QgPSBzZXJpYWxpemVBbnlPYmplY3Q7XG52YXIgZGVzZXJpYWxpemVBbnlPYmplY3QgPSBmdW5jdGlvbiAoYnVmZmVyLCBzdGF0ZSkge1xuICAgIHZhciBsZW4gPSBidWZmZXIuZ2V0VmFydWludDMyKCk7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdmFyIGtleSA9IGJ1ZmZlci5nZXRTdHJpbmcoKTtcbiAgICAgICAgaWYgKGtleSBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgIHZhciBqID0gMTtcbiAgICAgICAgICAgIHdoaWxlIChrZXkgKyAnXycgKyBqIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICsrajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleSA9IGtleSArICdfJyArIGo7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0W2tleV0gPSAoMCwgZXhwb3J0cy5kZXNlcmlhbGl6ZUFueXZhcikoYnVmZmVyLCBzdGF0ZSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuZXhwb3J0cy5kZXNlcmlhbGl6ZUFueU9iamVjdCA9IGRlc2VyaWFsaXplQW55T2JqZWN0O1xudmFyIHNlcmlhbGl6ZUFueUFycmF5ID0gZnVuY3Rpb24gKGJ1ZmZlciwgYXJyKSB7XG4gICAgdmFyIGVfMTIsIF9hO1xuICAgIGJ1ZmZlci5wdXNoVmFydWludDMyKGFyci5sZW5ndGgpO1xuICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGFycl8xID0gX192YWx1ZXMoYXJyKSwgYXJyXzFfMSA9IGFycl8xLm5leHQoKTsgIWFycl8xXzEuZG9uZTsgYXJyXzFfMSA9IGFycl8xLm5leHQoKSkge1xuICAgICAgICAgICAgdmFyIHggPSBhcnJfMV8xLnZhbHVlO1xuICAgICAgICAgICAgKDAsIGV4cG9ydHMuc2VyaWFsaXplQW55dmFyKShidWZmZXIsIHgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlXzEyXzEpIHsgZV8xMiA9IHsgZXJyb3I6IGVfMTJfMSB9OyB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoYXJyXzFfMSAmJiAhYXJyXzFfMS5kb25lICYmIChfYSA9IGFycl8xLnJldHVybikpIF9hLmNhbGwoYXJyXzEpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xMikgdGhyb3cgZV8xMi5lcnJvcjsgfVxuICAgIH1cbn07XG5leHBvcnRzLnNlcmlhbGl6ZUFueUFycmF5ID0gc2VyaWFsaXplQW55QXJyYXk7XG52YXIgZGVzZXJpYWxpemVBbnlBcnJheSA9IGZ1bmN0aW9uIChidWZmZXIsIHN0YXRlKSB7XG4gICAgdmFyIGxlbiA9IGJ1ZmZlci5nZXRWYXJ1aW50MzIoKTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICByZXN1bHQucHVzaCgoMCwgZXhwb3J0cy5kZXNlcmlhbGl6ZUFueXZhcikoYnVmZmVyLCBzdGF0ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbmV4cG9ydHMuZGVzZXJpYWxpemVBbnlBcnJheSA9IGRlc2VyaWFsaXplQW55QXJyYXk7XG52YXIgYWRkQWRkaXRpb25hbFR5cGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbml0aWFsVHlwZXMgPSAoMCwgZXhwb3J0cy5jcmVhdGVJbml0aWFsVHlwZXMpKCk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgnbnVsbF90JywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdudWxsX3QnLFxuICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIChidWZmZXIsIGFueXZhcikgeyB9LFxuICAgICAgICBkZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGJ1ZmZlciwgc3RhdGUpIHsgfVxuICAgIH0pKTtcbiAgICBpbml0aWFsVHlwZXMuc2V0KCdhbnlfb2JqZWN0JywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdhbnlfb2JqZWN0JyxcbiAgICAgICAgc2VyaWFsaXplOiBleHBvcnRzLnNlcmlhbGl6ZUFueU9iamVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGV4cG9ydHMuZGVzZXJpYWxpemVBbnlPYmplY3RcbiAgICB9KSk7XG4gICAgaW5pdGlhbFR5cGVzLnNldCgnYW55X2FycmF5JywgY3JlYXRlVHlwZSh7XG4gICAgICAgIG5hbWU6ICdhbnlfYXJyYXknLFxuICAgICAgICBzZXJpYWxpemU6IGV4cG9ydHMuc2VyaWFsaXplQW55QXJyYXksXG4gICAgICAgIGRlc2VyaWFsaXplOiBleHBvcnRzLmRlc2VyaWFsaXplQW55QXJyYXlcbiAgICB9KSk7XG4gICAgcmV0dXJuIGluaXRpYWxUeXBlcztcbn07XG52YXIgYWRkaXRpb25hbFR5cGVzID0gYWRkQWRkaXRpb25hbFR5cGVzKCk7XG52YXIgYW55dmFyRGVmcyA9IHtcbiAgICBudWxsX3Q6IHsgaW5kZXg6IDAsIHVzZVNob3J0Rm9ybTogdHJ1ZSwgdHlwZTogYWRkaXRpb25hbFR5cGVzLmdldCgnbnVsbF90JykgfSxcbiAgICBpbnQ2NDogeyBpbmRleDogMSwgdXNlU2hvcnRGb3JtOiBmYWxzZSwgdHlwZTogYWRkaXRpb25hbFR5cGVzLmdldCgnaW50NjQnKSB9LFxuICAgIHVpbnQ2NDogeyBpbmRleDogMiwgdXNlU2hvcnRGb3JtOiBmYWxzZSwgdHlwZTogYWRkaXRpb25hbFR5cGVzLmdldCgndWludDY0JykgfSxcbiAgICBpbnQzMjogeyBpbmRleDogMywgdXNlU2hvcnRGb3JtOiB0cnVlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCdpbnQzMicpIH0sXG4gICAgdWludDMyOiB7IGluZGV4OiA0LCB1c2VTaG9ydEZvcm06IGZhbHNlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCd1aW50MzInKSB9LFxuICAgIGludDE2OiB7IGluZGV4OiA1LCB1c2VTaG9ydEZvcm06IGZhbHNlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCdpbnQxNicpIH0sXG4gICAgdWludDE2OiB7IGluZGV4OiA2LCB1c2VTaG9ydEZvcm06IGZhbHNlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCd1aW50MTYnKSB9LFxuICAgIGludDg6IHsgaW5kZXg6IDcsIHVzZVNob3J0Rm9ybTogZmFsc2UsIHR5cGU6IGFkZGl0aW9uYWxUeXBlcy5nZXQoJ2ludDgnKSB9LFxuICAgIHVpbnQ4OiB7IGluZGV4OiA4LCB1c2VTaG9ydEZvcm06IGZhbHNlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCd1aW50OCcpIH0sXG4gICAgdGltZV9wb2ludDogeyBpbmRleDogOSwgdXNlU2hvcnRGb3JtOiBmYWxzZSwgdHlwZTogYWRkaXRpb25hbFR5cGVzLmdldCgndGltZV9wb2ludCcpIH0sXG4gICAgY2hlY2tzdW0yNTY6IHsgaW5kZXg6IDEwLCB1c2VTaG9ydEZvcm06IGZhbHNlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCdjaGVja3N1bTI1NicpIH0sXG4gICAgZmxvYXQ2NDogeyBpbmRleDogMTEsIHVzZVNob3J0Rm9ybTogZmFsc2UsIHR5cGU6IGFkZGl0aW9uYWxUeXBlcy5nZXQoJ2Zsb2F0NjQnKSB9LFxuICAgIHN0cmluZzogeyBpbmRleDogMTIsIHVzZVNob3J0Rm9ybTogdHJ1ZSwgdHlwZTogYWRkaXRpb25hbFR5cGVzLmdldCgnc3RyaW5nJykgfSxcbiAgICBhbnlfb2JqZWN0OiB7IGluZGV4OiAxMywgdXNlU2hvcnRGb3JtOiB0cnVlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCdhbnlfb2JqZWN0JykgfSxcbiAgICBhbnlfYXJyYXk6IHsgaW5kZXg6IDE0LCB1c2VTaG9ydEZvcm06IHRydWUsIHR5cGU6IGFkZGl0aW9uYWxUeXBlcy5nZXQoJ2FueV9hcnJheScpIH0sXG4gICAgYnl0ZXM6IHsgaW5kZXg6IDE1LCB1c2VTaG9ydEZvcm06IGZhbHNlLCB0eXBlOiBhZGRpdGlvbmFsVHlwZXMuZ2V0KCdieXRlcycpIH0sXG4gICAgc3ltYm9sOiB7IGluZGV4OiAxNiwgdXNlU2hvcnRGb3JtOiBmYWxzZSwgdHlwZTogYWRkaXRpb25hbFR5cGVzLmdldCgnc3ltYm9sJykgfSxcbiAgICBzeW1ib2xfY29kZTogeyBpbmRleDogMTcsIHVzZVNob3J0Rm9ybTogZmFsc2UsIHR5cGU6IGFkZGl0aW9uYWxUeXBlcy5nZXQoJ3N5bWJvbF9jb2RlJykgfSxcbiAgICBhc3NldDogeyBpbmRleDogMTgsIHVzZVNob3J0Rm9ybTogZmFsc2UsIHR5cGU6IGFkZGl0aW9uYWxUeXBlcy5nZXQoJ2Fzc2V0JykgfSxcbn07XG52YXIgYW55dmFyRGVmc0J5SW5kZXggPSBbXG4gICAgYW55dmFyRGVmcy5udWxsX3QsXG4gICAgYW55dmFyRGVmcy5pbnQ2NCxcbiAgICBhbnl2YXJEZWZzLnVpbnQ2NCxcbiAgICBhbnl2YXJEZWZzLmludDMyLFxuICAgIGFueXZhckRlZnMudWludDMyLFxuICAgIGFueXZhckRlZnMuaW50MTYsXG4gICAgYW55dmFyRGVmcy51aW50MTYsXG4gICAgYW55dmFyRGVmcy5pbnQ4LFxuICAgIGFueXZhckRlZnMudWludDgsXG4gICAgYW55dmFyRGVmcy50aW1lX3BvaW50LFxuICAgIGFueXZhckRlZnMuY2hlY2tzdW0yNTYsXG4gICAgYW55dmFyRGVmcy5mbG9hdDY0LFxuICAgIGFueXZhckRlZnMuc3RyaW5nLFxuICAgIGFueXZhckRlZnMuYW55X29iamVjdCxcbiAgICBhbnl2YXJEZWZzLmFueV9hcnJheSxcbiAgICBhbnl2YXJEZWZzLmJ5dGVzLFxuICAgIGFueXZhckRlZnMuc3ltYm9sLFxuICAgIGFueXZhckRlZnMuc3ltYm9sX2NvZGUsXG4gICAgYW55dmFyRGVmcy5hc3NldCxcbl07XG52YXIgc2VyaWFsaXplUXVlcnkgPSBmdW5jdGlvbiAoYnVmZmVyLCBxdWVyeSkge1xuICAgIHZhciBfYSwgX2IsIF9jLCBlXzEzLCBfZDtcbiAgICB2YXIgbWV0aG9kO1xuICAgIHZhciBhcmc7XG4gICAgdmFyIGZpbHRlcjtcbiAgICBpZiAodHlwZW9mIHF1ZXJ5ID09PSAnc3RyaW5nJykge1xuICAgICAgICBtZXRob2QgPSBxdWVyeTtcbiAgICB9XG4gICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShxdWVyeSkgJiYgcXVlcnkubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIF9hID0gX19yZWFkKHF1ZXJ5LCAyKSwgbWV0aG9kID0gX2FbMF0sIGZpbHRlciA9IF9hWzFdO1xuICAgIH1cbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHF1ZXJ5KSAmJiBxdWVyeS5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgX2IgPSBfX3JlYWQocXVlcnksIDMpLCBtZXRob2QgPSBfYlswXSwgYXJnID0gX2JbMV0sIGZpbHRlciA9IF9iWzJdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgX2MgPSBfX3JlYWQoW3F1ZXJ5Lm1ldGhvZCwgcXVlcnkuYXJnLCBxdWVyeS5maWx0ZXJdLCAzKSwgbWV0aG9kID0gX2NbMF0sIGFyZyA9IF9jWzFdLCBmaWx0ZXIgPSBfY1syXTtcbiAgICB9XG4gICAgYnVmZmVyLnB1c2hTdHJpbmcobWV0aG9kKTtcbiAgICBpZiAoYXJnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYnVmZmVyLnB1c2goMCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBidWZmZXIucHVzaCgxKTtcbiAgICAgICAgKDAsIGV4cG9ydHMuc2VyaWFsaXplQW55dmFyKShidWZmZXIsIGFyZyk7XG4gICAgfVxuICAgIGlmIChmaWx0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBidWZmZXIucHVzaCgwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoVmFydWludDMyKGZpbHRlci5sZW5ndGgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgZmlsdGVyXzEgPSBfX3ZhbHVlcyhmaWx0ZXIpLCBmaWx0ZXJfMV8xID0gZmlsdGVyXzEubmV4dCgpOyAhZmlsdGVyXzFfMS5kb25lOyBmaWx0ZXJfMV8xID0gZmlsdGVyXzEubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHEgPSBmaWx0ZXJfMV8xLnZhbHVlO1xuICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLnNlcmlhbGl6ZVF1ZXJ5KShidWZmZXIsIHEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlXzEzXzEpIHsgZV8xMyA9IHsgZXJyb3I6IGVfMTNfMSB9OyB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyXzFfMSAmJiAhZmlsdGVyXzFfMS5kb25lICYmIChfZCA9IGZpbHRlcl8xLnJldHVybikpIF9kLmNhbGwoZmlsdGVyXzEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEzKSB0aHJvdyBlXzEzLmVycm9yOyB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0cy5zZXJpYWxpemVRdWVyeSA9IHNlcmlhbGl6ZVF1ZXJ5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEBtb2R1bGUgV2ViQXV0aG4tU2lnXG4gKi9cbi8vIGNvcHlyaWdodCBkZWZpbmVkIGluIGVvc2pzL0xJQ0VOU0UudHh0XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9fdmFsdWVzID0gKHRoaXMgJiYgdGhpcy5fX3ZhbHVlcykgfHwgZnVuY3Rpb24obykge1xuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5XZWJBdXRoblNpZ25hdHVyZVByb3ZpZGVyID0gdm9pZCAwO1xudmFyIHNlciA9IHJlcXVpcmUoXCIuL2Vvc2pzLXNlcmlhbGl6ZVwiKTtcbnZhciBudW1lcmljID0gcmVxdWlyZShcIi4vZW9zanMtbnVtZXJpY1wiKTtcbnZhciBlbGxpcHRpY18xID0gcmVxdWlyZShcImVsbGlwdGljXCIpO1xuLyoqIFNpZ25zIHRyYW5zYWN0aW9ucyB1c2luZyBXZWJBdXRobiAqL1xudmFyIFdlYkF1dGhuU2lnbmF0dXJlUHJvdmlkZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gV2ViQXV0aG5TaWduYXR1cmVQcm92aWRlcigpIHtcbiAgICAgICAgLyoqIE1hcCBwdWJsaWMga2V5IHRvIGNyZWRlbnRpYWwgSUQgKGhleCkuIFVzZXIgbXVzdCBwb3B1bGF0ZSB0aGlzLiAqL1xuICAgICAgICB0aGlzLmtleXMgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIC8qKiBQdWJsaWMga2V5cyB0aGF0IHRoZSBgU2lnbmF0dXJlUHJvdmlkZXJgIGhvbGRzICovXG4gICAgV2ViQXV0aG5TaWduYXR1cmVQcm92aWRlci5wcm90b3R5cGUuZ2V0QXZhaWxhYmxlS2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBBcnJheS5mcm9tKHRoaXMua2V5cy5rZXlzKCkpXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKiBTaWduIGEgdHJhbnNhY3Rpb24gKi9cbiAgICBXZWJBdXRoblNpZ25hdHVyZVByb3ZpZGVyLnByb3RvdHlwZS5zaWduID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBjaGFpbklkID0gX2EuY2hhaW5JZCwgcmVxdWlyZWRLZXlzID0gX2EucmVxdWlyZWRLZXlzLCBzZXJpYWxpemVkVHJhbnNhY3Rpb24gPSBfYS5zZXJpYWxpemVkVHJhbnNhY3Rpb24sIHNlcmlhbGl6ZWRDb250ZXh0RnJlZURhdGEgPSBfYS5zZXJpYWxpemVkQ29udGV4dEZyZWVEYXRhO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2lnbkJ1ZiwgX2IsIF9jLCBfZCwgZGlnZXN0LCBfZSwgc2lnbmF0dXJlcywgcmVxdWlyZWRLZXlzXzEsIHJlcXVpcmVkS2V5c18xXzEsIGtleSwgaWQsIGFzc2VydGlvbiwgZSwgcHViS2V5LCBmaXh1cCwgZGVyLCByLCBzLCB3aGF0SXRSZWFsbHlTaWduZWQsIF9mLCBfZywgX2gsIGhhc2hfMSwgX2osIHJlY2lkLCBzaWdEYXRhLCBzaWcsIGVfMV8xO1xuICAgICAgICAgICAgdmFyIGVfMSwgX2s7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9sKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfbC5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduQnVmID0gbmV3IHNlci5TZXJpYWxCdWZmZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25CdWYucHVzaEFycmF5KHNlci5oZXhUb1VpbnQ4QXJyYXkoY2hhaW5JZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbkJ1Zi5wdXNoQXJyYXkoc2VyaWFsaXplZFRyYW5zYWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2VyaWFsaXplZENvbnRleHRGcmVlRGF0YSkgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XG4gICAgICAgICAgICAgICAgICAgICAgICBfYyA9IChfYiA9IHNpZ25CdWYpLnB1c2hBcnJheTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kID0gVWludDhBcnJheS5iaW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgY3J5cHRvLnN1YnRsZS5kaWdlc3QoJ1NIQS0yNTYnLCBzZXJpYWxpemVkQ29udGV4dEZyZWVEYXRhLmJ1ZmZlcildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYy5hcHBseShfYiwgW25ldyAoX2QuYXBwbHkoVWludDhBcnJheSwgW3ZvaWQgMCwgX2wuc2VudCgpXSkpKCldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDNdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduQnVmLnB1c2hBcnJheShuZXcgVWludDhBcnJheSgzMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2wubGFiZWwgPSAzO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBfZSA9IFVpbnQ4QXJyYXkuYmluZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGNyeXB0by5zdWJ0bGUuZGlnZXN0KCdTSEEtMjU2Jywgc2lnbkJ1Zi5hc1VpbnQ4QXJyYXkoKS5zbGljZSgpLmJ1ZmZlcildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWdlc3QgPSBuZXcgKF9lLmFwcGx5KFVpbnQ4QXJyYXksIFt2b2lkIDAsIF9sLnNlbnQoKV0pKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmF0dXJlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2wubGFiZWwgPSA1O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICBfbC50cnlzLnB1c2goWzUsIDEyLCAxMywgMTRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkS2V5c18xID0gX192YWx1ZXMocmVxdWlyZWRLZXlzKSwgcmVxdWlyZWRLZXlzXzFfMSA9IHJlcXVpcmVkS2V5c18xLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9sLmxhYmVsID0gNjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEhcmVxdWlyZWRLZXlzXzFfMS5kb25lKSByZXR1cm4gWzMgLypicmVhayovLCAxMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSByZXF1aXJlZEtleXNfMV8xLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSBzZXIuaGV4VG9VaW50OEFycmF5KHRoaXMua2V5cy5nZXQoa2V5KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBuYXZpZ2F0b3IuY3JlZGVudGlhbHMuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVibGljS2V5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiA2MDAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG93Q3JlZGVudGlhbHM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3B1YmxpYy1rZXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnRzOiBbJ2ludGVybmFsJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFsbGVuZ2U6IGRpZ2VzdC5idWZmZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NlcnRpb24gPSBfbC5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlID0gbmV3IGVsbGlwdGljXzEuZWMoJ3AyNTYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YktleSA9IGUua2V5RnJvbVB1YmxpYyhudW1lcmljLnN0cmluZ1RvUHVibGljS2V5KGtleSkuZGF0YS5zdWJhcnJheSgwLCAzMykpLmdldFB1YmxpYygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZml4dXAgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhID0gQXJyYXkuZnJvbSh4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoYS5sZW5ndGggPCAzMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhLnVuc2hpZnQoMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChhLmxlbmd0aCA+IDMyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhLnNoaWZ0KCkgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2lnbmF0dXJlIGhhcyBhbiByIG9yIHMgdGhhdCBpcyB0b28gYmlnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlciA9IG5ldyBzZXIuU2VyaWFsQnVmZmVyKHsgYXJyYXk6IG5ldyBVaW50OEFycmF5KGFzc2VydGlvbi5yZXNwb25zZS5zaWduYXR1cmUpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlci5nZXQoKSAhPT0gMHgzMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2lnbmF0dXJlIG1pc3NpbmcgREVSIHByZWZpeCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlci5nZXQoKSAhPT0gZGVyLmFycmF5Lmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NpZ25hdHVyZSBoYXMgYmFkIGxlbmd0aCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlci5nZXQoKSAhPT0gMHgwMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2lnbmF0dXJlIGhhcyBiYWQgciBtYXJrZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBmaXh1cChkZXIuZ2V0VWludDhBcnJheShkZXIuZ2V0KCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXIuZ2V0KCkgIT09IDB4MDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NpZ25hdHVyZSBoYXMgYmFkIHMgbWFya2VyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzID0gZml4dXAoZGVyLmdldFVpbnQ4QXJyYXkoZGVyLmdldCgpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGF0SXRSZWFsbHlTaWduZWQgPSBuZXcgc2VyLlNlcmlhbEJ1ZmZlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hhdEl0UmVhbGx5U2lnbmVkLnB1c2hBcnJheShuZXcgVWludDhBcnJheShhc3NlcnRpb24ucmVzcG9uc2UuYXV0aGVudGljYXRvckRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9nID0gKF9mID0gd2hhdEl0UmVhbGx5U2lnbmVkKS5wdXNoQXJyYXk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaCA9IFVpbnQ4QXJyYXkuYmluZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGNyeXB0by5zdWJ0bGUuZGlnZXN0KCdTSEEtMjU2JywgYXNzZXJ0aW9uLnJlc3BvbnNlLmNsaWVudERhdGFKU09OKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9nLmFwcGx5KF9mLCBbbmV3IChfaC5hcHBseShVaW50OEFycmF5LCBbdm9pZCAwLCBfbC5zZW50KCldKSkoKV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2ogPSBVaW50OEFycmF5LmJpbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBjcnlwdG8uc3VidGxlLmRpZ2VzdCgnU0hBLTI1NicsIHdoYXRJdFJlYWxseVNpZ25lZC5hc1VpbnQ4QXJyYXkoKS5zbGljZSgpKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hfMSA9IG5ldyAoX2ouYXBwbHkoVWludDhBcnJheSwgW3ZvaWQgMCwgX2wuc2VudCgpXSkpKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWNpZCA9IGUuZ2V0S2V5UmVjb3ZlcnlQYXJhbShoYXNoXzEsIG5ldyBVaW50OEFycmF5KGFzc2VydGlvbi5yZXNwb25zZS5zaWduYXR1cmUpLCBwdWJLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnRGF0YSA9IG5ldyBzZXIuU2VyaWFsQnVmZmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWdEYXRhLnB1c2gocmVjaWQgKyAyNyArIDQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnRGF0YS5wdXNoQXJyYXkocik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWdEYXRhLnB1c2hBcnJheShzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ0RhdGEucHVzaEJ5dGVzKG5ldyBVaW50OEFycmF5KGFzc2VydGlvbi5yZXNwb25zZS5hdXRoZW50aWNhdG9yRGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnRGF0YS5wdXNoQnl0ZXMobmV3IFVpbnQ4QXJyYXkoYXNzZXJ0aW9uLnJlc3BvbnNlLmNsaWVudERhdGFKU09OKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWcgPSBudW1lcmljLnNpZ25hdHVyZVRvU3RyaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBudW1lcmljLktleVR5cGUud2EsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogc2lnRGF0YS5hc1VpbnQ4QXJyYXkoKS5zbGljZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduYXR1cmVzLnB1c2goc2lnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9sLmxhYmVsID0gMTA7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZEtleXNfMV8xID0gcmVxdWlyZWRLZXlzXzEubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNl07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTE6IHJldHVybiBbMyAvKmJyZWFrKi8sIDE0XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVfMV8xID0gX2wuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZV8xID0geyBlcnJvcjogZV8xXzEgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDE0XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVpcmVkS2V5c18xXzEgJiYgIXJlcXVpcmVkS2V5c18xXzEuZG9uZSAmJiAoX2sgPSByZXF1aXJlZEtleXNfMS5yZXR1cm4pKSBfay5jYWxsKHJlcXVpcmVkS2V5c18xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNyAvKmVuZGZpbmFsbHkqL107XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTQ6IHJldHVybiBbMiAvKnJldHVybiovLCB7IHNpZ25hdHVyZXM6IHNpZ25hdHVyZXMsIHNlcmlhbGl6ZWRUcmFuc2FjdGlvbjogc2VyaWFsaXplZFRyYW5zYWN0aW9uLCBzZXJpYWxpemVkQ29udGV4dEZyZWVEYXRhOiBzZXJpYWxpemVkQ29udGV4dEZyZWVEYXRhIH1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBXZWJBdXRoblNpZ25hdHVyZVByb3ZpZGVyO1xufSgpKTtcbmV4cG9ydHMuV2ViQXV0aG5TaWduYXR1cmVQcm92aWRlciA9IFdlYkF1dGhuU2lnbmF0dXJlUHJvdmlkZXI7XG4iLCIvLyBodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3dsemxhMDAwL2JhYzgzZGY2ZDNjNTE5MTZjNGRkMGJjOTQ3ZTQ2OTQ3L3Jhdy83ZWUzNDYyYjA5NWFiMjI1ODBkZGFmMTkxZjQ0YTU5MGRhNmZlMzNiL1JJUEVNRC0xNjAuanNcblxuLypcblx0UklQRU1ELTE2MC5qc1xuXG5cdFx0ZGV2ZWxvcGVkXG5cdFx0XHRieSBLLiAoaHR0cHM6Ly9naXRodWIuY29tL3dsemxhMDAwKVxuXHRcdFx0b24gRGVjZW1iZXIgMjctMjksIDIwMTcsXG5cblx0XHRsaWNlbnNlZCB1bmRlclxuXG5cblx0XHR0aGUgTUlUIGxpY2Vuc2VcblxuXHRcdENvcHlyaWdodCAoYykgMjAxNyBLLlxuXG5cdFx0IFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG5cdFx0b2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cblx0XHRmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXRcblx0XHRyZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSxcblx0XHRjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Jcblx0XHRzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZVxuXHRcdFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG5cdFx0Y29uZGl0aW9uczpcblxuXHRcdCBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuXHRcdGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5cdFx0IFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG5cdFx0RVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG5cdFx0T0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcblx0XHROT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVFxuXHRcdEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLFxuXHRcdFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuXHRcdEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1Jcblx0XHRPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4qL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNsYXNzIFJJUEVNRDE2MFxue1xuICAgIGNvbnN0cnVjdG9yKClcbiAgICB7XG4gICAgICAgIC8vIGh0dHBzOi8vd2ViY2FjaGUuZ29vZ2xldXNlcmNvbnRlbnQuY29tL3NlYXJjaD9xPWNhY2hlOkNuTE9nb2xUSFlFSjpodHRwczovL3d3dy5jb3NpYy5lc2F0Lmt1bGV1dmVuLmJlL3B1YmxpY2F0aW9ucy9hcnRpY2xlLTMxNy5wZGZcbiAgICAgICAgLy8gaHR0cDovL3Nob2RoZ2FuZ2EuaW5mbGlibmV0LmFjLmluL2JpdHN0cmVhbS8xMDYwMy8yMjk3OC8xMy8xM19hcHBlbmRpeC5wZGZcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0X25fcGFkX2J5dGVzKG1lc3NhZ2Vfc2l6ZSAvKiBpbiBieXRlcywgMSBieXRlIGlzIDggYml0cy4gKi8pXG4gICAge1xuICAgICAgICAvLyAgT2J0YWluIHRoZSBudW1iZXIgb2YgYnl0ZXMgbmVlZGVkIHRvIHBhZCB0aGUgbWVzc2FnZS5cbiAgICAgICAgLy8gSXQgZG9lcyBub3QgY29udGFpbiB0aGUgc2l6ZSBvZiB0aGUgbWVzc2FnZSBzaXplIGluZm9ybWF0aW9uLlxuICAgICAgICAvKlxuXHRcdFx0aHR0cHM6Ly93ZWJjYWNoZS5nb29nbGV1c2VyY29udGVudC5jb20vc2VhcmNoP3E9Y2FjaGU6Q25MT2dvbFRIWUVKOmh0dHBzOi8vd3d3LmNvc2ljLmVzYXQua3VsZXV2ZW4uYmUvcHVibGljYXRpb25zL2FydGljbGUtMzE3LnBkZlxuXG5cdFx0XHRUaGUgQ3J5cHRvZ3JhcGhpYyBIYXNoIEZ1bmN0aW9uIFJJUEVNRC0xNjBcblxuXHRcdFx0d3JpdHRlbiBieVxuXHRcdFx0XHRCYXJ0IFByZW5lZWwsXG5cdFx0XHRcdEhhbnMgRG9iYmVydGluLFxuXHRcdFx0XHRBbnRvb24gQm9zc2VsYWVyc1xuXHRcdFx0aW5cblx0XHRcdFx0MTk5Ny5cblxuXHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdFx0wqc1ICAgICBEZXNjcmlwdGlvbiBvZiBSSVBFTUQtMTYwXG5cblx0XHRcdC4uLi4uLlxuXG5cdFx0XHQgSW4gb3JkZXIgdG8gZ3VhcmFudGVlIHRoYXQgdGhlIHRvdGFsIGlucHV0IHNpemUgaXMgYVxuXHRcdFx0bXVsdGlwbGUgb2YgNTEyIGJpdHMsIHRoZSBpbnB1dCBpcyBwYWRkZWQgaW4gdGhlIHNhbWVcblx0XHRcdHdheSBhcyBmb3IgYWxsIHRoZSBtZW1iZXJzIG9mIHRoZSBNRDQtZmFtaWx5OiBvbmVcblx0XHRcdGFwcGVuZHMgYSBzaW5nbGUgMSBmb2xsb3dlZCBieSBhIHN0cmluZyBvZiAwcyAodGhlXG5cdFx0XHRudW1iZXIgb2YgMHMgbGllcyBiZXR3ZWVuIDAgYW5kIDUxMSk7IHRoZSBsYXN0IDY0IGJpdHNcblx0XHRcdG9mIHRoZSBleHRlbmRlZCBpbnB1dCBjb250YWluIHRoZSBiaW5hcnkgcmVwcmVzZW50YXRpb25cblx0XHRcdG9mIHRoZSBpbnB1dCBzaXplIGluIGJpdHMsIGxlYXN0IHNpZ25pZmljYW50IGJ5dGUgZmlyc3QuXG5cdFx0Ki9cbiAgICAgICAgLypcblx0XHRcdGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvcmZjL3JmYzExODYudHh0XG5cblx0XHRcdFJGQyAxMTg2OiBNRDQgTWVzc2FnZSBEaWdlc3QgQWxnb3JpdGhtLlxuXG5cdFx0XHR3cml0dGVuIGJ5XG5cdFx0XHRcdFJvbmFsZCBMaW5uIFJpdmVzdFxuXHRcdFx0aW5cblx0XHRcdFx0T2N0b2JlciAxOTkwLlxuXG5cdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0XHTCpzMgICAgIE1ENCBBbGdvcml0aG0gRGVzY3JpcHRpb25cblxuXHRcdFx0Li4uLi4uXG5cblx0XHRcdFN0ZXAgMS4gQXBwZW5kIHBhZGRpbmcgYml0c1xuXG5cdFx0XHQgVGhlIG1lc3NhZ2UgaXMgXCJwYWRkZWRcIiAoZXh0ZW5kZWQpIHNvIHRoYXQgaXRzIGxlbmd0aFxuXHRcdFx0KGluIGJpdHMpIGlzIGNvbmdydWVudCB0byA0NDgsIG1vZHVsbyA1MTIuIFRoYXQgaXMsIHRoZVxuXHRcdFx0bWVzc2FnZSBpcyBleHRlbmRlZCBzbyB0aGF0IGl0IGlzIGp1c3QgNjQgYml0cyBzaHkgb2Zcblx0XHRcdGJlaW5nIGEgbXVsdGlwbGUgb2YgNTEyIGJpdHMgbG9uZy4gUGFkZGluZyBpcyBhbHdheXNcblx0XHRcdHBlcmZvcm1lZCwgZXZlbiBpZiB0aGUgbGVuZ3RoIG9mIHRoZSBtZXNzYWdlIGlzIGFscmVhZHlcblx0XHRcdGNvbmdydWVudCB0byA0NDgsIG1vZHVsbyA1MTIgKGluIHdoaWNoIGNhc2UgNTEyIGJpdHMgb2Zcblx0XHRcdHBhZGRpbmcgYXJlIGFkZGVkKS5cblxuXHRcdFx0IFBhZGRpbmcgaXMgcGVyZm9ybWVkIGFzIGZvbGxvd3M6IGEgc2luZ2xlIFwiMVwiIGJpdCBpc1xuXHRcdFx0YXBwZW5kZWQgdG8gdGhlIG1lc3NhZ2UsIGFuZCB0aGVuIGVub3VnaCB6ZXJvIGJpdHMgYXJlXG5cdFx0XHRhcHBlbmRlZCBzbyB0aGF0IHRoZSBsZW5ndGggaW4gYml0cyBvZiB0aGUgcGFkZGVkXG5cdFx0XHRtZXNzYWdlIGJlY29tZXMgY29uZ3J1ZW50IHRvIDQ0OCwgbW9kdWxvIDUxMi5cblxuXHRcdFx0U3RlcCAyLiBBcHBlbmQgbGVuZ3RoXG5cblx0XHRcdCBBIDY0LWJpdCByZXByZXNlbnRhdGlvbiBvZiBiICh0aGUgbGVuZ3RoIG9mIHRoZSBtZXNzYWdlXG5cdFx0XHRiZWZvcmUgdGhlIHBhZGRpbmcgYml0cyB3ZXJlIGFkZGVkKSBpcyBhcHBlbmRlZCB0byB0aGVcblx0XHRcdHJlc3VsdCBvZiB0aGUgcHJldmlvdXMgc3RlcC4gSW4gdGhlIHVubGlrZWx5IGV2ZW50IHRoYXRcblx0XHRcdGIgaXMgZ3JlYXRlciB0aGFuIDJeNjQsIHRoZW4gb25seSB0aGUgbG93LW9yZGVyIDY0IGJpdHNcblx0XHRcdG9mIGIgYXJlIHVzZWQuIChUaGVzZSBiaXRzIGFyZSBhcHBlbmRlZCBhcyB0d28gMzItYml0XG5cdFx0XHR3b3JkcyBhbmQgYXBwZW5kZWQgbG93LW9yZGVyIHdvcmQgZmlyc3QgaW4gYWNjb3JkYW5jZVxuXHRcdFx0d2l0aCB0aGUgcHJldmlvdXMgY29udmVudGlvbnMuKVxuXG5cdFx0XHQgQXQgdGhpcyBwb2ludCB0aGUgcmVzdWx0aW5nIG1lc3NhZ2UgKGFmdGVyIHBhZGRpbmcgd2l0aFxuXHRcdFx0Yml0cyBhbmQgd2l0aCBiKSBoYXMgYSBsZW5ndGggdGhhdCBpcyBhbiBleGFjdCBtdWx0aXBsZVxuXHRcdFx0b2YgNTEyIGJpdHMuIEVxdWl2YWxlbnRseSwgdGhpcyBtZXNzYWdlIGhhcyBhIGxlbmd0aFxuXHRcdFx0dGhhdCBpcyBhbiBleGFjdCBtdWx0aXBsZSBvZiAxNiAoMzItYml0KSB3b3Jkcy4gTGV0XG5cdFx0XHRNWzAgLi4uIE4tMV0gZGVub3RlIHRoZSB3b3JkcyBvZiB0aGUgcmVzdWx0aW5nIG1lc3NhZ2UsXG5cdFx0XHR3aGVyZSBOIGlzIGEgbXVsdGlwbGUgb2YgMTYuXG5cdFx0Ki9cbiAgICAgICAgLy8gaHR0cHM6Ly9jcnlwdG8uc3RhY2tleGNoYW5nZS5jb20vYS8zMjQwNy81NDU2OFxuICAgICAgICAvKlxuXHRcdFx0RXhhbXBsZSBjYXNlICAjIDFcblx0XHRcdFx0WzAgYml0OiBtZXNzYWdlLl1cblx0XHRcdFx0WzEgYml0OiAxLl1cblx0XHRcdFx0WzQ0NyBiaXRzOiAwLl1cblx0XHRcdFx0WzY0IGJpdHM6IG1lc3NhZ2Ugc2l6ZSBpbmZvcm1hdGlvbi5dXG5cblx0XHRcdEV4YW1wbGUgY2FzZSAgIyAyXG5cdFx0XHRcdFs1MTItYml0czogbWVzc2FnZV1cblx0XHRcdFx0WzEgYml0OiAxLl1cblx0XHRcdFx0WzQ0NyBiaXRzOiAwLl1cblx0XHRcdFx0WzY0IGJpdHM6IG1lc3NhZ2Ugc2l6ZSBpbmZvcm1hdGlvbi5dXG5cblx0XHRcdEV4YW1wbGUgY2FzZSAgIyAzXG5cdFx0XHRcdFsoNTEyIC0gNjQgPSA0NDgpIGJpdHM6IG1lc3NhZ2UuXVxuXHRcdFx0XHRbMSBiaXQ6IDEuXVxuXHRcdFx0XHRbNTExIGJpdHM6IDAuXVxuXHRcdFx0XHRbNjQgYml0czogbWVzc2FnZSBzaXplIGluZm9ybWF0aW9uLl1cblxuXHRcdFx0RXhhbXBsZSBjYXNlICAjIDRcblx0XHRcdFx0Wyg1MTIgLSA2NSA9IDQ0NykgYml0czogbWVzc2FnZS5dXG5cdFx0XHRcdFsxIGJpdDogMS5dXG5cdFx0XHRcdFswIGJpdDogMC5dXG5cdFx0XHRcdFs2NCBiaXRzOiBtZXNzYWdlIHNpemUgaW5mb3JtYXRpb24uXVxuXHRcdCovXG4gICAgICAgIC8vIFRoZSBudW1iZXIgb2YgcGFkZGluZyB6ZXJvIGJpdHM6XG4gICAgICAgIC8vICAgICAgNTExIC0gW3sobWVzc2FnZSBzaXplIGluIGJpdHMpICsgNjR9IChtb2QgNTEyKV1cbiAgICAgICAgcmV0dXJuIDY0IC0gKChtZXNzYWdlX3NpemUgKyA4KSAmIDBiMDAxMTExMTEgLyogNjMgKi8pO1xuICAgIH1cbiAgICBzdGF0aWMgcGFkKG1lc3NhZ2UgLyogQW4gQXJyYXlCdWZmZXIuICovKVxuICAgIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZV9zaXplID0gbWVzc2FnZS5ieXRlTGVuZ3RoO1xuICAgICAgICBjb25zdCBuX3BhZCA9IFJJUEVNRDE2MC5nZXRfbl9wYWRfYnl0ZXMobWVzc2FnZV9zaXplKTtcblxuICAgICAgICAvLyAgYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYCBpcyAoKDIgKiogNTMpIC0gMSkgYW5kXG4gICAgICAgIC8vIGJpdHdpc2Ugb3BlcmF0aW9uIGluIEphdmFzY3JpcHQgaXMgZG9uZSBvbiAzMi1iaXRzIG9wZXJhbmRzLlxuICAgICAgICBjb25zdCBkaXZtb2QgPSAoZGl2aWRlbmQsIGRpdmlzb3IpID0+IFtcbiAgICAgICAgICAgIE1hdGguZmxvb3IoZGl2aWRlbmQgLyBkaXZpc29yKSxcbiAgICAgICAgICAgIGRpdmlkZW5kICUgZGl2aXNvclxuICAgICAgICBdO1xuICAgICAgICAvKlxuVG8gc2hpZnRcblxuICAgMDAwMDAwMDAgMDAwPz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0IG9cbiAgIDAwMDAwMDAwID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/MDAwXG5cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbk1ldGhvZCAjMVxuXG4gICAgMDAwMDAwMDAgMDAwPz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/XG4gICBbMDAwMDAwMDAgMDAwQUFBQUEgQUFBQUFBQUEgQUFBQUFBQUFdICg8QT4gY2FwdHVyZWQpXG4gICBbMDAwMDAwMDAgQUFBQUFBQUEgQUFBQUFBQUEgQUFBQUEwMDBdICg8QT4gc2hpZnRlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAoPEI+IGNhcHR1cmVkKSBbQkJCQkJCQkIgQkJCQkJCQkIgQkJCQkJCQkIgQkJCQkJCQkJdXG4gICAgICAgICAgICAgICAgICAgICAoPEI+IHNoaWZ0ZWQpIFtCQkJdW0JCQkJCQkJCIEJCQkJCQkJCIEJCQkJCQkJCIEJCQkJCMDAwXVxuICAgWzAwMDAwMDAwIEFBQUFBQUFBIEFBQUFBQUFBIEFBQUFBQkJCXSAoPEE+ICYgPEJfMj4gbWVyZ2VkKVxuICAgWzAwMDAwMDAwIEFBQUFBQUFBIEFBQUFBQUFBIEFBQUFBQkJCXVtCQkJCQkJCQiBCQkJCQkJCQiBCQkJCQkJCQiBCQkJCQjAwMF1cbiAgICAwMDAwMDAwMCA/Pz8/Pz8/PyA/Pz8/Pz8/PyA/Pz8/Pz8/PyAgPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8wMDBcblxuXHRcdGNvbnN0IHVpbnQzMl9tYXhfcGx1c18xID0gMHgxMDAwMDAwMDA7IC8vICgyICoqIDMyKVxuXHRcdGNvbnN0IFtcblx0XHRcdG1zZ19ieXRlX3NpemVfbW9zdCwgLy8gVmFsdWUgcmFuZ2UgWzAsICgyICoqIDIxKSAtIDFdLlxuXHRcdFx0bXNnX2J5dGVfc2l6ZV9sZWFzdCAvLyBWYWx1ZSByYW5nZSBbMCwgKDIgKiogMzIpIC0gMV0uXG5cdFx0XSA9IGRpdm1vZChtZXNzYWdlX3NpemUsIHVpbnQzMl9tYXhfcGx1c18xKTtcblx0XHRjb25zdCBbXG5cdFx0XHRjYXJyeSwgLy8gVmFsdWUgcmFuZ2UgWzAsIDddLlxuXHRcdFx0bXNnX2JpdF9zaXplX2xlYXN0IC8vIFZhbHVlIHJhbmdlIFswLCAoMiAqKiAzMikgLSA4XS5cblx0XHRdID0gZGl2bW9kKG1lc3NhZ2VfYnl0ZV9zaXplX2xlYXN0ICogOCwgdWludDMyX21heF9wbHVzXzEpO1xuXHRcdGNvbnN0IG1lc3NhZ2VfYml0X3NpemVfbW9zdCA9IG1lc3NhZ2VfYnl0ZV9zaXplX21vc3QgKiA4XG5cdFx0XHQrIGNhcnJ5OyAvLyBWYWx1ZSByYW5nZSBbMCwgKDIgKiogMjQpIC0gMV0uXG5cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbk1ldGhvZCAjMlxuICAgIDAwMDAwMDAwIDAwMD8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ICA/Pz8/Pz8/PyA/Pz8/Pz8/PyA/Pz8/Pz8/PyA/Pz8/Pz8/P1xuICAgICAgWzAwMDAwIDAwMEFBQUFBIEFBQUFBQUFBIEFBQUFBQUFBICBBQUFdICg8QT4gY2FwdHVyZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKDxCPiBjYXB0dXJlZCkgWzAwMEJCQkJCIEJCQkJCQkJCIEJCQkJCQkJCIEJCQkJCQkJCXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAoPEI+IHNoaWZ0ZWQpIFtCQkJCQkJCQiBCQkJCQkJCQiBCQkJCQkJCQiBCQkJCQjAwMF1cbiAgIFswMDAwMDAwMCBBQUFBQUFBQSBBQUFBQUFBQSBBQUFBQUFBQV1bQkJCQkJCQkIgQkJCQkJCQkIgQkJCQkJCQkIgQkJCQkIwMDBdXG4gICAgMDAwMDAwMDAgPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/MDAwXG5cblx0XHQqL1xuICAgICAgICBjb25zdCBbXG4gICAgICAgICAgICBtc2dfYml0X3NpemVfbW9zdCxcbiAgICAgICAgICAgIG1zZ19iaXRfc2l6ZV9sZWFzdFxuICAgICAgICBdID0gZGl2bW9kKG1lc3NhZ2Vfc2l6ZSwgNTM2ODcwOTEyIC8qICgyICoqIDI5KSAqLylcbiAgICAgICAgICAgIC5tYXAoKHgsIGluZGV4KSA9PiAoaW5kZXggPyAoeCAqIDgpIDogeCkpO1xuXG4gICAgICAgIC8vIGBBcnJheUJ1ZmZlci50cmFuc2ZlcigpYCBpcyBub3Qgc3VwcG9ydGVkLlxuICAgICAgICBjb25zdCBwYWRkZWQgPSBuZXcgVWludDhBcnJheShtZXNzYWdlX3NpemUgKyBuX3BhZCArIDgpO1xuICAgICAgICBwYWRkZWQuc2V0KG5ldyBVaW50OEFycmF5KG1lc3NhZ2UpLCAwKTtcbiAgICAgICAgY29uc3QgZGF0YV92aWV3ID0gbmV3IERhdGFWaWV3KHBhZGRlZC5idWZmZXIpO1xuICAgICAgICBkYXRhX3ZpZXcuc2V0VWludDgobWVzc2FnZV9zaXplLCAwYjEwMDAwMDAwKTtcbiAgICAgICAgZGF0YV92aWV3LnNldFVpbnQzMihcbiAgICAgICAgICAgIG1lc3NhZ2Vfc2l6ZSArIG5fcGFkLFxuICAgICAgICAgICAgbXNnX2JpdF9zaXplX2xlYXN0LFxuICAgICAgICAgICAgdHJ1ZSAvLyBMaXR0bGUtZW5kaWFuXG4gICAgICAgICk7XG4gICAgICAgIGRhdGFfdmlldy5zZXRVaW50MzIoXG4gICAgICAgICAgICBtZXNzYWdlX3NpemUgKyBuX3BhZCArIDQsXG4gICAgICAgICAgICBtc2dfYml0X3NpemVfbW9zdCxcbiAgICAgICAgICAgIHRydWUgLy8gTGl0dGxlLWVuZGlhblxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBwYWRkZWQuYnVmZmVyO1xuICAgIH1cblxuICAgIHN0YXRpYyBmKGosIHgsIHksIHopXG4gICAge1xuICAgICAgICBpZigwIDw9IGogJiYgaiA8PSAxNSlcbiAgICAgICAgeyAvLyBFeGNsdXNpdmUtT1JcbiAgICAgICAgICAgIHJldHVybiB4IF4geSBeIHo7XG4gICAgICAgIH1cbiAgICAgICAgaWYoMTYgPD0gaiAmJiBqIDw9IDMxKVxuICAgICAgICB7IC8vIE11bHRpcGxleGluZyAobXV4aW5nKVxuICAgICAgICAgICAgcmV0dXJuICh4ICYgeSkgfCAofnggJiB6KTtcbiAgICAgICAgfVxuICAgICAgICBpZigzMiA8PSBqICYmIGogPD0gNDcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAoeCB8IH55KSBeIHo7XG4gICAgICAgIH1cbiAgICAgICAgaWYoNDggPD0gaiAmJiBqIDw9IDYzKVxuICAgICAgICB7IC8vIE11bHRpcGxleGluZyAobXV4aW5nKVxuICAgICAgICAgICAgcmV0dXJuICh4ICYgeikgfCAoeSAmIH56KTtcbiAgICAgICAgfVxuICAgICAgICBpZig2NCA8PSBqICYmIGogPD0gNzkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB4IF4gKHkgfCB+eik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIEsoailcbiAgICB7XG4gICAgICAgIGlmKDAgPD0gaiAmJiBqIDw9IDE1KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gMHgwMDAwMDAwMDtcbiAgICAgICAgfVxuICAgICAgICBpZigxNiA8PSBqICYmIGogPD0gMzEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIE1hdGguZmxvb3IoKDIgKiogMzApICogTWF0aC5TUVJUMilcbiAgICAgICAgICAgIHJldHVybiAweDVBODI3OTk5O1xuICAgICAgICB9XG4gICAgICAgIGlmKDMyIDw9IGogJiYgaiA8PSA0NylcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gTWF0aC5mbG9vcigoMiAqKiAzMCkgKiBNYXRoLnNxcnQoMykpXG4gICAgICAgICAgICByZXR1cm4gMHg2RUQ5RUJBMTtcbiAgICAgICAgfVxuICAgICAgICBpZig0OCA8PSBqICYmIGogPD0gNjMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIE1hdGguZmxvb3IoKDIgKiogMzApICogTWF0aC5zcXJ0KDUpKVxuICAgICAgICAgICAgcmV0dXJuIDB4OEYxQkJDREM7XG4gICAgICAgIH1cbiAgICAgICAgaWYoNjQgPD0gaiAmJiBqIDw9IDc5KVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBNYXRoLmZsb29yKCgyICoqIDMwKSAqIE1hdGguc3FydCg3KSlcbiAgICAgICAgICAgIHJldHVybiAweEE5NTNGRDRFO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBLUChqKSAvLyBLJ1xuICAgIHtcbiAgICAgICAgaWYoMCA8PSBqICYmIGogPD0gMTUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIE1hdGguZmxvb3IoKDIgKiogMzApICogTWF0aC5jYnJ0KDIpKVxuICAgICAgICAgICAgcmV0dXJuIDB4NTBBMjhCRTY7XG4gICAgICAgIH1cbiAgICAgICAgaWYoMTYgPD0gaiAmJiBqIDw9IDMxKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBNYXRoLmZsb29yKCgyICoqIDMwKSAqIE1hdGguY2JydCgzKSlcbiAgICAgICAgICAgIHJldHVybiAweDVDNEREMTI0O1xuICAgICAgICB9XG4gICAgICAgIGlmKDMyIDw9IGogJiYgaiA8PSA0NylcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gTWF0aC5mbG9vcigoMiAqKiAzMCkgKiBNYXRoLmNicnQoNSkpXG4gICAgICAgICAgICByZXR1cm4gMHg2RDcwM0VGMztcbiAgICAgICAgfVxuICAgICAgICBpZig0OCA8PSBqICYmIGogPD0gNjMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIE1hdGguZmxvb3IoKDIgKiogMzApICogTWF0aC5jYnJ0KDcpKVxuICAgICAgICAgICAgcmV0dXJuIDB4N0E2RDc2RTk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoNjQgPD0gaiAmJiBqIDw9IDc5KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gMHgwMDAwMDAwMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgYWRkX21vZHVsbzMyKC8qIC4uLi4uLiAqLylcbiAgICB7XG4gICAgICAgIC8vIDEuICBNb2R1bG8gYWRkaXRpb24gKGFkZGl0aW9uIG1vZHVsbykgaXMgYXNzb2NpYXRpdmUuXG4gICAgICAgIC8vICAgIGh0dHBzOi8vcHJvb2Z3aWtpLm9yZy93aWtpL01vZHVsb19BZGRpdGlvbl9pc19Bc3NvY2lhdGl2ZVxuIFx0XHQvLyAyLiAgQml0d2lzZSBvcGVyYXRpb24gaW4gSmF2YXNjcmlwdFxuICAgICAgICAvLyAgICBpcyBkb25lIG9uIDMyLWJpdHMgb3BlcmFuZHNcbiAgICAgICAgLy8gICAgYW5kIHJlc3VsdHMgaW4gYSAzMi1iaXRzIHZhbHVlLlxuICAgICAgICByZXR1cm4gQXJyYXlcbiAgICAgICAgICAgIC5mcm9tKGFyZ3VtZW50cylcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IChhICsgYiksIDApIHwgMDtcbiAgICB9XG4gICAgc3RhdGljIHJvbDMyKHZhbHVlLCBjb3VudClcbiAgICB7IC8vIEN5Y2xpYyBsZWZ0IHNoaWZ0IChyb3RhdGUpIG9uIDMyLWJpdHMgdmFsdWUuXG4gICAgICAgIHJldHVybiAodmFsdWUgPDwgY291bnQpIHwgKHZhbHVlID4+PiAoMzIgLSBjb3VudCkpO1xuICAgIH1cbiAgICBzdGF0aWMgaGFzaChtZXNzYWdlIC8qIEFuIEFycmF5QnVmZmVyLiAqLylcbiAgICB7XG4gICAgICAgIC8vIC8vLy8vLy8vICAgICAgIFBhZGRpbmcgICAgICAgLy8vLy8vLy8vL1xuXG4gICAgICAgIC8vIFRoZSBwYWRkZWQgbWVzc2FnZS5cbiAgICAgICAgY29uc3QgcGFkZGVkID0gUklQRU1EMTYwLnBhZChtZXNzYWdlKTtcblxuICAgICAgICAvLyAvLy8vLy8vLyAgICAgQ29tcHJlc3Npb24gICAgIC8vLy8vLy8vLy9cblxuICAgICAgICAvLyBNZXNzYWdlIHdvcmQgc2VsZWN0b3JzLlxuICAgICAgICBjb25zdCByID0gW1xuICAgICAgICAgICAgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSxcbiAgICAgICAgICAgIDcsIDQsIDEzLCAxLCAxMCwgNiwgMTUsIDMsIDEyLCAwLCA5LCA1LCAyLCAxNCwgMTEsIDgsXG4gICAgICAgICAgICAzLCAxMCwgMTQsIDQsIDksIDE1LCA4LCAxLCAyLCA3LCAwLCA2LCAxMywgMTEsIDUsIDEyLFxuICAgICAgICAgICAgMSwgOSwgMTEsIDEwLCAwLCA4LCAxMiwgNCwgMTMsIDMsIDcsIDE1LCAxNCwgNSwgNiwgMixcbiAgICAgICAgICAgIDQsIDAsIDUsIDksIDcsIDEyLCAyLCAxMCwgMTQsIDEsIDMsIDgsIDExLCA2LCAxNSwgMTNcbiAgICAgICAgXTtcbiAgICAgICAgY29uc3QgclAgPSBbIC8vIHInXG4gICAgICAgICAgICA1LCAxNCwgNywgMCwgOSwgMiwgMTEsIDQsIDEzLCA2LCAxNSwgOCwgMSwgMTAsIDMsIDEyLFxuICAgICAgICAgICAgNiwgMTEsIDMsIDcsIDAsIDEzLCA1LCAxMCwgMTQsIDE1LCA4LCAxMiwgNCwgOSwgMSwgMixcbiAgICAgICAgICAgIDE1LCA1LCAxLCAzLCA3LCAxNCwgNiwgOSwgMTEsIDgsIDEyLCAyLCAxMCwgMCwgNCwgMTMsXG4gICAgICAgICAgICA4LCA2LCA0LCAxLCAzLCAxMSwgMTUsIDAsIDUsIDEyLCAyLCAxMywgOSwgNywgMTAsIDE0LFxuICAgICAgICAgICAgMTIsIDE1LCAxMCwgNCwgMSwgNSwgOCwgNywgNiwgMiwgMTMsIDE0LCAwLCAzLCA5LCAxMVxuICAgICAgICBdO1xuXG4gICAgICAgIC8vIEFtb3VudHMgZm9yICdyb3RhdGUgbGVmdCcgb3BlcmF0aW9uLlxuICAgICAgICBjb25zdCBzID0gW1xuICAgICAgICAgICAgMTEsIDE0LCAxNSwgMTIsIDUsIDgsIDcsIDksIDExLCAxMywgMTQsIDE1LCA2LCA3LCA5LCA4LFxuICAgICAgICAgICAgNywgNiwgOCwgMTMsIDExLCA5LCA3LCAxNSwgNywgMTIsIDE1LCA5LCAxMSwgNywgMTMsIDEyLFxuICAgICAgICAgICAgMTEsIDEzLCA2LCA3LCAxNCwgOSwgMTMsIDE1LCAxNCwgOCwgMTMsIDYsIDUsIDEyLCA3LCA1LFxuICAgICAgICAgICAgMTEsIDEyLCAxNCwgMTUsIDE0LCAxNSwgOSwgOCwgOSwgMTQsIDUsIDYsIDgsIDYsIDUsIDEyLFxuICAgICAgICAgICAgOSwgMTUsIDUsIDExLCA2LCA4LCAxMywgMTIsIDUsIDEyLCAxMywgMTQsIDExLCA4LCA1LCA2XG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IHNQID0gWyAvLyBzJ1xuICAgICAgICAgICAgOCwgOSwgOSwgMTEsIDEzLCAxNSwgMTUsIDUsIDcsIDcsIDgsIDExLCAxNCwgMTQsIDEyLCA2LFxuICAgICAgICAgICAgOSwgMTMsIDE1LCA3LCAxMiwgOCwgOSwgMTEsIDcsIDcsIDEyLCA3LCA2LCAxNSwgMTMsIDExLFxuICAgICAgICAgICAgOSwgNywgMTUsIDExLCA4LCA2LCA2LCAxNCwgMTIsIDEzLCA1LCAxNCwgMTMsIDEzLCA3LCA1LFxuICAgICAgICAgICAgMTUsIDUsIDgsIDExLCAxNCwgMTQsIDYsIDE0LCA2LCA5LCAxMiwgOSwgMTIsIDUsIDE1LCA4LFxuICAgICAgICAgICAgOCwgNSwgMTIsIDksIDEyLCA1LCAxNCwgNiwgOCwgMTMsIDYsIDUsIDE1LCAxMywgMTEsIDExXG4gICAgICAgIF07XG5cbiAgICAgICAgLy8gVGhlIHNpemUsIGluIGJ5dGVzLCBvZiBhIHdvcmQuXG4gICAgICAgIGNvbnN0IHdvcmRfc2l6ZSA9IDQ7XG5cbiAgICAgICAgLy8gVGhlIHNpemUsIGluIGJ5dGVzLCBvZiBhIDE2LXdvcmRzIGJsb2NrLlxuICAgICAgICBjb25zdCBibG9ja19zaXplID0gNjQ7XG5cbiAgICAgICAgLy8gVGhlIG51bWJlciBvZiB0aGUgMTYtd29yZHMgYmxvY2tzLlxuICAgICAgICBjb25zdCB0ID0gcGFkZGVkLmJ5dGVMZW5ndGggLyBibG9ja19zaXplO1xuXG4gICAgICAgIC8vICBUaGUgbWVzc2FnZSBhZnRlciBwYWRkaW5nIGNvbnNpc3RzIG9mIHQgMTYtd29yZCBibG9ja3MgdGhhdFxuICAgICAgICAvLyBhcmUgZGVub3RlZCB3aXRoIFhfaVtqXSwgd2l0aCAw4omkaeKJpCh0IOKIkiAxKSBhbmQgMOKJpGriiaQxNS5cbiAgICAgICAgY29uc3QgWCA9IChuZXcgQXJyYXkodCkpXG4gICAgICAgICAgICAuZmlsbCh1bmRlZmluZWQpXG4gICAgICAgICAgICAubWFwKChfLCBpKSA9PiBqID0+IChcbiAgICAgICAgICAgICAgICBuZXcgRGF0YVZpZXcoXG4gICAgICAgICAgICAgICAgICAgIHBhZGRlZCwgaSAqIGJsb2NrX3NpemUsIGJsb2NrX3NpemVcbiAgICAgICAgICAgICAgICApLmdldFVpbnQzMihcbiAgICAgICAgICAgICAgICAgICAgaiAqIHdvcmRfc2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgdHJ1ZSAvLyBMaXR0bGUtZW5kaWFuXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSk7XG5cbiAgICAgICAgLy8gIFRoZSByZXN1bHQgb2YgUklQRU1ELTE2MCBpcyBjb250YWluZWQgaW4gZml2ZSAzMi1iaXQgd29yZHMsXG4gICAgICAgIC8vIHdoaWNoIGZvcm0gdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBhbGdvcml0aG0uIFRoZSBmaW5hbFxuICAgICAgICAvLyBjb250ZW50IG9mIHRoZXNlIGZpdmUgMzItYml0IHdvcmRzIGlzIGNvbnZlcnRlZCB0byBhIDE2MC1iaXRcbiAgICAgICAgLy8gc3RyaW5nLCBhZ2FpbiB1c2luZyB0aGUgbGl0dGxlLWVuZGlhbiBjb252ZW50aW9uLlxuICAgICAgICBjb25zdCBoID0gW1xuICAgICAgICAgICAgMHg2NzQ1MjMwMSwgLy8gaF8wXG4gICAgICAgICAgICAweEVGQ0RBQjg5LCAvLyBoXzFcbiAgICAgICAgICAgIDB4OThCQURDRkUsIC8vIGhfMlxuICAgICAgICAgICAgMHgxMDMyNTQ3NiwgLy8gaF8zXG4gICAgICAgICAgICAweEMzRDJFMUYwICAvLyBoXzRcbiAgICAgICAgXTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdDsgKytpKVxuICAgICAgICB7XG4gICAgICAgICAgICBsZXQgQSA9IGhbMF07IGxldCBCID0gaFsxXTsgbGV0IEMgPSBoWzJdOyBsZXQgRCA9IGhbM107IGxldCBFID0gaFs0XTtcbiAgICAgICAgICAgIGxldCBBUCA9IEE7IGxldCBCUCA9IEI7IGxldCBDUCA9IEM7IGxldCBEUCA9IEQ7IGxldCBFUCA9IEU7XG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgODA7ICsrailcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBMZWZ0IHJvdW5kc1xuICAgICAgICAgICAgICAgIGxldCBUID0gUklQRU1EMTYwLmFkZF9tb2R1bG8zMiggLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zaGFkb3dcbiAgICAgICAgICAgICAgICAgICAgUklQRU1EMTYwLnJvbDMyKFxuICAgICAgICAgICAgICAgICAgICAgICAgUklQRU1EMTYwLmFkZF9tb2R1bG8zMihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJJUEVNRDE2MC5mKGosIEIsIEMsIEQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFhbaV0ocltqXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUklQRU1EMTYwLksoailcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBzW2pdXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIEVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIEEgPSBFO1xuICAgICAgICAgICAgICAgIEUgPSBEO1xuICAgICAgICAgICAgICAgIEQgPSBSSVBFTUQxNjAucm9sMzIoQywgMTApO1xuICAgICAgICAgICAgICAgIEMgPSBCO1xuICAgICAgICAgICAgICAgIEIgPSBUO1xuXG4gICAgICAgICAgICAgICAgLy8gUmlnaHQgcm91bmRzXG4gICAgICAgICAgICAgICAgVCA9IFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoXG4gICAgICAgICAgICAgICAgICAgIFJJUEVNRDE2MC5yb2wzMihcbiAgICAgICAgICAgICAgICAgICAgICAgIFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQVAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUklQRU1EMTYwLmYoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDc5IC0gaixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQlAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENQLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEUFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWFtpXShyUFtqXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUklQRU1EMTYwLktQKGopXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgc1Bbal1cbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgRVBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIEFQID0gRVA7XG4gICAgICAgICAgICAgICAgRVAgPSBEUDtcbiAgICAgICAgICAgICAgICBEUCA9IFJJUEVNRDE2MC5yb2wzMihDUCwgMTApO1xuICAgICAgICAgICAgICAgIENQID0gQlA7XG4gICAgICAgICAgICAgICAgQlAgPSBUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgVCA9IFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoaFsxXSwgQywgRFApO1xuICAgICAgICAgICAgaFsxXSA9IFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoaFsyXSwgRCwgRVApO1xuICAgICAgICAgICAgaFsyXSA9IFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoaFszXSwgRSwgQVApO1xuICAgICAgICAgICAgaFszXSA9IFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoaFs0XSwgQSwgQlApO1xuICAgICAgICAgICAgaFs0XSA9IFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoaFswXSwgQiwgQ1ApO1xuICAgICAgICAgICAgaFswXSA9IFQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAgVGhlIGZpbmFsIG91dHB1dCBzdHJpbmcgdGhlbiBjb25zaXN0cyBvZiB0aGUgY29uY2F0ZW5hdGF0aW9uXG4gICAgICAgIC8vIG9mIGhfMCwgaF8xLCBoXzIsIGhfMywgYW5kIGhfNCBhZnRlciBjb252ZXJ0aW5nIGVhY2ggaF9pIHRvIGFcbiAgICAgICAgLy8gNC1ieXRlIHN0cmluZyB1c2luZyB0aGUgbGl0dGxlLWVuZGlhbiBjb252ZW50aW9uLlxuICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXlCdWZmZXIoMjApO1xuICAgICAgICBjb25zdCBkYXRhX3ZpZXcgPSBuZXcgRGF0YVZpZXcocmVzdWx0KTtcbiAgICAgICAgaC5mb3JFYWNoKChoX2ksIGkpID0+IGRhdGFfdmlldy5zZXRVaW50MzIoaSAqIDQsIGhfaSwgdHJ1ZSkpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgUklQRU1EMTYwXG59O1xuIiwiLyogKGlnbm9yZWQpICovIiwiLyogKGlnbm9yZWQpICovIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiZW9zanNfd2FzaWdcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua19uYW1lX1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtfbmFtZV9cIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcImV4dGVybmFsc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9lb3Nqcy13ZWJhdXRobi1zaWcudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
