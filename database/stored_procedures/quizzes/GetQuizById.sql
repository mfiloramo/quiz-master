-- STORED PROCEDURE TO FETCH A QUIZ BY ID
CREATE PROCEDURE GetQuizById
    @QuizId INT
AS
BEGIN
    -- SELECT QUIZ DETAILS FOR THE PROVIDED ID
    SELECT id, user_id, title, description, created_at
    FROM Quizzes
    WHERE id = @QuizId;
END;
GO
