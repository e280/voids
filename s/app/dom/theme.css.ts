
import {css} from "@benev/slate"
export default css`

@layer core, view;

@layer core {
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;

		scrollbar-width: thin;
		scrollbar-color: #444 transparent;
	}

	::selection {
		color: var(--selection-color);
		background-color: var(--selection-bg);
	}

	::-webkit-scrollbar { width: 8px; }
	::-webkit-scrollbar-track { background: transparent; }
	::-webkit-scrollbar-thumb { background: #444; border-radius: 1em; }
	::-webkit-scrollbar-thumb:hover { background: #666; }

	a {
		color: var(--link);
		text-decoration: none;

		&:visited {
			color: color-mix(in srgb, purple, var(--link) 70%);
		}

		&:hover {
			color: color-mix(in srgb, white, var(--link) 90%);
			text-decoration: underline;
		}

		&:active {
			color: color-mix(in srgb, white, var(--link) 50%);
		}
	}
}

`

