
import {css} from "@benev/slate"
export default css`@layer view {

:host {
	position: relative;
	overflow: hidden;
}

.harness {
	position: absolute;
	inset: 0;
	z-index: 1;

	display: flex;
	flex-direction: column;

	touch-action: none;
	user-select: none;

	.carousel {
		flex: 1 1 auto;
		position: relative;
		overflow: hidden;

		--bravo: 0%;
		display: flex;
		width: 100%;
		transform: translateX(calc(-1 * var(--bravo)));

		section {
			width: 100%;
			&[inert] {
				opacity: 0.5;
			}
		}
	}

	nav {
		display: flex;
		background: #0008;
		border-top: 2px solid #fff1;
		justify-content: center;
		flex-wrap: wrap;

		button {
			all: unset;
			padding: 0.5em;
			transition: all var(--anim) linear;
			border-top: 3px solid transparent;
			color: white;
			background: #fff0;
			-webkit-tap-highlight-color: transparent;

			opacity: 0.5;

			display: flex;
			flex-direction: column;
			align-items: center;

			&:not([disabled]) {
				cursor: pointer;

				&:is(:hover, :focus-visible) {
					opacity: 1;
				}
			}

			&[x-active] {
				opacity: 1;
				color: var(--prime-bright);
				background: #fff1;
				filter: drop-shadow(0 0 0.4em var(--prime));
				border-top-color: currentColor;
			}

			> svg {
				width: 1.6em;
				height: 1.6em;
			}

			> span {
				opacity: 0.5;
				font-size: 0.5em;
			}
		}
	}
}

.bg {
	position: absolute;
	overflow: hidden;
	inset: 0;
	--alpha: 0%;

	img {
		display: block;
		position: absolute;
		inset: 0;
		height: 100%;
		min-width: 164%;
		object-fit: cover;

		transform: translateX(0%);

		& + img {
			mix-blend-mode: screen;
		}

		&:nth-of-type(1) {
			transform: translateX(calc(-1 * var(--alpha) * 0.08));
		}

		&:nth-of-type(2) {
			transform: rotate(180deg) translateX(calc(1 * var(--alpha) * 0.16));
		}

		&:nth-of-type(3) {
			transform: translateX(calc(-1 * var(--alpha) * 0.32));
		}
	}
}

}`

