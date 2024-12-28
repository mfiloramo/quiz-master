-- STORED PROCEDURE TO ADD A QUESTION TO A QUIZ
CREATE PROCEDURE AddQuestion
    @QuizId INT,
    @Question NVARCHAR(MAX),
    @Options NVARCHAR(MAX),
    @Correct INT
AS
BEGIN
    -- INSERT THE QUESTION INTO THE QUESTIONS TABLE
    INSERT INTO Questions (quiz_id, question, options, correct)
    VALUES (@QuizId, @Question, @Options, @Correct);
END;
GO
