// Force strict mode and setup for ESM
"use strict";
import {
  ChannelBase,
  SessionRouter,
  getGlobalQwenDir
} from "./chunk-JXQ23SNT.js";
import "./chunk-UFC57OYT.js";
import "./chunk-K5PGHDBN.js";
import {
  wrapper_default
} from "./chunk-H6BD2ELD.js";
import "./chunk-5IFG2VC4.js";
import {
  init_esbuild_shims
} from "./chunk-A4BMJM77.js";
import {
  __commonJS,
  __name,
  __toESM
} from "./chunk-J2S4EL5Y.js";

// node_modules/qrcode-terminal/vendor/QRCode/QRMode.js
var require_QRMode = __commonJS({
  "node_modules/qrcode-terminal/vendor/QRCode/QRMode.js"(exports, module) {
    init_esbuild_shims();
    module.exports = {
      MODE_NUMBER: 1 << 0,
      MODE_ALPHA_NUM: 1 << 1,
      MODE_8BIT_BYTE: 1 << 2,
      MODE_KANJI: 1 << 3
    };
  }
});

// node_modules/qrcode-terminal/vendor/QRCode/QR8bitByte.js
var require_QR8bitByte = __commonJS({
  "node_modules/qrcode-terminal/vendor/QRCode/QR8bitByte.js"(exports, module) {
    init_esbuild_shims();
    var QRMode = require_QRMode();
    function QR8bitByte(data) {
      this.mode = QRMode.MODE_8BIT_BYTE;
      this.data = data;
    }
    __name(QR8bitByte, "QR8bitByte");
    QR8bitByte.prototype = {
      getLength: /* @__PURE__ */ __name(function() {
        return this.data.length;
      }, "getLength"),
      write: /* @__PURE__ */ __name(function(buffer) {
        for (var i = 0; i < this.data.length; i++) {
          buffer.put(this.data.charCodeAt(i), 8);
        }
      }, "write")
    };
    module.exports = QR8bitByte;
  }
});

// node_modules/qrcode-terminal/vendor/QRCode/QRMath.js
var require_QRMath = __commonJS({
  "node_modules/qrcode-terminal/vendor/QRCode/QRMath.js"(exports, module) {
    init_esbuild_shims();
    var QRMath = {
      glog: /* @__PURE__ */ __name(function(n) {
        if (n < 1) {
          throw new Error("glog(" + n + ")");
        }
        return QRMath.LOG_TABLE[n];
      }, "glog"),
      gexp: /* @__PURE__ */ __name(function(n) {
        while (n < 0) {
          n += 255;
        }
        while (n >= 256) {
          n -= 255;
        }
        return QRMath.EXP_TABLE[n];
      }, "gexp"),
      EXP_TABLE: new Array(256),
      LOG_TABLE: new Array(256)
    };
    for (i = 0; i < 8; i++) {
      QRMath.EXP_TABLE[i] = 1 << i;
    }
    var i;
    for (i = 8; i < 256; i++) {
      QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
    }
    var i;
    for (i = 0; i < 255; i++) {
      QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
    }
    var i;
    module.exports = QRMath;
  }
});

// node_modules/qrcode-terminal/vendor/QRCode/QRPolynomial.js
var require_QRPolynomial = __commonJS({
  "node_modules/qrcode-terminal/vendor/QRCode/QRPolynomial.js"(exports, module) {
    init_esbuild_shims();
    var QRMath = require_QRMath();
    function QRPolynomial(num, shift) {
      if (num.length === void 0) {
        throw new Error(num.length + "/" + shift);
      }
      var offset = 0;
      while (offset < num.length && num[offset] === 0) {
        offset++;
      }
      this.num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i++) {
        this.num[i] = num[i + offset];
      }
    }
    __name(QRPolynomial, "QRPolynomial");
    QRPolynomial.prototype = {
      get: /* @__PURE__ */ __name(function(index) {
        return this.num[index];
      }, "get"),
      getLength: /* @__PURE__ */ __name(function() {
        return this.num.length;
      }, "getLength"),
      multiply: /* @__PURE__ */ __name(function(e) {
        var num = new Array(this.getLength() + e.getLength() - 1);
        for (var i = 0; i < this.getLength(); i++) {
          for (var j = 0; j < e.getLength(); j++) {
            num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
          }
        }
        return new QRPolynomial(num, 0);
      }, "multiply"),
      mod: /* @__PURE__ */ __name(function(e) {
        if (this.getLength() - e.getLength() < 0) {
          return this;
        }
        var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
        var num = new Array(this.getLength());
        for (var i = 0; i < this.getLength(); i++) {
          num[i] = this.get(i);
        }
        for (var x = 0; x < e.getLength(); x++) {
          num[x] ^= QRMath.gexp(QRMath.glog(e.get(x)) + ratio);
        }
        return new QRPolynomial(num, 0).mod(e);
      }, "mod")
    };
    module.exports = QRPolynomial;
  }
});

// node_modules/qrcode-terminal/vendor/QRCode/QRMaskPattern.js
var require_QRMaskPattern = __commonJS({
  "node_modules/qrcode-terminal/vendor/QRCode/QRMaskPattern.js"(exports, module) {
    init_esbuild_shims();
    module.exports = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
  }
});

