all: README.html

%.html: %.md
	rm -f $@
	pandoc -f markdown_github $? > $@
	chmod ugo-w $@

clean:
	rm -f README.html

