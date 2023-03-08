---
to: src/components/<%= componentName %>/<%= componentName %>.d.ts
---
// What gets passed into the component from the parent as attributes
export declare interface I<%= componentName %>InputProps {

}

export type <%= componentName %>Props = I<%= componentName %>InputProps;