// node_modules/qrcode-terminal/vendor/QRCode/QRUtil.js
var require_QRUtil = __commonJS({
  "node_modules/qrcode-terminal/vendor/QRCode/QRUtil.js"(exports, module) {
    init_esbuild_shims();
    var QRMode = require_QRMode();
    var QRPolynomial = require_QRPolynomial();
    var QRMath = require_QRMath();
    var QRMaskPattern = require_QRMaskPattern();
    var QRUtil = {
      PATTERN_POSITION_TABLE: [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
      ],
      G15: 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0,
      G18: 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0,
      G15_MASK: 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1,
      getBCHTypeInfo: /* @__PURE__ */ __name(function(data) {
        var d3 = data << 10;
        while (QRUtil.getBCHDigit(d3) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
          d3 ^= QRUtil.G15 << QRUtil.getBCHDigit(d3) - QRUtil.getBCHDigit(QRUtil.G15);
        }
        return (data << 10 | d3) ^ QRUtil.G15_MASK;
      }, "getBCHTypeInfo"),
      getBCHTypeNumber: /* @__PURE__ */ __name(function(data) {
        var d3 = data << 12;
        while (QRUtil.getBCHDigit(d3) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
          d3 ^= QRUtil.G18 << QRUtil.getBCHDigit(d3) - QRUtil.getBCHDigit(QRUtil.G18);
        }
        return data << 12 | d3;
      }, "getBCHTypeNumber"),
      getBCHDigit: /* @__PURE__ */ __name(function(data) {
        var digit = 0;
        while (data !== 0) {
          digit++;
          data >>>= 1;
        }
        return digit;
      }, "getBCHDigit"),
      getPatternPosition: /* @__PURE__ */ __name(function(typeNumber) {
        return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
      }, "getPatternPosition"),
      getMask: /* @__PURE__ */ __name(function(maskPattern, i, j) {
        switch (maskPattern) {
          case QRMaskPattern.PATTERN000:
            return (i + j) % 2 === 0;
          case QRMaskPattern.PATTERN001:
            return i % 2 === 0;
          case QRMaskPattern.PATTERN010:
            return j % 3 === 0;
          case QRMaskPattern.PATTERN011:
            return (i + j) % 3 === 0;
          case QRMaskPattern.PATTERN100:
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
          case QRMaskPattern.PATTERN101:
            return i * j % 2 + i * j % 3 === 0;
          case QRMaskPattern.PATTERN110:
            return (i * j % 2 + i * j % 3) % 2 === 0;
          case QRMaskPattern.PATTERN111:
            return (i * j % 3 + (i + j) % 2) % 2 === 0;
          default:
            throw new Error("bad maskPattern:" + maskPattern);
        }
      }, "getMask"),
      getErrorCorrectPolynomial: /* @__PURE__ */ __name(function(errorCorrectLength) {
        var a = new QRPolynomial([1], 0);
        for (var i = 0; i < errorCorrectLength; i++) {
          a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
        }
        return a;
      }, "getErrorCorrectPolynomial"),
      getLengthInBits: /* @__PURE__ */ __name(function(mode, type) {
        if (1 <= type && type < 10) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 10;
            case QRMode.MODE_ALPHA_NUM:
              return 9;
            case QRMode.MODE_8BIT_BYTE:
              return 8;
            case QRMode.MODE_KANJI:
              return 8;
            default:
              throw new Error("mode:" + mode);
          }
        } else if (type < 27) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 12;
            case QRMode.MODE_ALPHA_NUM:
              return 11;
            case QRMode.MODE_8BIT_BYTE:
              return 16;
            case QRMode.MODE_KANJI:
              return 10;
            default:
              throw new Error("mode:" + mode);
          }
        } else if (type < 41) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 14;
            case QRMode.MODE_ALPHA_NUM:
              return 13;
            case QRMode.MODE_8BIT_BYTE:
              return 16;
            case QRMode.MODE_KANJI:
              return 12;
            default:
              throw new Error("mode:" + mode);
          }
        } else {
          throw new Error("type:" + type);
        }
      }, "getLengthInBits"),
      getLostPoint: /* @__PURE__ */ __name(function(qrCode) {
        var moduleCount = qrCode.getModuleCount();
        var lostPoint = 0;
        var row = 0;
        var col = 0;
        for (row = 0; row < moduleCount; row++) {
          for (col = 0; col < moduleCount; col++) {
            var sameCount = 0;
            var dark = qrCode.isDark(row, col);
            for (var r = -1; r <= 1; r++) {
              if (row + r < 0 || moduleCount <= row + r) {
                continue;
              }
              for (var c = -1; c <= 1; c++) {
                if (col + c < 0 || moduleCount <= col + c) {
                  continue;
                }
                if (r === 0 && c === 0) {
                  continue;
                }
                if (dark === qrCode.isDark(row + r, col + c)) {
                  sameCount++;
                }
              }
            }
            if (sameCount > 5) {
              lostPoint += 3 + sameCount - 5;
            }
          }
        }
        for (row = 0; row < moduleCount - 1; row++) {
          for (col = 0; col < moduleCount - 1; col++) {
            var count = 0;
            if (qrCode.isDark(row, col)) count++;
            if (qrCode.isDark(row + 1, col)) count++;
            if (qrCode.isDark(row, col + 1)) count++;
            if (qrCode.isDark(row + 1, col + 1)) count++;
            if (count === 0 || count === 4) {
              lostPoint += 3;
            }
          }
        }
        for (row = 0; row < moduleCount; row++) {
          for (col = 0; col < moduleCount - 6; col++) {
            if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
              lostPoint += 40;
            }
          }
        }
        for (col = 0; col < moduleCount; col++) {
          for (row = 0; row < moduleCount - 6; row++) {
            if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
              lostPoint += 40;
            }
          }
        }
        var darkCount = 0;
        for (col = 0; col < moduleCount; col++) {
          for (row = 0; row < moduleCount; row++) {
            if (qrCode.isDark(row, col)) {
              darkCount++;
            }
          }
        }
        var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += ratio * 10;
        return lostPoint;
      }, "getLostPoint")
    };
    module.exports = QRUtil;
  }
});

// node_modules/qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel.js
var require_QRErrorCorrectLevel = __commonJS({
  "node_modules/qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel.js"(exports, module) {
    init_esbuild_shims();
    module.exports = {
      L: 1,
      M: 0,
      Q: 3,
      H: 2
    };
  }
});

// node_modules/qrcode-terminal/vendor/QRCode/QRRSBlock.js
var require_QRRSBlock = __commonJS({
  "node_modules/qrcode-terminal/vendor/QRCode/QRRSBlock.js"(exports, module) {
    init_esbuild_shims();
    var QRErrorCorrectLevel = require_QRErrorCorrectLevel();
    function QRRSBlock(totalCount, dataCount) {
      this.totalCount = totalCount;
      this.dataCount = dataCount;
    }
    __name(QRRSBlock, "QRRSBlock");
    QRRSBlock.RS_BLOCK_TABLE = [
      // L
      // M
      // Q
      // H
      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],
      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],
      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],
      // 4		
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],
      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],
      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],
      // 7		
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],
      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],
      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],
      // 10		
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],
      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],
      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],
      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],
      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],
      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12],
      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],
      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],
      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],
      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],
      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],
      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],
      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],
      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],
      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],
      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],
      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],
      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],
      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],
      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],
      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],
      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],
      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],
      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],
      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],
      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],
      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],
      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],
      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],
      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],
      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];
    QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
      var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
      if (rsBlock === void 0) {
        throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
      }
      var length = rsBlock.length / 3;
      var list = [];
      for (var i = 0; i < length; i++) {
        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];
        for (var j = 0; j < count; j++) {
          list.push(new QRRSBlock(totalCount, dataCount));
        }
      }
      return list;
    };
    QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {
      switch (errorCorrectLevel) {
        case QRErrorCorrectLevel.L:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
        case QRErrorCorrectLevel.M:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
        case QRErrorCorrectLevel.Q:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
        case QRErrorCorrectLevel.H:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    module.exports = QRRSBlock;
  }
});

// node_modules/qrcode-terminal/vendor/QRCode/QRBitBuffer.js
var require_QRBitBuffer = __commonJS({
  "node_modules/qrcode-terminal/vendor/QRCode/QRBitBuffer.js"(exports, module) {
    init_esbuild_shims();
    function QRBitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    __name(QRBitBuffer, "QRBitBuffer");
    QRBitBuffer.prototype = {
      get: /* @__PURE__ */ __name(function(index) {
        var bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
      }, "get"),
      put: /* @__PURE__ */ __name(function(num, length) {
        for (var i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) == 1);
        }
      }, "put"),
      getLengthInBits: /* @__PURE__ */ __name(function() {
        return this.length;
      }, "getLengthInBits"),
      putBit: /* @__PURE__ */ __name(function(bit) {
        var bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }, "putBit")
    };
    module.exports = QRBitBuffer;
  }
});

