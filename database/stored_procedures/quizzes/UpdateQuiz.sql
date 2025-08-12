-- STORED PROCEDURE TO UPDATE A QUIZ
CREATE PROCEDURE [dbo].[UpdateQuiz]
    @QuizId INT,
    @Title NVARCHAR(100),
    @Description TEXT,
	@Visibility NVARCHAR(25)
AS
BEGIN
    -- UPDATE THE QUIZ RECORD IN THE QUIZZES TABLE
    UPDATE Quizzes
    SET title = @Title, description = @Description, visibility = @Visibility
    WHERE id = @QuizId;
END;
GO

