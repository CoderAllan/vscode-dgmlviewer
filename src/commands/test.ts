import * as vscode from 'vscode';
import nearley = require("nearley");

export class Test {

  public static get commandName(): string { return 'dgmlTest'; }

  public execute(): void {
    const grammar = require('../../javascript/expressionGrammar.js');
    
    // Parse something!
    const testExpressions = [
      // '2 + 4',
      // '2 + 4 - 6',
      // '(2 + 4)',
      // '!true', 
      // '!(true)', 
      'hasCategory(test)', 
      'hasCategory(\'test\')', 
      // 'hasCategory(test,test2)', 
      // 'hasCategory( test , test2 )', 
      // 'hasCategory(test,test2, test3)', 
      // 'IsReference', 
      // 'IsReference()',
      // '2 * 4',
      // '(2 / 4)',
      // '2 * 4 + 2',
      // '(2 / 4) + 2',
      // '2 > 4', 
      // '2 >= 2', 
      // '2 = 4', 
      // '2 == 2', 
      // '2 != 4', 
      // '2 !== 2', 
      // '(2 * 4 + 2) > 4', 
      // '(2 * 4 + 2) > (4 + 10)', 
      // 'true',
      // 'true or false',
      // 'true || false',
      // 'true and false',
      // 'true && false',
      // '(true or false)',
      // '!(true or false)',
      // '2 != 1+1',
      // '2 != (1+1)',
      // '2 != (1+2)',
      // '(2 > 2 or (2 != 1+1))',
      'a or b', 
      'a<b', 
      'a> b', 
      'a == b', 
      '!(a = b)', 
      // 'AttributeA * 1.25 >= 500'
    ];
    let results = '';
    testExpressions.forEach(input => {
      try{
      // Create a Parser object from our grammar.
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        parser.feed(input);
        parser.finish();
        const result = JSON.stringify(parser.results);
        // results = `${results}${input}: ${result}\n\n`;
        console.log(`${input}: ${result}\n\n`);
      }catch(ex: any) {
        // results = `${results}${input}: ${ex}\n\n`;
        console.log(`${input}: ${ex.message}\n\n`);
      }
    });
    vscode.window.showInformationMessage(`Result ${results}`);
    // console.log(results);
  }
}