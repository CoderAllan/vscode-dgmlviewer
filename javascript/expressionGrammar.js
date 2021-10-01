// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function nth(n) {
    return function(d) {
        return d[n];
    };
}


// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function $(o) {
    return function(d) {
        var ret = {};
        Object.keys(o).forEach(function(k) {
            ret[k] = d[o[k]];
        });
        return ret;
    };
}


function methodCall(nameId, argsId = -1) {
  return function(data) {
      return {
          type: 'methodCall',
          name: data[nameId],
          args: argsId == -1 ? [] : data[argsId]
      };
    }
}

function value() {
  return function(data) {
      return {
          type: 'value',
          value: data[0]
      };
    }
}
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_int$ebnf$1", "symbols": ["unsigned_int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_int", "symbols": ["unsigned_int$ebnf$1"], "postprocess": 
        function(d) {
            return parseInt(d[0].join(""));
        }
        },
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "int$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$2", "symbols": ["int$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1", "int$ebnf$2"], "postprocess": 
        function(d) {
            if (d[0]) {
                return parseInt(d[0][0]+d[1].join(""));
            } else {
                return parseInt(d[1].join(""));
            }
        }
        },
    {"name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$1", "symbols": ["unsigned_decimal$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "unsigned_decimal$ebnf$2", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "unsigned_decimal$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "unsigned_decimal", "symbols": ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], "postprocess": 
        function(d) {
            return parseFloat(
                d[0].join("") +
                (d[1] ? "."+d[1][1].join("") : "")
            );
        }
        },
    {"name": "decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$2", "symbols": ["decimal$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "decimal$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "")
            );
        }
        },
    {"name": "percentage", "symbols": ["decimal", {"literal":"%"}], "postprocess": 
        function(d) {
            return d[0]/100;
        }
        },
    {"name": "jsonfloat$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "jsonfloat$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$2", "symbols": ["jsonfloat$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "jsonfloat$ebnf$3", "symbols": ["jsonfloat$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [/[+-]/], "postprocess": id},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$4$subexpression$1", "symbols": [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"]},
    {"name": "jsonfloat$ebnf$4", "symbols": ["jsonfloat$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat", "symbols": ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "") +
                (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
            );
        }
        },
    {"name": "expression", "symbols": ["methodCall"], "postprocess": id},
    {"name": "expression", "symbols": ["relationalExpression"], "postprocess": value()},
    {"name": "expression", "symbols": ["booleanExpression"], "postprocess": value()},
    {"name": "expression", "symbols": ["_", "identifier", "_"], "postprocess": methodCall(1)},
    {"name": "booleanExpression", "symbols": ["parentheses"], "postprocess": id},
    {"name": "booleanExpression$subexpression$1", "symbols": [/[aA]/, /[nN]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "booleanExpression", "symbols": ["parentheses", "_", "booleanExpression$subexpression$1", "_", "parentheses"], "postprocess": d => d[0] && d[4]},
    {"name": "booleanExpression$string$1", "symbols": [{"literal":"&"}, {"literal":"&"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "booleanExpression", "symbols": ["parentheses", "_", "booleanExpression$string$1", "_", "parentheses"], "postprocess": d => d[0] && d[4]},
    {"name": "booleanExpression$subexpression$2", "symbols": [/[oO]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "booleanExpression", "symbols": ["parentheses", "_", "booleanExpression$subexpression$2", "_", "parentheses"], "postprocess": d => d[0] || d[4]},
    {"name": "booleanExpression$string$2", "symbols": [{"literal":"|"}, {"literal":"|"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "booleanExpression", "symbols": ["parentheses", "_", "booleanExpression$string$2", "_", "parentheses"], "postprocess": d => d[0] || d[4]},
    {"name": "parentheses", "symbols": ["_", {"literal":"("}, "relationalExpression", {"literal":")"}, "_"], "postprocess": nth(2)},
    {"name": "parentheses", "symbols": ["_", {"literal":"("}, "booleanExpression", {"literal":")"}, "_"], "postprocess": nth(2)},
    {"name": "parentheses", "symbols": ["unaryExpression"], "postprocess": id},
    {"name": "relationalExpression", "symbols": ["_", "additiveExpression", "_"], "postprocess": nth(1)},
    {"name": "relationalExpression", "symbols": ["relationalExpression", "_", {"literal":"="}, "_", "additiveExpression"], "postprocess": d => d[0] == d[4]},
    {"name": "relationalExpression$string$1", "symbols": [{"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "relationalExpression", "symbols": ["relationalExpression", "_", "relationalExpression$string$1", "_", "additiveExpression"], "postprocess": d => d[0] == d[4]},
    {"name": "relationalExpression$string$2", "symbols": [{"literal":"!"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "relationalExpression", "symbols": ["relationalExpression", "_", "relationalExpression$string$2", "_", "additiveExpression"], "postprocess": d => d[0] != d[4]},
    {"name": "relationalExpression$string$3", "symbols": [{"literal":"!"}, {"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "relationalExpression", "symbols": ["relationalExpression", "_", "relationalExpression$string$3", "_", "additiveExpression"], "postprocess": d => d[0] != d[4]},
    {"name": "relationalExpression", "symbols": ["relationalExpression", "_", {"literal":"<"}, "_", "additiveExpression"], "postprocess": d => d[0] < d[4]},
    {"name": "relationalExpression", "symbols": ["relationalExpression", "_", {"literal":">"}, "_", "additiveExpression"], "postprocess": d => d[0] > d[4]},
    {"name": "relationalExpression$string$4", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "relationalExpression", "symbols": ["relationalExpression", "_", "relationalExpression$string$4", "_", "additiveExpression"], "postprocess": d => d[0] <= d[4]},
    {"name": "relationalExpression$string$5", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "relationalExpression", "symbols": ["relationalExpression", "_", "relationalExpression$string$5", "_", "additiveExpression"], "postprocess": d => d[0] >= d[4]},
    {"name": "additiveExpression", "symbols": ["_", "multiplicativeExpression", "_"], "postprocess": nth(1)},
    {"name": "additiveExpression", "symbols": ["additiveExpression", "_", {"literal":"+"}, "_", "multiplicativeExpression"], "postprocess": d => d[0] + d[4]},
    {"name": "additiveExpression", "symbols": ["additiveExpression", "_", {"literal":"-"}, "_", "multiplicativeExpression"], "postprocess": d => d[0] - d[4]},
    {"name": "multiplicativeExpression", "symbols": ["_", "parentheses", "_"], "postprocess": nth(1)},
    {"name": "multiplicativeExpression", "symbols": ["parentheses", "_", {"literal":"*"}, "_", "parentheses"], "postprocess": d => d[0] * d[4]},
    {"name": "multiplicativeExpression", "symbols": ["parentheses", "_", {"literal":"/"}, "_", "parentheses"], "postprocess": d => d[0] / d[4]},
    {"name": "multiplicativeExpression", "symbols": ["parentheses", "_", {"literal":"%"}, "_", "parentheses"], "postprocess": d => d[0] % d[4]},
    {"name": "unaryExpression", "symbols": ["_", {"literal":"!"}, "_", "expression", "_"], "postprocess": d => !d[3]},
    {"name": "unaryExpression", "symbols": ["_", "decimal", "_"], "postprocess": nth(1)},
    {"name": "unaryExpression", "symbols": ["_", "unsigned_int", "_"], "postprocess": nth(1)},
    {"name": "unaryExpression", "symbols": ["_", "boolean", "_"], "postprocess": nth(1)},
    {"name": "unaryExpression", "symbols": ["_", "identifier", "_"], "postprocess": nth(1)},
    {"name": "methodCall", "symbols": ["identifier", {"literal":"("}, "methodArgs", {"literal":")"}], "postprocess": methodCall(0, 2)},
    {"name": "methodCall", "symbols": ["identifier", {"literal":"("}, "_", {"literal":")"}], "postprocess": methodCall(0)},
    {"name": "methodArgs", "symbols": ["_", "identifier", "_"], "postprocess": d => [d[1]]},
    {"name": "methodArgs", "symbols": [{"literal":"'"}, "_", "identifier", "_", {"literal":"'"}], "postprocess": d => [d[2]]},
    {"name": "methodArgs", "symbols": [{"literal":"\""}, "_", "identifier", "_", {"literal":"\""}], "postprocess": d => [d[2]]},
    {"name": "methodArgs", "symbols": ["_", "identifier", "_", {"literal":","}, "_", "methodArgs", "_"], "postprocess": d => [d[1]].concat(d[5])},
    {"name": "boolean$subexpression$1", "symbols": [/[tT]/, /[rR]/, /[uU]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "boolean", "symbols": ["boolean$subexpression$1"], "postprocess": () => true},
    {"name": "boolean$subexpression$2", "symbols": [/[fF]/, /[aA]/, /[lL]/, /[sS]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "boolean", "symbols": ["boolean$subexpression$2"], "postprocess": () => false},
    {"name": "identifier$ebnf$1", "symbols": [/[A-Za-z0-9_]/]},
    {"name": "identifier$ebnf$1", "symbols": ["identifier$ebnf$1", /[A-Za-z0-9_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "identifier", "symbols": ["identifier$ebnf$1"], "postprocess":  (data, l, reject) => {
          var ident = data[0].join('');
          if (ident.toLowerCase() === 'true' || ident.toLowerCase() === 'false') {
            return reject;
          } else {
            return ident;
          }
        }
         }
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
