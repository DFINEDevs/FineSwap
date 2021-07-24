//window.onload = function() {
//	console.log("Initializing DropDown custom element");
	class DropDown extends HTMLSelectElement{
		constructor() {
			// Always initialize the parent class
			super();

			this.display = document.createElement('span-drop-down');

			this.searchbar = document.createElement('input');
			let attr = document.createAttribute('for');
			attr.value = 'drop-down';
			this.searchbar.attributes.setNamedItem(attr);

			this.appendChild(this.display);
			this.insertBefore(this.searchbar, this.firstChild);

			this.addEventListener('click', function(event) {
				// Use for debugging:
				//console.log(event);
				let options = this.options;

				if (event.target.matches('drop-down') || event.target.matches('span-drop-down')) {
					// Toggle the dropdown
					this.classList.toggle("show");
				} else if (event.target.matches('div') && !event.target.attributes.disabled) {
					// A click happen to one of our options
					this.classList.remove("show");

					// Assign some variables
					if (
						this.selectedIndex !== undefined &&
						options[this.selectedIndex].attributes.selected
					)
						options[this.selectedIndex].attributes.removeNamedItem('selected');
					// Assign private vars
					this._value = event.target.attributes.value.value;
					this._selectedIndex = options.indexOf(event.target);

					// Edit options styling
					let attr = document.createAttribute('selected');
					options[this.selectedIndex].attributes.setNamedItem(attr);

					// Finally, emit signal and rerender the element
					this.dispatchEvent(new CustomEvent(
						'changed',
						{ detail: {value: this._value } }
					));
					this.render();
				}
			});

			// Searchbar input event
			this.searchbar.addEventListener('input', () => {
				let options = this.options;
				let bitfield = options.map(x => x.innerText.includes(this.searchbar.value));
				for (let i = 0; i < this.options.length; i++) {
					if (bitfield[i] && options[i].attributes.hide) {
						options[i].attributes.removeNamedItem('hide');
					} else if (!bitfield[i]) {
						let _attr = document.createAttribute('hide');
						options[i].attributes.setNamedItem(_attr);
					} // else defaults to no 'hide' attribute
				}
			});

			// Worst case: O(n), but who cares in this case??
			let options = this.options;
			for (let i = 0; i < options.length; i++) {
				let opt = options[i];
				if (opt.attributes.selected && !opt.attributes.disabled) {
					options[i].click();
					break;
				}
			}

			this.render();
		}

		get options() {
			return [...this.children].filter(x => x.nodeName === "DIV");
		}

		get value() { return this._value; }
		set value(val) {
			let options = this.options;

			this._selectedIndex = undefined;
			for (const opt of options) {
				if (opt.attributes.value.value == val) {
					this._selectedIndex = options.indexOf(opt);
					break;
				}
			}
			this._value = val;

			this.dispatchEvent(new CustomEvent('changed', { detail: { value: val } }));
			this.render();
		}

		get selectedIndex() { return this._selectedIndex; }
		set selectedIndex(val) {
			if (isNaN(+val)) return;
			this._value = this.options[+val].attributes.value.value;
			this._selectedIndex = +val;

			this.dispatchEvent(new CustomEvent('changed', { detail: { value: this._value } }));
			this.render();
		}

		get searchBar() {
			return this.querySelectorAll("input[for=drop-down]")[0];
		}

		/**
		 * @method render
		 * This method is used everytime you want to rerender the element.
		 * Some setters use this.
		 */
		render() {
			let options = this.options;
			this.display.innerText = options[this.selectedIndex]?.innerText || '';

			// Move searchbar to be the first child
			this.insertBefore(this.searchbar, this.firstChild);
			// Reset searchbar's query
			this.searchbar.value = '';
			for (let i = 0; i < options.length; i++) {
				let opt = options[i];
				if (opt.attributes.hide)
					opt.attributes.removeNamedItem('hide');
				if (opt.attributes.selected && i !== this.selectedIndex)
					opt.attributes.removeNamedItem('selected');
			}
		}
	}

	window.customElements.define('drop-down', DropDown, { extends: 'select' });
	window.addEventListener('click', function(event) {
		if (
			!event.target.matches('input[for=drop-down]') &&
			!event.target.matches('drop-down.show') &&
			!event.target.matches('span-drop-down')
		) {
			let dropdowns = [...document.querySelectorAll('drop-down.show')];
			for (const el of dropdowns) {
				el.classList.remove("show");
				el.render();
			}
		}
	});
//};
