# Day 6 Assignment — School Database Design

## Tables

- **`students`** stores each student's unique ID, full name, and email. `student_id` is the primary key. `full_name` and `email` are required, and `email` is unique so two student records cannot use the same email address.
- **`courses`** stores each course's unique ID, course name, and instructor. `course_id` is the primary key. Course names are required and unique.
- **`enrolments`** records the relationship between a student and a course, including the student's grade. `enrolment_id` is the primary key. `student_id` and `course_id` are foreign keys that reference `students.student_id` and `courses.course_id`. Both are required. The unique constraint on `(student_id, course_id)` prevents the same student from enrolling in the same course more than once. The grade is restricted to `A`, `B`, `C`, `D`, or `F`.

## Relationships

A student can have many enrolments, but each enrolment belongs to one student. This is a **one-to-many** relationship from `students` to `enrolments`.

A course can have many enrolments, but each enrolment belongs to one course. This is a **one-to-many** relationship from `courses` to `enrolments`.

Therefore, students and courses have a **many-to-many** relationship: a student can take multiple courses, and a course can have multiple students. The `enrolments` table is the join table that resolves this relationship. It also stores data specific to the relationship—the grade—rather than duplicating course or student details.

Foreign keys ensure that an enrolment cannot refer to a student or course that does not exist. `ON DELETE CASCADE` removes related enrolment rows when a student or course is deleted. In SQLite, `PRAGMA foreign_keys = ON;` enables enforcement for the current connection.

## Index

The script creates `idx_enrolments_course_id` on `enrolments(course_id)`. This helps the database find enrolments for a particular course, including when listing students on a course or counting students per course. Indexes use additional storage and add some work to writes, so they should target common searches.

## SQL or NoSQL?

I would choose a **relational SQL database** for this school system. Students, courses, enrolments, and grades have clear structure and relationships. Primary keys, foreign keys, unique constraints, and the grade check can enforce data integrity in the database. SQL `JOIN`s make it straightforward to list course registrations and calculate enrolment counts. SQLite is suitable for this small learning assignment; a larger production system with multiple concurrent users could use PostgreSQL or another server-based relational database.
