Stripes -- a modular toolkit for user interfaces
================================================

Introduction
------------

Stripes is part of the [Folio](http://www.folio.org/) project, which
is building an open library services platform. The goal of Folio is
that third-party developers will be able to contribute moduls that
slide easily into place as part of a library' IT infrastructure -- for
example, an acquisitions module or integration with an institutional
respository.

Folio modules run on clouds of servers -- either hosted commercially
by SAAS providers like EBSCO, or hosted locally by institutions that
prefer to take on this kind of infrastructure work. These modules
provide their services via RESTful APIPs. But the way Folio
functionality is exposed to users (whether librarians, administrators
or patrons) is in a Web browser. Each Folio module is fronted by a
Stripes module which makes its functionality available to users.

> (Actually, that's a bit of a simplification. A given Folio module
> may be represented more than one Stripes module. for example, two
> different Stripes Loads modules might present different views of the
> loan process, one more suited to academic libraries and one to
> public libraries. Then anotber vendor might come along and offer a
> third alternative: a slicker public-library loans UI to compete with
> the existing one. Stripes allows different alternative modules to be
> slipped into place.)

