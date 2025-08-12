-- STORED PROCEDURE TO FETCH ALL QUIZZES
CREATE PROCEDURE [dbo].[GetAllQuizzes]
AS
BEGIN
    -- SELECT ALL QUIZZES FROM THE QUIZZES TABLE
    SELECT id, user_id, title, description, created_at, visibility
    FROM Quizzes;
END;
GO

