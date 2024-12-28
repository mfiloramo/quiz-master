-- SWITCH TO THE CORRECT DATABASE
USE QuizMasterApp;
GO

-- INSERT USERS
INSERT INTO Users (username, email, password, created_at)
VALUES
    ('john_doe', 'john@example.com', 'hashedpassword1', GETDATE()),
    ('jane_smith', 'jane@example.com', 'hashedpassword2', GETDATE()),
    ('admin_user', 'admin@example.com', 'adminpassword', GETDATE());
GO

-- INSERT QUIZZES
INSERT INTO Quizzes (user_id, title, description, created_at)
VALUES
    (1, 'Math Basics', 'A basic math quiz for beginners', GETDATE()),
    (2, 'Science Trivia', 'General science questions', GETDATE()),
    (1, 'History 101', 'Introduction to history', GETDATE());
GO

-- INSERT QUESTIONS
INSERT INTO Questions (quiz_id, question, options, correct)
VALUES
    (1, 'What is 2 + 2?', '["4", "3", "5", "6"]', 0),
    (1, 'What is 10 / 2?', '["5", "4", "6", "7"]', 0),
    (2, 'What planet is closest to the sun?', '["Mercury", "Venus", "Earth", "Mars"]', 0),
    (2, 'What is the chemical symbol for water?', '["H2O", "CO2", "O2", "N2"]', 0),
    (3, 'Who discovered America?', '["Christopher Columbus", "George Washington", "Napoleon", "Einstein"]', 0),
    (3, 'When was the Declaration of Independence signed?', '["1776", "1789", "1800", "1754"]', 0);
GO

-- INSERT SESSIONS
INSERT INTO Sessions (quiz_id, host_user_id, status, created_at)
VALUES
    (1, 1, 'created', GETDATE()),
    (2, 2, 'created', GETDATE()),
    (3, 1, 'ongoing', GETDATE());
GO

-- INSERT PLAYERS
INSERT INTO Players (user_id, session_id, name, joined_at)
VALUES
    (1, 1, 'John', GETDATE()),
    (2, 1, 'Jane', GETDATE()),
    (3, 2, 'Admin', GETDATE()),
    (2, 3, 'Jane', GETDATE());
GO

-- INSERT PLAYER_ANSWERS
INSERT INTO Player_Answers (session_id, player_id, question_id, answer, is_correct, score)
VALUES
    (1, 1, 1, 0, 1, 10),  -- JOHN ANSWERED QUESTION 1 CORRECTLY
    (1, 2, 1, 1, 0, 0),   -- JANE ANSWERED QUESTION 1 INCORRECTLY
    (2, 3, 3, 0, 1, 10),  -- ADMIN ANSWERED QUESTION 3 CORRECTLY
    (3, 2, 5, 2, 1, 15);  -- JANE ANSWERED QUESTION 5 CORRECTLY
GO
