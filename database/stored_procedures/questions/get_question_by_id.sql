-- STORED PROCEDURE TO FETCH A SPECIFIC QUESTION BY ID
CREATE PROCEDURE GetQuestionById
    @QuestionId INT
AS
BEGIN
    -- SELECT QUESTION DETAILS BASED ON THE PROVIDED ID
    SELECT id, quiz_id, question, options, correct
    FROM Questions
    WHERE id = @QuestionId;
END;
GO
