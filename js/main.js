// JavaScript Document
/* jshint esversion: 6 */

(function () {
	"use strict";

	const SCROLL_DURATION = 965;
	let hdr = document.querySelector(".page-header"),
		hideable = document.querySelectorAll(".page-header .logo, .page-header .tab"),
		nav = document.querySelector(".menu"),
		links = nav.querySelectorAll("a"),
		hamburger = document.querySelector(".nav-toggle a"),
		article = document.querySelector("article"),
		top = document.querySelector(".top"),
		slidingSections = document.querySelectorAll(".slide-top"),
		youtube = document.querySelectorAll(".youtube-video"),
		menuRegex = /^A$/,
		sections = [
			{
				block: document.querySelector("#cne .inner-wrapper"),
				link: nav.querySelector(".cne")
			},
			{
				block: document.querySelector("#technology .inner-wrapper"),
				link: nav.querySelector(".technology")
			},
			{
				block: document.querySelector("#patient-wellness .inner-wrapper"),
				link: nav.querySelector(".patient-wellness")
			},
			{
				block: document.querySelector("#caring .inner-wrapper"),
				link: nav.querySelector(".caring")
			},
			{
				block: document.querySelector("#mission .inner-wrapper"),
				link: nav.querySelector(".contact")
			}
		];

	// http://stackoverflow.com/a/16136789
	function scrollTo(element, to, duration) {
		let start = 0,
			change = 0,
			currentTime = 0,
			increment = 20,
			rafId = 0,
			animateScroll = function(time) {
				currentTime += increment;
				var val = Math.easeInOutQuad(currentTime, start, change, duration);
				if (Array.isArray(element)) {
					for (let el of element) {
						el.scrollTop = val;
					}
				} else {
					element.scrollTop = val;
				}
				if (currentTime < duration) {
					requestAnimationFrame(animateScroll);
				} else {
					if (Array.isArray(element)) {
						for (let el of element) {
							el.scrollTop = to;
						}
					} else {
						element.scrollTop = to;
					}
					cancelAnimationFrame(rafId);
				}
			};

		if (Array.isArray(element)) {
			for (let el of element) {
				start = start || el.scrollTop;
			}
		} else {
			start = element.scrollTop;
		}
		change = to - start;
		rafId = requestAnimationFrame(animateScroll);
	}

	// t = current time
	// b = start value
	// c = change in value
	// d = duration
	Math.easeInOutQuad = function (t, b, c, d) {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t + b;
		t--;
		return -c / 2 * (t * (t - 2) - 1) + b;
	};

	function getTarget(e) {
		let targ;
		if (typeof(e) !== "undefined" && e !== null) {
			if (e.currentTarget) {
				targ = e.currentTarget;
			} else if (e.target) {
				targ = e.target;
			} else if (e.srcElement) {
				targ = e.srcElement;
			}
			if (targ !== null && targ.nodeType === 3) { // defeat Safari bug
				targ = targ.parentNode;
			}
		}

		return targ;
	}

	function cancelDefault(e) {
		if (typeof(e) !== "undefined" && e !== null) {
			if (e.preventDefault) {
				e.preventDefault();
			}
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			e.cancelBubble = true;
			e.returnValue = false;
		}
	}

	function isElementPassedMiddleOfViewport(el) {
		//special bonus for those using jQuery
		if (typeof jQuery === "function" && el instanceof jQuery) {
			el = el[0];
		}

		let rect = el.getBoundingClientRect(),
			isFixed = window.getComputedStyle(hdr).position === "fixed",
			hdrHeight = isFixed ? hdr.offsetHeight : 0;
		return (
			rect.top <= (((window.innerHeight + hdrHeight) / 2) || ((document.documentElement.clientHeight + hdrHeight) / 2)) && /*or $(window).height() */
			rect.left <= (window.innerWidth || document.documentElement.clientWidth) && /*or $(window).width() */
			rect.top + rect.height >= hdrHeight &&
			rect.left + rect.width >= 0
		);
	}

	function unhide() {
		if (hdr.classList.contains("mini")) {
			Array.from(hideable).forEach(function (el, idx, arr) {
				el.classList.remove("hidden");
			});
		}
	}
	
	function determineScrollPosition() {
		let activedMenuItem = false;

		sections.forEach(function (el, idx, arr) {
			if (isElementPassedMiddleOfViewport(el.block)) {
				links.forEach(function (lnk, idx, arr) {
					lnk.classList.remove("active");
				});
				el.link.classList.add("active");
				activedMenuItem = true;
			}
		});

		if (!activedMenuItem) {
			links.forEach(function (lnk, idx, arr) {
				lnk.classList.remove("active");
			});
		}
	}

	function manageHeader(e) {
		hdr.classList.toggle("border-btm", window.pageYOffset >= 5);
		top.classList.toggle("active", window.pageYOffset >= 25);

		if ((window.innerWidth <= 767 && window.innerHeight <= 580) || window.innerHeight <= 390) {
			unhide();
			hdr.classList.remove("mini");
		} else if (window.innerWidth <= 767) {
			if (window.pageYOffset < 100) {
				unhide();
			}
			hdr.classList.toggle("mini", window.pageYOffset >= 100);
		} else {
			unhide();
			hdr.classList.remove("mini");
		}

		determineScrollPosition();
	}

	document.documentElement.classList.remove("no-js");
	document.documentElement.classList.add("js");

	hdr.addEventListener("click", (e) => {
		if (e.defaultPrevented) {
			return false;
		}

		if (e.target.tagName.match(menuRegex) && e.target.closest(".menu") !== null) {
			let hash = e.target.hash,
				isFixed = window.getComputedStyle(hdr).position === "fixed",
				targ = document.getElementById(hash.charAt(0) === "#" ? hash.substring(1) : hash);

			if (hash === "#contact-us") {
				targ = document.querySelector(".page-footer");
			}

			if (targ !== null) {
				let margin = 10,
					padding = 0;

				hdr.classList.remove("open");
				if (window.innerWidth >= 768) {
					margin = parseInt(window.getComputedStyle(targ).marginTop.replace(/[^0-9]*/g, ""));
				}
				if (isFixed) {
					padding = parseInt(window.getComputedStyle(article).paddingTop.replace(/[^0-9]*/g, ""));
					scrollTo([document.documentElement, document.body], targ.offsetTop - margin - padding, SCROLL_DURATION);
				} else {
					// 349 is the difference between the expanded menu height and the normal menu height
					scrollTo([document.documentElement, document.body], targ.offsetTop - 349 - margin - padding, SCROLL_DURATION);
				}
			}

			cancelDefault(e);
			return false;
		} else if (e.target.parentElement === hamburger || e.target === hamburger) {
			determineScrollPosition();

			hdr.classList.toggle("open");
			cancelDefault(e);
			return false;
		}
	}, false);

	hdr.addEventListener("transitionend", (e) => {
		if (e.target.classList.contains("logo") || e.target.classList.contains("tab")) {
			e.target.classList.toggle("hidden", hdr.classList.contains("mini"));
		}
	}, false);

	top.addEventListener("click", (e) => {
		scrollTo([document.documentElement, document.body], 0, SCROLL_DURATION);

		cancelDefault(e);
		return false;
	}, false);

	function createIFrame(e) {
		let iframe = document.createElement("iframe"),
			el = getTarget(e);

		if (e.defaultPrevented) {
			return false;
		}

		iframe.allowFullscreen = true;
		iframe.frameBorder = "0";
		iframe.src = [
			"https://www.youtube-nocookie.com/embed/",
			el.dataset.id,
			"?rel=0&autoplay=1"
		].join("");
		el.replaceChild(iframe, el.firstElementChild);
		el.style.backgroundImage = "";

		cancelDefault(e);
		return false;
	}
	
	for (let yt of Array.from(youtube)) {
		yt.style.backgroundImage = [
			'url("https://i.ytimg.com/vi/',
			yt.dataset.id,
			'/sddefault.jpg")'
		].join("");
		yt.addEventListener("click", createIFrame, false);
	}

	window.addEventListener("scroll", manageHeader, { passive: true });
	window.addEventListener("resize", manageHeader, { passive: true });
	
	if ("IntersectionObserver" in window) {
		let observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((en, idx, arr) => {
				if (en.isIntersecting) {
					if (Math.round(en.intersectionRect.top) <= 0 || Math.ceil(en.intersectionRect.bottom) >= Math.ceil(en.rootBounds.height)) {
						en.target.style.opacity = "1";
						en.target.style.transform = "none";
						observer.unobserve(en.target);
					}
				}
			});
		}, {
			rootMargin: "0px 0px -42% 0px",
			threshold: [0]
		});
		
		for (let el of Array.from(slidingSections)) {
			observer.observe(el);
		}
	} else {
		for (let el of Array.from(slidingSections)) {
			el.classList.remove("slide-top");
		}
	}
}());
