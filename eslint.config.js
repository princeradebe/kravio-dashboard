import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "react-refresh/only-export-components": [
        "error",
        {
          allowConstantExport: true,
          allowExportNames: [
            "useAnimatedValue",
            "buttonVariants",
            "toggleVariants",
            "ToggleGroupContext",
            "badgeVariants",
            "selectTriggerVariants",
            "selectTriggerIconClassName",
            "AutocompleteCollection",
            "useStore",
            "useNav",
            "initials",
            "availabilityLabel",
            "navViewMap",
            "viewMeta",
            "MenuCreateHandle",
            "DialogCreateHandle",
            "SheetCreateHandle",
            "CommandCreateHandle",
            "SelectPrimitive",
            "SelectContent",
            "SwitchPrimitive",
            "MenuPrimitive",
            "FieldPrimitive",
            "SheetPrimitive",
            "DialogPrimitive",
            "CommandDialogPrimitive",
            "MenuLinkItem",
            "TabsPrimitive",
            "ProgressPrimitive",
            "CardContent",
            "useAutocompleteFilter",
            "AutocompletePrimitive",
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["src/lib/**", "src/screens/**"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
]);
