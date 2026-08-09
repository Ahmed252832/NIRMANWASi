You are now working ONLY on the database SQL part of the existing
NIRMAN project.

Do NOT modify the frontend, JavaScript, CSS, documentation, project
structure, ER diagrams, or any other existing project files.

The database folder already exists and contains exactly these files:

database/
├── schema.sql
├── sample_data.sql
└── queries.sql

Your task is to complete ONLY these three files.

============================================================
1. SOURCE OF TRUTH
============================================================

Before writing any SQL, read completely:

- PROJECT_SPEC.md
- MASTER_PROMPT.md
- the four ER diagram images inside references/

Treat PROJECT_SPEC.md as the authoritative source whenever the visual
ER diagram is unclear.

The four ER images are parts of ONE complete ER diagram.

Do not redesign the database.

Do not:
- add new entities
- remove existing entities
- invent relationships
- change cardinalities
- rename attributes unnecessarily
- add direct relationships that are not present in the ER/schema
- change weak-entity handling
- change multivalued-attribute handling
- change composite-attribute handling

The SQL schema must be a relational implementation of the existing
NIRMAN ER/schema design.

============================================================
2. VERY STRICT BEGINNER-LEVEL SQL RULE
============================================================

This is a beginner CSE-302 Database Management Systems Sessional
project.

The SQL MUST be simple enough for a student who has recently learned
SQL to understand and explain line by line during a viva.

SIMPLICITY HAS HIGHER PRIORITY THAN CLEVERNESS.

Do not optimize for:
- shortest SQL
- clever SQL
- professional enterprise-style SQL
- sophisticated database architecture

Optimize for:
- clarity
- explicitness
- classroom-level SQL
- easy explanation
- easy debugging

If the same result can be produced by a simple, explicit query or by
a complicated nested/compact query, ALWAYS choose the simpler version.

Do not combine many SQL techniques into one query unless genuinely
necessary.

============================================================
3. ALLOWED SQL KNOWLEDGE BOUNDARY
============================================================

Use ONLY SQL concepts that have been taught in our CSE-302 lab
materials.

Allowed concepts include ordinary use of:

DATABASE / TABLE BASICS
- CREATE TABLE
- Oracle basic datatypes such as VARCHAR2, NUMBER and DATE
- INSERT INTO ... VALUES
- SELECT
- UPDATE if genuinely needed
- ALTER TABLE only if genuinely needed

CONSTRAINTS
- PRIMARY KEY
- composite PRIMARY KEY
- FOREIGN KEY
- UNIQUE
- NOT NULL
- CHECK
- named constraints
- column-level constraints
- table-level constraints

SIMPLE QUERY CONCEPTS
- WHERE
- =, <>, !=, >, >=, <, <=
- AND
- OR
- BETWEEN ... AND
- simple filtering
- simple single-value subqueries where useful

JOINS
- simple equijoin
- NATURAL JOIN
- JOIN ... USING
- JOIN ... ON
- outer join only when genuinely useful
- self join only when genuinely useful

FUNCTIONS
- simple taught single-row functions where useful
- UPPER, LOWER, INITCAP
- CONCAT, LENGTH, SUBSTR, INSTR, LPAD, RPAD, TRIM, REPLACE
- ROUND, TRUNC, MOD
- basic taught date functions
- TO_DATE / TO_CHAR where needed for dates

GROUP FUNCTIONS
- COUNT
- SUM
- AVG
- MIN
- MAX
- GROUP BY
- HAVING
- DISTINCT where appropriate

Do NOT introduce SQL concepts beyond this course boundary.

In particular, DO NOT use:

- WITH / CTE
- recursive queries
- window/analytic functions
- ROW_NUMBER
- RANK / DENSE_RANK
- PARTITION BY
- PIVOT
- MERGE
- triggers
- stored procedures
- PL/SQL blocks
- packages
- cursors
- sequences unless absolutely required by PROJECT_SPEC
- identity columns
- generated columns
- views
- materialized views
- dynamic SQL
- exception-handling blocks
- sophisticated date/time techniques
- JSON SQL features
- database-specific advanced optimizations
- unnecessarily complicated nested subqueries

This project targets Oracle Database 11g.

Do not use features introduced in later Oracle versions.

IDs should remain simple manually supplied values unless the project
specification explicitly requires something else.

============================================================
4. schema.sql
============================================================

Create the complete relational schema represented by PROJECT_SPEC.md
and the ER diagram.

Use CREATE TABLE statements in a sensible parent-before-child order
so that foreign keys can be understood easily.

Whenever possible, define constraints directly inside CREATE TABLE.

Do NOT separate constraints into another file merely for style.

Prefer beginner-readable definitions such as:

CREATE TABLE Example
(
    Example_id VARCHAR2(10),
    Name VARCHAR2(50) NOT NULL,

    CONSTRAINT Example_Example_id_pk
        PRIMARY KEY (Example_id)
);

Use simple and descriptive constraint names similar to the naming
style taught in class.

For example:

Table_Column_pk
Table_Column_fk
Table_Column_uk
Table_Column_ck

For composite keys, use a normal table-level PRIMARY KEY constraint.

Use foreign keys exactly according to the ER relationships.

Correctly implement relational tables needed for:

