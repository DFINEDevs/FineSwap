//window.onload = function() {
	let inputs = [...document.querySelectorAll("input[type=number]")];
	for (const input of inputs) {
		input.addEventListener("input", function() {
			if (
				input.value < 0 ||
				(input.prevValue && input.value.length == 0 && input.prevValue.length == 1)
			) {
				input.value = '0';
				input.prevValue = '0';
			} else if (input.value[0] == undefined) {
				// The last typed value is not integer,
				// apply undo
				input.value = input.prevValue || '0';
			} else {
				input.prevValue = input.value;
			}
		});
	}
//};
