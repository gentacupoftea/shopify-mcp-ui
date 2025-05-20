# Theme Directory - Important Notes

## Theme Implementation

This theme directory contains Material UI theme customizations. Due to the complexity of MUI theme types, we've implemented a simplified approach:

1. **Basic Theme Implementation:** 
   - We use a simplified theme implementation in `basic-theme.ts`
   - This version omits complex component styling to avoid TypeScript errors
   - Core palette, typography, and shape settings are preserved

2. **Full Theme Reference:**
   - The original complete theme with all component styling is preserved in other files
   - These can be referenced when specific styling needs to be extracted and applied

3. **TypeScript Compatibility:**
   - The simplified theme passes TypeScript checks without errors
   - Core theme functionality (light/dark mode, colors) is preserved

## For Developers

1. **If you need to update the basic theme:**
   - Edit `basic-theme.ts` - this is the file that's actually used
   - Keep it simple - avoid complex component style overrides that cause TypeScript errors

2. **If you need component-specific styling:**
   - Apply styles directly in the components themselves rather than in the theme
   - Use styled components or the sx prop in Material UI components
   - Check the reference files for guidance on styling patterns

3. **TypeScript Safety:**
   - The basic theme passes TypeScript checks
   - This ensures type safety when using theme properties
   - You'll get proper autocomplete for core theme properties

## Reference Files

- `basic-theme.ts` - The simplified theme implementation that is actually used
- Other files in this directory contain reference material for styling

## Notes

This approach is a workaround for complex MUI theme typing issues, which are fairly common in Material UI projects. By using a simplified theme without component style overrides, we maintain TypeScript compatibility while preserving core theme functionality.

For component-specific styling, prefer to use styled components or the sx prop directly in the components that need them, rather than adding styles to the theme object.