-- STORED PROCEDURE TO CREATE A NEW GAME SESSION
CREATE PROCEDURE CreateSession
    @QuizId INT,
    @HostUserId INT
AS
BEGIN
    -- INSERT A NEW SESSION INTO THE SESSIONS TABLE
    INSERT INTO Sessions (quiz_id, host_user_id, status, created_at)
    VALUES (@QuizId, @HostUserId, 'created', GETDATE());
END;
GO
