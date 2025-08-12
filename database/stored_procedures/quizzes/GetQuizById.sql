-- STORED PROCEDURE TO FETCH A QUIZ BY ID
CREATE PROCEDURE [dbo].[GetQuizById]
    @QuizId INT
AS
BEGIN
    -- SELECT QUIZ DETAILS FOR THE PROVIDED ID
    SELECT id, user_id, title, description, created_at, visibility
    FROM Quizzes
    WHERE id = @QuizId;
END;
GO

