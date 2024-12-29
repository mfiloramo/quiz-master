-- STORED PROCEDURE TO UPDATE A QUIZ
CREATE PROCEDURE UpdateQuiz
    @QuizId INT,
    @Title NVARCHAR(100),
    @Description TEXT
AS
BEGIN
    -- UPDATE THE QUIZ RECORD IN THE QUIZZES TABLE
    UPDATE Quizzes
    SET title = @Title, description = @Description
    WHERE id = @QuizId;
END;
GO