// node_modules/qrcode-terminal/vendor/QRCode/index.js
var require_QRCode = __commonJS({
  "node_modules/qrcode-terminal/vendor/QRCode/index.js"(exports, module) {
    init_esbuild_shims();
    var QR8bitByte = require_QR8bitByte();
    var QRUtil = require_QRUtil();
    var QRPolynomial = require_QRPolynomial();
    var QRRSBlock = require_QRRSBlock();
    var QRBitBuffer = require_QRBitBuffer();
    function QRCode(typeNumber, errorCorrectLevel) {
      this.typeNumber = typeNumber;
      this.errorCorrectLevel = errorCorrectLevel;
      this.modules = null;
      this.moduleCount = 0;
      this.dataCache = null;
      this.dataList = [];
    }
    __name(QRCode, "QRCode");
    QRCode.prototype = {
      addData: /* @__PURE__ */ __name(function(data) {
        var newData = new QR8bitByte(data);
        this.dataList.push(newData);
        this.dataCache = null;
      }, "addData"),
      isDark: /* @__PURE__ */ __name(function(row, col) {
        if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
          throw new Error(row + "," + col);
        }
        return this.modules[row][col];
      }, "isDark"),
      getModuleCount: /* @__PURE__ */ __name(function() {
        return this.moduleCount;
      }, "getModuleCount"),
      make: /* @__PURE__ */ __name(function() {
        if (this.typeNumber < 1) {
          var typeNumber = 1;
          for (typeNumber = 1; typeNumber < 40; typeNumber++) {
            var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);
            var buffer = new QRBitBuffer();
            var totalDataCount = 0;
            for (var i = 0; i < rsBlocks.length; i++) {
              totalDataCount += rsBlocks[i].dataCount;
            }
            for (var x = 0; x < this.dataList.length; x++) {
              var data = this.dataList[x];
              buffer.put(data.mode, 4);
              buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
              data.write(buffer);
            }
            if (buffer.getLengthInBits() <= totalDataCount * 8)
              break;
          }
          this.typeNumber = typeNumber;
        }
        this.makeImpl(false, this.getBestMaskPattern());
      }, "make"),
      makeImpl: /* @__PURE__ */ __name(function(test, maskPattern) {
        this.moduleCount = this.typeNumber * 4 + 17;
        this.modules = new Array(this.moduleCount);
        for (var row = 0; row < this.moduleCount; row++) {
          this.modules[row] = new Array(this.moduleCount);
          for (var col = 0; col < this.moduleCount; col++) {
            this.modules[row][col] = null;
          }
        }
        this.setupPositionProbePattern(0, 0);
        this.setupPositionProbePattern(this.moduleCount - 7, 0);
        this.setupPositionProbePattern(0, this.moduleCount - 7);
        this.setupPositionAdjustPattern();
        this.setupTimingPattern();
        this.setupTypeInfo(test, maskPattern);
        if (this.typeNumber >= 7) {
          this.setupTypeNumber(test);
        }
        if (this.dataCache === null) {
          this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
        }
        this.mapData(this.dataCache, maskPattern);
      }, "makeImpl"),
      setupPositionProbePattern: /* @__PURE__ */ __name(function(row, col) {
        for (var r = -1; r <= 7; r++) {
          if (row + r <= -1 || this.moduleCount <= row + r) continue;
          for (var c = -1; c <= 7; c++) {
            if (col + c <= -1 || this.moduleCount <= col + c) continue;
            if (0 <= r && r <= 6 && (c === 0 || c === 6) || 0 <= c && c <= 6 && (r === 0 || r === 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      }, "setupPositionProbePattern"),
      getBestMaskPattern: /* @__PURE__ */ __name(function() {
        var minLostPoint = 0;
        var pattern = 0;
        for (var i = 0; i < 8; i++) {
          this.makeImpl(true, i);
          var lostPoint = QRUtil.getLostPoint(this);
          if (i === 0 || minLostPoint > lostPoint) {
            minLostPoint = lostPoint;
            pattern = i;
          }
        }
        return pattern;
      }, "getBestMaskPattern"),
      createMovieClip: /* @__PURE__ */ __name(function(target_mc, instance_name, depth) {
        var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
        var cs = 1;
        this.make();
        for (var row = 0; row < this.modules.length; row++) {
          var y2 = row * cs;
          for (var col = 0; col < this.modules[row].length; col++) {
            var x = col * cs;
            var dark = this.modules[row][col];
            if (dark) {
              qr_mc.beginFill(0, 100);
              qr_mc.moveTo(x, y2);
              qr_mc.lineTo(x + cs, y2);
              qr_mc.lineTo(x + cs, y2 + cs);
              qr_mc.lineTo(x, y2 + cs);
              qr_mc.endFill();
            }
          }
        }
        return qr_mc;
      }, "createMovieClip"),
      setupTimingPattern: /* @__PURE__ */ __name(function() {
        for (var r = 8; r < this.moduleCount - 8; r++) {
          if (this.modules[r][6] !== null) {
            continue;
          }
          this.modules[r][6] = r % 2 === 0;
        }
        for (var c = 8; c < this.moduleCount - 8; c++) {
          if (this.modules[6][c] !== null) {
            continue;
          }
          this.modules[6][c] = c % 2 === 0;
        }
      }, "setupTimingPattern"),
      setupPositionAdjustPattern: /* @__PURE__ */ __name(function() {
        var pos = QRUtil.getPatternPosition(this.typeNumber);
        for (var i = 0; i < pos.length; i++) {
          for (var j = 0; j < pos.length; j++) {
            var row = pos[i];
            var col = pos[j];
            if (this.modules[row][col] !== null) {
              continue;
            }
            for (var r = -2; r <= 2; r++) {
              for (var c = -2; c <= 2; c++) {
                if (Math.abs(r) === 2 || Math.abs(c) === 2 || r === 0 && c === 0) {
                  this.modules[row + r][col + c] = true;
                } else {
                  this.modules[row + r][col + c] = false;
                }
              }
            }
          }
        }
      }, "setupPositionAdjustPattern"),
      setupTypeNumber: /* @__PURE__ */ __name(function(test) {
        var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
        var mod;
        for (var i = 0; i < 18; i++) {
          mod = !test && (bits >> i & 1) === 1;
          this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
        }
        for (var x = 0; x < 18; x++) {
          mod = !test && (bits >> x & 1) === 1;
          this.modules[x % 3 + this.moduleCount - 8 - 3][Math.floor(x / 3)] = mod;
        }
      }, "setupTypeNumber"),
      setupTypeInfo: /* @__PURE__ */ __name(function(test, maskPattern) {
        var data = this.errorCorrectLevel << 3 | maskPattern;
        var bits = QRUtil.getBCHTypeInfo(data);
        var mod;
        for (var v = 0; v < 15; v++) {
          mod = !test && (bits >> v & 1) === 1;
          if (v < 6) {
            this.modules[v][8] = mod;
          } else if (v < 8) {
            this.modules[v + 1][8] = mod;
          } else {
            this.modules[this.moduleCount - 15 + v][8] = mod;
          }
        }
        for (var h2 = 0; h2 < 15; h2++) {
          mod = !test && (bits >> h2 & 1) === 1;
          if (h2 < 8) {
            this.modules[8][this.moduleCount - h2 - 1] = mod;
          } else if (h2 < 9) {
            this.modules[8][15 - h2 - 1 + 1] = mod;
          } else {
            this.modules[8][15 - h2 - 1] = mod;
          }
        }
        this.modules[this.moduleCount - 8][8] = !test;
      }, "setupTypeInfo"),
      mapData: /* @__PURE__ */ __name(function(data, maskPattern) {
        var inc = -1;
        var row = this.moduleCount - 1;
        var bitIndex = 7;
        var byteIndex = 0;
        for (var col = this.moduleCount - 1; col > 0; col -= 2) {
          if (col === 6) col--;
          while (true) {
            for (var c = 0; c < 2; c++) {
              if (this.modules[row][col - c] === null) {
                var dark = false;
                if (byteIndex < data.length) {
                  dark = (data[byteIndex] >>> bitIndex & 1) === 1;
                }
                var mask = QRUtil.getMask(maskPattern, row, col - c);
                if (mask) {
                  dark = !dark;
                }
                this.modules[row][col - c] = dark;
                bitIndex--;
                if (bitIndex === -1) {
                  byteIndex++;
                  bitIndex = 7;
                }
              }
            }
            row += inc;
            if (row < 0 || this.moduleCount <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      }, "mapData")
    };
    QRCode.PAD0 = 236;
    QRCode.PAD1 = 17;
    QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
      var buffer = new QRBitBuffer();
      for (var i = 0; i < dataList.length; i++) {
        var data = dataList[i];
        buffer.put(data.mode, 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
        data.write(buffer);
      }
      var totalDataCount = 0;
      for (var x = 0; x < rsBlocks.length; x++) {
        totalDataCount += rsBlocks[x].dataCount;
      }
      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
      }
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(false);
      }
      while (true) {
        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(QRCode.PAD0, 8);
        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(QRCode.PAD1, 8);
      }
      return QRCode.createBytes(buffer, rsBlocks);
    };
    QRCode.createBytes = function(buffer, rsBlocks) {
      var offset = 0;
      var maxDcCount = 0;
      var maxEcCount = 0;
      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);
      for (var r = 0; r < rsBlocks.length; r++) {
        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;
        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);
        dcdata[r] = new Array(dcCount);
        for (var i = 0; i < dcdata[r].length; i++) {
          dcdata[r][i] = 255 & buffer.buffer[i + offset];
        }
        offset += dcCount;
        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var x = 0; x < ecdata[r].length; x++) {
          var modIndex = x + modPoly.getLength() - ecdata[r].length;
          ecdata[r][x] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
        }
      }
      var totalCodeCount = 0;
      for (var y2 = 0; y2 < rsBlocks.length; y2++) {
        totalCodeCount += rsBlocks[y2].totalCount;
      }
      var data = new Array(totalCodeCount);
      var index = 0;
      for (var z = 0; z < maxDcCount; z++) {
        for (var s = 0; s < rsBlocks.length; s++) {
          if (z < dcdata[s].length) {
            data[index++] = dcdata[s][z];
          }
        }
      }
      for (var xx = 0; xx < maxEcCount; xx++) {
        for (var t = 0; t < rsBlocks.length; t++) {
          if (xx < ecdata[t].length) {
            data[index++] = ecdata[t][xx];
          }
        }
      }
      return data;
    };
    module.exports = QRCode;
  }
});

