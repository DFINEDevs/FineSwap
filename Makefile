.PHONY: scss
scss: SPATH=scss
scss: OPATH=css
scss: SCSS_FILES=$(shell \
	find $(SPATH)\/* -not -path '*_*' -not -path '*~' |\
	sed -r 's/$(SPATH)\///g' |\
	tr '.scss\n' ' '\
)
scss: SCSS_FLAGS=
scss: SCSS_OPTIONS=-I=scss --no-source-map
scss:
	$(foreach file,\
		$(SCSS_FILES),\
		sass $(SPATH)/$(file).scss $(OPATH)/$(file).css $(SCSS_OPTIONS) $(SCSS_FLAGS);\
	)

scss-watch:
	sass --watch scss/index.scss css/index.css -I scss

serve:
	if command -v php &> /dev/null; then \
		php -S localhost:8080; \
	elif command -v python3 &> /dev/null; then \
		python3 -m http.server; \
	else \
		echo You don\'t have one of these command: php or python3; \
	fi

.PHONY: clean
clean: FILES=$(shell find -path '*~' -or -path '*.map' | tr '\n' ' ')
clean:
	rm -f $(FILES)
