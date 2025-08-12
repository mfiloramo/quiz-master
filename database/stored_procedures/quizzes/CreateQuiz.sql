-- STORED PROCEDURE TO CREATE A NEW QUIZ
CREATE PROCEDURE [dbo].[CreateQuiz]
    @UserId INT,
	@Username NVARCHAR(100),
    @Title NVARCHAR(100),
    @Description TEXT,
	@Visibility NVARCHAR(25)
AS
BEGIN
    -- INSERT A NEW QUIZ INTO THE QUIZZES TABLE
    INSERT INTO Quizzes (user_id, title, username, description, created_at, visibility)
    VALUES (@UserId, @Title, @Username, @Description, GETDATE(), @Visibility);

	-- RETURN THE NEW QUIZ ID
    SELECT SCOPE_IDENTITY() AS id;
END;
GO

