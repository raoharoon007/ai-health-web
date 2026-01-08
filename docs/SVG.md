# SVG Icons (SVGR)

This project uses `vite-plugin-svgr` to enable importing SVGs as React components.

How to import:

- Named import:

```js
import { ReactComponent as Icon } from './path/to/icon.svg'
```

- Query import:

```js
import Icon from './path/to/icon.svg?component'
```

Usage:

```jsx
<Icon width={24} height={24} />
```

Notes:
- The plugin is already registered in `vite.config.js`.
- SVGs inherit `currentColor` if styled appropriately, so you can change them with CSS color.