- ISA/specialization mappings
- weak entities
- multivalued attributes
- composite attributes
- recursive Employee work relation
- many-to-many relationships
- Booking/Allocation representation
- other relationship tables already defined in PROJECT_SPEC.md

IMPORTANT:
Do not invent a direct Construction_Project -> Flats_Units relationship
if PROJECT_SPEC.md does not define one.

Use only necessary constraints.

Do not invent arbitrary business CHECK constraints merely to make the
schema look sophisticated.

A CHECK constraint may be used only where the rule is obvious from
the existing specification, for example a percentage being within a
valid range, if appropriate.

Use DATE for ordinary project dates/times instead of introducing
advanced timestamp handling unless PROJECT_SPEC explicitly requires
otherwise.

The final schema.sql must be understandable line by line.

============================================================
5. sample_data.sql
============================================================

Insert AT LEAST 5 valid demo rows into EVERY relational table created
in schema.sql.

This means EVERY table, not just the major entity tables.

If schema.sql contains tables representing:
- multivalued attributes
- relationships
- weak entities
- junction tables
- recursive relations

those tables must also contain at least 5 rows where logically
possible.

Use ordinary beginner-style INSERT statements:

INSERT INTO Table_Name
(column1, column2, column3)
VALUES
(value1, value2, value3);

Do NOT use:
- bulk insert tricks
- INSERT ALL
- loops
- procedures
- generated-data scripts
- complex INSERT ... SELECT unless absolutely necessary

Prefer one explicit INSERT statement per row.

For dates, use the simple Oracle date conversion style taught in
class, such as TO_DATE(...), where necessary.

The data MUST satisfy every PK, FK, UNIQUE, NOT NULL and CHECK
constraint.

Insert parent-table rows before child-table rows.

Use easy-to-read demo values.

Where practical, reuse IDs, names, project names and other values
already present in js/mock-data.js so that the database and frontend
feel consistent.

However, PROJECT_SPEC.md remains authoritative.

If the existing frontend does not contain enough records to provide
five valid rows for every table, add simple fictional demo records.

Do not mention any real organization.

============================================================
6. queries.sql
============================================================

Prepare 5 useful queries for the NIRMAN system.

These are intended to satisfy the lab requirement for sample
"advanced queries", but they MUST remain beginner-level and must use
ONLY concepts taught in the supplied CSE-302 materials.

"Advanced" in this project means:

combining a few concepts already taught in class,

NOT using advanced professional SQL.

Prefer understandable queries using combinations such as:

- JOIN + WHERE
- multiple table JOIN
- JOIN + GROUP BY
- GROUP BY + aggregate function
- GROUP BY + HAVING
- a simple subquery
- simple functions when meaningful

Do NOT make a query complicated simply to make it look advanced.

Suitable NIRMAN query themes include:

1. Client booking information
   Example idea:
   show a client together with booking, selected unit and project
   information using straightforward joins.

2. Tender and bid information
   Example idea:
   show tenders, submitted bids, representatives and contractors.

3. Construction project progress
   Example idea:
   show project, area and project-update information, possibly using
   a simple aggregate if useful.

4. Payment information
   Example idea:
   calculate or display client/payment/installment information using
   joins and a simple group function.

5. Employee operational information
   Example idea:
   show or count complaints/payments/tenders associated with
   employees using straightforward joins and GROUP BY.

These are themes, not mandatory exact implementations.
Choose the simplest meaningful versions supported by the actual schema.

Each query should have a short natural comment immediately above it:

-- Query 1: Show client booking details

Do not write long AI-style explanations inside the SQL file.

Every query MUST work with sample_data.sql.

Avoid queries that deliberately return zero rows.

============================================================
7. IMPORTANT DATABASE CONSISTENCY RULES
============================================================

Before finishing:

Check that:

- every table in schema.sql matches PROJECT_SPEC.md
- all table and column names are consistent
- all referenced parent tables are created before child tables
- every foreign key references an existing PK/UNIQUE key
- composite keys are implemented correctly
- every table has at least 5 valid demo rows
- demo values satisfy all constraints
- all 5 queries reference real table/column names
- all 5 queries return meaningful results from the supplied demo data
- no Oracle version later than 11g is required
- no advanced SQL outside the allowed course topics has been used

============================================================
8. DO NOT OVERENGINEER
============================================================

Do not create:
- extra database files
- migration frameworks
- helper scripts
- stored code
- seed generators
- configuration files
- database abstraction layers

Do not modify:
- frontend files
- mock-data JavaScript
- PROJECT_SPEC.md
- ER images
- documentation
- Git configuration

Only complete:

database/schema.sql
database/sample_data.sql
database/queries.sql

============================================================
9. FINAL SELF-AUDIT
============================================================

Before stopping, perform a strict beginner-complexity audit.

For EVERY SQL technique used, ask:

"Could a beginner who studied the supplied CSE-302 lab slides
reasonably explain this?"

If the answer is no, simplify it.

If a nested query can be replaced by a straightforward taught join or
a simpler query without changing the intended result, prefer the
simpler form.

If a sophisticated SQL feature is not necessary, remove it.

The final SQL should look like work produced from classroom concepts,
not enterprise database engineering.

After completing and checking the three files, STOP.

Do not continue into PHP/backend integration.
Do not modify any other part of the project.