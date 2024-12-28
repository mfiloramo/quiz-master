-- STORED PROCEDURE TO SUBMIT AN ANSWER
CREATE PROCEDURE SubmitAnswer
    @SessionId INT,
    @PlayerId INT,
    @QuestionId INT,
    @Answer INT
AS
BEGIN
    DECLARE @CorrectAnswer INT;
    DECLARE @IsCorrect BIT;

    -- FETCH THE CORRECT ANSWER
    SELECT @CorrectAnswer = correct
    FROM Questions
    WHERE id = @QuestionId;

    -- DETERMINE IF THE ANSWER IS CORRECT
    SET @IsCorrect = CASE WHEN @CorrectAnswer = @Answer THEN 1 ELSE 0 END;

    -- INSERT THE ANSWER INTO THE PLAYER_ANSWERS TABLE
    INSERT INTO Player_Answers (session_id, player_id, question_id, answer, is_correct, score)
    VALUES (@SessionId, @PlayerId, @QuestionId, @Answer, @IsCorrect,
            CASE WHEN @IsCorrect = 1 THEN 10 ELSE 0 END); -- ADD SCORE FOR CORRECT ANSWER
END;
GO
