-- STORED PROCEDURE TO UPDATE A QUESTION
CREATE PROCEDURE UpdateQuestion
    @QuestionId INT,
    @Question NVARCHAR(MAX),
    @Options NVARCHAR(MAX),
    @Correct INT
AS
BEGIN
    -- UPDATE THE QUESTION RECORD
    UPDATE Questions
    SET question = @Question, options = @Options, correct = @Correct
    WHERE id = @QuestionId;
END;
GO

