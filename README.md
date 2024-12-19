
# README

A simple implementation of a triple datastore.

All data is stored as a three element array, like so:

```Javascript
[100, "person/name", "James Cameron"]

```

The first element is the ID, the second element is the key or property name (or table column if you're thinking in relational DB terms), the third element is the property value.

The property element is in the form `namespace/value`, e.g. `person/name`, `person/born`; but this is really a convenience rather than a requirement.

The query language is interesting and is based on Datalog. It works like this:

```Javascript
{
  find: ["?year"], // array of properties to return
  where: [
    // look for a record with 'movie/title', 'Alien' and store its first element as ?id
    ['?id', 'movie/title', 'Alien'],
    // look for a record with 'movie/year' and first element matching ?id
    // store its third element as ?year
    ['?id', 'movie/year', '?year'],
  ],
}
```

This makes for a simple and powerful way of accessing data in a very small amount of code.
