import type { EsLintConfigTransform } from "../transform";

export interface TypeScriptPluginOptions {
    /**
     * Path of the workspace root. All project paths are relative to the workspace
     * root and have to be contained in it.
     *
     * **Recommended**: `__dirname`
     */
    readonly workspaceRootPath: string;
    /**
     * Paths of the projects in the workspace relative to the workspace root. The
     * paths should point to `tsconfig.json` files.
     *
     * **Recommmended**: `["./packages/**​/tsconfig.json"]`
     */
    readonly projectPaths: string[];
}

export type TypeScriptPlugin = (options: TypeScriptPluginOptions) => EsLintConfigTransform;

export const TypeScriptPlugin: TypeScriptPlugin = (options) => (config) => {
    const {
        workspaceRootPath,
        projectPaths,
    } = options;

    config.plugins = [
        ...(config.plugins ?? []),
        "@typescript-eslint",
    ];

    config.extends = [
        ...(Array.isArray(config.extends ??= []) ? config.extends : [config.extends]),
        "plugin:@typescript-eslint/recommended",
    ];

    config.parser = "@typescript-eslint/parser";
    config.parserOptions = {
        tsconfigRootDir: workspaceRootPath,
        project: projectPaths,
    };

    config.rules = {
        ...config.rules,

        /* eslint-disable @typescript-eslint/naming-convention */
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/adjacent-overload-signatures.md
         */
        "@typescript-eslint/adjacent-overload-signatures": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/array-type.md
         */
        "@typescript-eslint/array-type": [
            "warn",
            { default: "array", readonly: "array" },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/await-thenable.md
         */
        "@typescript-eslint/await-thenable": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-ts-comment.md
         */
        "@typescript-eslint/ban-ts-comment": [
            "error",
            {
                "ts-expect-error": "allow-with-description",
                "ts-ignore": true,
                "ts-nocheck": true,
                "ts-check": false,
            },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-tslint-comment.md
         */
        "@typescript-eslint/ban-tslint-comment": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-types.md
         */
        "@typescript-eslint/ban-types": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/class-literal-property-style.md
         */
        "@typescript-eslint/class-literal-property-style": ["warn", "fields"],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-assertions.md
         */
        "@typescript-eslint/consistent-type-assertions": [
            "warn",
            {
                assertionStyle: "as",
                objectLiteralTypeAssertions: "allow",
            },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
         */
        "@typescript-eslint/explicit-function-return-type": [
            "warn",
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
                allowHigherOrderFunctions: true,
                allowConciseArrowFunctionExpressionsStartingWithVoid: true,
            },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-member-accessibility.md
         */
        "@typescript-eslint/explicit-member-accessibility": [
            "warn",
            {
                accessibility: "explicit",
                overrides: {
                    accessors: "explicit",
                    constructors: "no-public",
                    methods: "explicit",
                    properties: "explicit",
                    parameterProperties: "explicit",
                },
            },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md
         */
        "@typescript-eslint/explicit-module-boundary-types": [
            "warn",
            {
                allowArgumentsExplicitlyTypedAsAny: true,
                allowDirectConstAssertionInArrowFunctions: true,
                allowedNames: [],
                allowHigherOrderFunctions: true,
                allowTypedFunctionExpressions: true,
            },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md
         */
        "@typescript-eslint/member-delimiter-style": [
            "warn",
            {
                multiline: {
                    delimiter: "semi",
                    requireLast: true,
                },
                singleline: {
                    delimiter: "semi",
                    requireLast: true,
                },
                overrides: {
                    typeLiteral: {
                        singleline: {
                            delimiter: "comma",
                            requireLast: false,
                        },
                    },
                },
            },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-ordering.md
         */
        "@typescript-eslint/member-ordering": [
            "warn",
            {
                default: {
                    memberTypes: [
                        // Fields
                        "static-field",
                        "field",
                        // Constructor
                        "constructor",
                        // Methods
                        "static-method",
                        "signature",
                        "method",
                    ],
                },
            },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/method-signature-style.md
         */
        "@typescript-eslint/method-signature-style": ["warn", "property"],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
         */
        "@typescript-eslint/naming-convention": [
            "warn",
            { selector: "default", format: [ "strictCamelCase" ], leadingUnderscore: "allow", trailingUnderscore: "allow" },
            // Variable-like
            { selector: "variable", format: [ "strictCamelCase", "StrictPascalCase", "UPPER_CASE" ] },
            { selector: "function", format: [ "strictCamelCase", "StrictPascalCase" ] },
            // Member-like
            { selector: "enumMember", format: [ "StrictPascalCase" ] },
            // Type-like
            { selector: "typeLike", format: [ "StrictPascalCase" ], leadingUnderscore: "forbid", trailingUnderscore: "forbid" },
            { selector: "typeParameter", format: [ "PascalCase" ] },
            { selector: "class", modifiers: [ "abstract" ], format: [ "StrictPascalCase" ], suffix: [ "Base" ] },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-base-to-string.md
         */
        "@typescript-eslint/no-base-to-string": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-confusing-non-null-assertion.md
         */
        "@typescript-eslint/no-confusing-non-null-assertion": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-dynamic-delete.md
         */
        "@typescript-eslint/no-dynamic-delete": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-interface.md
         */
        "@typescript-eslint/no-empty-interface": "off",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md
         */
        "@typescript-eslint/no-explicit-any": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-non-null-assertion.md
         */
        "@typescript-eslint/no-extra-non-null-assertion": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extraneous-class.md
         */
        "@typescript-eslint/no-extraneous-class": [
            "warn",
            {
                allowConstructorOnly: false,
                allowEmpty: true,
                allowStaticOnly: false,
                allowWithDecorator: true,
            },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-floating-promises.md
         */
        "@typescript-eslint/no-floating-promises": [
            "error",
            { ignoreVoid: false, ignoreIIFE: true },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-for-in-array.md
         */
        "@typescript-eslint/no-for-in-array": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-implicit-any-catch.md
         */
        "@typescript-eslint/no-implicit-any-catch": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-inferrable-types.md
         */
        "@typescript-eslint/no-inferrable-types": [
            "warn",
            { ignoreParameters: true, ignoreProperties: true },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-invalid-void-type.md
         */
        "@typescript-eslint/no-invalid-void-type": "off",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-misused-new.md
         */
        "@typescript-eslint/no-misused-new": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-misused-promises.md
         */
        "@typescript-eslint/no-misused-promises": [
            "error",
            { checksConditionals: true, checksVoidReturn: true },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-namespace.md
         */
        "@typescript-eslint/no-namespace": "off",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-asserted-optional-chain.md
         */
        "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
         */
        "@typescript-eslint/no-non-null-assertion": "off",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-require-imports.md
         */
        "@typescript-eslint/no-require-imports": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-this-alias.md
         */
        "@typescript-eslint/no-this-alias": [
            "warn",
            { allowDestructuring: true },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-boolean-literal-compare.md
         */
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-condition.md
         */
        "@typescript-eslint/no-unnecessary-condition": [
            "warn",
            { allowConstantLoopConditions: true },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-qualifier.md
         */
        "@typescript-eslint/no-unnecessary-qualifier": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-type-arguments.md
         */
        "@typescript-eslint/no-unnecessary-type-arguments": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-type-assertion.md
         */
        "@typescript-eslint/no-unnecessary-type-assertion": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-type-constraint.md
         */
        "@typescript-eslint/no-unnecessary-type-constraint": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-assignment.md
         */
        // This rule currently does not work as expected and is not fit for use.
        "@typescript-eslint/no-unsafe-assignment": "off",
        // "@typescript-eslint/no-unsafe-assignment": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-call.md
         */
        // This rule currently does not work as expected and is not fit for use.
        "@typescript-eslint/no-unsafe-call": "off",
        // "@typescript-eslint/no-unsafe-call": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-member-access.md
         */
        // This rule currently does not work as expected and is not fit for use.
        "@typescript-eslint/no-unsafe-member-access": "off",
        // "@typescript-eslint/no-unsafe-member-access": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unsafe-return.md
         */
        // This rule currently does not work as expected and is not fit for use.
        "@typescript-eslint/no-unsafe-return": "off",
        // "@typescript-eslint/no-unsafe-return": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-as-const.md
         */
        "@typescript-eslint/prefer-as-const": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-enum-initializers.md
         */
        "@typescript-eslint/prefer-enum-initializers": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-for-of.md
         */
        "@typescript-eslint/prefer-for-of": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-function-type.md
         */
        "@typescript-eslint/prefer-function-type": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-includes.md
         */
        "@typescript-eslint/prefer-includes": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-literal-enum-member.md
         */
        "@typescript-eslint/prefer-literal-enum-member": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-namespace-keyword.md
         */
        "@typescript-eslint/prefer-namespace-keyword": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-nullish-coalescing.md
         */
        "@typescript-eslint/prefer-nullish-coalescing": [
            "warn",
            { ignoreConditionalTests: false, ignoreMixedLogicalExpressions: false },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-optional-chain.md
         */
        "@typescript-eslint/prefer-optional-chain": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-readonly.md
         */
        "@typescript-eslint/prefer-readonly": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-reduce-type-parameter.md
         */
        "@typescript-eslint/prefer-reduce-type-parameter": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-regexp-exec.md
         */
        "@typescript-eslint/prefer-regexp-exec": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-string-starts-ends-with.md
         */
        "@typescript-eslint/prefer-string-starts-ends-with": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-ts-expect-error.md
         */
        "@typescript-eslint/prefer-ts-expect-error": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/promise-function-async.md
         */
        "@typescript-eslint/promise-function-async": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/require-array-sort-compare.md
         */
        "@typescript-eslint/require-array-sort-compare": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/restrict-plus-operands.md
         */
        "@typescript-eslint/restrict-plus-operands": [
            "warn",
            { checkCompoundAssignments: true },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/restrict-template-expressions.md
         */
        "@typescript-eslint/restrict-template-expressions": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/strict-boolean-expressions.md
         */
        "@typescript-eslint/strict-boolean-expressions": [
            "error",
            {
                allowString: false,
                allowNumber: false,
                allowNullableObject: true,
                allowNullableBoolean: false,
                allowNullableString: false,
                allowNullableNumber: false,
                allowAny: false,
            },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/switch-exhaustiveness-check.md
         */
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/triple-slash-reference.md
         */
        "@typescript-eslint/triple-slash-reference": [
            "error",
            { path: "never", types: "never", lib: "never" },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/type-annotation-spacing.md
         */
        "@typescript-eslint/type-annotation-spacing": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/unbound-method.md
         */
        "@typescript-eslint/unbound-method": [
            "error",
            { ignoreStatic: true },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/unified-signatures.md
         */
        "@typescript-eslint/unified-signatures": "warn",

        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/brace-style.md
         */
        "brace-style": "off",
        "@typescript-eslint/brace-style": [
            "warn",
            "1tbs",
            { allowSingleLine: true },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/comma-spacing.md
         */
        "comma-spacing": "off",
        "@typescript-eslint/comma-spacing": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/default-param-last.md
         */
        "default-param-last": "off",
        "@typescript-eslint/default-param-last": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/dot-notation.md
         */
        "dot-notation": "off",
        "@typescript-eslint/dot-notation": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/func-call-spacing.md
         */
        "func-call-spacing": "off",
        "@typescript-eslint/func-call-spacing": ["warn", "never"],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/indent.md
         */
        "indent": "off",
        "@typescript-eslint/indent": [
            "warn",
            4,
            {
                SwitchCase: 1,
                MemberExpression: 1,
                CallExpression: { arguments: 1 },
                /**
                 * Ignoring type parameter instantiation nodes resolves most issues with the rule surrounding consumption of generics.
                 * This workaround can be removed once [typescript-eslint#1824](https://github.com/typescript-eslint/typescript-eslint/issues/1824)
                 * is resolved.
                 */
                ignoredNodes: [
                    "TSTypeParameterInstantiation",
                ],
            },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/init-declarations.md
         */
        "init-declarations": "off",
        "@typescript-eslint/init-declarations": "off",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/keyword-spacing.md
         */
        "keyword-spacing": "off",
        "@typescript-eslint/keyword-spacing": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/lines-between-class-members.md
         */
        "lines-between-class-members": "off",
        "@typescript-eslint/lines-between-class-members": [
            "warn",
            { exceptAfterSingleLine: true, exceptAfterOverload: true },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-array-constructor.md
         */
        "no-array-constructor": "off",
        "@typescript-eslint/no-array-constructor": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
         */
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": "off",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-semi.md
         */
        "no-extra-semi": "off",
        "@typescript-eslint/no-extra-semi": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-implied-eval.md
         */
        "@typescript-eslint/no-implied-eval": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loss-of-precision.md
         */
        "no-loss-of-precision": "off",
        "@typescript-eslint/no-loss-of-precision": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-redeclare.md
         */
        "no-redeclare": "off",
        "@typescript-eslint/no-redeclare": "off",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
         */
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-throw-literal.md
         */
        "no-throw-literal": "off",
        "@typescript-eslint/no-throw-literal": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.md
         */
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
         */
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
         */
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": [
            "warn",
            {
                classes: true,
                typedefs: true,
                enums: false,
                functions: true,
                variables: true,
            },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-useless-constructor.md
         */
        "no-useless-constructor": "off",
        "@typescript-eslint/no-useless-constructor": "warn",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/quotes.md
         */
        "quotes": "off",
        "@typescript-eslint/quotes": [
            "error",
            "double",
            {
                allowTemplateLiterals: true,
                avoidEscape: false,
            },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.md
         */
        "no-return-await": "off",
        "@typescript-eslint/return-await": "error",
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/semi.md
         */
        "semi": "off",
        "@typescript-eslint/semi": [
            "error",
            "always",
            { omitLastInOneLineBlock: false },
        ],
        /**
         * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-before-function-paren.md
         */
        "space-before-function-paren": "off",
        "@typescript-eslint/space-before-function-paren": [
            "warn",
            { anonymous: "never", named: "never", asyncArrow: "always" },
        ],
        /* eslint-enable @typescript-eslint/naming-convention */
    };

    return config;
};