// node_modules/qrcode-terminal/lib/main.js
var require_main = __commonJS({
  "node_modules/qrcode-terminal/lib/main.js"(exports, module) {
    init_esbuild_shims();
    var QRCode = require_QRCode();
    var QRErrorCorrectLevel = require_QRErrorCorrectLevel();
    var black = "\x1B[40m  \x1B[0m";
    var white = "\x1B[47m  \x1B[0m";
    var toCell = /* @__PURE__ */ __name(function(isBlack) {
      return isBlack ? black : white;
    }, "toCell");
    var repeat = /* @__PURE__ */ __name(function(color) {
      return {
        times: /* @__PURE__ */ __name(function(count) {
          return new Array(count).join(color);
        }, "times")
      };
    }, "repeat");
    var fill = /* @__PURE__ */ __name(function(length, value) {
      var arr = new Array(length);
      for (var i = 0; i < length; i++) {
        arr[i] = value;
      }
      return arr;
    }, "fill");
    module.exports = {
      error: QRErrorCorrectLevel.L,
      generate: /* @__PURE__ */ __name(function(input, opts, cb) {
        if (typeof opts === "function") {
          cb = opts;
          opts = {};
        }
        var qrcode = new QRCode(-1, this.error);
        qrcode.addData(input);
        qrcode.make();
        var output = "";
        if (opts && opts.small) {
          var BLACK = true, WHITE = false;
          var moduleCount = qrcode.getModuleCount();
          var moduleData = qrcode.modules.slice();
          var oddRow = moduleCount % 2 === 1;
          if (oddRow) {
            moduleData.push(fill(moduleCount, WHITE));
          }
          var platte = {
            WHITE_ALL: "\u2588",
            WHITE_BLACK: "\u2580",
            BLACK_WHITE: "\u2584",
            BLACK_ALL: " "
          };
          var borderTop = repeat(platte.BLACK_WHITE).times(moduleCount + 3);
          var borderBottom = repeat(platte.WHITE_BLACK).times(moduleCount + 3);
          output += borderTop + "\n";
          for (var row = 0; row < moduleCount; row += 2) {
            output += platte.WHITE_ALL;
            for (var col = 0; col < moduleCount; col++) {
              if (moduleData[row][col] === WHITE && moduleData[row + 1][col] === WHITE) {
                output += platte.WHITE_ALL;
              } else if (moduleData[row][col] === WHITE && moduleData[row + 1][col] === BLACK) {
                output += platte.WHITE_BLACK;
              } else if (moduleData[row][col] === BLACK && moduleData[row + 1][col] === WHITE) {
                output += platte.BLACK_WHITE;
              } else {
                output += platte.BLACK_ALL;
              }
            }
            output += platte.WHITE_ALL + "\n";
          }
          if (!oddRow) {
            output += borderBottom;
          }
        } else {
          var border = repeat(white).times(qrcode.getModuleCount() + 3);
          output += border + "\n";
          qrcode.modules.forEach(function(row2) {
            output += white;
            output += row2.map(toCell).join("");
            output += white + "\n";
          });
          output += border;
        }
        if (cb) cb(output);
        else console.log(output);
      }, "generate"),
      setErrorLevel: /* @__PURE__ */ __name(function(error) {
        this.error = QRErrorCorrectLevel[error] || this.error;
      }, "setErrorLevel")
    };
  }
});

// packages/channels/qqbot/dist/index.js
init_esbuild_shims();

// packages/channels/qqbot/dist/QQChannel.js
init_esbuild_shims();
import { readFileSync as readFileSync2, writeFileSync as writeFileSync2, existsSync as existsSync2, mkdirSync as mkdirSync2 } from "node:fs";
import { join as join2 } from "node:path";

// packages/channels/qqbot/dist/types.js
init_esbuild_shims();
var OpCode = {
  DISPATCH: 0,
  HEARTBEAT: 1,
  IDENTIFY: 2,
  RESUME: 6,
  RECONNECT: 7,
  INVALID_SESSION: 9,
  HELLO: 10,
  HEARTBEAT_ACK: 11
};
var Intent = {
  C2C_MESSAGE: 1 << 12,
  // C2C 消息
  GROUP_AT_MESSAGE: 1 << 25
  // 群聊 @ 消息事件
};

// packages/channels/qqbot/dist/accounts.js
init_esbuild_shims();
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
function getCredsFilePath(safeName) {
  return join(getGlobalQwenDir(), "channels", `${safeName}-credentials.json`);
}
__name(getCredsFilePath, "getCredsFilePath");
function loadCredentials(credsFile) {
  if (!existsSync(credsFile))
    return null;
  try {
    const saved = JSON.parse(readFileSync(credsFile, "utf-8"));
    if (saved.appId && saved.appSecret) {
      return { appId: saved.appId, appSecret: saved.appSecret };
    }
    return null;
  } catch {
    return null;
  }
}
__name(loadCredentials, "loadCredentials");
function saveCredentials(credsFile, appId, appSecret) {
  const dir = join(getGlobalQwenDir(), "channels");
  mkdirSync(dir, { recursive: true });
  writeFileSync(credsFile, JSON.stringify({ appId, appSecret }), {
    mode: 384
  });
}
__name(saveCredentials, "saveCredentials");

// packages/channels/qqbot/dist/login.js
init_esbuild_shims();

// node_modules/@tencent-connect/qqbot-connector/dist/esm/index.js
init_esbuild_shims();

// node_modules/@tencent-connect/qqbot-connector/dist/esm/qr-connect.js
init_esbuild_shims();
var import_qrcode_terminal = __toESM(require_main(), 1);

// node_modules/@tencent-connect/qqbot-connector/dist/esm/qqbot-session.js
init_esbuild_shims();
import m from "node:crypto";
import _ from "node:https";
var E = { production: "q.qq.com", test: "test.q.qq.com" };
function u(t = "production") {
  return E[t];
}
__name(u, "u");
function l() {
  return m.randomBytes(32).toString("base64");
}
__name(l, "l");
var d;
(function(t) {
  t[t.NONE = 0] = "NONE", t[t.PENDING = 1] = "PENDING", t[t.COMPLETED = 2] = "COMPLETED", t[t.EXPIRED = 3] = "EXPIRED";
})(d || (d = {}));
function b(t, r) {
  const a = Buffer.from(r, "base64"), n = Buffer.from(t, "base64"), e = n.subarray(0, 12), i = n.subarray(n.length - 16), s = n.subarray(12, n.length - 16), o = m.createDecipheriv("aes-256-gcm", a, e);
  return o.setAuthTag(i), Buffer.concat([o.update(s), o.final()]).toString("utf8");
}
__name(b, "b");
function h(t, r, a) {
  return new Promise((n, e) => {
    const i = JSON.stringify(r), s = new URL(t), o = _.request({ hostname: s.hostname, path: s.pathname + s.search, method: "POST", timeout: a, headers: { "Content-Type": "application/json", Accept: "application/json", "Content-Length": Buffer.byteLength(i) } }, (c) => {
      if (c.statusCode !== 200) {
        c.resume(), e(new Error(`HTTP ${c.statusCode} from ${t}`));
        return;
      }
      let f = "";
      c.on("data", (p2) => {
        f += p2;
      }), c.on("end", () => {
        try {
          n(JSON.parse(f));
        } catch (p2) {
          e(p2);
        }
      });
    });
    o.on("error", e), o.on("timeout", () => {
      o.destroy(), e(new Error(`timeout fetching ${t}`));
    }), o.end(i);
  });
}
__name(h, "h");
async function y(t = "production", r = 1e4) {
  const a = `https://${u(t)}/lite/create_bind_task`, n = l(), e = await h(a, { key: n }, r);
  if (e.retcode !== 0) throw new Error(e.msg ?? "create_bind_task failed");
  if (!e.data?.task_id) throw new Error("create_bind_task: missing task_id");
  return { taskId: e.data.task_id, key: n };
}
__name(y, "y");
async function g(t, r = "production", a = 1e4) {
  const n = `https://${u(r)}/lite/poll_bind_result`, e = await h(n, { task_id: t }, a);
  if (e.retcode !== 0) throw new Error(e.msg ?? "poll_bind_result failed");
  return { status: e.data?.status ?? d.NONE, botAppId: String(e.data?.bot_appid ?? ""), botEncryptSecret: e.data?.bot_encrypt_secret ?? "" };
}
__name(g, "g");
function w(t, r = "") {
  return `https://${u("production")}/qqbot/openclaw/connect.html?task_id=${encodeURIComponent(t)}&source=${encodeURIComponent(r)}&_wv=2`;
}
__name(w, "w");

