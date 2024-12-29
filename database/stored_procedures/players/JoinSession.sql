-- STORED PROCEDURE TO ALLOW A PLAYER TO JOIN A SESSION
CREATE PROCEDURE JoinSession
    @UserId INT,
    @SessionId INT,
    @Name NVARCHAR(50)
AS
BEGIN
    -- INSERT A NEW PLAYER INTO THE PLAYERS TABLE
    INSERT INTO Players (user_id, session_id, name, joined_at)
    VALUES (@UserId, @SessionId, @Name, GETDATE());
END;
GO
