-- STORED PROCEDURE TO MOVE TO THE NEXT QUESTION IN A SESSION
CREATE PROCEDURE MoveToNextQuestion
    @SessionId INT,
    @CurrentQuestionId INT
AS
BEGIN
    -- SELECT THE NEXT QUESTION IN THE QUIZ
    SELECT TOP 1 id, question, options, correct
    FROM Questions
    WHERE quiz_id = (SELECT quiz_id FROM Sessions WHERE id = @SessionId)
      AND id > @CurrentQuestionId
    ORDER BY id ASC;
END;
GO
