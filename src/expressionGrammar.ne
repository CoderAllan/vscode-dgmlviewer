@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace
@builtin "number.ne"     # `int`, `decimal`, and `percentage` number primitives
@builtin "postprocessors.ne"

@{%
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
%}
expression -> 
    methodCall {% id %}
  | relationalExpression {% value() %}
  | booleanExpression  {% value() %}
  | _ identifier _  {% methodCall(1) %}

booleanExpression ->
      parentheses {% id %}
    | parentheses _ "and"i _ parentheses {% d => d[0] && d[4] %}
    | parentheses _ "&&" _ parentheses {% d => d[0] && d[4] %}
    | parentheses _ "or"i _ parentheses {% d => d[0] || d[4] %}
    | parentheses _ "||" _ parentheses {% d => d[0] || d[4] %}

parentheses ->
    _ "(" relationalExpression ")" _ {% nth(2) %}
  |  _ "(" booleanExpression ")" _ {% nth(2) %}
  | unaryExpression {% id %}

relationalExpression -> 
      _ additiveExpression _ {% nth(1) %}
    | relationalExpression _ "=" _ additiveExpression {% d => d[0] == d[4] %}
    | relationalExpression _ "==" _ additiveExpression {% d => d[0] == d[4] %}
    | relationalExpression _ "!=" _ additiveExpression {% d => d[0] != d[4] %}
    | relationalExpression _ "!==" _ additiveExpression {% d => d[0] != d[4] %}
    | relationalExpression _ "<" _ additiveExpression {% d => d[0] < d[4] %}
    | relationalExpression _ ">" _ additiveExpression {% d => d[0] > d[4] %}
    | relationalExpression _ "<=" _ additiveExpression {% d => d[0] <= d[4] %}
    | relationalExpression _ ">=" _ additiveExpression {% d => d[0] >= d[4] %}

additiveExpression -> 
    _ multiplicativeExpression _ {% nth(1) %}
  | additiveExpression _ "+" _ multiplicativeExpression {% d => d[0] + d[4] %}
  | additiveExpression _ "-" _ multiplicativeExpression {% d => d[0] - d[4] %}

multiplicativeExpression ->
    _ parentheses _  {% nth(1) %}
  | parentheses _ "*" _ parentheses {% d => d[0] * d[4] %}
  | parentheses _ "/" _ parentheses {% d => d[0] / d[4] %}
  | parentheses _ "%" _ parentheses {% d => d[0] % d[4] %}

unaryExpression ->  
    _ "!" _ expression _ {% d => !d[3] %}
  | _ decimal _ {% nth(1) %}
  | _ unsigned_int _ {% nth(1) %}
  | _ boolean _ {% nth(1) %}
  | _ identifier _ {% nth(1) %}

methodCall -> 
      identifier "(" methodArgs ")" {% methodCall(0, 2) %}
    | identifier "(" _ ")" {% methodCall(0) %}

methodArgs ->
    _ identifier _  {% d => [d[1]] %}
  | "'" _ identifier _ "'"  {% d => [d[2]] %}
  | "\"" _ identifier _ "\""  {% d => [d[2]] %}
  | _ identifier _ "," _ methodArgs _ {% d => [d[1]].concat(d[5]) %}

boolean ->
    "true"i {% () => true %} 
  | "false"i {% () => false %}

identifier -> 
  [A-Za-z0-9_]:+ {% (data, l, reject) => {
    var ident = data[0].join('');
    if (ident.toLowerCase() === 'true' || ident.toLowerCase() === 'false') {
      return reject;
    } else {
      return ident;
    }
  }
   %}