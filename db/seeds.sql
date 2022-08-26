USE employee_tracker;

INSERT INTO department
    (d_name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Ric', 'Ocasek', 1, 1),
    ('Janis', 'Joplin', 2, NULL),
    ('Stevie', 'Nicks', 3, NULL),
    ('Ray', 'Manzarek', 4, NULL),
    ('Ray', 'Charles', 5, NULL),
    ('Ann', 'Wilson', 6, NULL),
    ('Robert', 'Plant', 7, NULL),
    ('Roger', 'Waters', 8, NULL);