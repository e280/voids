
import {css} from "@benev/slate"
export default css`@layer view {

:host {
	position: relative;
	overflow: hidden;
	--x: 0%;
}

.bg {
	position: absolute;
	overflow: hidden;
	inset: 0;
	--x: 1%;

	&:hover {
		--x: 100%;
	}

	img {
		display: block;
		position: absolute;
		inset: 0;
		height: 100%;
		min-width: 164%;
		object-fit: cover;

		transform: translateX(0%);
		transition: transform 900ms ease;

		& + img {
			mix-blend-mode: screen;
		}

		&:nth-of-type(1) {
			transform: translateX(calc(-1 * var(--x) * 0.08));
		}

		&:nth-of-type(2) {
			transform: rotate(180deg) translateX(calc(1 * var(--x) * 0.16));
		}

		&:nth-of-type(3) {
			transform: translateX(calc(-1 * var(--x) * 0.32));
		}
	}
}

}`

