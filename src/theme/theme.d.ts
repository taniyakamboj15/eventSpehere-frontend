import { Theme } from './themes';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
// If not using styled-components, this might be less critical but good for uniformity if we use a custom hook.

export type AppTheme = Theme;