// node_modules/@tencent-connect/qqbot-connector/dist/esm/qr-connect.js
var l2 = 2e3;
function F(o) {
  return new Promise((r) => {
    import_qrcode_terminal.default.generate(o, { small: true }, (t) => {
      r(t);
    });
  });
}
__name(F, "F");
function E2(o, r) {
  return new Promise((t, n) => {
    if (r?.aborted) {
      n(new DOMException("Aborted", "AbortError"));
      return;
    }
    const e = setTimeout(t, o);
    r?.addEventListener("abort", () => {
      clearTimeout(e), n(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}
__name(E2, "E");
async function m2(o, r, t) {
  for (; !t?.aborted; ) {
    let n;
    try {
      n = await g(o);
    } catch {
      await E2(l2, t);
      continue;
    }
    if (n.status === d.COMPLETED) {
      const e = b(n.botEncryptSecret, r);
      return { outcome: "scanned", appId: n.botAppId, appSecret: e };
    }
    if (n.status === d.EXPIRED) return { outcome: "expired" };
    await E2(l2, t);
  }
  throw new DOMException("Aborted", "AbortError");
}
__name(m2, "m");
function p(o, r) {
  const t = new AbortController(), n = r?.signal ? AbortSignal.any([t.signal, r.signal]) : t.signal;
  return (async () => {
    const e = r?.displayQrCodeToConsole ?? true;
    for (; ; ) {
      if (n.aborted) throw new DOMException("Aborted", "AbortError");
      let a;
      try {
        a = await y();
      } catch (u2) {
        throw new Error(`\u83B7\u53D6\u7ED1\u5B9A\u4EFB\u52A1\u5931\u8D25: ${u2 instanceof Error ? u2.message : String(u2)}`, { cause: u2 });
      }
      const s = w(a.taskId, r?.source);
      if (e) {
        const u2 = await F(s);
        console.log(u2), console.log(`\u8BF7\u4F7F\u7528\u624B\u673A QQ \u626B\u63CF\u4E0A\u65B9\u4E8C\u7EF4\u7801\uFF0C\u5B8C\u6210\u673A\u5668\u4EBA\u7ED1\u5B9A\u3002
`);
      }
      o.onQrDisplayed?.(s);
      const c = await m2(a.taskId, a.key, n);
      if (c.outcome === "scanned") {
        o.onSuccess([{ appId: c.appId, appSecret: c.appSecret }]);
        return;
      }
      o.onQrExpired?.(), e && console.log(`\u4E8C\u7EF4\u7801\u5DF2\u8FC7\u671F\uFF0C\u6B63\u5728\u5237\u65B0\u2026
`);
    }
  })().catch((e) => {
    if (e instanceof DOMException && e.name === "AbortError") {
      o.onFailure(new Error("\u5DF2\u53D6\u6D88"));
      return;
    }
    o.onFailure(e instanceof Error ? e : new Error(String(e)));
  }), () => t.abort();
}
__name(p, "p");
function C(o) {
  return new Promise((r, t) => {
    p({ onSuccess: r, onFailure: t }, { ...o, displayQrCodeToConsole: true });
  });
}
__name(C, "C");

// packages/channels/qqbot/dist/login.js
async function qrCodeLogin() {
  const results = await C();
  const creds = results[0];
  if (!creds?.appId || !creds?.appSecret) {
    throw new Error("QR login failed: no credentials returned");
  }
  return { appId: creds.appId, appSecret: creds.appSecret };
}
__name(qrCodeLogin, "qrCodeLogin");

// packages/channels/qqbot/dist/api.js
init_esbuild_shims();
var TOKEN_URL = "https://bots.qq.com/app/getAppAccessToken";
var API_HOST = "https://api.sgroup.qq.com";
var SANDBOX_HOST = "https://sandbox.api.sgroup.qq.com";
var FETCH_TIMEOUT = 15e3;
async function fetchAccessToken(appId, appSecret) {
  const resp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appId, clientSecret: appSecret }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT)
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new Error(`QQ Bot token request failed (HTTP ${resp.status}): ${body}`);
  }
  const data = await resp.json();
  if (!data.access_token) {
    throw new Error("QQ Bot token response missing access_token");
  }
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in ?? 7200
  };
}
__name(fetchAccessToken, "fetchAccessToken");
async function fetchGatewayUrl(accessToken, sandbox) {
  const gw = sandbox ? `${SANDBOX_HOST}/gateway` : `${API_HOST}/gateway`;
  const resp = await fetch(gw, {
    headers: { Authorization: `QQBot ${accessToken}` },
    signal: AbortSignal.timeout(FETCH_TIMEOUT)
  });
  if (!resp.ok) {
    throw new Error(`QQ Bot gateway request failed (HTTP ${resp.status})`);
  }
  const data = await resp.json();
  if (!data["url"]) {
    throw new Error("QQ Bot gateway response missing WebSocket URL");
  }
  return data["url"];
}
__name(fetchGatewayUrl, "fetchGatewayUrl");
function getApiBase(sandbox) {
  return sandbox ? SANDBOX_HOST : API_HOST;
}
__name(getApiBase, "getApiBase");
async function sendQQMessage(base, path, accessToken, body) {
  return fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `QQBot ${accessToken}`
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT)
  });
}
__name(sendQQMessage, "sendQQMessage");

