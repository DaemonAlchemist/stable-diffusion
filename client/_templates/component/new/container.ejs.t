---
to: src/components/<%= componentName %>/<%= componentName %>.container.ts
---
import { inject, mergeProps } from "unstateless";
import {<%= componentName %>Component} from "./<%= componentName %>.component";
import {I<%= componentName %>InputProps, <%= componentName %>Props} from "./<%= componentName %>.d";

const connect = inject<I<%= componentName %>InputProps, <%= componentName %>Props>(mergeProps((a:any) => a));

export const <%= componentName %> = connect(<%= componentName %>Component);
