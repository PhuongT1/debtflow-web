// Keep React presentation on MUI roles while neutral tokens serve other frameworks.
export const uiConventions = {
  rules: {
    'theme-ownership': {
      meta: {
        type: 'problem',
        schema: [],
        messages: {
          useTheme:
            'React UI must consume the MUI theme (palette, typography, shape, customShadows). Map neutral visual tokens only in the theme owner.',
        },
      },
      create(context) {
        return {
          "MemberExpression[object.name='designTokens'][property.name=/^(color|shadow|radius|effect|typography)$/]"(
            node,
          ) {
            context.report({ node, messageId: 'useTheme' });
          },
        };
      },
    },
  },
};
