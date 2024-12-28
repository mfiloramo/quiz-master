-- STORED PROCEDURE TO FETCH SESSION DETAILS BY ID
CREATE PROCEDURE GetSessionById
    @SessionId INT
AS
BEGIN
    -- SELECT SESSION DETAILS BASED ON THE PROVIDED ID
    SELECT id, quiz_id, host_user_id, status, created_at
    FROM Sessions
    WHERE id = @SessionId;
END;
GO
