
import {css} from "@benev/slate"
export default css`@layer view {

:host {
	position: relative;
	overflow: hidden;
	--x: 0%;
}

.harness {
	position: absolute;
	inset: 0;
	z-index: 1;

	display: flex;
	flex-direction: column;

	.carousel {
		flex: 1 1 auto;
		position: relative;
		overflow: hidden;

		--y: 0%;
		display: flex;
		width: 100%;
		transform: translateX(calc(-1 * var(--y)));
		transition: transform 400ms ease;

		section {
			width: 100%;
		}
	}

	nav {
		display: flex;
		background: #0008;
		border-top: 2px solid #fff1;
		gap: 0.5em;
		padding: 0.5em;
		justify-content: center;
		button {
			padding: 0.5em;
		}
	}
}

.bg {
	position: absolute;
	overflow: hidden;
	inset: 0;
	--x: 0%;

	img {
		display: block;
		position: absolute;
		inset: 0;
		height: 100%;
		min-width: 164%;
		object-fit: cover;

		transform: translateX(0%);
		transition: transform 400ms ease;

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

