-- STORED PROCEDURE TO CREATE A NEW QUIZ
CREATE PROCEDURE CreateQuiz
    @UserId INT,
    @Username NVARCHAR (100),
    @Title NVARCHAR(100),
    @Description TEXT
AS
BEGIN
    -- INSERT A NEW QUIZ INTO THE QUIZZES TABLE
    INSERT INTO Quizzes (user_id, title, description, created_at)
    VALUES (@UserId, @Title, @Description, GETDATE());
END;
GO