// packages/channels/qqbot/dist/QQChannel.js
function isValidChatId(id) {
  return /^[A-Za-z0-9_-]+$/.test(id) && id.length <= 128;
}
__name(isValidChatId, "isValidChatId");
function hasLinkSyntax(text) {
  const open = text.indexOf("[");
  if (open === -1)
    return false;
  const mid = text.indexOf("](", open + 1);
  if (mid === -1)
    return false;
  return text.indexOf(")", mid + 2) !== -1;
}
__name(hasLinkSyntax, "hasLinkSyntax");
function hasMarkdownSyntax(text) {
  return /^#{1,6}\s/m.test(text) || text.includes("```") || /\*\*|__|~~/.test(text) || /`[^`]+`/.test(text) || hasLinkSyntax(text) || /^[-*+]\s/m.test(text) || /^\d+\.\s/m.test(text);
}
__name(hasMarkdownSyntax, "hasMarkdownSyntax");
function splitText(text) {
  const MAX = 2e3;
  if (text.length <= MAX)
    return [text];
  const chunks = [];
  for (let i = 0; i < text.length; i += MAX) {
    chunks.push(text.slice(i, i + MAX));
  }
  return chunks;
}
__name(splitText, "splitText");
var QQChannel = class extends ChannelBase {
  static {
    __name(this, "QQChannel");
  }
  ws = null;
  accessToken = "";
  tokenExpiresAt = 0;
  tokenRefreshTimer = null;
  heartbeatTimer = null;
  heartbeatInterval = 45e3;
  seq = 0;
  reconnectAttempts = 0;
  maxReconnectAttempts = 20;
  /** QQ Bot session_id from READY, used for RESUME on reconnect. */
  sessionId = "";
  /** Whether this connection attempt should try RESUME first. */
  tryResume = false;
  qqConfig;
  /** Set when server sends RECONNECT opcode — close handler uses this to force reconnect. */
  serverRequestedReconnect = false;
  /** Pending connect promise reject — called when WebSocket closes before READY. */
  connectReject = null;
  /** Set to true when channel is disconnected — prevents orphaned connections. */
  disposed = false;
  /** Deduplicate inbound messages on reconnect replay (messageId → timestamp). */
  seenMessages = /* @__PURE__ */ new Map();
  /** Cleanup timer for seenMessages TTL eviction. */
  seenCleanupTimer = null;
  /** Timestamp of last received HEARTBEAT_ACK, for zombie-connection detection. */
  lastHeartbeatAck = 0;
  /** Debounce timer for saveQQState to avoid blocking event loop. */
  saveTimer = null;
  /** Timer for reconnectWithRetry fallback (unref'd so it doesn't block exit). */
  reconnectTimer = null;
  /** Guard against parallel reconnectWithRetry chains from stale close events. */
  isReconnecting = false;
  /** Track whether a chatId is a group or C2C for correct API routing. */
  chatTypeMap = /* @__PURE__ */ new Map();
  /** Track the latest user messageId per chatId for proper reply (msg_id). */
  replyMsgId = /* @__PURE__ */ new Map();
  /** msg_seq counter per user messageId, for multi-block streaming. */
  msgSeqMap = /* @__PURE__ */ new Map();
  /** Path to persisted QQ routing state: chatTypeMap, replyMsgId, msgSeqMap. */
  qqStatePath;
  /**
   * Path to the SessionRouter persistence file we back up before shutdown.
   * start.ts passes a shared router; standalone QQChannel instances use a
   * per-channel router file.
   */
  globalSessionsPath;
  /** Backup of sessions.json so conversations survive daemon restarts. */
  sessionsBackupPath;
  constructor(name, config, bridge, options) {
    const safeName = name.replace(/[^A-Za-z0-9_-]/g, "_");
    const stateDir = join2(getGlobalQwenDir(), "channels");
    mkdirSync2(stateDir, { recursive: true });
    const sessionsPath = join2(stateDir, `${safeName}-sessions.json`);
    const hasExternalRouter = Boolean(options?.router);
    const router = options?.router ?? new SessionRouter(bridge, config.cwd, config.sessionScope, sessionsPath);
    super(name, config, bridge, { ...options, router });
    this.qqConfig = config;
    this.qqStatePath = join2(stateDir, `${safeName}-state.json`);
    this.globalSessionsPath = hasExternalRouter ? join2(stateDir, "sessions.json") : sessionsPath;
    this.sessionsBackupPath = join2(stateDir, `${safeName}-sessions-backup.json`);
  }
  // ── ChannelBase interface ──────────────────────────────────────
  async connect() {
    this.disposed = false;
    if (!this.config.instructions) {
      this.config.instructions = [
        "## QQ Bot Channel",
        "",
        "\u4F60\u662F\u901A\u8FC7 QQ Bot \u4E0E\u7528\u6237\u5BF9\u8BDD\u7684 AI \u52A9\u624B\u3002",
        "\u56DE\u590D\u63A7\u5236\u5728 2000 \u5B57\u7B26\u4EE5\u5185\uFF08\u8D85\u957F\u4F1A\u81EA\u52A8\u5206\u5757\uFF09\uFF0C\u652F\u6301 Markdown \u683C\u5F0F\u3002"
      ].join("\n");
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await this.fetchToken();
        await this.connectGateway();
        return;
      } catch (e) {
        if (attempt < 2) {
          const msg = e instanceof Error ? e.message : String(e);
          process.stderr.write(`[QQ:${this.name}] Connect attempt ${attempt + 1} failed: ${msg}, retrying...
`);
          await this.sleep(2e3);
        } else {
          throw e;
        }
      }
    }
  }
  async sendMessage(chatId, text) {
    const route = await this.resolveRoute(chatId);
    if (!route)
      return;
    const msgId = this.replyMsgId.get(chatId);
    const useMarkdown = hasMarkdownSyntax(text);
    for (const chunk of splitText(text)) {
      try {
        const body = useMarkdown ? { msg_type: 2, markdown: { content: chunk } } : { content: chunk, msg_type: 0 };
        const nextSeq = msgId ? (this.msgSeqMap.get(msgId) ?? 0) + 1 : 0;
        if (msgId) {
          body["msg_id"] = msgId;
          body["msg_seq"] = nextSeq;
        }
        let resp = await sendQQMessage(route.base, route.path, this.accessToken, body);
        if (!resp.ok && useMarkdown) {
          const errBody = await resp.text().catch(() => "");
          process.stderr.write(`[QQ:${this.name}] Markdown rejected (HTTP ${resp.status}: ${errBody.slice(0, 100)}), retrying as plain text
`);
          const plainBody = {
            content: chunk,
            msg_type: 0
          };
          if (msgId) {
            plainBody["msg_id"] = msgId;
            plainBody["msg_seq"] = nextSeq;
          }
          resp = await sendQQMessage(route.base, route.path, this.accessToken, plainBody);
        }
        if (!resp.ok) {
          const errBody = await resp.text().catch(() => "");
          process.stderr.write(`[QQ:${this.name}] Send HTTP ${resp.status} (msg_seq=${body["msg_seq"] ?? "-"}): ${errBody.slice(0, 200)}
`);
          break;
        }
        if (msgId)
          this.msgSeqMap.set(msgId, nextSeq);
      } catch (e) {
        process.stderr.write(`[QQ:${this.name}] Send error: ${e}
`);
        break;
      }
    }
    if (msgId)
      this.saveQQState();
  }
  /**
   * Resolve API routing: handles disposed check, token refresh, chatId validation,
   * sandbox detection, and C2C/group path selection. Returns null if any guard fails.
   */
  async resolveRoute(chatId) {
    if (this.disposed)
      return null;
    if (Date.now() >= this.tokenExpiresAt) {
      try {
        await this.fetchToken();
      } catch {
        return null;
      }
    }
    if (!this.accessToken || !isValidChatId(chatId))
      return null;
    const base = getApiBase(Boolean(this.qqConfig.sandbox));
    const path = this.chatTypeMap.get(chatId) === "group" ? `/v2/groups/${chatId}/messages` : `/v2/users/${chatId}/messages`;
    return { base, path };
  }
  disconnect() {
    this.disposed = true;
    this.stopHeartbeat();
    this.stopTokenRefresh();
    if (this.seenCleanupTimer) {
      clearInterval(this.seenCleanupTimer);
      this.seenCleanupTimer = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.flushQQState();
    this.backupGlobalSessions();
    if (this.ws) {
      this.ws.close(1e3);
      this.ws = null;
    }
    if (this.connectReject) {
      this.connectReject(new Error("Channel disconnected"));
      this.connectReject = null;
    }
    this.chatTypeMap.clear();
    this.replyMsgId.clear();
    this.msgSeqMap.clear();
  }
  /**
   * QQ Bot API V2 does not provide a typing indicator endpoint.
   * ChannelBase calls these hooks to signal prompt start/end;
   * they are intentionally no-ops for this channel.
   */
  onPromptStart(_chatId, _sessionId, _messageId) {
  }
  onPromptEnd(_chatId, _sessionId, _messageId) {
  }
  // ── State Persistence (cross-server context continuation) ──────
  /** Debounced state persistence to avoid blocking event loop. */
  saveQQState() {
    if (this.saveTimer)
      clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      try {
        writeFileSync2(this.qqStatePath, JSON.stringify({
          chatTypeMap: Array.from(this.chatTypeMap.entries()),
          replyMsgId: Array.from(this.replyMsgId.entries()),
          msgSeqMap: Array.from(this.msgSeqMap.entries())
        }), { mode: 384 });
      } catch {
      }
    }, 500);
  }
  /** Flush pending state writes immediately (called on disconnect). */
  flushQQState() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    try {
      writeFileSync2(this.qqStatePath, JSON.stringify({
        chatTypeMap: Array.from(this.chatTypeMap.entries()),
        replyMsgId: Array.from(this.replyMsgId.entries()),
        msgSeqMap: Array.from(this.msgSeqMap.entries())
      }));
    } catch {
    }
  }
  /**
   * Restore QQ routing state from disk.
   * Trusts persisted JSON — if the file is corrupt, new Map() may create
   * entries with undefined values, causing get()===undefined to fall through
   * to default routing (C2C). This is acceptable for a rare edge case.
   */
  restoreQQState() {
    try {
      if (!existsSync2(this.qqStatePath))
        return false;
      const raw = JSON.parse(readFileSync2(this.qqStatePath, "utf-8"));
      if (raw.chatTypeMap)
        this.chatTypeMap = new Map(raw.chatTypeMap);
      if (raw.replyMsgId)
        this.replyMsgId = new Map(raw.replyMsgId);
      if (raw.msgSeqMap)
        this.msgSeqMap = new Map(raw.msgSeqMap);
      return true;
    } catch (e) {
      process.stderr.write(`[QQ:${this.name}] Failed to restore QQ state: ${e instanceof Error ? e.message : String(e)}
`);
      return false;
    }
  }
  /**
   * Backup the global sessions.json before start.ts deletes it on shutdown.
   * Restored on next connect so conversations survive daemon restarts.
   */
  backupGlobalSessions() {
    try {
      if (existsSync2(this.globalSessionsPath)) {
        const data = readFileSync2(this.globalSessionsPath, "utf-8");
        if (data.trim())
          writeFileSync2(this.sessionsBackupPath, data, { mode: 384 });
      }
    } catch {
    }
  }
  restoreGlobalSessions() {
    try {
      if (!existsSync2(this.globalSessionsPath) && existsSync2(this.sessionsBackupPath)) {
        writeFileSync2(this.globalSessionsPath, readFileSync2(this.sessionsBackupPath, "utf-8"), { mode: 384 });
      }
    } catch {
    }
  }
  /**
   * Workaround for SessionRouter.restoreSessions() storing undefined sessionIds
   * when ACP bridge.loadSession() fails to return a session_id.
   *
   * **Fragile**: accesses SessionRouter's private `toSession`/`toTarget`/`toCwd`
   * maps via type coercion. If SessionRouter internals change, this breaks
   * silently. The only signal will be cross-server conversations failing to
   * restore after daemon restart — no crash, no log.
   *
   * If upstream SessionRouter adds a public fix for this, remove this method.
   */
  fixRestoredSessions() {
    try {
      if (!existsSync2(this.globalSessionsPath))
        return;
      const raw = JSON.parse(readFileSync2(this.globalSessionsPath, "utf-8"));
      const r = this.router;
      const tm = r["toSession"];
      const tt = r["toTarget"];
      const tc = r["toCwd"];
      if (!tm || !tt)
        return;
      for (const [key, sid] of tm) {
        if (sid)
          continue;
        const entry = raw[key];
        if (!entry?.sessionId)
          continue;
        const correctId = entry.sessionId;
        const target = entry.target;
        tm.set(key, correctId);
        tt.delete(void 0);
        tt.set(correctId, target);
        if (tc) {
          tc.delete(void 0);
          tc.set(correctId, entry.cwd || "");
        }
      }
    } catch {
    }
  }
  // ── Token ──────────────────────────────────────────────────────
  async fetchToken() {
    const safeName = this.name.replace(/[^A-Za-z0-9_-]/g, "_");
    const credsFile = getCredsFilePath(safeName);
    let appID = this.qqConfig.appID;
    let appSecret = this.qqConfig.appSecret;
    if (!appID || !appSecret) {
      const saved = loadCredentials(credsFile);
      if (saved) {
        appID = saved.appId;
        appSecret = saved.appSecret;
        this.qqConfig.appID = appID;
        this.qqConfig.appSecret = appSecret;
      }
    }
    if (!appID || !appSecret) {
      process.stderr.write(`[QQ:${this.name}] No credentials, scan QR code with QQ...
`);
      const creds = await qrCodeLogin();
      appID = creds.appId;
      appSecret = creds.appSecret;
      this.qqConfig.appID = appID;
      this.qqConfig.appSecret = appSecret;
      saveCredentials(credsFile, appID, appSecret);
    }
    const token = await fetchAccessToken(appID, appSecret);
    this.accessToken = token.accessToken;
    this.tokenExpiresAt = Date.now() + token.expiresIn * 1e3;
    this.scheduleTokenRefresh();
  }
  scheduleTokenRefresh() {
    if (this.disposed)
      return;
    this.stopTokenRefresh();
    const ttl = Math.max(0, this.tokenExpiresAt - Date.now());
    const delay = Math.max(Math.min(ttl * 0.8, ttl - 6e4), 6e4);
    if (delay > 0) {
      this.tokenRefreshTimer = setTimeout(() => {
        this.fetchToken().catch((e) => {
          if (this.disposed)
            return;
          process.stderr.write(`[QQ:${this.name}] Token refresh failed: ${e}, retrying in 60s
`);
          this.scheduleTokenRefreshRetry();
        });
      }, delay);
    }
  }
  scheduleTokenRefreshRetry() {
    if (this.disposed)
      return;
    this.stopTokenRefresh();
    this.tokenRefreshTimer = setTimeout(() => {
      this.fetchToken().catch((e) => {
        if (this.disposed)
          return;
        process.stderr.write(`[QQ:${this.name}] Token refresh failed: ${e}, retrying in 60s
`);
        this.scheduleTokenRefreshRetry();
      });
    }, 6e4);
  }
  stopTokenRefresh() {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }
  // ── WebSocket Gateway ──────────────────────────────────────────
  async connectGateway() {
    if (this.disposed)
      throw new Error("Channel disposed");
    const url = await fetchGatewayUrl(this.accessToken, Boolean(this.qqConfig.sandbox));
    return new Promise((resolve, reject) => {
      this.connectReject = reject;
      this.dialGateway(url, resolve, reject);
    });
  }
  dialGateway(url, resolve, reject) {
    this.ws = new wrapper_default(url);
    const dialed = this.ws;
    this.ws.on("open", () => {
      process.stderr.write(`[QQ:${this.name}] WebSocket connected
`);
    });
    this.ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        this.handleGatewayMessage(msg, resolve);
      } catch (e) {
        process.stderr.write(`[QQ:${this.name}] Malformed gateway message: ${e instanceof Error ? e.message : String(e)}
`);
      }
    });
    this.ws.on("close", (code) => {
      if (this.ws !== dialed)
        return;
      process.stderr.write(`[QQ:${this.name}] WebSocket closed (code=${code})
`);
      this.stopHeartbeat();
      this.ws = null;
      const shouldReconnect = this.serverRequestedReconnect || code !== 1e3 && this.reconnectAttempts < this.maxReconnectAttempts;
      this.serverRequestedReconnect = false;
      if (shouldReconnect && this.connectReject) {
        this.connectReject(new Error(`WebSocket closed before READY (code=${code})`));
        this.connectReject = null;
      } else if (shouldReconnect) {
        this.reconnectAttempts++;
        const delay = Math.min(1e3 * 2 ** this.reconnectAttempts, 3e4);
        process.stderr.write(`[QQ:${this.name}] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})
`);
        if (!this.isReconnecting) {
          this.reconnectTimer = setTimeout(() => this.reconnectWithRetry(), delay);
          this.reconnectTimer.unref();
        }
      } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        process.stderr.write(`[QQ:${this.name}] FATAL: reconnect exhausted after ${this.maxReconnectAttempts} attempts. Bot is offline until daemon restart.
`);
        if (this.connectReject) {
          this.connectReject(new Error(`WebSocket closed (max reconnect attempts, code=${code})`));
          this.connectReject = null;
        }
      } else {
        if (this.connectReject) {
          this.connectReject(new Error(`WebSocket closed before READY (code=${code})`));
          this.connectReject = null;
        }
      }
    });
    this.ws.on("error", (e) => {
      process.stderr.write(`[QQ:${this.name}] WebSocket error: ${e.message}
`);
      if (!this.ws || this.ws.readyState !== wrapper_default.OPEN) {
        reject(e);
      }
    });
  }
  handleGatewayMessage(msg, onReady) {
    const op = msg["op"];
    switch (op) {
      case OpCode.HELLO: {
        this.heartbeatInterval = Math.max(msg["d"]?.["heartbeat_interval"] || 45e3, 5e3);
        this.sendIdentify();
        break;
      }
      case OpCode.DISPATCH: {
        const t = msg["t"];
        const s = msg["s"];
        if (s !== void 0)
          this.seq = s;
        if (t === "READY") {
          this.reconnectAttempts = 0;
          this.isReconnecting = false;
          this.sessionId = msg["d"]?.["session_id"] || "";
          this.tryResume = true;
          this.connectReject = null;
          this.startHeartbeat();
          this.restoreGlobalSessions();
          this.restoreQQState();
          this.router.restoreSessions().then(() => {
            this.fixRestoredSessions();
            const all = this.router.getAll?.();
            const sessions = all?.map((e) => `${e.target?.chatId}:${e.sessionId}`).join(", ") || "none";
            process.stderr.write(`[QQ:${this.name}] Ready (sessions: ${sessions})
`);
            onReady();
          }).catch(() => onReady());
        } else if (t === "C2C_MESSAGE_CREATE") {
          this.handleC2C(msg["d"]);
        } else if (t === "GROUP_AT_MESSAGE_CREATE") {
          this.handleGroup(msg["d"]);
        } else if (t === "RESUMED") {
          this.reconnectAttempts = 0;
          this.isReconnecting = false;
          this.connectReject = null;
          this.startHeartbeat();
          onReady();
        }
        break;
      }
      case OpCode.HEARTBEAT_ACK:
        this.lastHeartbeatAck = Date.now();
        break;
      case OpCode.RECONNECT:
        this.serverRequestedReconnect = true;
        this.ws?.close(4e3);
        break;
      case OpCode.INVALID_SESSION:
        process.stderr.write(`[QQ:${this.name}] Server sent INVALID_SESSION, falling back to IDENTIFY
`);
        this.tryResume = false;
        this.sendIdentify();
        break;
      default:
        break;
    }
  }
  sendIdentify() {
    if (!this.ws)
      return;
    if (this.tryResume && this.sessionId) {
      process.stderr.write(`[QQ:${this.name}] Sending RESUME (session: ${this.sessionId})
`);
      this.ws.send(JSON.stringify({
        op: OpCode.RESUME,
        d: {
          token: `QQBot ${this.accessToken}`,
          session_id: this.sessionId,
          seq: this.seq
        }
      }));
      return;
    }
    this.ws.send(JSON.stringify({
      op: OpCode.IDENTIFY,
      d: {
        token: `QQBot ${this.accessToken}`,
        intents: Intent.C2C_MESSAGE | Intent.GROUP_AT_MESSAGE,
        shard: [0, 1],
        properties: {}
      }
    }));
  }
  /**
   * Reconnect loop with retry on gateway fetch failures.
   * Refreshes token before each attempt, and retries GW HTTP failures
   * with exponential backoff. Keeps retrying until success.
   */
  async reconnectWithRetry() {
    if (this.disposed)
      return;
    if (this.isReconnecting)
      return;
    this.isReconnecting = true;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      process.stderr.write(`[QQ:${this.name}] RC: reconnect attempts exhausted, giving up
`);
      this.isReconnecting = false;
      return;
    }
    const maxGwRetries = 5;
    let gatewayAttempted = false;
    for (let attempt = 0; attempt < maxGwRetries; attempt++) {
      try {
        try {
          await this.fetchToken();
        } catch {
          process.stderr.write(`[QQ:${this.name}] RC: token refresh failed, retrying...
`);
          await this.sleep(2e3);
          continue;
        }
        gatewayAttempted = true;
        await this.connectGateway();
        return;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        const backoff = Math.min(1e3 * 2 ** (attempt + 1), 3e4);
        process.stderr.write(`[QQ:${this.name}] RC: ${msg} (retry in ${backoff}ms, attempt ${attempt + 1}/${maxGwRetries})
`);
        if (attempt < maxGwRetries - 1)
          await this.sleep(backoff);
      }
    }
    process.stderr.write(`[QQ:${this.name}] RC: exhausted ${maxGwRetries} reconnect retries, will retry in 60s
`);
    if (gatewayAttempted)
      this.reconnectAttempts++;
    this.tryResume = false;
    this.isReconnecting = false;
    this.reconnectTimer = setTimeout(() => this.reconnectWithRetry(), 6e4);
    this.reconnectTimer.unref();
  }
  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
  startHeartbeat() {
    this.stopHeartbeat();
    this.lastHeartbeatAck = Date.now();
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState !== wrapper_default.OPEN)
        return;
      const elapsed = Date.now() - this.lastHeartbeatAck;
      if (elapsed > this.heartbeatInterval * 2) {
        process.stderr.write(`[QQ:${this.name}] Heartbeat ACK timeout (${elapsed}ms), forcing reconnect
`);
        this.ws?.close(4001);
        return;
      }
      this.ws.send(JSON.stringify({ op: OpCode.HEARTBEAT, d: this.seq }));
    }, this.heartbeatInterval);
  }
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
  // ── Message Handlers ───────────────────────────────────────────
  /** Check if a message ID was already processed (reconnect replay dedup). */
  isDuplicate(eventId) {
    if (this.seenMessages.has(eventId))
      return true;
    const now = Date.now();
    this.seenMessages.set(eventId, now);
    if (!this.seenCleanupTimer) {
      this.seenCleanupTimer = setInterval(() => {
        const cutoff = Date.now() - 3e5;
        for (const [id, ts] of this.seenMessages) {
          if (ts < cutoff)
            this.seenMessages.delete(id);
        }
        if (this.seenMessages.size === 0) {
          clearInterval(this.seenCleanupTimer);
          this.seenCleanupTimer = null;
        }
      }, 6e4);
    }
    return false;
  }
  handleC2C(event) {
    if (this.isDuplicate(event.id))
      return;
    if (!event.content?.trim())
      return;
    const chatId = event.author.user_openid || event.author.id;
    this.chatTypeMap.set(chatId, "c2c");
    this.replyMsgId.set(chatId, event.id);
    this.saveQQState();
    this.handleInbound({
      channelName: this.name,
      senderId: chatId,
      senderName: event.author.username || event.author.id || "QQ User",
      chatId,
      text: event.content,
      messageId: event.id,
      isGroup: false,
      isMentioned: true,
      isReplyToBot: false
    }).catch((e) => process.stderr.write(`[QQ:${this.name}] C2C handler error: ${e}
`));
  }
  handleGroup(event) {
    if (this.isDuplicate(event.id))
      return;
    if (!event.group_openid) {
      process.stderr.write(`[QQ:${this.name}] Group message dropped: missing group_openid
`);
      return;
    }
    const chatId = event.group_openid;
    this.chatTypeMap.set(chatId, "group");
    this.replyMsgId.set(chatId, event.id);
    this.saveQQState();
    const senderName = event.author.username || event.author.id || "QQ User";
    const cleanText = (event.content || "").replace(/<@[^>]{1,64}>/g, "").trim();
    if (!cleanText)
      return;
    const isSlash = cleanText.startsWith("/");
    if (isSlash) {
      process.stderr.write(`[QQ:${this.name}] Slash cmd from ${senderName} (${chatId}): ${cleanText}
`);
    }
    const text = isSlash ? cleanText : `[${senderName}]: ${cleanText}`;
    this.handleInbound({
      channelName: this.name,
      senderId: event.author.user_openid || event.author.id,
      senderName,
      chatId,
      text,
      messageId: event.id,
      isGroup: true,
      isMentioned: true,
      // QQ Bot only receives group messages when explicitly @mentioned, so
      // every group message is semantically a reply to the bot.
      isReplyToBot: true
    }).catch((e) => process.stderr.write(`[QQ:${this.name}] Group handler error: ${e}
`));
  }
};

// packages/channels/qqbot/dist/index.js
var plugin = {
  channelType: "qq",
  displayName: "QQ",
  // Both appID and appSecret are optional at config level because
  // fetchToken() resolves them via a fallback chain:
  //   config values → persisted credentials file → QR code login
  // If we required them here, parseChannelConfig() would reject the config
  // before QQChannel is ever constructed — QR-only login would be unreachable
  // through the built-in channel path.
  requiredConfigFields: [],
  createChannel: /* @__PURE__ */ __name((name, config, bridge, options) => new QQChannel(name, config, bridge, options), "createChannel")
};
export {
  QQChannel,
  plugin
};
