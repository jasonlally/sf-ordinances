SF Ordinances
=============
This is an example application to parse and display the table or ordinances produced by American Legal for the City and County of San Francisco.

American Legal provides a comprehensive list of ordinances passed by the City of San Francisco going back to 2011.  While they don't contain the full text of the ordinances in a digital format, there are some interesting bits or data in the summaries such as effective date, "Sections Affected" by the ordinance, dollar figures for appropriations, and settlement amounts.

So far, I've written a parser in python to convert the raw text into a structured json document that includes the ordinance number, file number, effective date, summary description and type.

I then made a stupid simple application that's just a sortable table of all the ordinances with a bar chart representing when ordinances went into effect.

This is still a half-baked project in search of an audience.  The simplest use case is around researchers or journalists that want to slice and dice information regarding City ordinances and discover insights they may not have found without hours of work.

Here are a couple of areas that could use some talent and insight:

1. Improve search and sortability (add quick filters, date ranges)
2. Add some interactivity to the chart (i.e. clicking on a bar filters all the relevant ordinances)
3. Usability and interface improvements more broadly including mobile use
4. Extract better data from the text (currently missing as discrete data: sections affected by revisions and whether they were amended, repealed or approved, better categories for the ordinances)
5. Improve charting/visualizations generally (display chart of ordinances by type over time, display dollar amounts represented by appropriations or settlements, display which sections of the code have been most affected by ordinance changes, etc)
6. And generally clean up code (I got it to do something, but it's ugly and inefficient)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jasonlally/sf-ordinances/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

