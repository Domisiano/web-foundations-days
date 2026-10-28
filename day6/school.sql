-- Day 6 Assignment: A School Database
-- SQLite-compatible SQL.
-- PRAGMA enables foreign-key enforcement for this SQLite connection.
PRAGMA foreign_keys = ON;

-- Reset the sample tables so this script can be rerun in a practice database.
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- One row represents one student.
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    full_name  TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE
);

-- One row represents one course.
CREATE TABLE courses (
    course_id   INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL UNIQUE,
    instructor  TEXT NOT NULL
);

-- Each row records one student's enrolment in one course.
CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id   INTEGER NOT NULL,
    course_id    INTEGER NOT NULL,
    grade        TEXT NOT NULL CHECK (grade IN ('A', 'B', 'C', 'D', 'F')),
    CONSTRAINT uq_student_course UNIQUE (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Sample data: 4 students, 4 courses, and 6 enrolments.
INSERT INTO students (full_name, email) VALUES
    ('Amina Nansubuga', 'amina@example.com'),
    ('Brian Okello', 'brian@example.com'),
    ('Grace Namutebi', 'grace@example.com'),
    ('David Kato', 'david@example.com');

INSERT INTO courses (course_name, instructor) VALUES
    ('Database Systems', 'Ms. Nakato'),
    ('Web Development', 'Mr. Ssemanda'),
    ('Computer Networks', 'Dr. Mugisha'),
    ('Software Testing', 'Ms. Atim');

INSERT INTO enrolments (student_id, course_id, grade) VALUES
    (1, 1, 'A'),
    (1, 2, 'B'),
    (2, 1, 'B'),
    (2, 3, 'A'),
    (3, 2, 'A'),
    (3, 3, 'B');

-- Query 1: All courses taken by one student, identified by name.
SELECT s.full_name, c.course_name, e.grade
FROM students AS s
JOIN enrolments AS e ON e.student_id = s.student_id
JOIN courses AS c ON c.course_id = e.course_id
WHERE s.full_name = 'Amina Nansubuga'
ORDER BY c.course_name;

-- Query 2: All students enrolled in one course.
SELECT s.full_name, s.email, e.grade
FROM students AS s
JOIN enrolments AS e ON e.student_id = s.student_id
JOIN courses AS c ON c.course_id = e.course_id
WHERE c.course_name = 'Database Systems'
ORDER BY s.full_name;

-- Query 3: Number of students per course, including courses with zero enrolments.
SELECT c.course_name, COUNT(e.student_id) AS student_count
FROM courses AS c
LEFT JOIN enrolments AS e ON e.course_id = c.course_id
GROUP BY c.course_id, c.course_name
ORDER BY c.course_name;

-- Query 4: Students who have no enrolments.
SELECT s.student_id, s.full_name, s.email
FROM students AS s
LEFT JOIN enrolments AS e ON e.student_id = s.student_id
WHERE e.student_id IS NULL
ORDER BY s.full_name;

-- Query 5: Update one enrolment's grade. WHERE limits the update to one enrolment.
UPDATE enrolments
SET grade = 'A'
WHERE student_id = 1 AND course_id = 2;

-- Index to speed up lookups of students enrolled in a particular course.
CREATE INDEX idx_enrolments_course_id ON enrolments(course_id);
