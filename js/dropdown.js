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
				if (event.target.matches('drop-down')) {
					// Toggle the dropdown
					this.classList.toggle("show");
				} else if (event.target.matches('div') && !event.target.attributes.disabled) {
					// A click happen to one of our options
					this.classList.remove("show");

					// Assign some variables
					if (this.selectedIndex !== undefined)
						this.options[this.selectedIndex].attributes.removeNamedItem('selected');
					// Assign private vars
					this._value = event.target.attributes.value.value;
					this._selectedIndex = this.options.indexOf(event.target);

					// Edit options styling
					let attr = document.createAttribute('selected');
					this.options[this.selectedIndex].attributes.setNamedItem(attr);

					// Finally, rerender the element
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
			let i = 0;
			for (const opt of this.options) {
				if (opt.attributes.selected && !opt.attributes.disabled) {
					this.options[i].click();
					break;
				}
				i++;
			}

			this.render();
		}

		get options() {
			return [...this.children].filter(x => x.nodeName === "DIV");
		}

		get value() { return this._value; }
		set value(val) {
			this._selectedIndex = undefined;
			for (const opt of this.options) {
				if (opt.attributes.value.value == val) {
					this._selectedIndex = this.options.indexOf(opt);
					break;
				}
			}
			this._value = val;
			this.render();
		}

		get selectedIndex() { return this._selectedIndex; }
		set selectedIndex(val) {
			if (isNaN(+val)) return;
			this._value = this.options[+val].attributes.value.value;
			this._selectedIndex = +val;
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
			this.display.innerText = this.options[this.selectedIndex]?.innerText || '';

			// Move searchbar to be the first child
			this.insertBefore(this.searchbar, this.firstChild);
			// Reset searchbar's query
			this.searchbar.value = '';
			for (const opt of this.options) {
				if (opt.attributes.hide)
					opt.attributes.removeNamedItem('hide');
			}
		}
	}

	window.customElements.define('drop-down', DropDown, { extends: 'select' });
	window.addEventListener('click', function(event) {
		if (!event.target.matches('input[for=drop-down]') && !event.target.matches('drop-down.show')) {
			let dropdowns = [...document.querySelectorAll('drop-down.show')];
			for (const el of dropdowns) {
				el.classList.remove("show");
				el.render();
			}
		}
	});
//};
