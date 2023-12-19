// Add to list plus
// Based on an example script from @agiletortoise
//
// v2021.09.13

(() => {

	const getLists = () => {
		return listWorkspaceTabs
			.map(s => Draft.query("", s, [listTag]))
			.filter(arr => arr !== undefined)
			.reduce((acc, v) => acc.concat(v), [])
			.reduce((o, d) => {
				const m = d.content.match(/#+ ([^\n]+)/);
				if (m) { o[m[1].trim()] = d; }
				return o;
			}, {});
	};

	const sortcase = (xs) => {
		return xs.sort((a,b) => {
			return a.toLowerCase().localeCompare(b.toLowerCase());
		})
	}

	const split = (s, delim) => {
		const i = s.indexOf(delim);
		return [
			s.substr(0, (i>=0) ? i : s.length),
			(i>=0) ? s.substr(i) : ''
		]
	};

	const append = (s, item) => {
		s = s.replace(/\n$/, '');
		return [s, item].join('\n');
	};

	const prepend = (s, item) => {
		const xs = split(s, '- [');
		xs[0] = xs[0].replace(/\n$/, '');
		return [xs[0], item, xs[1]].join('\n');
	};

	const main = () => {

		if (draft.hasTag(listTag)) {
			alert('Cannot run this action on a list draft.');
			context.fail();
			return;
		}

		// prompt to select a list
		let p = Prompt.create();
		p.title = 'Add item to list';

		const lists = getLists();
		sortcase(Object.keys(lists)).map(c => p.addButton(c));

		// Give the user an option to create a new list
		p.addButton('Create a new list');

		if (!p.show()) {
			context.fail();
			return;
		}

		let d = lists[p.buttonPressed];
		if (d === undefined) {
			p = Prompt.create();
			p.title = 'Create a new list';
			p.addTextField('listName', 'List name', '');
			p.addButton('Ok');

			if (!p.show()) {
				context.fail();
				return;
			}

			const name = p.fieldValues['listName'].trim();
			if (name.length == 0) {
				alert('Invalid list name.');
				context.fail();
				return;
			}

			d = Draft.create();
			d.content = newListHeading + ` ${name} \n\n`;
			d.addTag(listTag);
		}

		const item = draft.content.trim().split('\n').map(x => '- [ ] ' + x).join('\n');
		const fn = appendItem ? append : prepend;
		d.content = fn(d.content, item);
		d.update();

		if (viewListAfterSuccess) {
			editor.load(d);
		}
	};

	main();

})();
