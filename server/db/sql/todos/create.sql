/*
    Creates table Todos
*/

CREATE TABLE Todos
(
    todo_id serial PRIMARY KEY,
    couple_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    FOREIGN KEY (couple_id) REFERENCES Couples(couple_id) ON DELETE CASCADE ON UPDATE CASCADE
);