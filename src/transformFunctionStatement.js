/**
 * Converts a Function Declaration to Declare Function Statement
 * Should be called only for Named and Default Exports
 */
export default function transformFunctionStatement(t, functionStatement) {
  // Convert incoming parameters to strictly typed parameter with proper optional value
  const functionTypeParams = functionStatement.params.map(function (param) {
    let identifier = param,
      optional = param.optional || false;

    // If default value for the parameter is provided
    if (t.isAssignmentPattern(param)) {
      identifier = param.left;
      optional = true;
    }

    const paramTypeAnnotation = identifier.typeAnnotation ? identifier.typeAnnotation.typeAnnotation : t.anyTypeAnnotation();
    const functionTypeParam = t.functionTypeParam(identifier, paramTypeAnnotation);
    functionTypeParam.optional = optional;

    return functionTypeParam;
  });

  // Generate function signature
  const returnType = functionStatement.returnType ? functionStatement.returnType.typeAnnotation : t.anyTypeAnnotation();
  const functionTypeAnnotation = t.functionTypeAnnotation(null, functionTypeParams, null, returnType);

  // Generate function statement with above signature
  const functionDeclarationIdentifer = t.identifier(functionStatement.id.name);
  functionDeclarationIdentifer.typeAnnotation = t.typeAnnotation(functionTypeAnnotation);

  // Return newly created function declaration export statement
  const functionDeclaration = t.declareFunction(functionDeclarationIdentifer);
  return t.declareExportDeclaration(functionDeclaration, null, null);
}
