-- STORED PROCEDURE TO ADD A QUESTION TO A QUIZ
CREATE PROCEDURE [dbo].[AddQuestion]
    @QuizId INT,
    @Question NVARCHAR(MAX),
    @Options NVARCHAR(MAX),
    @Correct NVARCHAR(200)
AS
BEGIN
    -- INSERT THE QUESTION INTO THE QUESTIONS TABLE
    INSERT INTO Questions (quiz_id, question, options, correct)
    VALUES (@QuizId, @Question, @Options, @Correct);

	-- RETURN THE NEW QUESTION ID
    SELECT SCOPE_IDENTITY() AS id;
END;
GO
