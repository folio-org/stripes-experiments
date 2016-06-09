OUTPUT = README.html OVERVIEW.html

all: $(OUTPUT)

%.html: %.md
	rm -f $@
	pandoc -f markdown_github $? > $@
	chmod ugo-w $@

clean:
	rm -f $(OUTPUT)

