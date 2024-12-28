-- STORED PROCEDURE TO DELETE A QUIZ
CREATE PROCEDURE DeleteQuiz
    @QuizId INT
AS
BEGIN
    -- DELETE THE QUIZ RECORD AND CASCADE TO RELATED TABLES
    DELETE FROM Quizzes
    WHERE id = @QuizId;
END;
GO