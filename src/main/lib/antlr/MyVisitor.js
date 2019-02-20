// Generated from C.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
import { CVisitor } from './CVisitor';
import { Symbol, SymbolTable } from './sym';
import { CParser } from './CParser';

// This class defines a complete generic visitor for a parse tree produced by CParser.

const VERBOSE = true;

function MyVisitor() {
  antlr4.tree.ParseTreeVisitor.call(this);

  this.result = ''; // 存放最终的xml
  this.declaration = ''; // 存放declaration部分的xml, 因为此部分必须在result的头部

  // flags, 理论上都可以通过在ctx中添加属性来解决, 待完善
  this.flagAssignmentLeft = false; // 为了处理左值和右值而设置的flag
  this.fieldname = "VAR";

  this.symTab = new SymbolTable();


  return this;
}

// MyVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
MyVisitor.prototype = Object.create(CVisitor.prototype);
MyVisitor.prototype.constructor = MyVisitor;

// Visit a parse tree produced by CParser#primaryExpression.
MyVisitor.prototype.visitPrimaryExpression = function (ctx) {
  if (null != ctx.Identifier()) {
    if (this.flagAssignmentLeft) {
      this.writeResult(`<field name=\"VAR\" variabletype=\"\">${ctx.Identifier()}</field>`, ctx.Identifier());
    } else {
      let sym;
      if (sym = this.symTab.find(ctx.Identifier())) {
        if (sym.type == 'var' || sym.type == 'const') {
          this.writeResult("<block type=\"variables_get\">");
          this.writeResult(`<field name=\"VAR\" variabletype=\"\">${ctx.Identifier()}</field>`, ctx.Identifier());
          this.writeResult("</block>");
        }
        else if (sym.type == 'func') {
          this.writeResult('<block type="procedures_callnoreturn">');
          this.writeResult(`<mutation name="${ctx.Identifier()}">`);
          if (sym.params) {
            for (let i in sym.params) {
              this.writeResult(`<arg name="${sym.params[i]}"></arg>`);
            }
          }
          this.writeResult('</mutation>');
        }
      } else {
        // 在本文件中未定义, 在本版本中认为它是非法的, 因为已经做了预编译
        // 也可以暂且认为它在标准库中有定义, 而不是非法的, 那不在我们的考虑范围之内
        error(`Undefined: ${ctx.Identifier()}`);

        // // 并不知道sym到底是变量/常量/函数
        // if (sym.type == 'var' || sym.type == 'const') {
        //   this.writeResult("<block type=\"variables_get\">");
        //   this.writeResult(`<field name=\"VAR\" variabletype=\"\">${ctx.Identifier()}</field>`, ctx.Identifier());
        //   this.writeResult("</block>");
        // }
        // else if (sym.type == 'func') { // 问题是这里并不知道函数的prototype, 也就是并不知道函数的参数情况
        //   this.writeResult('<block type="procedures_callnoreturn">');
        //   this.writeResult(`<mutation name="${ctx.Identifier()}">`);
        //   if (sym.params) {
        //     for (let i in sym.params) {
        //       this.writeResult(`<arg name="${sym.params[i]}"></arg>`);
        //     }
        //     this.writeResult('</mutation>');
        //   }
        // }
      }
    }
  } else if (null != ctx.Constant()) {
    let x = ctx.Constant().getText();
    if (x.includes('x')) {
      x = parseInt(x);
    }
    this.writeResult("<block type=\"math_number\">");
    this.writeResult(`<field name=\"NUM\">${x}</field>`);
    this.writeResult("</block>");
  }

  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#genericSelection.
MyVisitor.prototype.visitGenericSelection = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#genericAssocList.
MyVisitor.prototype.visitGenericAssocList = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#genericAssociation.
MyVisitor.prototype.visitGenericAssociation = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#postfixExpression.
MyVisitor.prototype.visitPostfixExpression = function (ctx) {
  if (null != ctx.argumentExpressionList()) {
    this.visit(ctx.postfixExpression());
    let argumentExpressionList = ctx.argumentExpressionList();
    argumentExpressionList.argCount = 0;
    this.visit(argumentExpressionList);
    this.writeResult('</block>')
  } else {
    this.visitChildren(ctx);
  }
  return null;
};


// Visit a parse tree produced by CParser#argumentExpressionList.
MyVisitor.prototype.visitArgumentExpressionList = function (ctx) {
  if (ctx.getChildCount() == 1) {
    this.writeResult(`<value name="ARG0">`);
    this.visit(ctx.assignmentExpression());
    this.writeResult(`</value>`);
    return 0;
  } else {
    let count = this.visit(ctx.argumentExpressionList()) + 1;
    this.writeResult(`<value name="ARG${count}">`);
    this.visit(ctx.assignmentExpression());
    this.writeResult(`</value>`);
    return count;
  }
};


// Visit a parse tree produced by CParser#unaryExpression.
MyVisitor.prototype.visitUnaryExpression = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#unaryOperator.
MyVisitor.prototype.visitUnaryOperator = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#castExpression.
MyVisitor.prototype.visitCastExpression = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#multiplicativeExpression.
MyVisitor.prototype.visitMultiplicativeExpression = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#additiveExpression.
MyVisitor.prototype.visitAdditiveExpression = function (ctx) {
  if (ctx.children.length > 1) {
    this.writeResult("<block type=\"math_arithmetic\">");
    if (ctx.getChild(1).getText() == "+") {
      this.writeResult("<field name=\"OP\">ADD</field>");
    } else if (ctx.getChild(1).getText() == "-") {
      this.writeResult("<field name=\"OP\">MINUS</field>");
    }
    this.writeResult("<value name=\"A\">");
    this.visit(ctx.additiveExpression());
    this.writeResult("</value>");
    this.writeResult("<value name=\"B\">");
    this.visit(ctx.multiplicativeExpression());
    this.writeResult("</value>");

    this.writeResult("</block>");
    return null;
  } else {
    return this.visitChildren(ctx);
  }
};


// Visit a parse tree produced by CParser#shiftExpression.
MyVisitor.prototype.visitShiftExpression = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#relationalExpression.
MyVisitor.prototype.visitRelationalExpression = function (ctx) {
  if (ctx.getChildCount() > 1) {
    this.writeResult("<block type=\"logic_compare\">");

    if (ctx.getChild(1).getText() == "<") {
      this.writeResult("<field name=\"OP\">LT</field>");
    } else if (ctx.getChild(1).getText() == "<=") {
      this.writeResult("<field name=\"OP\">LTE</field>");
    } else if (ctx.getChild(1).getText() == ">") {
      this.writeResult("<field name=\"OP\">GT</field>");
    } else if (ctx.getChild(1).getText() == ">=") {
      this.writeResult("<field name=\"OP\">GTE</field>");
    }
    this.writeResult("<value name=\"A\">");
    this.visit(ctx.relationalExpression());
    this.writeResult("</value>");
    this.writeResult("<value name=\"B\">");
    this.visit(ctx.shiftExpression());
    this.writeResult("</value>");
    this.writeResult("</block>");
    return null;
  } else return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#equalityExpression.
MyVisitor.prototype.visitEqualityExpression = function (ctx) {
  if (ctx.getChildCount() > 1) {
    info(ctx.children.get(1).getText());
  }
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#andExpression.
MyVisitor.prototype.visitAndExpression = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#exclusiveOrExpression.
MyVisitor.prototype.visitExclusiveOrExpression = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#inclusiveOrExpression.
MyVisitor.prototype.visitInclusiveOrExpression = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#logicalAndExpression.
MyVisitor.prototype.visitLogicalAndExpression = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#logicalOrExpression.
MyVisitor.prototype.visitLogicalOrExpression = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#conditionalExpression.
MyVisitor.prototype.visitConditionalExpression = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#assignmentExpression.
MyVisitor.prototype.visitAssignmentExpression = function (ctx) {
  if (ctx.conditionalExpression() != null) {
    this.visitChildren(ctx);

  } else if (ctx.assignmentOperator() != null) {
    this.writeResult("<block type=\"variables_set\">");


    this.flagAssignmentLeft = true;
    this.visit(ctx.unaryExpression());

    this.visit(ctx.assignmentOperator());
    this.writeResult("<value name=\"VALUE\">");


    this.flagAssignmentLeft = false;
    this.visit(ctx.assignmentExpression());

    this.writeResult("</value>");
    this.writeResult("</block>");
  } else {
    this.visitChildren(ctx);
  }
  return null;
};


// Visit a parse tree produced by CParser#assignmentOperator.
MyVisitor.prototype.visitAssignmentOperator = function (ctx) {
  if (ctx.getText().length > 1) {
    this.writeResult("<block type=\"math_arithmetic\">");

    if (ctx.getText().replace("=", "") == "*") {
      this.writeResult("<field name=\"OP\">MULTIPLY</field>");
    } else if (ctx.getText().replace("=", "") == "/") {
      this.writeResult("<field name=\"OP\">DIVIDE</field>");
    } else if (ctx.getText().replace("=", "") == "+") {
      this.writeResult("<field name=\"OP\">ADD</field>");
    } else if (ctx.getText().replace("=", "") == "-") {
      this.writeResult("<field name=\"OP\">MINUS</field>");
    } else {
      error(`Unsupported operator ${ctx.getText()}`);
    }
    //
    //            writeResult("</block>");
  }
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#expression.
MyVisitor.prototype.visitExpression = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#constantExpression.
MyVisitor.prototype.visitConstantExpression = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#declaration.
MyVisitor.prototype.visitDeclaration = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#declarationSpecifiers.
MyVisitor.prototype.visitDeclarationSpecifiers = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#declarationSpecifiers2.
MyVisitor.prototype.visitDeclarationSpecifiers2 = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#declarationSpecifier.
MyVisitor.prototype.visitDeclarationSpecifier = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#initDeclaratorList.
MyVisitor.prototype.visitInitDeclaratorList = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#initDeclarator.
MyVisitor.prototype.visitInitDeclarator = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#storageClassSpecifier.
MyVisitor.prototype.visitStorageClassSpecifier = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#typeSpecifier.
MyVisitor.prototype.visitTypeSpecifier = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#structOrUnionSpecifier.
MyVisitor.prototype.visitStructOrUnionSpecifier = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#structOrUnion.
MyVisitor.prototype.visitStructOrUnion = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#structDeclarationList.
MyVisitor.prototype.visitStructDeclarationList = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#structDeclaration.
MyVisitor.prototype.visitStructDeclaration = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#specifierQualifierList.
MyVisitor.prototype.visitSpecifierQualifierList = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#structDeclaratorList.
MyVisitor.prototype.visitStructDeclaratorList = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#structDeclarator.
MyVisitor.prototype.visitStructDeclarator = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#enumSpecifier.
MyVisitor.prototype.visitEnumSpecifier = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#enumeratorList.
MyVisitor.prototype.visitEnumeratorList = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#enumerator.
MyVisitor.prototype.visitEnumerator = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#enumerationConstant.
MyVisitor.prototype.visitEnumerationConstant = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#atomicTypeSpecifier.
MyVisitor.prototype.visitAtomicTypeSpecifier = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#typeQualifier.
MyVisitor.prototype.visitTypeQualifier = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#functionSpecifier.
MyVisitor.prototype.visitFunctionSpecifier = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#alignmentSpecifier.
MyVisitor.prototype.visitAlignmentSpecifier = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#declarator.
MyVisitor.prototype.visitDeclarator = function (ctx) {
  if (ctx.getChildCount() == 1) {
    return this.visit(ctx.directDeclarator());
  } else {
    error('Pointer not supported!');
    return this.visitChildren(ctx);
  }
};


// Visit a parse tree produced by CParser#directDeclarator.
MyVisitor.prototype.visitDirectDeclarator = function (ctx) {
  if (ctx.getChildCount() == 1) {
    if (!ctx.isFunc) {
      this.symTab.add(new Symbol(ctx.Identifier().getText(), 'var'));
    }
    // info(ctx.Identifier().getText())
    return ctx.Identifier().getText();
  } else if (ctx.getChild(1).getText() == '(') { // function declarator (a bit strange)
    let directDeclarator = ctx.directDeclarator();
    directDeclarator.isFunc = true;
    let params;
    if (null != ctx.parameterTypeList()) {
      params = this.visit(ctx.parameterTypeList());
    } else {
      params = [];
    }
    this.symTab.add(new Symbol(this.visit(directDeclarator).toString(), 'func', params));
    return directDeclarator;
  } else {
    return null;
  }
};


// Visit a parse tree produced by CParser#gccDeclaratorExtension.
MyVisitor.prototype.visitGccDeclaratorExtension = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#gccAttributeSpecifier.
MyVisitor.prototype.visitGccAttributeSpecifier = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#gccAttributeList.
MyVisitor.prototype.visitGccAttributeList = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#gccAttribute.
MyVisitor.prototype.visitGccAttribute = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#nestedParenthesesBlock.
MyVisitor.prototype.visitNestedParenthesesBlock = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#pointer.
MyVisitor.prototype.visitPointer = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#typeQualifierList.
MyVisitor.prototype.visitTypeQualifierList = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#parameterTypeList.
MyVisitor.prototype.visitParameterTypeList = function (ctx) {
  if (ctx.getChildCount() == 1) {
    let x = this.visitChildren(ctx);
    x = flatten(x);
    for (let i in x) {
      if (x[i] == undefined) {
        x[i] = `arg${i}`;
      }
    }
    return x;
  } else {
    return this.visitChildren(ctx);
  }
};


// Visit a parse tree produced by CParser#parameterList.
MyVisitor.prototype.visitParameterList = function (ctx) {
  if (ctx.getChildCount() == 1) {
    return [this.visit(ctx.parameterDeclaration())];
  } else {
    let x;
    x = this.visit(ctx.parameterList()).slice();
    x.push(this.visit(ctx.parameterDeclaration()));
    return x;
  }
};


// Visit a parse tree produced by CParser#parameterDeclaration.
MyVisitor.prototype.visitParameterDeclaration = function (ctx) {
  let x = this.visitChildren(ctx);
  return x[1];
};


// Visit a parse tree produced by CParser#identifierList.
MyVisitor.prototype.visitIdentifierList = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#typeName.
MyVisitor.prototype.visitTypeName = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#abstractDeclarator.
MyVisitor.prototype.visitAbstractDeclarator = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#directAbstractDeclarator.
MyVisitor.prototype.visitDirectAbstractDeclarator = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#typedefName.
MyVisitor.prototype.visitTypedefName = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#initializer.
MyVisitor.prototype.visitInitializer = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#initializerList.
MyVisitor.prototype.visitInitializerList = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#designation.
MyVisitor.prototype.visitDesignation = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#designatorList.
MyVisitor.prototype.visitDesignatorList = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#designator.
MyVisitor.prototype.visitDesignator = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#staticAssertDeclaration.
MyVisitor.prototype.visitStaticAssertDeclaration = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#statement.
MyVisitor.prototype.visitStatement = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#labeledStatement.
MyVisitor.prototype.visitLabeledStatement = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#compoundStatement.
MyVisitor.prototype.visitCompoundStatement = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#blockItemList.
MyVisitor.prototype.visitBlockItemList = function (ctx) {
  // info(ctx.parentCtx instanceof CParser.BlockItemListContext);

  if (ctx.getChildCount() > 1) {
    let notStatement = this.visit(ctx.blockItem()); // 如果blockItem是Statement, 在处理后面的List时需要删掉尾部的</block>


    if (notStatement) {
      this.visit(ctx.blockItemList());
    } else {
      // 下面两行用来删掉result尾部的</block>行
      this.result = this.result.slice(0, -1);
      this.result = this.result.slice(0, this.result.lastIndexOf('\n') + 1);
      this.writeResult("<next>");
      this.visit(ctx.blockItemList());
      this.writeResult("</next>");
      this.writeResult("</block>");
    }
  } else {
    this.visit(ctx.blockItem());
  }
  return null;
};


// Visit a parse tree produced by CParser#blockItem.
MyVisitor.prototype.visitBlockItem = function (ctx) {
  this.visitChildren(ctx);
  return ctx.statement() == null;
};


// Visit a parse tree produced by CParser#expressionStatement.
MyVisitor.prototype.visitExpressionStatement = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#selectionStatement.
MyVisitor.prototype.visitSelectionStatement = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#iterationStatement.
MyVisitor.prototype.visitIterationStatement = function (ctx) {
  if (ctx.getChild(0).getText() == "while") {
    this.writeResult("<block type=\"controls_whileUntil\">");
    this.writeResult("<field name=\"MODE\">WHILE</field>");
    this.writeResult("<value name=\"BOOL\">");
    this.visit(ctx.expression());
    this.writeResult("</value>");
    this.writeResult("<statement name=\"DO\">");
    this.visit(ctx.statement());
    this.writeResult("</statement>");
    this.writeResult("</block>");
  } else if (ctx.getChild(0).getText() == "do") {

  } else if (ctx.getChild(0).getText() == "for") {

  }
  return null;
};


// Visit a parse tree produced by CParser#forCondition.
MyVisitor.prototype.visitForCondition = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#forDeclaration.
MyVisitor.prototype.visitForDeclaration = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#forExpression.
MyVisitor.prototype.visitForExpression = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#jumpStatement.
MyVisitor.prototype.visitJumpStatement = function (ctx) {
  if (ctx.getChild(0).getText() == "return") {
    this.writeResult("<block type=\"procedures_ifreturn\">");
    this.writeResult("<value name=\"CONDITION\">");
    this.writeResult("<block type=\"logic_boolean\">");
    this.writeResult("<field name=\"BOOL\">TRUE</field>");
    this.writeResult("</block>");
    this.writeResult("</value>");
    this.writeResult("<value name=\"VALUE\">");
    this.visit(ctx.expression());
    this.writeResult("</value>");
    this.writeResult("</block>");
  }
  return null;
};


// Visit a parse tree produced by CParser#compilationUnit.
MyVisitor.prototype.visitCompilationUnit = function (ctx) {
  this.writeResult("<xml xmlns=\"http://www.w3.org/1999/xhtml\">");

  this.writeResult("<!-- declaration -->");

  this.visitChildren(ctx);

  // variables declarations can be omitted

  // this.writeDeclaration("<variables>");
  // for (let i in this.symTab.table) {
  //   let sym = this.symTab.table[i];
  //   if (sym.type == 'var') {
  //     this.writeDeclaration(`<variable type="">${sym.name}</variable>`);
  //   } else if (sym.type == 'func') {
  //     // if (null != sym.params && sym.params.length >= 1) {
  //     //   this.writeDeclaration('<mutation>');
  //     //   for (let j in sym.params) {
  //     //     let param = sym.params[j];
  //     //     this.writeDeclaration(`<arg name="${param}"></arg>`);
  //     //   }
  //     //   this.writeDeclaration('</mutation>');
  //     // }
  //   }
  // }
  // this.writeDeclaration("</variables>");


  this.writeResult("</xml>");

  this.result = this.result.replace("<!-- declaration -->", this.declaration);

  // info(this.symTab.table);
  return null;
};


// Visit a parse tree produced by CParser#translationUnit.
MyVisitor.prototype.visitTranslationUnit = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#externalDeclaration.
MyVisitor.prototype.visitExternalDeclaration = function (ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CParser#functionDefinition.
MyVisitor.prototype.visitFunctionDefinition = function (ctx) {
  this.writeResult("<block type=\"procedures_defnoreturn\">");

  if (ctx.declarationSpecifiers() != null) this.visit(ctx.declarationSpecifiers());
  let declarator = this.visit(ctx.declarator()).getText();

  this.writeResult(`<field name=\"NAME\">${declarator}</field>`);
  if (ctx.declarationList() != null) this.visit(ctx.declarationList());

  let sym = this.symTab.find(declarator);
  if (sym.params) {
    this.writeResult('<mutation>');
    for (let i in sym.params) {
      this.writeResult(`<arg name="${sym.params[i]}"></arg>`);
    }
    this.writeResult('</mutation>');
  }

  this.writeResult("<statement name=\"STACK\">");
  this.visit(ctx.compoundStatement());
  this.writeResult("</statement>");
  this.writeResult("</block>");
  return null;
};


// Visit a parse tree produced by CParser#declarationList.
MyVisitor.prototype.visitDeclarationList = function (ctx) {
  return this.visitChildren(ctx);
};


MyVisitor.prototype.writeResult = function (s) {
  this.result += s + '\n';
}

MyVisitor.prototype.writeDeclaration = function (s) {
  this.declaration += s + '\n';
}

const info = function (s) {
  if (VERBOSE) console.info(s);
}

const error = function (s) {
  console.error(s);
}

export function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
};

exports.MyVisitor = MyVisitor;